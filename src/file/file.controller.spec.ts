import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            uploadFile: jest
              .fn()
              .mockImplementation((file: Express.Multer.File) =>
                Promise.resolve({
                  data: file.path,
                  mimeType: file.mimetype,
                }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const mockFile = {
        path: 'public/img/test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      expect(await controller.uploadFile(mockFile)).toEqual({
        data: mockFile.path,
        mimeType: mockFile.mimetype,
      });
    });
  });
});
