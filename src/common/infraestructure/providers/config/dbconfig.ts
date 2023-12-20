
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: getMetadataArgsStorage().tables.map((table) => table.target),
         //entities: ['dist/src/**/*.entity.js', 'dist/src/**/*.entity.enum.js'],
        //entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // ssl: {
        //   rejectUnauthorized: false
        // },
        synchronize: true,
      });

      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }

      return dataSource;
    },
  },
  {
    provide: 'UserRepository',
    useFactory: (dataSource: DataSource) => {
      return new UserRepository(dataSource);
    },
    inject: ['DataSource'],
  }
];