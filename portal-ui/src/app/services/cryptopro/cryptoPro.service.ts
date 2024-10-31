/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// TODO: eslint на говно исходится при типизации yield, нужно потом поправить как то

import { CAdESCOM } from './models/cadescom_async';
import { CADESPluginAsync } from './models/cadesplugin';
import { CAPICOM_ASYNC } from './models/capicom_async';

declare const cadesplugin: CADESPluginAsync;

export function fileSignCreate(oFile: File | Blob, certName?: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    cadesplugin.async_spawn(() => {
      if (!window.FileReader) {
        return reject('API чтения файлов не поддерживается в вашем браузере');
      }

      const oFReader = new FileReader();

      if (typeof oFReader.readAsDataURL !== 'function') {
        return reject('Ошибка получение информации о файле');
      }

      oFReader.readAsDataURL(oFile);
      oFReader.addEventListener('load', function (oFREvent) {
        cadesplugin.async_spawn(function* () {
          const header = ';base64,';

          if (!oFREvent?.target?.result) {
            return reject('Ошибка получения данных');
          }

          const sFileData = oFREvent.target.result;

          if (typeof sFileData !== 'string') {
            return reject('Некорректные данные');
          }

          const sBase64Data = sFileData.slice(sFileData.indexOf(header) + header.length);
          const oCertName = { value: certName }; // имя сертификата
          const sCertName = oCertName.value;
          if (sCertName === '') {
            return reject('Введите имя сертификата (CN).');
          }

          const oStore: CAPICOM_ASYNC.StoreAsync = yield cadesplugin.CreateObjectAsync('CAPICOM.Store');

          if (!oStore) {
            return reject('Введите имя сертификата (CN).');
          }

          yield oStore.Open(
            cadesplugin.CAPICOM_CURRENT_USER_STORE,
            cadesplugin.CAPICOM_MY_STORE,
            cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
          );

          const oStoreCerts: CAPICOM_ASYNC.ICertificatesAsync = yield oStore.Certificates;
          const oCertificates: CAPICOM_ASYNC.ICertificatesAsync = yield oStoreCerts?.Find(
            cadesplugin.CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME,
            sCertName
          );
          const certsCount: number = yield oCertificates?.Count;

          if (certsCount === 0) {
            return reject('Не найден сертификат: ' + sCertName);
          }

          const oCertificate: CAPICOM_ASYNC.ICertificateAsync = yield oCertificates.Item(1);
          const oSigner: CAdESCOM.CPSignerAsync = yield cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
          yield oSigner.propset_Certificate(oCertificate);
          yield oSigner.propset_CheckCertificate(true);

          const oSignedData: CAdESCOM.CadesSignedDataAsync =
            yield cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
          yield oSignedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
          yield oSignedData.propset_Content(sBase64Data);

          try {
            const sSignedMessage: string = yield oSignedData.SignCades(oSigner, cadesplugin.CADESCOM_CADES_BES, true);
            // Функция для конвертации Base64 в бинарный массив
            // Получаем бинарные данные из строки Base64
            const binarySignature = base64ToUint8Array(sSignedMessage);

            yield oStore.Close();

            resolve(new Blob([binarySignature], { type: 'application/octet-stream' }));
          } catch (error) {
            return reject('Ошибка создания подписи: ' + cadesplugin.getLastError(error as Error));
          }

          yield oStore.Close();
        });
      });
    });
  });
}

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    const byte = binaryString.codePointAt(i);

    if (typeof byte === 'number') {
      bytes[i] = byte;
    }
  }

  return bytes;
}
