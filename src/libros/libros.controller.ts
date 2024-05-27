import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, HttpException, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dtos/create-libro.dto';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('libros')
@ApiBearerAuth()
@Controller('libros')
@UseGuards(JwtAuthGuard)
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @ApiResponse({ status: 200, description: 'Lista de libros', type: [Libro] })
  @ApiResponse({ status: 404, description: 'Libros no encontrados' })
  async findAll(): Promise<Libro[]> {
    try {
      return await this.librosService.findAll();
    } catch (error) {
      throw new HttpException('Libros no encontrados', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un libro por ID' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'El libro encontrado', type: Libro })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async findOne(@Param('id') id: number): Promise<Libro> {
    const libro = await this.librosService.findOne(id);
    if (!libro) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
    return libro;
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo libro' })
  @ApiBody({ type: CreateLibroDto })
  @ApiResponse({ status: 201, description: 'El libro ha sido creado', type: Libro })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body(new ValidationPipe()) createLibroDto: CreateLibroDto): Promise<Libro> {
    try {
      return await this.librosService.create(createLibroDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un libro existente' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiBody({ type: CreateLibroDto })
  @ApiResponse({ status: 200, description: 'El libro ha sido actualizado', type: Libro })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(@Param('id') id: number, @Body(new ValidationPipe()) createLibroDto: CreateLibroDto): Promise<Libro> {
    const libro = await this.librosService.update(id, createLibroDto);
    if (!libro) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
    return libro;
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un libro por ID' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'El libro ha sido eliminado' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.librosService.remove(id);
      return { message: 'Libro eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(`Error al eliminar el libro con id ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}  
