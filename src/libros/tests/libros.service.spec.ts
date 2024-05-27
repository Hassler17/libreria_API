import { Test, TestingModule } from '@nestjs/testing';
import { LibrosService } from '../libros.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from '../entities/libro.entity';
import { Repository } from 'typeorm';

describe('LibrosService', () => {
  let service: LibrosService;
  let libroRepository: Repository<Libro>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        {
          provide: getRepositoryToken(Libro),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
    libroRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
