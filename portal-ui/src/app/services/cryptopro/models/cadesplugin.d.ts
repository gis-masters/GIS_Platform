export declare namespace CADES_Plugin {
  interface ObjectNames {
    'CAPICOM.Store': CAPICOM.Store;
    'CAdESCOM.CPSigner': CAdESCOM.CPSigner;
    'CAdESCOM.About': CAdESCOM.About;
    'CAdESCOM.SignedXML': CAdESCOM.SignedXML;
    'CAdESCOM.HashedData': CAdESCOM.CPHashedData;
    'CAdESCOM.CadesSignedData': CAdESCOM.CadesSignedData;
    'CAdESCOM.CPAttribute': CAdESCOM.CPAttribute;
    'CAdESCOM.RawSignature': CAdESCOM.RawSignature;
  }

  interface ObjectNamesAsync {
    'CAPICOM.Store': CAPICOM.StoreAsync;
    'CAdESCOM.CPSigner': CAdESCOM.CPSignerAsync;
    'CAdESCOM.About': CAdESCOM.AboutAsync;
    'CAdESCOM.SignedXML': CAdESCOM.SignedXMLAsync;
    'CAdESCOM.HashedData': CAdESCOM.CPHashedDataAsync;
    'CAdESCOM.CadesSignedData': CAdESCOM.CadesSignedDataAsync;
    'CAdESCOM.CPAttribute': CAdESCOM.CPAttributeAsync;
    'CAdESCOM.RawSignature': CAdESCOM.RawSignatureAsync;
  }

  const enum LogLevel {
    LOG_LEVEL_DEBUG = 4,
    LOG_LEVEL_INFO = 2,
    LOG_LEVEL_ERROR = 1
  }

  const enum ISignedXmlUrls {
    XmlDsigGost3410Url = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411',
    XmlDsigGost3410UrlObsolete = 'http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411',
    XmlDsigGost3411Url = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411',
    XmlDsigGost3411UrlObsolete = 'http://www.w3.org/2001/04/xmldsig-more#gostr3411'
  }

  const enum IEncodingType {
    CADESCOM_ENCODE_ANY = -1,
    CADESCOM_ENCODE_BASE64 = 0,
    CADESCOM_ENCODE_BINARY = 1
  }
}

type _CADESPluginBase = Promise<never> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_LOCATION, CAPICOM.StoreLocationPluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_NAME, CAPICOM.StoreNamePluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_OPEN_MODE, CAPICOM.StoreOpenModePluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_CERT_INFO_TYPE, CAPICOM.CertIntoTypePluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_KEY_USAGE, CAPICOM.KeyUsagePluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_PROPID, CAPICOM.PropIDPluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_OID, CAPICOM.OIDPluginNames>> &
  Readonly<Pick<typeof CAPICOM.CAPICOM_EKU, CAPICOM.EKUPluginNames>> &
  Readonly<Pick<typeof CAdESCOM.CADESCOM_STORE_LOCATION, CAdESCOM.StoreLocationPluginNames>> &
  Readonly<typeof CAPICOM.CAPICOM_CERTIFICATE_FIND_TYPE> &
  Readonly<typeof CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_OPTION> &
  Readonly<typeof CAPICOM.CAPICOM_ATTRIBUTE> &
  Readonly<typeof CAdESCOM.CADESCOM_CADES_TYPE> &
  Readonly<typeof CAdESCOM.CADESCOM_XML_SIGNATURE_TYPE> &
  Readonly<typeof CAdESCOM.CADESCOM_ATTRIBUTE> &
  Readonly<typeof CAdESCOM.CADESCOM_CONTENT_ENCODING_TYPE> &
  Readonly<typeof CAdESCOM.CADESCOM_DISPLAY_DATA> &
  Readonly<typeof CAdESCOM.CADESCOM_ENCRYPTION_ALGORITHM> &
  Readonly<typeof CAdESCOM.CADESCOM_HASH_ALGORITHM> &
  Readonly<typeof CAdESCOM.CADESCOM_InstallResponseRestrictionFlags> &
  Readonly<typeof CADES_Plugin.LogLevel> &
  Readonly<typeof CADES_Plugin.ISignedXmlUrls> &
  Readonly<typeof CADES_Plugin.IEncodingType>;

interface CADESPluginBase extends _CADESPluginBase {
  readonly JSModuleVersion: string;
  readonly current_log_level: number;
  async_spawn<T>(generatorFun: () => void): T;
  // излишняя на этом этапе типизация
  // async_spawn<T>(generatorFun: (...args: any[]) => Iterator<T>): T;
  set(obj: CADESPluginBase): void;
  set_log_level(level: CADES_Plugin.LogLevel): void;
  getLastError(exception: Error): string;
  is_capilite_enabled(): boolean;
}

interface CADESPluginAsync extends CADESPluginBase {
  CreateObjectAsync<T extends keyof CADES_Plugin.ObjectNamesAsync>(
    objname: T
  ): Promise<CADES_Plugin.ObjectNamesAsync[T]>;
  ReleasePluginObjects(): Promise<boolean>;
}

export interface CADESPluginSync extends CADESPluginBase {
  CreateObject<T extends keyof CADES_Plugin.ObjectNames>(objname: T): CADES_Plugin.ObjectNames[T];
}

export type CADESPlugin = CADESPluginAsync;
