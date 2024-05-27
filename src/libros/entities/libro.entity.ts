import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'libros' })
export class Libro {

  @ApiProperty({
    description: 'Identificador único del libro',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Título del libro',
    example: 'Cien Años de Soledad',
  })
  @Column({ nullable: false })
  titulo: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Gabriel García Márquez',
  })
  @Column({ nullable: false })
  autor: string;

  @ApiProperty({
    description: 'Año de publicación del libro',
    example: 1967,
  })
  @Column()
  publicacion: number;
}
