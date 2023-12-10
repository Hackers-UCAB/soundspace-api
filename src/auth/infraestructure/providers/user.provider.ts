import { User } from 'src/user/infraestructure/orm-entities/user.entity';
import { DataSource } from 'typeorm';

export const photoProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];