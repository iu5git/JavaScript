import { Module } from '@nestjs/common';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [StocksModule],
})
export class AppModule {}
