import { RegData } from '../../../src/app/services/auth/auth/auth.models';

export const testUsers: Record<'admin' | 'owner' | 'contributor' | 'viewer', RegData> = {
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
    password: 'Avadakedavra3',
    password_: 'Avadakedavra3'
  }
};
