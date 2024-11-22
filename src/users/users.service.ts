import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatchUserDto } from './dto/patch-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, ObjectLiteral, Repository } from 'typeorm';
import { ERRORS_MSG, hashValue } from '../shared';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: SignUpDto) {
    try {
      return await this.userRepository.save({
        ...createUserDto,
        password: await hashValue(createUserDto.password),
      });
    } catch (err) {
      if ('code' in err) {
        if (err.code === '23505')
          throw new ConflictException(ERRORS_MSG.USER_EXIST_ERR_MSG);
      }
    }
  }

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
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
      await this.userRepository.update(id, {
        ...patchUserDto,
      });
      return this.findOne({ where: { id } });
    } catch (err) {
      if ('code' in err) {
        if (err.code === '23505')
          throw new ConflictException(ERRORS_MSG.USER_EXIST_ERR_MSG);
      }
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
}
