import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, userId: string) {
    createWishDto['owner'] = userId;
    try {
      await this.wishesRepository.save(createWishDto);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
    return;
  }

  findLast() {
    return this.wishesRepository.find({
      relations: { owner: true },
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  findTop() {
    return this.wishesRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  findMany(params: FindManyOptions) {
    return this.wishesRepository.find(params);
  }

  async findOne(params: FindOneOptions) {
    const wish = await this.wishesRepository.findOne(params);

    if (!wish) throw new NotFoundException();

    return wish;
  }

  async updateOne(id: string, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne({ where: { id } });

    return await this.wishesRepository.save({ ...updateWishDto, id });
  }

  async removeOne(id: string) {
    const wish = await this.findOne({ where: { id } });

    return await this.wishesRepository.remove(wish);
  }

  async copyOne(wishId: string, user: User) {
    const wish = await this.findOne({ where: { id: wishId } });

    wish.copied++;
    await this.wishesRepository.save(wish);

    delete wish.id;
    delete wish.copied;

    wish['owner'] = user;

    return await this.wishesRepository.save(wish);
  }

  async donate(wish: Wish, amount: number) {
    wish.raised += amount;
    return this.wishesRepository.save(wish);
  }
}
