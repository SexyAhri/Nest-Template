import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestIpMiddleware } from '../middleware/request-ip.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';
// import { CsrfMiddleware } from './middleware/csrf.middleware';
import { CatsModule } from '../cats/cats.module';
import { FileUploadModule } from '../files/files.module';
import { UserModule } from '../user/user.module';
// import { ServeStaticModule } from '@nestjs/serve-static'; //使用本地文件系统就解开注释
// import { join } from 'path'; //使用本地文件系统就解开注释

@Module({
  imports: [
    CatsModule,
    //使用本地文件系统就解开注释
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'upload'), // 指定静态文件的根目录
    //   serveRoot: '/static', // 指定访问路径前缀
    // }),

    FileUploadModule,
    // TypeOrmModule.forRoot(),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIpMiddleware).forRoutes('*path');
    consumer.apply(LoggerMiddleware).forRoutes('*path');
    // consumer.apply(CsrfMiddleware).forRoutes('*path');
  }
}
