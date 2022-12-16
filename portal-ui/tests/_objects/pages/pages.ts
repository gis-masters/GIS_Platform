import { Given, Then, When } from '@wdio/cucumber-framework';

import { pagesRegistry } from '../Page';

Then(/^открылась страница "([\dA-Za-z]*)"$/, async (name: string) => {
  await pagesRegistry[name].waitForVisible();
  await pagesRegistry[name].testUrl();
});

Given(/^я на странице "(.*)"$/, async (name: string) => {
  await pagesRegistry[name].open();
});

When(/^я открываю страницу "(.*)"$/, async (name: string) => {
  await browser.url(pagesRegistry[name].url);
  await browser.pause(5000);
});

When(/^я открываю страницу "(.*)" с гостевыми логином-паролем$/, async (name: string) => {
  await browser.url(pagesRegistry[name].url + '/?guestName=ron@viewer&guestPass=Avadakedavra4');
  await browser.pause(5000);
});
