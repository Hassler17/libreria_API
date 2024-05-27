import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dtos/create-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,
  ) {}

  async findAll(): Promise<Libro[]> {
    const libros = await this.librosRepository.find();
    if (libros.length === 0) {
      throw new NotFoundException('No se encontraron libros');
    }
    return libros;
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.librosRepository.findOne({ where: { id } });
    if (!libro) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
    return libro;
  }

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    const nuevoLibro = this.librosRepository.create(createLibroDto);
    return this.librosRepository.save(nuevoLibro);
  }

  async update(id: number, updateLibroDto: CreateLibroDto): Promise<Libro> {
    const libroExistente = await this.findOne(id);
    if (!libroExistente) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }


    const { titulo, autor, publicacion } = updateLibroDto;
    if (
      titulo === libroExistente.titulo &&
      autor === libroExistente.autor &&
      publicacion === libroExistente.publicacion
    ) {
      throw new BadRequestException('Los datos proporcionados son iguales a los datos actuales del libro');
    }

    Object.assign(libroExistente, updateLibroDto);
    return this.librosRepository.save(libroExistente);
  }

  async remove(id: number): Promise<void> {
    const result = await this.librosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
  }
}
