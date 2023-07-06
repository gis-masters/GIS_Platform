import { WebDriverLogTypes } from '@wdio/types/build/Options';

export function logLevel(logLevel: WebDriverLogTypes = 'info'): boolean {
  const levels: WebDriverLogTypes[] = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];
  const level = levels.indexOf(logLevel);
  const currentLevel = levels.indexOf(browser.options.logLevel || 'info');

  return currentLevel <= level;
}
