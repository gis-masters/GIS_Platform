import React, { type FC, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { type CrgLayer } from '../../services/gis/layers/layers.models';
import { type FeaturePrintTemplate } from '../../services/report/baseTemplates/FeaturePrintTemplate';
import { getFeaturePrintTemplates } from '../../services/report/report.service';
import { PrintAction } from '../PrintAction/PrintAction';

const cnPrintFeature = cn('PrintFeature');

interface PrintFeatureProps {
  feature: WfsFeature;
  layer?: CrgLayer;
}

type PrintFeatureState = {
  templates: FeaturePrintTemplate[];
  setTemplates(templates: FeaturePrintTemplate[]): void;
};

export const PrintFeature: FC<PrintFeatureProps> = observer(({ feature, layer }) => {
  const state = useLocalObservable<PrintFeatureState>(() => ({
    templates: [],
    setTemplates(templates) {
      this.templates = templates;
    }
  }));

  const featureRef = useRef(feature);
  featureRef.current = feature;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const list = await getFeaturePrintTemplates(featureRef.current);
      if (!cancelled) {
        state.setTemplates(list);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [feature.id, layer?.id, state]);

  return (
    state.templates.length > 0 && (
      <PrintAction<WfsFeature>
        className={cnPrintFeature()}
        as='iconButton'
        entity={feature}
        templates={state.templates}
      />
    )
  );
});
