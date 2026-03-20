export const keys: (keyof FlagsList)[] = [
  'allowProjectionsForAllLayers',
  'oldPrintMechanism',
  'selectingFeaturesLimit',
  'showDocumentRoles'
];

export interface FlagsList {
  allowProjectionsForAllLayers: string; // boolean;
  oldPrintMechanism: string; //boolean
  selectingFeaturesLimit: string; // number
  showDocumentRoles: string; //boolean
}
