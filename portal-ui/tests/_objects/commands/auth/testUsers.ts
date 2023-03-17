import { RegData } from '../../../../src/app/services/auth//auth/auth.models';
import { Role } from '../../../../src/app/services/data/permissions/permissions.models';

export const userRoles: Record<string, Role> = {
  владение: Role.OWNER,
  чтение: Role.VIEWER,
  редактирование: Role.CONTRIBUTOR
};

export const testUsers: Record<
  | 'Администратор системы'
  | 'Администратор организации'
  | 'Гарри'
  | 'Драко'
  | 'Рональд'
  | 'Джинни'
  | 'Деактивированный пользователь'
  | 'Администратор другой организации'
  | 'Питер',
  RegData
> = {
  'Администратор системы': {
    company: 'Order of the Phoenix',
    contactPhone: '7777777777',
    firstName: 'Albus',
    lastName: 'Dumbledore',
    email: 'admin@mail.ru',
    password: 'Esterhazy2022',
    password_: 'Esterhazy2022'
  },
  'Администратор организации': {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Hermione',
    lastName: 'Granger',
    email: 'hermione@admin',
    password: 'Avadakedavra1',
    password_: 'Avadakedavra1'
  },
  Гарри: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Harry',
    lastName: 'Potter',
    email: 'harry@owner',
    password: 'Avadakedavra2',
    password_: 'Avadakedavra2'
  },
  Драко: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Draco',
    lastName: 'Malfoy',
    email: 'draco@contributor',
    password: 'Avadakedavra3',
    password_: 'Avadakedavra3'
  },
  Рональд: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Ronald',
    lastName: 'Weasley',
    email: 'ron@viewer',
    password: 'Avadakedavra4',
    password_: 'Avadakedavra4'
  },
  Джинни: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Ginny',
    lastName: 'Weasley',
    email: 'ginny@user',
    password: 'Avadakedavra5',
    password_: 'Avadakedavra5'
  },
  'Деактивированный пользователь': {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Fred',
    lastName: 'Weasley',
    email: 'fred@dead',
    password: 'Avadakedavra6',
    password_: 'Avadakedavra6'
  },
  'Администратор другой организации': {
    company: 'Другая организация',
    contactPhone: '7777777777',
    firstName: 'Tom',
    lastName: 'Riddle',
    email: 'dark_lord@other',
    password: 'Avadakedavra666',
    password_: 'Avadakedavra666'
  },
  Питер: {
    company: 'Другая организация',
    contactPhone: '7777777777',
    firstName: 'Peter',
    lastName: 'Pettigrew',
    email: 'scabbers@other',
    password: 'Avadakedavra0',
    password_: 'Avadakedavra0'
  }
};
