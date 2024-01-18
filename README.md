<p align="center">
  <img src="./docs/1.jpg" width="200" alt="Descripción de la imagen" />
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

## Sobre MongoDB

El proyecto esta realizado originalmente usando una base de datos postgreSQL y posteriormente se agrego la implementacion para el uso de una base no relacional con mongoDB. Sin embargo para tener el uso completo de la aplicacion es necesario usar la base

## Documentacion

Modelo de dominio.

![App Screenshot](./docs/Modelo%20de%20dominio.svg)

<br/>

Arquitectura Hexagonal

![App Screenshot](./docs/Diagrama%20hexagonal.svg)

## Aportes por desarrollador

Se presentan los aportes por cada desarrollador en el backend 

### Victor Blanco

- Capa de dominio:

	Se colaboró en el diseño del modelo de dominio y se implementaron abstracciones genéricas. Se diseñó e implementó la lógica central del dominio para User, Subscription, SubscriptionChanel y Promotion. Se crearon eventos de dominio y excepciones para cada uno, y se diseñaron los contratos de los repositorios. También se refactorizó parte de la lógica en el dominio de Artist.

- Capa de aplicación:

	En la **capa de aplicación**, se diseñaron e implementaron abstracciones genéricas, decoradores de auditoría y logs, y un decorador de seguridad. Se crearon DTOs base para todos los servicios de aplicación y una abstracción del id-generator.
    
	- Para **User**, se diseñaron e implementaron servicios de aplicación para buscar y actualizar la información del usuario. Así como también los DTOs de entrada y salida respectivos.
    
	- Para **Auth**, se diseñaron e implementaron servicios de aplicación para el log-in (tanto para invitados como para usuarios con suscripción) y el sign-up (mediante las operadoras Movistar y Digitel). Así como también los DTOs de entrada y salida respectivos.
    
	- Para **Subscription**, se diseñaron e implementaron servicios de aplicación para la cancelación de la suscripción, para chequear las suscripciones que están por expirar y para chequear las expiradas (estas dos ultimas corren como un CRON).
    
	- Para **Promotions**, se diseñó e implementó un servicio de aplicación para obtener una promoción aleatoria. Así como también los DTOs de entrada y salida respectivos.
    
	- Para **Search**, se diseñaron e implementaron DTOs y un servicio de aplicación que orquesta los servicios de búsqueda a utilizar, que se encuentran en cada módulo.
    
	- Para **Playlist**, se refactorizó el servicio de aplicación para obtener playlist por id y se creó un servicio de aplicación que busca playlists por nombre.
    
	- Para **Album** , **Song** y **Artist**, se crearon servicios de aplicación que buscan álbumes y artistas por nombre, respectivamente.

- Capa de infraestructura:

	- En la **capa de infraestructura**, se implementaron el repositorio ORM y ODM para la auditoria, las entidades del ODM, una clase para solicitar imágenes de Azure y convertirlas en Buffers, y una clase para centralizar las respuestas HTTP. También se colaboró en la creación de las entidades del ORM y se implementó un generador de UUID.
    
	- Para **User**, **Auth**, **Subscription**, **Promotions**, **Search**, se diseñaron e implementaron controladores para las peticiones, DTOs de entrada y salida, mappers para las entidades ORM y ODM, y repositorios ORM y ODM. 
	
	- Para Auth, se configuraron los JWT y el strategy que los verifica. Para Subscription, se implementaron clases para hacer peticiones a APIs externas para validar con las operadoras Movistar y Digitel, y se configuraron CRONs para chequear las suscripciones expiradas y las cerca de expirar.

	- Para **Playlist**, **Album**, **Artist** y **Song**, se implementaron mappers para las entidades ODM, y repositorios ODM. 
    
- En otras cosas, se colaboró en el diseño de la base de datos principal, se configuró una base de datos PostgreSQL en Microsoft Azure, se configuraron contenedores de archivos blob en Microsoft Azure, se diseñó y configuró una base de datos MongoDB en Atlas, y se realizó el despliegue del servidor en Railway. Se implementaron los providers necesarios para la aplicación, mediante el uso del factory de Nest. Se crearon los providers de cada servicio, de cada repository, y de ciertas implementaciones como el Helper para obtener las imágenes de Azure.

### Guillermo de Abreu

- Capa de Dominio: 

	Se colaboró en el diseño del modelo de dominio y se implementaron abstracciones genéricas. Se diseñó e implementó la lógica central del dominio para Subscription, User y Song. Se crearon eventos de dominio y excepciones para cada uno, y se diseñaron los contratos de los repositorios. Se crea un servicio de dominio que maneja la regla de negocio correspondiente a cual cancion reproducir segun el rol del usuario.

