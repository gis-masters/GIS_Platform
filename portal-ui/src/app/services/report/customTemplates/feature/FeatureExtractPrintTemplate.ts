import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { isRecordStringUnknown } from '../../../util/typeGuards/isRecordStringUnknown';
import { FeaturePrintTemplate } from '../../baseTemplates/FeaturePrintTemplate';
import { type PrintPreparedData } from '../../report.models';
import { isCompactGeometry } from '../../utils/isCompactGeometry';

function hasMapPreviewInTemplateData(templateData: unknown): boolean {
  if (!isRecordStringUnknown(templateData)) {
    return false;
  }
  const map = templateData.map;

  return typeof map === 'string' && map.length > 0;
}

export class FeatureExtractPrintTemplate extends FeaturePrintTemplate {
  protected override getTemplateName(prepared: PrintPreparedData, entity: WfsFeature): string {
    const compact = hasMapPreviewInTemplateData(prepared.templateData) && isCompactGeometry(entity.geometry, 20);

    return compact ? 'sys_feature_extract_compact' : 'sys_feature_extract_full';
  }
}
