export declare namespace CAPICOM_ASYNC {
  interface ICertificateAsync {
    readonly Version: Promise<number>;
    readonly Thumbprint: Promise<string>;
    readonly SubjectName: Promise<string>;
  }

  interface ICertificatesAsync {
    readonly Count: Promise<number>;
    Item(index: number): Promise<ICertificateAsync>;
    Find(
      findType: CAPICOM_CERTIFICATE_FIND_TYPE,
      varCriteria?: any,
      bFindValidOnly?: boolean
    ): Promise<ICertificatesAsync>;
    propset_Count(): Promise<unknown>;
  }

  interface StoreAsync {
    Open(
      location?: CAPICOM_STORE_LOCATION,
      name?: CAPICOM_STORE_NAME,
      openMode?: CAPICOM_STORE_OPEN_MODE
    ): Promise<void>;
    Close(): Promise<void>;
    Delete(): Promise<boolean>;
    Add(): Promise<unknown>;
    AddCRL(): Promise<unknown>;
    Export(): Promise<unknown>;
    Remove(): Promise<unknown>;
    addEventListener(): Promise<unknown>;
    removeEventListener(): Promise<unknown>;
    propset_Certificates(): Promise<unknown>;
    propset_Location(): Promise<unknown>;
    propset_Name(): Promise<unknown>;
    readonly Certificates: Promise<ICertificatesAsync>;
    readonly Location: Promise<unknown>;
    readonly Name: Promise<unknown>;
  }
}
