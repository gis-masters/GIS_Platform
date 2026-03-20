import { sleep } from '../../../../src/app/services/util/sleep';
import { createUserAs } from './createUserAs';
import { editUser } from './editUser';
import { getUserByEmail } from './getUserByEmail';
import { getAllTestUsers, getTestUser } from './testUsers';

export async function createTestUsers(): Promise<void> {
  for (const {
    company,
    email,
    firstName,
    lastName,
    middleName,
    contactPhone,
    department,
    job,
    password
  } of getAllTestUsers()) {
    if (company.startsWith('Hogwarts') && job !== 'Администратор организации') {
      await createUserAs(
        {
          email,
          name: firstName,
          surname: lastName,
          middleName,
          enabled: true,
          phone: contactPhone,
          department,
          job,
          password
        },
        'Администратор организации'
      );
    }
  }

  await sleep(5000); // wait for users ready

  const deadUser = await getUserByEmail(getTestUser('Деактивированный пользователь').email);
  await editUser({ enabled: false }, deadUser.id);
}

export async function createTestUsersInOtherOrganization(): Promise<void> {
  const { email, firstName, lastName, middleName, job, department, contactPhone, password } = getTestUser('Питер');

  await createUserAs(
    {
      enabled: true,
      email,
      name: firstName,
      surname: lastName,
      middleName,
      job,
      department,
      phone: contactPhone,
      password
    },
    'Администратор другой организации'
  );
}
