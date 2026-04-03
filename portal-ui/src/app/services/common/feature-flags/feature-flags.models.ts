export const keys: (keyof FlagsList)[] = [
  'allowProjectionsForAllLayers',
  'oldPrintMechanism',
  'openFileDownloadInSameTab',
  'featureExtractPrintAutoMap',
  'selectingFeaturesLimit',
  'showDocumentRoles'
];

export interface FlagsList {
  allowProjectionsForAllLayers: string; // boolean;
  oldPrintMechanism: string; //boolean
  /** Открывать скачиваемый файл в текущей вкладке */
  openFileDownloadInSameTab: string; // boolean
  /** Автогенерация фрагмента карты в диалоге печати выписки об объекте */
  featureExtractPrintAutoMap: string; // boolean
  selectingFeaturesLimit: string; // number
  showDocumentRoles: string; //boolean
}
