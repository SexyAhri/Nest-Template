import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { checkDirAndCreate } from '../utils/index';
import { FileUploadController } from './files.controller';
import { FileUploadService } from './files.service';
import { getFileType } from '../utils/fileTypeUtils';

// 生成一个简单的 UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Module({
  imports: [
    MulterModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async () => ({
        limits: {
          fileSize: 1024 * 1024 * 5, // 限制文件大小为 5MB
        },
        storage: diskStorage({
          destination: (_, file, cb) => {
            const fileExtension = file.originalname
              .split('.')
              .pop()
              ?.toLowerCase() as string;
            const fileType = getFileType(fileExtension);

            const filePath = `upload/${fileType}`;
            checkDirAndCreate(filePath);
            return cb(null, `./${filePath}`);
          },
          filename: (_, file, cb) => {
            const ext = file.mimetype.split('/').pop(); // 获取扩展名
            const filename = `${generateUUID()}.${ext}`;
            return cb(null, filename);
          },
        }),
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
