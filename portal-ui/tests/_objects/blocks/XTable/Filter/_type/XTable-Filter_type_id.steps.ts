import { Then, When } from '@wdio/cucumber-framework';

import { xTableFilterTypeIdBlock } from './XTable-Filter_type_id.block';

When('в таблице xTable я ввожу в поле фильтра типа id {string}', async (value: string) => {
  await xTableFilterTypeIdBlock.setValue(value);
});

Then('в таблице xTable в поле фильтра типа id введено значение {string}', async (value: string) => {
  await expect(await xTableFilterTypeIdBlock.getValue()).toEqual(value);
});

When('в таблице xTable я ввожу в поле фильтра типа id 2, 3 и 5 через {string}', async (divType: string) => {
  const div = {
    пробел: ' ',
    запятая: ',',
    'запятая и пробел': ', ',
    'пробел и запятая': ' ,',
    'запятая и два пробела': ',  ',
    'три запятые и четыре пробела': ',,,    '
  }[divType];

  if (!div) {
    throw new Error('Незнакомый разделитель');
  }

  await xTableFilterTypeIdBlock.setValue([2, 3, 5].join(div));
});
