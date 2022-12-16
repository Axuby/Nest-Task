import { Repository, EntityRepository, DataSource, Not } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Got here', hashedPassword);
    const user = this.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplucate username
        throw new ConflictException('Username already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    console.log('Got Here');
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.findOne({ where: { username } });

      console.log(user);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user.username;
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
