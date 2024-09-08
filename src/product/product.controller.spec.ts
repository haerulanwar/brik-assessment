import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './create-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

const createProductDto: CreateProductDto = {
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

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((product: CreateProductDto) =>
                Promise.resolve({ id: '1', ...product }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                categoryId: 1,
                sku: 'sku #1',
                name: 'name #1',
              },
              {
                categoryId: 1,
                sku: 'sku #2',
                name: 'name #3',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                categoryId: 1,
                sku: 'sku #1',
                name: 'name #1',
                id,
              }),
            ),
            remove: jest.fn(),
            update: jest
              .fn()
              .mockImplementation((product: CreateProductDto, id: string) =>
                Promise.resolve({ id, ...product }),
              ),
          },
        },
      ],
    }).compile();

    productController = app.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a product', () => {
      expect(productController.create(createProductDto)).resolves.toEqual({
        id: '1',
        ...createProductDto,
      });
      expect(productService.create).toHaveBeenCalled();
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll()', () => {
    it('should find all products ', () => {
      productController.findAll(1, 10);
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a product', () => {
      productController.findOne('1');
      expect(productService.findOne).toHaveBeenCalled();
      expect(productController.findOne('1')).resolves.toEqual({
        categoryId: 1,
        sku: 'sku #1',
        name: 'name #1',
        id: '1',
      });
    });
  });

  describe('remove()', () => {
    it('should remove the product', () => {
      productController.remove('2');
      expect(productService.remove).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      const retVal = await productController.update(
        {
          name: 'name #1',
          categoryId: 1,
          sku: 'sku #1',
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
      expect(productService.update).toHaveBeenCalledWith(
        {
          name: 'name #1',
          categoryId: 1,
          sku: 'sku #1',
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
      expect(retVal).toEqual({
        id: '1',
        ...createProductDto,
      });
    });
  });
});
