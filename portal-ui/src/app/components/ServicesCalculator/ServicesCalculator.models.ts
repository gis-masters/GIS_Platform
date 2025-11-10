export interface ServicesInfo {
  id: number;
  price: number;
  service: string;
  counter?: number;
  additions?: ServicesAdditions[];
  enable?: boolean;
}

export interface ServicesAdditions {
  price: number;
  service: string;
  counter: number;
}

export interface InvoiceInfo {
  bank: string;
  bik: number;
  inn: number;
  kpp: number;
  checkingAccount: number;
  correspondentAccount: number;
  recipient: string;
  paymentPurpose: string;
  supplier: string;
  buyer: string;
  supervisor: string;
  accountant: string;
}
