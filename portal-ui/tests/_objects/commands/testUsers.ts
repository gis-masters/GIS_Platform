import { RegData } from '../../../src/app/services/auth.service';

export const testUsers: Record<'admin' | 'owner' | 'contributor' | 'viewer' | 'user', RegData> = {
  admin: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Hermione',
    lastName: 'Granger',
    email: 'hermione@admin',
    password: 'Avadakedavra1',
    password_: 'Avadakedavra1'
  },
  owner: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Harry',
    lastName: 'Potter',
    email: 'harry@owner',
    password: 'Avadakedavra2',
    password_: 'Avadakedavra2'
  },
  contributor: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Draco',
    lastName: 'Malfoy',
    email: 'draco@contributor',
    password: 'Avadakedavra3',
    password_: 'Avadakedavra3'
  },
  viewer: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Ronald',
    lastName: 'Weasley',
    email: 'ron@viewer',
    password: 'Avadakedavra4',
    password_: 'Avadakedavra4'
  },
  user: {
    company: 'Hogwarts',
    contactPhone: '7777777777',
    firstName: 'Ginny',
    lastName: 'Weasley',
    email: 'ginny@user',
    password: 'Avadakedavra5',
    password_: 'Avadakedavra5'
  }
};
