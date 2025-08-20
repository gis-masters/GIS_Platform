import { useEffect, useRef } from 'react';

import { Schema } from '../../../services/data/schema/schema.models';
import { CrgVectorableLayer, CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { ShouldRender } from './useEditFeatureState';

export const useLayerData = (
  layer: CrgVectorableLayer | CrgVectorLayer | undefined,
  shouldRender: ShouldRender,
  setLayerSchema: (schema: Schema) => void,
  setShouldRender: (shouldRender: ShouldRender) => void
): void => {
  const layerRef = useRef(layer);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted && layer && layer !== layerRef.current) {
          const layerSchema = await getLayerSchema(layer);
          if (!layerSchema) {
            setShouldRender({ ...shouldRender, noLayerSchema: true });
            layerRef.current = layer;

            return;
          }
          setLayerSchema(layerSchema);
          layerRef.current = layer;
        }
      } catch {
        layerRef.current = undefined;
      }
    };

    void fetchData();
    layerRef.current = layer;

    return () => {
      isMounted = false;
    };
  }, [layer, shouldRender, setLayerSchema, setShouldRender]);
};
