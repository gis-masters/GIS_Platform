export declare namespace CAPICOM {
  interface ICertificate {
    readonly Version: number;
    readonly Thumbprint: string;
    readonly SubjectName: string;
    readonly SerialNumber: string;
    readonly IssuerName: string;
    readonly ValidFromDate: VarDate;
    readonly ValidToDate: VarDate;
    HasPrivateKey(): boolean;
    //GetInfo(infoType: CAPICOM_CERT_INFO_TYPE): string;
    IsValid(): ICertificateStatus;
    Display(): void;
  }

  interface ICertificateStatus {
    // TODO
  }

  interface ICertificates {
    readonly Count: number;
    Item(index: number): ICertificate;
    Find(findType: CAPICOM_CERTIFICATE_FIND_TYPE, varCriteria?: any, bFindValidOnly?: boolean): ICertificates;
    Select(title?: string, displayString?: string, bMultiSelect?: boolean): ICertificates;
  }

  interface Store {
    Open(location?: CAPICOM_STORE_LOCATION, name?: CAPICOM_STORE_NAME, openMode?: CAPICOM_STORE_OPEN_MODE): void;
    Close(): void;
    Delete(): boolean;
    Import(encodedStore: string): void;
    readonly Certificates: ICertificates;
    readonly Location: CAPICOM_STORE_LOCATION;
    readonly Name: string;
  }

  interface Signers {
    readonly Count: number;
    Item(index: number): Signer;
  }

  interface Signer {
    Load(fileName: string, password?: string): void;
    Certificate: ICertificate;
    Options: CAPICOM_CERTIFICATE_INCLUDE_OPTION;
  }
}
