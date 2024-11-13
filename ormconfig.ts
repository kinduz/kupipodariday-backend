import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Wish } from './src/wishes/entities/wish.entity';
import { Wishlist } from './src/wishlists/entities/wishlist.entity';
import { Offer } from './src/offers/entities/offer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  entities: [User, Wish, Wishlist, Offer],
  migrations: [`${__dirname}/**/database/migrations/**/*{.ts,.js}`],
  synchronize: true,
});
