import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './create-sale.dto';
import { Sale } from './sale.model';

const createSaleDto: CreateSaleDto = {
  productId: 1,
  qty: 1,
};

const oneSale = {
  id: '1',
  productId: 1,
  qty: 1,
  revenue: 1000,
} as Sale;

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: {
            sale: jest
              .fn()
              .mockImplementation((sale: CreateSaleDto) =>
                Promise.resolve({ id: '1', ...sale, revenue: 1000 }),
              ),
            history: jest.fn().mockResolvedValue([
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
            ]),
            byProduct: jest.fn().mockResolvedValue([
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
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sale()', () => {
    it('should create a sale', () => {
      expect(controller.sale(createSaleDto)).resolves.toEqual(oneSale);
      expect(service.sale).toHaveBeenCalled();
      expect(service.sale).toHaveBeenCalledWith(createSaleDto);
    });
  });

  describe('history()', () => {
    it('should find all sales ', () => {
      controller.history(1, 10);
      expect(service.history).toHaveBeenCalled();
    });
  });

  describe('byProduct()', () => {
    it('should find sales by product id', () => {
      controller.byProduct('1', 1, 10);
      expect(service.byProduct).toHaveBeenCalled();
    });
  });
});
