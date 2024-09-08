import { Test, TestingModule } from '@nestjs/testing';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/sequelize';

const categoriesArray = [
  {
    name: 'category #1',
  },
  {
    name: 'category #2',
  },
];

const oneCategory = {
  name: 'category #1',
};

describe('CategoryService', () => {
  let service: CategoryService;
  let model: typeof Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category),
          useValue: {
            findAll: jest.fn(() => categoriesArray),
            findOne: jest.fn(() => oneCategory),
            create: jest.fn(() => oneCategory),
            remove: jest.fn(),
            destroy: jest.fn(() => oneCategory),
            update: jest.fn(() => oneCategory),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get<typeof Category>(getModelToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a category', () => {
      const oneCategory = {
        name: 'category #1',
      };
      expect(
        service.create({
          name: 'category #1',
        }),
      ).toEqual(oneCategory);
    });
  });

  describe('update()', () => {
    it('should update a category', async () => {
      const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        update: jest.fn(() => oneCategory),
      } as any);
      const retVal = await service.update(
        {
          name: 'category #1',
        },
        '1',
      );
      expect(findSpy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(retVal).toEqual(oneCategory);
    });
  });

  describe('findAll()', () => {
    it('should return an array of categories', async () => {
      const categories = await service.findAll();
      expect(categories).toEqual(categoriesArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single category', () => {
      const findSpy = jest.spyOn(model, 'findOne');
      expect(service.findOne('1'));
      expect(findSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove()', () => {
    it('should remove a category', async () => {
      const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(findSpy).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(retVal).toBeUndefined();
    });
  });
});
