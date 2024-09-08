import { FileService } from './file.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    const mockFile = {
      path: 'public/img/test.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const result = await service.uploadFile(mockFile);

    expect(result).toEqual({
      data: mockFile.path,
      mimeType: mockFile.mimetype,
    });
  });
});
