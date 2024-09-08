import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/sequelize';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';
import { PaginatedResource } from '../helpers/pagination.dto';
import { ResponseProductDto } from './response-product.dto';
import { CreateProductDto } from './create-product.dto';
// import { CategoryModule } from '../category/category.module';

const productsArray = [
  {
    categoryId: 1,
    sku: 'sku #1',
    name: 'name #1',
    description: '',
    weight: 0,
    width: 0,
    length: 0,
    height: 0,
    image: '',
    price: 0,
    qty: 0,
    categoryName: '',
  },
  {
    categoryId: 1,
    sku: 'sku #2',
    name: 'name #2',
    description: '',
    weight: 0,
    width: 0,
    length: 0,
    height: 0,
    image: '',
    price: 0,
    qty: 0,
    categoryName: '',
  },
];

const oneProduct = {
  categoryId: 1,
  sku: 'sku #1',
  name: 'name #1',
  description: '',
  weight: 0,
  width: 0,
  length: 0,
  height: 0,
  image: '',
  price: 0,
  qty: 0,
  categoryName: 'name #1',
};

describe('ProductService', () => {
  let service: ProductService;
  let model: typeof Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product),
          useValue: {
            findOne: jest.fn(() => oneProduct),
            create: jest
              .fn()
              .mockImplementation((product: CreateProductDto) =>
                Promise.resolve({ id: '1', ...product }),
              ),
            remove: jest.fn(),
            destroy: jest.fn(() => 1),
            findAndCountAll: jest.fn(() => ({ rows: productsArray, count: 2 })),
            update: jest.fn(() => 1),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                name: 'name #1',
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<typeof Product>(getModelToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a product', async () => {
      const oneProductIt = {
        categoryId: 1,
        sku: 'sku #1',
        name: 'name #1',
        description: '',
        weight: 0,
        width: 0,
        length: 0,
        height: 0,
        image: '',
        price: 0,
        qty: 0,
      };
      const resp = await service.create(oneProductIt);
      expect(resp).toEqual(oneProduct);
    });
  });

  describe('findAll()', () => {
    it('should return an array of products', async () => {
      const respPage: PaginatedResource<ResponseProductDto> = {
        data: productsArray,
        total: 2,
        page: 1,
        limit: 10,
      };
      const products = await service.findAll(1, 10);
      expect(products).toEqual(respPage);
    });
  });

  describe('findOne()', () => {
    it('should get a single product', () => {
      const findSpy = jest.spyOn(model, 'findOne');
      expect(service.findOne('1'));
      expect(findSpy).toHaveBeenCalledWith({
        where: { id: '1' },
        include: [Category],
      });
    });
  });

  describe('remove()', () => {
    it('should remove a product', async () => {
      const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(findSpy).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(retVal).toBeUndefined();
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        update: jest.fn(() => oneProduct),
      } as any);
      const retVal = await service.update(
        {
          name: 'product #1',
          categoryId: 0,
          sku: '',
          description: '',
          weight: 0,
          width: 0,
          length: 0,
          height: 0,
          image: '',
          price: 0,
          qty: 0,
        },
        '1',
      );
      expect(findSpy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(retVal).toEqual(oneProduct);
    });
  });
});
