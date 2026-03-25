export const keys: (keyof FlagsList)[] = [
  'allowProjectionsForAllLayers',
  'oldPrintMechanism',
  'openFileDownloadInSameTab',
  'selectingFeaturesLimit',
  'showDocumentRoles'
];

export interface FlagsList {
  allowProjectionsForAllLayers: string; // boolean;
  oldPrintMechanism: string; //boolean
  /** Открывать скачиваемый файл в текущей вкладке */
  openFileDownloadInSameTab: string; // boolean
  selectingFeaturesLimit: string; // number
  showDocumentRoles: string; //boolean
}
