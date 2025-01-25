import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerDocument() {
  const options = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Authorization',
    )
    .addGlobalParameters(
      {
        name: 'X-Lang',
        in: 'header',
        description: '国际化语言，英语: enUs; 中文简体: zhCN; 中文繁体: zhTW;',
        required: false,
      },
      {
        name: 'X-Version',
        in: 'header',
        description: '版本号控制， 1 ,2 ',
        required: false,
      },
    )
    .setTitle('nest-templates')
    .setDescription('nest-templates-1.0.0 API description')
    .setVersion('1.0.0')
    .addServer(`http://127.0.0.1:3000/`, 'Local environment')
    .build();
  return options;
}
