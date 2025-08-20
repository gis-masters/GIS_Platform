import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { Role, rolesTitles } from '../../../../src/app/services/permissions/permissions.models';
import { inverseObject } from '../../../../src/app/services/util/inverseObject';

export function getRoleByTitle(title: string): Role {
  const role = inverseObject(rolesTitles)[title];

  if (!role) {
    throw new Error(`Не существует роль "${title}"`);
  }

  return role;
}

export type TestUser = RegData & { token?: string; middleName: string; job: string; department: string };

const testUsers: Record<
  | 'Администратор системы'
  | 'Администратор организации'
  | 'Гарри'
  | 'Драко'
  | 'Рональд'
  | 'Джинни'
  | 'Деактивированный пользователь'
  | 'Администратор другой организации'
  | 'Питер',
  TestUser
> = {
  'Администратор системы': {
    company: 'Order of the Phoenix',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Albus',
    middleName: 'Percival',
    lastName: 'Dumbledore',
    email: 'testcrguser@mail.ru',
    job: 'Администратор системы',
    department: 'Gryffindor',
    password: 'BigTestPass6834',
    password_: 'BigTestPass6834'
  },
  'Администратор организации': {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Hermione',
    middleName: 'Jean',
    lastName: 'Granger',
    email: 'hermione@admin',
    job: 'Администратор организации',
    department: 'Ravenclaw',
    password: 'Avadakedavra1',
    password_: 'Avadakedavra1'
  },
  Гарри: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Harry',
    middleName: 'James',
    lastName: 'Potter',
    email: 'harry@owner.ru',
    job: 'Владелец',
    department: 'Ravenclaw',
    password: 'Avadakedavra2',
    password_: 'Avadakedavra2'
  },
  Драко: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Draco',
    middleName: 'Lucius',
    lastName: 'Malfoy',
    email: 'draco@contributor',
    job: 'Писец',
    department: 'Slytherin',
    password: 'Avadakedavra3',
    password_: 'Avadakedavra3'
  },
  Рональд: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Ronald',
    middleName: 'Bilius',
    lastName: 'Weasley',
    email: 'ron@viewer',
    job: 'Чтец',
    department: 'Gryffindor',
    password: 'Avadakedavra4',
    password_: 'Avadakedavra4'
  },
  Джинни: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Ginny',
    middleName: 'Molly',
    lastName: 'Weasley',
    email: 'ginny@user',
    job: 'Никто',
    department: 'Gryffindor',
    password: 'Avadakedavra5',
    password_: 'Avadakedavra5'
  },
  'Деактивированный пользователь': {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Fred',
    middleName: 'Gideon',
    lastName: 'Weasley',
    email: 'fred@dead',
    job: 'Мертвец',
    department: 'Gryffindor',
    password: 'Avadakedavra6',
    password_: 'Avadakedavra6'
  },
  'Администратор другой организации': {
    company: 'Другая организация',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Tom',
    middleName: 'Marvolo',
    lastName: 'Riddle',
    email: 'dark_lord@other',
    job: 'Администратор другой организации',
    department: 'Death Eaters',
    password: 'Avadakedavra666',
    password_: 'Avadakedavra666'
  },
  Питер: {
    company: 'Другая организация',
    contactPhone: '7777777777',
    specializationId: 1,
    firstName: 'Peter',
    middleName: 'Wormtail',
    lastName: 'Pettigrew',
    email: 'scabbers@other',
    job: 'Предатель',
    department: 'Death Eaters',
    password: 'Avadakedavra0',
    password_: 'Avadakedavra0'
  }
};

export function getTestUser(username: string): TestUser {
  const user: TestUser | undefined = testUsers[username as keyof typeof testUsers];
  const testOrganizationIndex = global.testOrganizationIndex;

  if (!user) {
    throw new Error(`Не существует тестовый пользователь "${username}"`);
  }

  return user.job === 'Администратор системы'
    ? user
    : {
        ...user,
        email: `${user.email}${testOrganizationIndex || 0}`,
        company: `${user.company} ${testOrganizationIndex || 0}`
      };
}

export function getAllTestUsers(): TestUser[] {
  return Object.keys(testUsers).map(getTestUser);
}
