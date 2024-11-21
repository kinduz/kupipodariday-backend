import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { ERRORS_MSG } from '../shared';
import { isOwnerInEntityCheck } from '../shared/utils/is-owner-check';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    createWishlistDto['owner'] = user;
    await this.convertWishedToDto(createWishlistDto);
    return this.wishlistsRepository.save(createWishlistDto);
  }

  findAll() {
    return this.wishlistsRepository.find();
  }

  findOne(id: string) {
    const wishlist = this.wishlistsRepository.findOne({
      relations: { items: true, owner: true },
      where: { id },
    });

    if (!wishlist) throw new NotFoundException(ERRORS_MSG.WISHLIST_NOT_FOUND);

    return wishlist;
  }

  async updateOne(
    userId: string,
    id: string,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsRepository.findOne({
      relations: { owner: true },
      where: { id },
    });

    if (!wishlist) throw new NotFoundException(ERRORS_MSG.WISHLIST_NOT_FOUND);

    const isOwner = isOwnerInEntityCheck(userId, wishlist.owner.id);
    if (!isOwner) throw new ForbiddenException(ERRORS_MSG.FORBIDDEN_MSG);

    await this.convertWishedToDto(updateWishlistDto);
    updateWishlistDto['id'] = wishlist.id;
    return this.wishlistsRepository.save(updateWishlistDto);
  }

  async removeOne(id: string, userId: string) {
    const wishlist = await this.wishlistsRepository.findOne({
      relations: { owner: true },
      where: { id },
    });

    if (!wishlist) throw new NotFoundException(ERRORS_MSG.WISHLIST_NOT_FOUND);

    const isOwner = isOwnerInEntityCheck(userId, wishlist.owner.id);
    if (!isOwner) throw new ForbiddenException(ERRORS_MSG.FORBIDDEN_MSG);

    await this.wishlistsRepository.remove(wishlist);

    return;
  }

  private async convertWishedToDto(
    wishesDto: CreateWishlistDto | UpdateWishlistDto,
  ) {
    if ('itemsId' in wishesDto && wishesDto.itemsId.length > 0) {
      const wishes = await this.wishesService.findMany({
        where: { id: In(wishesDto.itemsId) },
      });
      delete wishesDto.itemsId;
      wishesDto['items'] = wishes;
    }
    return wishesDto;
  }
}
