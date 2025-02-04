export interface MessagesRegistry {
  id: number;
  title?: string;
  description?: string;
  tableName?: string;
  schemaName?: string;
  createdBy?: string;
  createdAt?: string;
  lastModified?: string;
}

export interface MessagesRegistriesMessages {
  [key: string]: unknown;

  id: number;
  system: string;
  user_from?: string;
  user_to?: string;
  status: string;
  body?: string;
  date_in?: string;
  date_out?: string;
  response_to?: string;
}
