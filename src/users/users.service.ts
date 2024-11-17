import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatchUserDto } from './dto/patch-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, ObjectLiteral, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { hashValue, ERRORS_MSG } from '../shared';
import { SignUpDto } from '../auth/dto/sign-up.dto';

const USER_EXIST_ERR_MSG =
  'User with such username or password is already exist';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async create(createUserDto: SignUpDto) {
    let user: User = null;
    try {
      user = await this.userRepository.save({
        ...createUserDto,
        password: await hashValue(createUserDto.password),
      });
    } catch (err) {
      if ('code' in err) {
        if (err.code === '23505')
          throw new ConflictException(USER_EXIST_ERR_MSG);
      }
    }
    return user;
  }

  async findById(id: string) {
    const cachedUser = await this.getFromCache(id);

    if (cachedUser) return cachedUser;

    const user = await this.userRepository.findOne({ where: { id } });

    await this.addToCache(user);

    return user;
  }

  async findMany(query: string) {
    const findOperator = Like(`%${query}`);

    const searchResult = await this.userRepository.find({
      where: [{ email: findOperator }, { username: findOperator }],
    });

    if (!searchResult.length) {
      throw new NotFoundException(ERRORS_MSG.USERS_NOT_FOUND);
    }

    return searchResult;
  }

  async findOne(userParams: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(userParams);

    if (!user) {
      throw new NotFoundException(ERRORS_MSG.USER_NOT_FOUND);
    }

    return user;
  }

  async updateOne(id: string, patchUserDto: PatchUserDto) {
    if (patchUserDto.password) {
      patchUserDto.password = await hashValue(patchUserDto.password);
    }

    try {
      const updateUser = await this.userRepository.save({
        ...patchUserDto,
        id,
      });
      await this.removeFromCache(id);
      return updateUser;
    } catch (e) {
      console.error(e);
    }
  }

  async getWishes(searchCondition: string, userParams: ObjectLiteral) {
    const userWishes = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect(
        'wishes.offers',
        'offers',
        'offers.hidden = :isHidden',
        { isHidden: false },
      )
      .where(searchCondition, userParams)
      .getOne();

    if (!userWishes) throw new NotFoundException();

    return userWishes;
  }

  private getCacheKey(id: string) {
    return `userId-${id}`;
  }

  private getFromCache(id: string): Promise<User> {
    return this.cache.get(this.getCacheKey(id));
  }

  private async addToCache(user: User) {
    const TTL = 5 * 60 * 1000; // 5 min
    await this.cache.set(this.getCacheKey(user.id), user, TTL);
  }

  private async removeFromCache(id: string) {
    await this.cache.del(this.getCacheKey(id));
  }
}
