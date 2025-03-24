import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

import { Stock } from './entities/stock.entity';
import { FileService } from '../file.service';

@Injectable()
export class StocksService {
  constructor(private fileService: FileService<Stock[]>) {}

  create(createStockDto: CreateStockDto) {
    try {
      const stocks = this.fileService.read();

      const stock = { ...createStockDto, id: stocks.length + 2 };

      this.fileService.add(stock);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  }

  findAll(title?: string): Stock[] {
    try {
      const stocks = this.fileService.read();

      return title
        ? stocks.filter((stock) =>
            stock.title.toLowerCase().includes(title.toLowerCase()),
          )
        : stocks;
    } catch (e) {
      console.error(`Error: ${e}`);

      return [];
    }
  }

  findOne(id: number): Stock | null {
    try {
      const stocks = this.fileService.read();

      return stocks.find((stock) => stock.id === id) ?? null;
    } catch (e) {
      console.error(`Error: ${e}`);

      return null;
    }
  }

  update(id: number, updateStockDto: UpdateStockDto): void {
    try {
      const stocks = this.fileService.read();

      const updatedStocks = stocks.map((stock) =>
        stock.id === id ? { ...stock, ...updateStockDto } : stock,
      );

      this.fileService.write(updatedStocks);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  }

  remove(id: number): void {
    try {
      const filteredStocks = this.fileService
        .read()
        .filter((stock) => stock.id !== id);

      this.fileService.write(filteredStocks);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  }
}
