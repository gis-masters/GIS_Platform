export interface KptTaskInfo {
  id: number;
  folder: boolean;
  content: Record<string, string>;
}

export interface KptRequestInfo {
  clientId: string;
}
