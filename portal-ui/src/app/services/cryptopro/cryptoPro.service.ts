/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// TODO: eslint на говно исходится при типизации файла, нужно потом поправить как то

import { CAdESCOM } from './models/cadescom_async';
import { CADESPlugin } from './models/cadesplugin';
import { CAPICOM_ASYNC } from './models/capicom_async';

declare const cadesplugin: CADESPlugin;

export async function createSignature(
  hashValue: string,
  certificateThumbprint: string,
  existingSign?: string
): Promise<string | undefined> {
  // Алгоритм хэширования, при помощи которого было вычислено хэш-значение
  const hashAlg = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256;

  const oHashedData: CAdESCOM.CPHashedDataAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');

  // Инициализируем объект заранее вычисленным хэш-значением
  // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
  await oHashedData.propset_Algorithm(hashAlg);
  await oHashedData.SetHashValue(hashValue);

  const oSignedData: CAdESCOM.CadesSignedDataAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');

  if (existingSign) {
    await oSignedData.VerifyHash(oHashedData, existingSign, cadesplugin.CADESCOM_CADES_BES);
  }

  // @ts-expect-error
  const oStore: CAPICOM_ASYNC.StoreAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.Store');
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

  const oSigner: CAdESCOM.CPSignerAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');

  await oSigner.propset_Certificate(oCertificate);
  await oSigner.propset_CheckCertificate(true);

  let sSignedMessage = '';
  sSignedMessage = await (existingSign
    ? oSignedData.CoSignHash(oHashedData, oSigner, cadesplugin.CADESCOM_CADES_BES)
    : oSignedData.SignHash(oHashedData, oSigner, cadesplugin.CADESCOM_CADES_BES));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await verifyHash(oHashedData, sSignedMessage);

  return sSignedMessage;
}

async function verifyHash(hash: CAdESCOM.CPHashedDataAsync, sSignedMessage: string) {
  const signedDataForVerify: CAdESCOM.CadesSignedDataAsync =
    await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');

  try {
    await signedDataForVerify.VerifyHash(hash, sSignedMessage, cadesplugin.CADESCOM_CADES_BES);
  } catch {
    alert('Failed to verify signature. Error: ');
  }
}

export async function getUsedCertificates(hashValue: string, existingSign: string): Promise<string[]> {
  const hashAlg = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256;

  const oHashedData: CAdESCOM.CPHashedDataAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');

  // Инициализируем объект заранее вычисленным хэш-значением
  // Алгоритм хэширования нужно указать до того, как будет передано хэш-значение
  await oHashedData.propset_Algorithm(hashAlg);
  await oHashedData.SetHashValue(hashValue);

  const oSignedData: CAdESCOM.CadesSignedDataAsync = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');

  const existingSignaturesThumbprints = [];

  // параллельная подпись
  if (existingSign) {
    await oSignedData.VerifyHash(oHashedData, existingSign, cadesplugin.CADESCOM_CADES_BES);

    // собираем thumbprint каждой существующей подписи для запрета дублирующих подписей
    const existingSignatures: CAPICOM_ASYNC.ICertificatesAsync = await oSignedData.Certificates;
    const centsLength = await existingSignatures?.Count;
    for (let i = 1; i <= centsLength; i++) {
      const cert = await existingSignatures.Item(i);
      const thumbprint = await cert.Thumbprint;
      existingSignaturesThumbprints.push(thumbprint);
    }
  }

  return existingSignaturesThumbprints;
}
