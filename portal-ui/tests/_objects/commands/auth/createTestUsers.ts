import { sleep } from '../../../../src/app/services/util/sleep';
import { getUserByEmail } from './getUserByEmail';
import { testUsers } from './testUsers';
import { createUserAs } from './createUserAs';
import { editUser } from './editUser';

export async function createTestUsers(): Promise<void> {
  for (const { company, email, firstName, lastName, middleName, contactPhone, job, password } of Object.values(
    testUsers
  )) {
    if (company === 'Hogwarts' && job !== 'Администратор организации') {
      await createUserAs(
        {
          email,
          name: firstName,
          surname: lastName,
          middleName,
          enabled: true,
          phone: contactPhone,
          job,
          password
        },
        'Администратор организации'
      );
    }
  }

  await sleep(5000); // wait for users ready

  const deadUser = await getUserByEmail('fred@dead');
  await editUser({ enabled: false }, deadUser.id);
}

export async function createTestUsersInOtherOrganization(): Promise<void> {
  const { email, firstName, lastName, middleName, job, department, contactPhone, password } = testUsers['Питер'];

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
