import { Then, When } from '@wdio/cucumber-framework';

import { permissionsWidgetBlock } from './PermissionsWidget.block';

When('у разрешений я нажимаю на стрелочку открытия', async () => {
  await permissionsWidgetBlock.clickOpenBtn();
});

When('у разрешений я нажимаю на стрелочку закрытия', async () => {
  await permissionsWidgetBlock.clickOpenBtn();
});

Then('содержимое аккордеона разрешений {string}', async (variant: string) => {
  await permissionsWidgetBlock.assertSelfie(variant.split(' ').join('-'));
});
