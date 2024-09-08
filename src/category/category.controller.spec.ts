import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

const createCategoryDto: CreateCategoryDto = {
  name: 'category #1',
};

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((category: CreateCategoryDto) =>
                Promise.resolve({ id: '1', ...category }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'category #1',
              },
              {
                name: 'category #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: 'category #1',
                id,
              }),
            ),
            remove: jest.fn(),
            update: jest
              .fn()
              .mockImplementation((category: CreateCategoryDto, id: string) =>
                Promise.resolve({ id, ...category }),
              ),
          },
        },
      ],
    }).compile();

    categoryController = app.get<CategoryController>(CategoryController);
    categoryService = app.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a category', () => {
      expect(categoryController.create(createCategoryDto)).resolves.toEqual({
        id: '1',
        ...createCategoryDto,
      });
      expect(categoryService.create).toHaveBeenCalled();
      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update()', () => {
    it('should update a category', () => {
      expect(
        categoryController.update(createCategoryDto, '1'),
      ).resolves.toEqual({
        id: '1',
        ...createCategoryDto,
      });
      expect(categoryService.update).toHaveBeenCalled();
      expect(categoryService.update).toHaveBeenCalledWith(
        createCategoryDto,
        '1',
      );
    });
  });

  describe('findAll()', () => {
    it('should find all categories ', () => {
      categoryController.findAll();
      expect(categoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a category', () => {
      categoryController.findOne('1');
      expect(categoryService.findOne).toHaveBeenCalled();
      expect(categoryController.findOne('1')).resolves.toEqual({
        name: 'category #1',
        id: '1',
      });
    });
  });

  describe('remove()', () => {
    it('should remove the category', () => {
      categoryController.remove('2');
      expect(categoryService.remove).toHaveBeenCalled();
    });
  });
});
