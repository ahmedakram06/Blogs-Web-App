import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    return this.usersRepository.remove(user);
  }

  async getProfile(userId: string) {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}

// async login(email: string, password: string) {
//   const user = await this.findByEmail(email);
//   if (!user) {
//     throw new UnauthorizedException('Invalid credentials');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new UnauthorizedException('Invalid credentials');
//   }

//   const payload = { sub: user.id, email: user.email };
//   return {
//     accessToken: this.jwtService.sign(payload),
//     user,
//   };
// }