- Capa de Aplicacion

	Se colaboro con el diseño de los decoradores para el logger y la auditoria. Tambien se empieza la implementacion del login manejando JWT. Se crea el servicio de aplicacion correspondiente al envio de la cancion, el mismo hace uso de interfaces que son implementadas en infraestructura las cuales se encargan de obtener la cancion para ser enviada posteriomente

- Capa de infraestructura:

	Se realiza la implementacion del streaming de la cancion el cual consiste en el envio de la misma desde un contenedor de azure en este caso. La misma es enviado por pedazos para que pueda ser recibida por partes y que la reproduccion pueda empezar antes de que se tenga acceso a toda la cancion. Se implementa el repositorio para Song. Se implementa la conexion con Azure para obtener la cancion. Se implementan los controladores pertinentes. Se hace la configuracion para poder validar al usuario conectado al socket a traves de su jwt. Se realiza la Configuracion base del swagger de la aplicacion. Se implementan los mappers necesarios igualmente. 

- Testing:

	Configuracion inicial del modulo de testing e implementacion de tests para usuarios, suscripciones, busquedas, autenticacion asi como seguimiento al resto de los tests

Ademas de esto se hizo aportes en trabajos como el diseño de la base de datos en postgreSQL, se poblo los contenedores con canciones en formato 128 kbps para facilitar el proceso de comunicacion. Se colaboro con el despliegue en Azure. 

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

- Capa de dominio:

    Aporte en implementación de base de datos mediante ORM
    Implementación de value objects de playlist
    Excepciones personalizadas a cada VO de playlist
    Implementación de aggregate Root de playlist
    Creación de interfaz de repositorio de playlist
    Creación de método conversor de tiempo de segundos a minutos u horas

- Capa de aplicación:

    DTOs de playlist (Entries y Responses)
    Aporte en DTOs de Song
    Servicios: "findPlaylistById", "findTopPlaylists", "getTopSongs"

- Capa de infraestructura:

    Implementación de repositorio de playlist
    Implementación del playlist controller
    Implementación de mapper de playlist
    implementación de "getTopSong" en repositorio de Song
    aporte en implementación del song controller

- Testing:
    Suite de findPlaylistById
    Suite de findTopPlaylists
    Suite de getTopSongs

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

### Francis Bompart

- Capa de dominio

	Se participó en la elaboración del modelo de dominio mediante la aplicación de Domain Driven Design, haciendo énfasis en los eventos relacionados a cada aggregate junto a los posibles servicios de dominio

- Capa de aplicacion

	En base a las arquitecturas orientadas a eventos se aplicó el patrón Publisher Subscriber para la publicación aquellos generados por el dominio, creando clases genéricas para definir el core de las posibles implementaciones.

	Para el *Publisher y *Subscriber, además de los respectivos puertos, se creó una salida estándar para cualquier publicador mediante la interfaz EventResponse, facilitando así la aplicación de AOP.
	El *Event Publisher Decorator, al igual que lo anterior, se diseñó con la finalidad de resolver los aspectos alrededor del proyecto
	Para el *Notifier se diseñó un puerto en conjunto de los DTOs de entrada y salida, estableciendo así un estándar en cuanto a la data necesaria para el envío de las notificaciones y a su vez para facilitar el logueo de sus resultados.

- Capa de infraestructura

	El *EventBus, implementación con manejo en memoria para la publicación de los eventos.
	Para los diferentes *Subscribers, estos se enfocaron en la escucha de los eventos de creación, cancelación y demás relacionados al cambio de estado de la suscripción de un usuario
	La implementación del *Notifier en este caso se realizó mediante Firebase 

Entre otras cosas, se planteó la aplicación de Dependency Injection para el proyecto mediante los métodos de fábrica de Nest. Lo anterior facilitó instanciar los suscriptores de los diferentes eventos al EventBus, procurando así mantener una sola instancia de dichas clases.

## Tecnologias Utilizadas

- [Jest](https://jestjs.io)
- [Socket.io](https://socket.io)
- [Azure](https://azure.microsoft.com/es-es/)
- [Railway](https://railway.app)

## Autores

| <img src="https://avatars.githubusercontent.com/u/108999297?v=4" width=115><br><sub>Victor Blanco</sub> |  <img src="https://avatars.githubusercontent.com/u/150209205?v=4" width=115><br><sub>Guillermo de Abreu</sub> |  <img src="https://avatars.githubusercontent.com/u/85240492?v=4" width=115><br><sub>Jhonny Sojo</sub> |  <img src="https://avatars.githubusercontent.com/u/56518507?v=4" width=115><br><sub>Stratos Kakalanos</sub> |  <img src="https://avatars.githubusercontent.com/u/106932816?v=4" width=115><br><sub>Ricardo Andueza</sub> |  <img src="https://avatars.githubusercontent.com/u/143916109?v=4" width=115><br><sub>Francis Bompart</sub> |
| :---: | :---: | :---: | :---: | :---: | :---: |
