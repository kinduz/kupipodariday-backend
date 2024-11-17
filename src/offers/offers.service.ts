import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { ERRORS_MSG } from '../shared';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: User) {
    const { itemId } = createOfferDto;

    const wish = await this.wishesService.findOne({
      relations: { owner: true },
      where: { id: itemId },
    });

    if (!wish) throw new NotFoundException(ERRORS_MSG.WISH_NOT_FOUND);

    const donateLimit = this.calcDonateLimit(wish);

    if (createOfferDto.amount > donateLimit)
      throw new ForbiddenException(ERRORS_MSG.DONATE_LIMIT);

    createOfferDto['item'] = wish;
    createOfferDto['user'] = userId;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.offersRepository.save(createOfferDto),
        this.wishesService.donate(wish, createOfferDto.amount),
      ]);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return;
  }

  async findAll() {
    return await this.offersRepository.find({ where: { hidden: false } });
  }

  async findOne(offerId: string, userId: string) {
    const offer = await this.offersRepository.findOne({
      relations: { user: true },
      where: {
        id: offerId,
        user: {
          id: userId,
        },
      },
    });

    if (!offer) throw new NotFoundException(ERRORS_MSG.OFFER_NOT_FOUND);

    return offer;
  }

  private calcDonateLimit(wish: Wish): number {
    return parseFloat((wish.price - wish.raised).toFixed(2));
  }
}
