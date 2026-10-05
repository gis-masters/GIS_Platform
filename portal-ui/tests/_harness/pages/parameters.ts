import { defineParameterType } from '@cucumber/cucumber';

import { getRoleByTitle, getTestUser } from '../commands/auth/testUsers';
import { getTestSchema } from '../commands/schemas/testSchemas';

defineParameterType({
  name: 'user',
  regexp: /"[ А-яЁё]+"/,
  transformer: usernameWithQuotes => getTestUser(usernameWithQuotes.slice(1, -1))
});

defineParameterType({
  name: 'schema',
  regexp: /"[\d ,A-Za-zА-яЁё]+"/,
  transformer: schemaTitleWithQuotes => getTestSchema(schemaTitleWithQuotes.slice(1, -1))
});

defineParameterType({
  name: 'role',
  regexp: /"(Чтение|Запись|Владение)"/,
  transformer: roleTitle => getRoleByTitle(roleTitle)
});

defineParameterType({
  name: 'strings',
  regexp: /(".+"( ,)*)+|-/,
  transformer: joined => joined?.slice(1, -1).split('", "') || []
});
