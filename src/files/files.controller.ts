/* eslint-disable @typescript-eslint/no-unsafe-call */
// import {
//   Controller,
//   Post,
//   Req,
//   UploadedFile,
//   UploadedFiles,
//   UseInterceptors,
//   Get,
//   Param,
//   Res,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
// import { Request, Response } from 'express';

// import { responseMessage } from '../utils';

// import { UpdateFileDto } from './dto/update-file.dto';
// import { join } from 'path';
// import * as fs from 'fs';
// import { getFileType } from '../utils/fileTypeUtils';

// @Controller('upload')
// export class FileUploadController {
//   /**
//    * @description: 获取客户端域名、端口和协议
//    */
//   private getClientInfo(req: Request) {
//     const hostname = Array.isArray(req.headers['x-forwarded-host'])
//       ? req.headers['x-forwarded-host'][0] || req.hostname
//       : req.headers['x-forwarded-host'] || req.hostname;

//     const port = Array.isArray(req.headers['x-forwarded-port'])
//       ? req.headers['x-forwarded-port'][0] || req.socket.localPort
//       : req.headers['x-forwarded-port'] || req.socket.localPort;

//     const protocol = Array.isArray(req.headers['x-forwarded-proto'])
//       ? req.headers['x-forwarded-proto'][0] || req.protocol
//       : req.headers['x-forwarded-proto'] || req.protocol;

//     return { hostname, port, protocol };
//   }

//   /**
//    * @description: 上传单个文件
//    */
//   @UseInterceptors(FileInterceptor('file'))
//   @Post('single-file')
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: '单个文件上传',
//     type: UpdateFileDto,
//   })
//   uploadFile(
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req: Request,
//   ): any {
//     const { hostname, port, protocol } = this.getClientInfo(req);

//     // 处理文件路径并确保路径拼接正确
//     const staticPath = file.path.replace(/\\/g, '/').replace(/^upload/, '');
//     file.path = `${protocol}://${hostname}:${port}/static/${staticPath}`;

//     // 使用 responseMessage.success 方法返回成功响应
//     return responseMessage.success('文件上传成功', file);
//   }

//   /**
//    * @description: 上传多个文件
//    */
//   @UseInterceptors(FilesInterceptor('files'))
//   @Post('multiple-files')
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: '多个文件上传',
//     type: [UpdateFileDto],
//   })
//   uploadMultipleFiles(
//     @UploadedFiles() files: Array<Express.Multer.File>,
//     @Req() req: Request,
//   ): any {
//     const { hostname, port, protocol } = this.getClientInfo(req);

//     // 处理文件路径并确保路径拼接正确
//     const uploadedFiles = files.map((file) => {
//       const staticPath = file.path.replace(/\\/g, '/').replace(/^upload/, '');
//       file.path = `${protocol}://${hostname}:${port}/static/${staticPath}`;
//       return file;
//     });

//     // 使用 responseMessage.success 方法返回成功响应
//     return responseMessage.success('文件上传成功', uploadedFiles);
//   }

//   /**
//    * @description: 下载文件
//    */
//   @Get('download/:filename')
//   @ApiOperation({ summary: '下载文件' })
//   @ApiParam({ name: 'filename', description: '文件名' })
//   downloadFile(@Param('filename') filename: string, @Res() res: Response) {
//     // 获取文件扩展名
//     const fileExtension = filename.split('.').pop()?.toLowerCase();
//     if (!fileExtension) {
//       throw new HttpException('文件扩展名无效', HttpStatus.BAD_REQUEST);
//     }

//     // 根据文件扩展名确定文件类型
//     const fileType = getFileType(fileExtension);

//     // 构建正确的文件路径
//     const uploadDir = join(__dirname, '..', '..', 'upload', fileType);
//     const filePath = join(uploadDir, filename);

//     // 检查文件是否存在
//     if (!fs.existsSync(filePath)) {
//       throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
//     }

//     // 设置响应头
//     res.setHeader('Content-Type', 'application/octet-stream');
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

//     // 创建可读流并发送文件
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   }
// }
//使用本地文件系统就解开以上注释
//使用ali-oss
import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { responseMessage } from '../utils';

import { UpdateFileDto } from './dto/update-file.dto';
import { getFileType } from '../utils/fileTypeUtils';
import * as OSS from 'ali-oss';
import { AliOss } from '../config/ali-oss.config';
import * as fs from 'fs';

