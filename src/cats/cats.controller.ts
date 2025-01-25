import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
