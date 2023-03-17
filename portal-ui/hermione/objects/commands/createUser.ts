import { testUsers } from './testUsers';
import { usersService } from '../../../src/app/services/auth/users/users.service';
import { NewUserData } from '../../../src/app/services/auth/users/users.models';

declare const window: { usersService: typeof usersService };

export async function createUser(
  browser: WebdriverIO.Browser,
  { email, enabled, name, middleName, surname, department, job, phone, password }: NewUserData
) {
  await browser.executeAsync(
    (email, enabled, name, middleName, surname, department, job, phone, password, callback) => {
      window.usersService
        .create({
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
        .then(result => {
          callback(result);
        });
    },
    email,
    enabled,
    name,
    middleName,
    surname,
    department,
    job,
    phone,
    password
  );
}

export async function createTestUsers(browser: WebdriverIO.Browser) {
  const { owner, contributor, viewer } = testUsers;

  await createUser(browser, {
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

  await createUser(browser, {
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

  await createUser(browser, {
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
}
