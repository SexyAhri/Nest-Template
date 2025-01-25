// src/dto/create-cat.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ description: 'The name of the cat' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The age of the cat' })
  @IsInt()
  age: number;

  @ApiProperty({ description: 'The breed of the cat' })
  @IsString()
  breed: string;
}
