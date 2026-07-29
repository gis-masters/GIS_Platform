import { useEffect } from 'react';

import { type Schema } from '../../../services/data/schema/schema.models';
import {
  type CrgExternalLayer,
  type CrgVectorableLayer,
  type CrgVectorLayer
} from '../../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';

export const useLayerData = (
  layer: CrgVectorableLayer | CrgVectorLayer | CrgExternalLayer | undefined,
  setLayerSchema: (schema: Schema) => void,
  setNoLayerSchema: (noLayerSchema: boolean) => void
): void => {
  useEffect(() => {
    let isMounted = true;

    if (!layer) {
      return;
    }

    const fetchData = async () => {
      try {
        const layerSchema = await getLayerSchema(layer);
        if (!isMounted) {
          return;
        }

        if (!layerSchema) {
          setNoLayerSchema(true);

          return;
        }

        setLayerSchema(layerSchema);
      } catch {
        // схема слоя недоступна — форма останется без полей
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [layer, setLayerSchema, setNoLayerSchema]);
};
