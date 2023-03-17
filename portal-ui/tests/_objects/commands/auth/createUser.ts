import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { CrgUser, NewUserData } from '../../../../src/app/services/auth/users/users.models';
import { sleep } from '../../../../src/app/services/util/sleep';
import { getUserByEmail } from './getUserByEmail';
import { testUsers } from './testUsers';

declare const window: { usersService: typeof usersService };

async function editUser(patch: Partial<CrgUser>, id: number) {
  return await browser.executeAsync(
    async (serializedPatch, id, callback) => {
      callback(await window.usersService.edit(JSON.parse(serializedPatch) as Partial<CrgUser>, id));
    },
    JSON.stringify(patch),
    id
  );
}

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
      try {
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
        });
      } catch {}
      callback();
    },
    { email, enabled, name, middleName, surname, department, job, phone, password }
  );
}

export async function createTestUsers(): Promise<void> {
  const {
    Гарри: owner,
    Драко: contributor,
    Рональд: viewer,
    Джинни: user,
    'Деактивированный пользователь': disabled
  } = testUsers;

  await createUser({
    enabled: true,
    email: owner.email,
    name: owner.firstName,
    surname: owner.lastName,
    middleName: 'James',
    job: 'Владелец',
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
    job: 'Писец',
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

  await sleep(5000); // wait for users ready
  const deadUser = await getUserByEmail('fred@dead');
  if (deadUser) {
    await editUser({ enabled: false }, deadUser.id);
  }
}

export async function createTestUsersInOtherOrganization(): Promise<void> {
  const collaborator = testUsers['Питер'];

  await createUser({
    enabled: true,
    email: collaborator.email,
    name: collaborator.firstName,
    surname: collaborator.lastName,
    middleName: 'Wormtail',
    job: 'Предатель',
    department: 'Death Eaters',
    phone: collaborator.contactPhone,
    password: collaborator.password
  });
}
