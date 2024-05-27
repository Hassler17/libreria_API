import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLibroDto {
  @ApiProperty({
    description: 'Título del libro',
    example: 'El nombre del viento',
  })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Patrick Rothfuss',
  })
  @IsNotEmpty({ message: 'El autor no puede estar vacío' })
  @IsString()
  autor: string;

  @ApiProperty({
    description: 'Año de publicación del libro',
    example: 2007,
  })
  @IsInt({ message: 'El año de publicación debe ser un número entero' })
  @Min(1900, { message: 'El año de publicación no puede ser menor a 1900' })
  @Max(new Date().getFullYear(), { message: 'El año de publicación no puede ser mayor al año actual' })
  publicacion: number;
}
