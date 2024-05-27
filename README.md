# Libreria API

Esta es una API REST simple para gestionar una colección de libros. La API permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en libros almacenados en una base de datos PostgreSQL.

## Requisitos

- Node.js
- PostgreSQL
- NestJS

## Configuración de la Base de Datos

1. Crea una base de datos PostgreSQL llamada `libreria`.

2. Crea una tabla llamada `libros` con las siguientes columnas:
   - `id` (SERIAL PRIMARY KEY)
   - `titulo` (VARCHAR)
   - `autor` (VARCHAR)
   - `publicacion` (INTEGER)

   ```sql
   CREATE TABLE libros (
     id SERIAL PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     autor VARCHAR(255) NOT NULL,
     publicacion INTEGER NOT NULL
   );

## Configuración del Proyecto

  1. Clona el repositorio
    - git clone <URL_DEL_REPOSITORIO>
    - cd libreria-api
  
  2. Instala las dependencias
    - npm install
  
  3. Crea un archivo .env en la raíz del proyecto con el siguiente contenido
    - DATABASE_HOST=localhost
      DATABASE_PORT=5432
      DATABASE_USERNAME="tu_usuario"
      DATABASE_PASSWORD="tu_contraseña"
      DATABASE_NAME=libreria
      JWT_SECRET=my-secret-key
      AUTH_USERNAME=username
      AUTH_PASSWORD=password 

  4. Inicia la aplicación
    - npm run start

  5. La API estará disponible 
    - http://localhost:3000

## TESTS

  1. npm run test

## Pruebas

  1. Abrir postman

  2. Ingresar los Endpoint de la API 

## END POINTS 

  1. URL: /libros
    - Método: GET

  2. URL: /libros/:id
    - Método: GET
  
  3. URL: /libros
    - Método: POST
    - Cuerpo de la solicitud:
    {
      "titulo": "Nuevo Libro",
      "autor": "Nuevo Autor",
      "publicacion": 2023
    }

  4. URL: /libros/:id
    - Método: PUT
  
  5. URL: /libros/:id
    - Método: DELETE