import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';
import { getModelToken } from '@nestjs/sequelize';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException } from '@nestjs/common';

const salesArray = [
  {
    productId: 1,
    qty: 1,
    revenue: 1000,
  },
  {
    productId: 1,
    qty: 2,
    revenue: 2000,
  },
];

describe('SaleService', () => {
  let service: SaleService;
  let saleModel: typeof Sale;
  let productModel: typeof Product;
  // let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: getModelToken(Sale),
          useValue: {
            create: jest.fn().mockResolvedValue(salesArray[0]),
            findAndCountAll: jest.fn(() => ({
              rows: salesArray,
              count: 2,
            })),
          },
        },
        {
          provide: getModelToken(Product),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              qty: 10,
              price: 1000,
            }),
            update: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn(() => ({
              commit: jest.fn(),
              rollback: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    saleModel = module.get<typeof Sale>(getModelToken(Sale));
    productModel = module.get<typeof Product>(getModelToken(Product));
    // sequelize = module.get<Sequelize>(Sequelize);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sale()', () => {
    it('should create a sale', async () => {
      const createSaleDto = {
        productId: 1,
        qty: 1,
      };
      const sale = await service.sale(createSaleDto);
      expect(sale).toEqual(salesArray[0]);
      expect(productModel.findOne).toHaveBeenCalledWith({
        where: { id: createSaleDto.productId },
      });
      expect(saleModel.create).toHaveBeenCalledWith(
        {
          ...createSaleDto,
          revenue: 1000,
        },
        { transaction: expect.any(Object) },
      );
    });

    it('should throw error if product not found', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValueOnce(null);
      const createSaleDto = {
        productId: 1,
        qty: 1,
      };
      await expect(service.sale(createSaleDto)).rejects.toThrowError(
        new BadRequestException('Product not found'),
      );
    });

    it('should throw error if product out of stock', async () => {
      const existingProduct = { id: 1, qty: 0, price: 1000 } as Product;
      jest
        .spyOn(productModel, 'findOne')
        .mockResolvedValueOnce(existingProduct);
      const createSaleDto = {
        productId: 1,
        qty: 1,
      };
      await expect(service.sale(createSaleDto)).rejects.toThrowError(
        new BadRequestException('Product out of stock'),
      );
    });
  });

  describe('history()', () => {
    it('should return an array of sales', async () => {
      const sales = await service.history(1, 10);
      expect(sales.data).toEqual(salesArray);
      expect(sales.total).toEqual(2);
      expect(sales.page).toEqual(1);
      expect(sales.limit).toEqual(10);
    });
  });

  describe('byProduct()', () => {
    it('should return an array of sales by product id', async () => {
      const sales = await service.byProduct(1, 10, '1');
      expect(sales.data).toEqual(salesArray);
      expect(sales.total).toEqual(2);
      expect(sales.page).toEqual(1);
      expect(sales.limit).toEqual(10);
    });
  });
});
