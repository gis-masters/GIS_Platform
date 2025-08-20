/* eslint-disable unicorn/prefer-node-protocol */
import { Buffer } from 'buffer';

import { CAdESCOM } from './models/cadescom_async';
import { CADESPlugin } from './models/cadesplugin';
import { CAPICOM_ASYNC } from './models/capicom_async';

declare const cadesplugin: CADESPlugin;

const CADES_SIGNED_DATA = 'CAdESCOM.CadesSignedData';

export async function createSignature(
  hashValue: string,
  certificateThumbprint: string,
  existingSign?: ArrayBuffer
): Promise<string | undefined> {
  // Алгоритм хэширования, при помощи которого было вычислено хэш-значение
  const hashAlg = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256;

  const oHashedData = (await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData')) as CAdESCOM.CPHashedDataAsync;

  // Инициализируем объект заранее вычисленным хэш-значением
  // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
  await oHashedData.propset_Algorithm(hashAlg);
  await oHashedData.SetHashValue(hashValue);

  const oSignedData = (await cadesplugin.CreateObjectAsync(CADES_SIGNED_DATA)) as CAdESCOM.CadesSignedDataAsync;

  if (existingSign) {
    const sign = isBinary(existingSign) ? convertToBase64(existingSign) : new TextDecoder().decode(existingSign);

    await oSignedData.VerifyHash(oHashedData, sign, cadesplugin.CADESCOM_CADES_BES);
  }

  const oStore = (await cadesplugin.CreateObjectAsync('CAPICOM.Store')) as CAPICOM_ASYNC.StoreAsync;

  await oStore.Open(
    cadesplugin.CAPICOM_CURRENT_USER_STORE,
    cadesplugin.CAPICOM_MY_STORE,
    cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
  );

  // Выбираем сертификат для подписания
  const certificates = await oStore.Certificates;
  const centsLength = await certificates?.Count;
  let oCertificate;

  for (let i = 1; i <= centsLength; i++) {
    const cert = await certificates.Item(i);
    const certThumbprint = await cert.Thumbprint;

    if (certThumbprint === certificateThumbprint) {
      oCertificate = cert;

      break;
    }
  }
  await oStore.Close();

  const oSigner = (await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner')) as CAdESCOM.CPSignerAsync;

  await oSigner.propset_Certificate(oCertificate);
  await oSigner.propset_CheckCertificate(true);

  let sSignedMessage = '';
  sSignedMessage = await (existingSign
    ? oSignedData.CoSignHash(oHashedData, oSigner, cadesplugin.CADESCOM_CADES_BES)
    : oSignedData.SignHash(oHashedData, oSigner, cadesplugin.CADESCOM_CADES_BES));

  await verifyHash(oHashedData, sSignedMessage);

  return sSignedMessage;
}

async function verifyHash(hash: CAdESCOM.CPHashedDataAsync, sSignedMessage: string) {
  const signedDataForVerify = (await cadesplugin.CreateObjectAsync(CADES_SIGNED_DATA)) as CAdESCOM.CadesSignedDataAsync;

  try {
    await signedDataForVerify.VerifyHash(hash, sSignedMessage, cadesplugin.CADESCOM_CADES_BES);
  } catch {
    throw new Error('Не удалось подтвердить подпись');
  }
}

export async function getUsedCertificates(hashValue: string, existingSign: ArrayBuffer): Promise<string[]> {
  const hashAlg = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256;

  const oHashedData = (await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData')) as CAdESCOM.CPHashedDataAsync;

  // Инициализируем объект заранее вычисленным хэш-значением
  // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
  await oHashedData.propset_Algorithm(hashAlg);
  await oHashedData.SetHashValue(hashValue);
  const oSignedData = (await cadesplugin.CreateObjectAsync(CADES_SIGNED_DATA)) as CAdESCOM.CadesSignedDataAsync;
  const existingSignaturesThumbprints = [];

  // параллельная подпись
  if (existingSign) {
    const signBase64 = convertToBase64(existingSign);
    await oSignedData.VerifyHash(oHashedData, signBase64, cadesplugin.CADESCOM_CADES_BES);
    // собираем thumbprint каждой существующей подписи для запрета дублирующих подписей
    const existingSignatures = (await oSignedData.Certificates) as CAPICOM_ASYNC.ICertificatesAsync;
    const centsLength = await existingSignatures?.Count;

    for (let i = 1; i <= centsLength; i++) {
      const cert = await existingSignatures.Item(i);
      const thumbprint = await cert.Thumbprint;
      existingSignaturesThumbprints.push(thumbprint);
    }
  }

  return existingSignaturesThumbprints;
}

// преобразуем байтовый массив в base64 строку
function convertToBase64(binaryData: ArrayBuffer) {
  try {
    return Buffer.from(binaryData).toString('base64');
  } catch {
    throw new Error('Ошибка при обработке файла подписи');
  }
}

function isBinary(arrayBuffer: ArrayBuffer) {
  const text = new TextDecoder().decode(arrayBuffer);

  for (let i = 0; i < text.length; i++) {
    const charCode = text.codePointAt(i);

    if (charCode && (charCode < 0x09 || (charCode > 0x0d && charCode < 0x20))) {
      return true;
    }
  }

  return false;
}