// 生成一个简单的 UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Controller('upload')
export class FileUploadController {
  private readonly ossClient: OSS;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.ossClient = new OSS({
      region: AliOss.region,
      accessKeyId: AliOss.accessKeyId,
      accessKeySecret: AliOss.accessKeySecret,
      bucket: AliOss.bucket,
    });
  }

  /**
   * @description: 获取客户端域名、端口和协议
   */
  private getClientInfo(req: Request): {
    hostname: string;
    port: number;
    protocol: string;
  } {
    const hostname = Array.isArray(req.headers['x-forwarded-host'])
      ? req.headers['x-forwarded-host'][0] || req.hostname
      : req.headers['x-forwarded-host'] || req.hostname;

    const port = Array.isArray(req.headers['x-forwarded-port'])
      ? parseInt(
          req.headers['x-forwarded-port'][0] ||
            (req.socket?.localPort || 80).toString(),
          10,
        )
      : parseInt(
          req.headers['x-forwarded-port'] ||
            (req.socket?.localPort || 80).toString(),
          10,
        );

    const protocol = Array.isArray(req.headers['x-forwarded-proto'])
      ? req.headers['x-forwarded-proto'][0] || req.protocol
      : req.headers['x-forwarded-proto'] || req.protocol;

    return { hostname, port, protocol };
  }

  /**
   * @description: 上传单个文件
   */
  @UseInterceptors(FileInterceptor('file'))
  @Post('single-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '单个文件上传',
    type: UpdateFileDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<any> {
    const { hostname, port, protocol } = this.getClientInfo(req);

    // 获取文件扩展名
    const fileExtension = file.originalname
      .split('.')
      .pop()
      ?.toLowerCase() as string;
    const fileType = getFileType(fileExtension);

    // 生成文件名
    const ext = file.mimetype.split('/').pop(); // 获取扩展名
    const filename = `${generateUUID()}.${ext}`;

    // 上传文件到 OSS
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.ossClient.put(
        `upload/${fileType}/${filename}`,
        file.path,
      );
      fs.unlinkSync(file.path); // 删除临时文件

      // 构建文件 URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const fileUrl = `${protocol}://${hostname}:${port}/static/${result.name}`;

      // 使用 responseMessage.success 方法返回成功响应
      return responseMessage.success('文件上传成功', {
        path: fileUrl,
        name: filename,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('文件上传失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description: 上传多个文件
   */
  @UseInterceptors(FilesInterceptor('files'))
  @Post('multiple-files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '多个文件上传',
    type: [UpdateFileDto],
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ): Promise<any> {
    const { hostname, port, protocol } = this.getClientInfo(req);

    const uploadedFiles: Array<{ path: string; name: string }> = [];

    for (const file of files) {
      // 获取文件扩展名
      const fileExtension = file.originalname
        .split('.')
        .pop()
        ?.toLowerCase() as string;
      const fileType = getFileType(fileExtension);

      // 生成文件名
      const ext = file.mimetype.split('/').pop(); // 获取扩展名
      const filename = `${generateUUID()}.${ext}`;

      // 上传文件到 OSS
      try {
        // 使用类型断言明确 result 的类型
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const result = (await this.ossClient.put(
          `upload/${fileType}/${filename}`,
          file.path,
        )) as OSS.PutResult;
        fs.unlinkSync(file.path); // 删除临时文件

        // 构建文件 URL
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const fileUrl = `${protocol}://${hostname}:${port}/static/${result.name}`;

        // 使用 responseMessage.success 方法返回成功响应
        return responseMessage.success('文件上传成功', {
          path: fileUrl,
          name: filename,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new HttpException(
          '文件上传失败',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // 使用 responseMessage.success 方法返回成功响应
    return responseMessage.success('文件上传成功', uploadedFiles);
  }
  @Get('download/:filename')
  @ApiOperation({ summary: '下载文件' })
  @ApiParam({ name: 'filename', description: '文件名' })
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    // 获取文件扩展名
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      throw new HttpException('文件扩展名无效', HttpStatus.BAD_REQUEST);
    }

    // 根据文件扩展名确定文件类型
    const fileType = getFileType(fileExtension);

    // 构建文件路径
    const objectName = `upload/${fileType}/${filename}`;

    // 从 OSS 下载文件
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.ossClient.get(objectName);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (result.res.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const fileStream = result.content as NodeJS.ReadableStream;

        // 设置响应头
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${filename}`,
        );

        // 发送文件
        fileStream.pipe(res);
      } else {
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
    }
  }
}
