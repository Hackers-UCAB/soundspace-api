<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# 🎵 SoundSpace API - Bienvenido a nuestro repositorio de Streaming de Música 🎵

Este repositorio alberga una aplicación de streaming de música construida con NestJS.

## 🏗️ Arquitectura 🏗️

Nuestra aplicación utiliza varios patrones de diseño y arquitecturas para garantizar un código limpio, mantenible y eficiente:

- **Arquitectura Hexagonal**: Esta arquitectura nos permite separar la lógica de negocio de los detalles técnicos, lo que facilita el mantenimiento y las pruebas de la aplicación.

- **Arquitectura Orientada a Eventos**: Utilizamos esta arquitectura para manejar acciones asíncronas y operaciones en tiempo real, lo que es esencial para una aplicación de streaming de música.

- **Programación Orientada a Aspectos (AOP) con Decoradores**: Los decoradores nos permiten añadir funcionalidades adicionales a nuestras clases y métodos de una manera limpia y reutilizable.

- **Diseño Guiado por el Dominio (DDD)**: Este enfoque nos ayuda a modelar la lógica de negocio de nuestra aplicación de una manera que refleja el dominio del problema.

## 🧰 Instalación 🧰

Pasos para clonar:

1. Ejecutar el comando ```yarn install```
2. El repositorio puede trabajar con PostgreSQL o con MongoDB, te recomendamos usar PostgreSQL ya que MongoDB se utilizó para una demostración de la buena aplicación de la arquitectura hexagonal. Asi que como segundo paso, crea tu base de datos PostgreSQL y no olvides las credenciales.
3. Crear los *Blob Containers* de Azure para las imagenes y las canciones.
4. Crear configuracion de proyecto de *Firebase Messaging*, y nuevamente no olvides las credenciales.
5. Clonar las variables de entorno ```.env.template``` y renombrarlo a ```.env```.
6. Llenar las variables de entorno.
7. Correrlo.
```yarn start:dev```

## Corriendo los Tests

Ejecutar el siguiente comando despues de haber realizado la instalacion previa
```
yarn test
```

## Documentacion

Modelo de dominio.

```Insertar aqui```

Arquitectura Hexagonal

```Insertar aqui```

## Aportes por desarrollador

Se presentan los aportes por cada desarrollador en el backend 

### Victor Blanco

```Por Agregar```

### Guillermo de Abreu

```Por Agregar```

### Ricardo Andueza

- Idealización y conceptualización de la transición del proyecto a la arquitectura hexagonal:
    - Explorar ideas para la interpretación del dominio del problema, y cómo reflejamos esto, separando los detalles ajenos al dominio para conservar su pureza.
    - Contribuir en la realización del diagrama del modelo de dominio, particularmente en cómo interactúan los agregados entre sí mediante el uso de referencias.
- Implementación de todo lo relacionado al aggregate Artista en dominio, aplicación e infraestructura, salvo por el servicio de búsqueda y su método de repositorio correspondiente:
    - Creación de todas las abstracciones del dominio:
        - Aggregate con su aggregate root (entity) y value-objects.
        - Excepciones de dominio.
        - Evento de dominio para la creación de un Artista.
        - Interfaz de repositorio.
    - Creación de servicios de aplicación con sus DTO correspondientes:
        - Buscar un Artista por su ID, y devolver toda su información, incluyendo sus Canciones y Álbumes (mediante el uso de métodos de repositorio pertenecientes a dichas entidades).
        - Buscar y retornar todos los Artistas que estén en tendencia (trending).
    - Creación de clases de infraestructura:
        - Controlador para recibir y retornar datos como requerido por el equipo de front-end, y el equipo de Geeks.
        - DTO de infraestructura para retornar la representación apropiada de los datos por la API.
        - Entity y Mapper encargados de fijar una estructura de datos y traducirla o mapearla al resto de la API.
        - Repositorio concreto con implementaciones de todos sus métodos para ser usados tanto en los servicios de aplicación de Artista, como por los servicios de otras entidades.
        - Interfaz compartida para manejo de excepción por uso incorrecto de mappers al mapear a dominio.
- Verificación de integridad de datos con la base de datos local y la remota, probando todos los llamados a la API para analizar sus respuestas y hacer correcciones o refactorizaciones donde se necesitasen.
- Refactorización de clases de infraestructura de Artista para hacer uso de la librería Swagger para mostrar externamente el formato de los datos que retorna la API.
- Implementación de la suite de pruebas completa de artistas:
    - Object-mother para la creación de diferentes instancias de un Artista.
    - Mock entero para el repositorio de Artista, incluyendo formas de simular dependencias externas no accesibles en el entorno de prueba.
    - Algunos métodos de álbum dentro de su repository mock para ser usados exclusivamente en pruebas unitarias de Artista.
    - Cuatro (4) pruebas unitarias para ambos servicios de aplicación implementados para Artista:
        - Dos (2) pruebas para el servicio de búsqueda de un Artista por su ID.
        - Dos (2) pruebas para el servicio de búsqueda de Artistas trending.


### Stratos Kakalanos

- Aporte en implementación para creación de base de datos mediante ORM.
- Implementación de value objects de playlist.
- Implementación de excepciones personalizadas en dominio perteneciente a cada VO de playlist.
- Implementación de aggregate Root de playlist.
- Implementación de método conversor de tiempo de segundos a minutos u horas.
- Implementación de servicio de "find playlist by id".
- Implementación de servicio de "find top playlists".
- Creación de interfaz de repositorio de playlist.
- Implementación de repositorio de playlist con métodos "get playlist by id" y "get top playlists".
- Implementación del playlist controller.
- Implementación de DTOs en capa de aplicación e infraestructura de entrada y salida en playlist.
- Implementación de mapper de playlist.
- Implementación de servicio "get top songs".
- Decoración de servicios implementados con Logger y Auditing.
- Aporte en implementación de repositorio de "song" para método "get top song".
- Aporte en implementación de DTOs en capa de aplicación e infraestructura de entrada y salida en song.
- Aporte en implementación del song controller con "get top songs".


### Jhonny Sojo

- Capa de dominio:
    - Evento de dominio album-created
    - Excepciones de dominio
    - Interfaz del repositorio de album
    - Value Objects de album
    - Aggregate de album

- Capa de aplicación:
    - DTOs de album (Entries y Responses)
    - Servicios: GetAlbumByIdService y GetTopAlbumService

- Capa de infraestructura:
    - Controlador de album
    - Mapper de album
    - Implementación del repositorio de album

- Testing:
    - Suite de getalbumbyid
    - Suite de topalbums

## Tecnologias Utilizadas

- [Jest](https://jestjs.io)
- [Socket.io](https://socket.io)
- [Azure](https://azure.microsoft.com/es-es/)
- [Railway](https://railway.app)

## Autores

| <img src="https://avatars.githubusercontent.com/u/108999297?v=4" width=115><br><sub>Victor Blanco</sub> |  <img src="https://avatars.githubusercontent.com/u/150209205?v=4" width=115><br><sub>Guillermo de Abreu</sub> |  <img src="https://avatars.githubusercontent.com/u/85240492?v=4" width=115><br><sub>Jhonny Sojo</sub> |  <img src="https://avatars.githubusercontent.com/u/56518507?v=4" width=115><br><sub>Stratos Kakalanos</sub> |  <img src="https://avatars.githubusercontent.com/u/106932816?v=4" width=115><br><sub>Ricardo Andueza</sub> |  <img src="https://avatars.githubusercontent.com/u/143916109?v=4" width=115><br><sub>Francis Bompart</sub> |
| :---: | :---: | :---: | :---: | :---: | :---: |
