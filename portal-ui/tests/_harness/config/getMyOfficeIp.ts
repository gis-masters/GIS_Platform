import { type NetworkInterfaceInfo, networkInterfaces } from 'node:os';

const subnets = [
  /^(?:10\.){3}\d{1,3}$/, // офис, провод
  /^192.168.101.\d{1,3}$/, // офис, wi-fi
  /^192.168.40.\d{1,3}$/ // vpn
];

function isOfficeV4(net: NetworkInterfaceInfo): boolean {
  // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
  const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;

  return net.family === familyV4Value && !net.internal && subnets.some(subnet => subnet.test(net.address));
}

/**
 * Возвращает IPv4-адрес текущей машины в офисной сети (провод, wi-fi или VPN).
 * Ищет среди сетевых интерфейсов адрес, попадающий в офисные подсети.
 * Нужно для формирования baseUrl в конфиге WDIO в dev-режиме — selenium-grid подключается к dev-серверу по этому IP
 * @throws {Error} Если офисный IP не найден
 */
export function getMyOfficeIp(): string {
  const nets = networkInterfaces();

  for (const netInterface of Object.values(nets)) {
    if (netInterface) {
      const found = netInterface.find(isOfficeV4);
      if (found) {
        return found.address;
      }
    }
  }

  throw new Error('Не удалось вычислить офисный IP для dev режима');
}
