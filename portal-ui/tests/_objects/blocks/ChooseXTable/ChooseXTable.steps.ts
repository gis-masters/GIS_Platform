import { When } from '@wdio/cucumber-framework';

import { chooseXTableBlock } from './ChooseXTable.block';

When('в таблице выбора я выбираю пункт, где {string} равно {string}', async function (colTitle: string, value: string) {
  await chooseXTableBlock.waitForVisible();
  await chooseXTableBlock.selectOne(colTitle, value);
});
