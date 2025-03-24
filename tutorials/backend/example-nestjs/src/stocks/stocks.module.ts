import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { FileAccessor, FileService } from '../file.service';
import { Stock } from './entities/stock.entity';

@Module({
  controllers: [StocksController],
  providers: [
    StocksService,
    {
      provide: FileService,
      useFactory: (stocks: StocksModule) =>
        new FileService<Stock[]>(stocks.filePath),
      inject: [StocksModule],
    },
  ],
})
export class StocksModule implements FileAccessor {
  public readonly filePath = 'assets/stocks.json';
}
