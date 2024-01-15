import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { UpdateUserInfoEntryApplicationDto } from 'src/user/application/dto/entrys/update-user-info-entry.application.dto';
import { User } from 'src/user/domain/user';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { UserBirthday } from 'src/user/domain/value-objects/user-birthday';
import { UserEmail } from 'src/user/domain/value-objects/user-email';
import { UserGender } from 'src/user/domain/value-objects/user-gender';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { UserName } from 'src/user/domain/value-objects/user-name';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UpdateUserInfoEntryInfraestructureDto } from 'src/user/infraestructure/dto/entrys/update-user-info.entry.infraestructure.dto';

export class UserObjectMother {
     
    static createNormalUser(){
        const idGenerator = new UuidGenerator()

        const normalUser = User.create(
            UserId.create(idGenerator.generate()), 
            UserRole.create(UserRoleEnum.USER),
            UserName.create('UserName'),
            UserBirthday.create(new Date('1990-01-01')),
            UserEmail.create('bKQkZ@example.com'),
            UserGender.create(UserGenderEnum.M),
        )
        
        return normalUser;
    }

    static createGuestUser(){
        const idGenerator = new UuidGenerator();
        

        const guestUser = User.create(
            UserId.create(idGenerator.generate()),
            UserRole.create(UserRoleEnum.GUEST),
        )
        return guestUser;
    }
    
    //!No se si esto es valido
    static validPatchEntry(id: UserId): UpdateUserInfoEntryApplicationDto{
        return {
            userId: id.Id,
            name: 'name',
            email: 'bKQkZ@example.com',
            birthdate: new Date('1990-01-01'),
            gender: 'M',
        }
    }
}