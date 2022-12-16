import { testUsers } from './testUsers';
import { NewUserData, usersService } from '../../../src/app/services/data/users.service';

declare const window: { usersService: typeof usersService };

export async function createUser({
  email,
  enabled,
  name,
  middleName,
  surname,
  department,
  job,
  phone,
  password
}: NewUserData): Promise<void> {
  await browser.executeAsync(
    async ({ email, enabled, name, middleName, surname, department, job, phone, password }, callback) => {
      callback(
        await window.usersService.create({
          email,
          enabled,
          name,
          middleName,
          surname,
          department,
          job,
          phone,
          password
        })
      );
    },
    { email, enabled, name, middleName, surname, department, job, phone, password }
  );
}

export async function createTestUsers(): Promise<void> {
  const { owner, contributor, viewer, user, disabled } = testUsers;

  await createUser({
    enabled: true,
    email: owner.email,
    name: owner.firstName,
    surname: owner.lastName,
    middleName: 'James',
    job: 'Писец',
    department: 'Ravenclaw',
    phone: owner.contactPhone,
    password: owner.password
  });

  await createUser({
    enabled: true,
    email: contributor.email,
    name: contributor.firstName,
    surname: contributor.lastName,
    middleName: 'Lucius',
    job: 'Владелец',
    department: 'Slytherin',
    phone: contributor.contactPhone,
    password: contributor.password
  });

  await createUser({
    enabled: true,
    email: viewer.email,
    name: viewer.firstName,
    surname: viewer.lastName,
    middleName: 'Bilius',
    job: 'Чтец',
    department: 'Gryffindor',
    phone: viewer.contactPhone,
    password: viewer.password
  });

  await createUser({
    enabled: true,
    email: user.email,
    name: user.firstName,
    surname: user.lastName,
    middleName: 'Molly',
    job: 'Никто',
    department: 'Gryffindor',
    phone: user.contactPhone,
    password: user.password
  });

  await createUser({
    enabled: false,
    email: disabled.email,
    name: disabled.firstName,
    surname: disabled.lastName,
    middleName: 'Gideon',
    job: 'Мертвец',
    department: 'Gryffindor',
    phone: disabled.contactPhone,
    password: disabled.password
  });
}
