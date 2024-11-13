import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findById(id: number) {
    const cachedUser = await this.getFromCache(id.toString());

    if (cachedUser) return cachedUser;

    const user = await this.userRepository.findOne({ where: { id } });
    await this.addToCache(user);

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private getCacheKey(id: string) {
    return `userId-${id}`;
  }

  private getFromCache(id: string): Promise<User> {
    return this.cache.get(this.getCacheKey(id));
  }

  private async addToCache(user: User) {
    const TTL = 5 * 60 * 1000;
    await this.cache.set(this.getCacheKey(user.id.toString()), user, TTL);
  }
}
