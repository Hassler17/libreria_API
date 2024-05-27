import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Libro } from '../entities/libro.entity';
import { LibrosModule } from '../libros.module';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';

describe('LibrosController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let token: string;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [Libro],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        LibrosModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const username = configService.get<string>('AUTH_USERNAME');
    const password = configService.get<string>('AUTH_PASSWORD');
    
    token = await authService.signIn(username, password);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  jest.setTimeout(40000);

  describe('/libros (GET)', () => {
    it('debería obtener todos los libros', async () => {
      return request(app.getHttpServer())
        .get('/libros')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/libros/:id (GET)', () => {
    it('debería obtener un libro por su ID', async () => {
      const libro = await request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro de prueba',
          autor: 'Autor de prueba',
          publicacion: 2023,
        })
        .expect(201);

      const id = libro.body.id;
      return request(app.getHttpServer())
        .get(`/libros/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(id);
          expect(res.body.titulo).toBe('Libro de prueba');
          expect(res.body.autor).toBe('Autor de prueba');
          expect(res.body.publicacion).toBe(2023);
        });
    });

    it('debería devolver 404 si el libro no existe', async () => {
      return request(app.getHttpServer())
        .get('/libros/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Libro con id 999 no encontrado');
        });
    });
  });

  describe('/libros (POST)', () => {
    it('debería crear un nuevo libro', async () => {
      return request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Nuevo Libro',
          autor: 'Nuevo Autor',
          publicacion: 2023,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.titulo).toBe('Nuevo Libro');
          expect(res.body.autor).toBe('Nuevo Autor');
          expect(res.body.publicacion).toBe(2023);
        });
    });

    it('debería devolver 400 si los datos son inválidos', async () => {
      return request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: '',
          autor: '',
          publicacion: null,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('El título no puede estar vacío');
          expect(res.body.message).toContain('El autor no puede estar vacío');
          expect(res.body.message).toContain('El año de publicación no puede ser mayor al año actual');
          expect(res.body.message).toContain('El año de publicación no puede ser menor a 1900');
          expect(res.body.message).toContain('El año de publicación debe ser un número entero');
        });
    });
  });

  describe('/libros/:id (PUT)', () => {
    it('debería actualizar un libro existente', async () => {
      const libro = await request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro de prueba',
          autor: 'Autor de prueba',
          publicacion: 2023,
        })
        .expect(201);

      const id = libro.body.id;
      return request(app.getHttpServer())
        .put(`/libros/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro Actualizado',
          autor: 'Autor Actualizado',
          publicacion: 2024,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.titulo).toBe('Libro Actualizado');
          expect(res.body.autor).toBe('Autor Actualizado');
          expect(res.body.publicacion).toBe(2024);
        });
    });

    it('debería devolver 404 si el libro no existe', async () => {
      return request(app.getHttpServer())
        .put('/libros/999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro Actualizado',
          autor: 'Autor Actualizado',
          publicacion: 2024,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Libro con id 999 no encontrado');
        });
    });

    it('debería devolver 400 si los datos son inválidos', async () => {
      const libro = await request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro de prueba',
          autor: 'Autor de prueba',
          publicacion: 2023,
        })
        .expect(201);

      const id = libro.body.id;
      return request(app.getHttpServer())
        .put(`/libros/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: '',
          autor: '',
          publicacion: null,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('El título no puede estar vacío');
          expect(res.body.message).toContain('El autor no puede estar vacío');
          expect(res.body.message).toContain('El año de publicación no puede ser mayor al año actual');
          expect(res.body.message).toContain('El año de publicación no puede ser menor a 1900');
          expect(res.body.message).toContain('El año de publicación debe ser un número entero');
        });
    });
  });

  describe('/libros/:id (DELETE)', () => {
    it('debería eliminar un libro por su ID', async () => {
      const libro = await request(app.getHttpServer())
        .post('/libros')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Libro de prueba',
          autor: 'Autor de prueba',
          publicacion: 2023,
        })
        .expect(201);
  
      const id = libro.body.id;
      return request(app.getHttpServer())
        .delete(`/libros/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'Libro eliminado correctamente' });
        });
    });
  
    it('debería devolver 404 si el libro no existe', async () => {
      return request(app.getHttpServer())
        .delete('/libros/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Libro con id 999 no encontrado');
        });
    });
  });
  
});
