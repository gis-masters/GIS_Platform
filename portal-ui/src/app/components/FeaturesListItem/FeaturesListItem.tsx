import React, { CSSProperties, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { applyView, changeSchemaNamesCaseByFeature } from '../../services/data/schema/schema.utils';
import { extractFeatureId, extractTableNameFromFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getFeatureById } from '../../services/geoserver/wfs/wfs.service';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapAction, MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { FeatureError } from '../../services/map/map-link-following.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapStore } from '../../stores/Map.store';
import { mapVerticesModificationStore } from '../../stores/MapVerticesModification.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { RectangleSelectionCancel } from '../Icons/RectangleSelectionCancel';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { FeaturesListItemTitle, getFeaturesListItemTitle } from './FeaturesListItem.util';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');

interface FeaturesListItemProps {
  feature?: WfsFeature;
  searchResultHighlight?: ReactNode;
  errorData?: FeatureError;
  message?: string;
  style?: CSSProperties;
  isSearchList?: boolean;

  onSelect?(item: WfsFeature): void;
}

interface FeaturesListItemStore {
  rawSchema: Schema | undefined;
  setRawSchema(schema: Schema): void;
}

export const FeaturesListItem = observer((props: FeaturesListItemProps) => {
  const { feature, searchResultHighlight, errorData, style, isSearchList, onSelect } = props;

  const { rawSchema, setRawSchema } = useLocalObservable(
    (): FeaturesListItemStore => ({
      rawSchema: undefined,

      setRawSchema(this: FeaturesListItemStore, schema: Schema) {
        this.rawSchema = schema;
      }
    })
  );

  const layer = useMemo<CrgLayer | undefined>(() => {
    if (feature) {
      const tableName = extractTableNameFromFeatureId(feature.id);

      return isSearchList
        ? currentProject.getLayerByTableNameFromAllVectorableLayers(tableName)
        : currentProject.getLayerByTableNameFromVisibleAndHiddenByZoomVectorLayers(tableName);
    }
  }, [feature, isSearchList]);

  const schema = useMemo<Schema | undefined>(() => {
    return layer?.view && rawSchema ? applyView(rawSchema, layer.view) : rawSchema;
  }, [layer?.view, rawSchema]);

  const subTitle = useMemo<string>(() => {
    return layer?.title || schema?.title || '';
  }, [layer?.title, schema?.title]);

  const titleAndEmptiness = useMemo<FeaturesListItemTitle | undefined>(() => {
    if (schema && feature) {
      return getFeaturesListItemTitle(feature, changeSchemaNamesCaseByFeature(schema, feature));
    }
  }, [schema, feature]);

  useEffect(() => {
    const loadSchema = async () => {
      if (!errorData && layer) {
        const schema = await getLayerSchema(layer);
        if (schema) {
          setRawSchema(schema);
        }
      }
    };

    void loadSchema();
  }, [feature?.id, errorData, layer]);

  const verticesModified = () =>
    mapStore.mode === MapMode.VERTICES_MODIFICATION &&
    mapVerticesModificationStore.modifiedFeatures.some(f => f.getId() === feature?.id);

  const selectIt = useCallback(async () => {
    if (mapStore.mode === MapMode.VERTICES_MODIFICATION || errorData) {
      return;
    }

    selectedFeaturesStore.clearActiveFeature();

    let selectedFeature = feature;
    if (layer?.complexName && feature && isSearchList) {
      selectedFeature = await getFeatureById(feature.id, layer.complexName);
    }

    if (onSelect && selectedFeature) {
      onSelect(selectedFeature);
    }

    if (layer?.tableName) {
      projectsService.enableLayersByTableNames([layer.tableName]);
    }
  }, [feature, errorData, isSearchList, onSelect, layer]);

  const removeFromSelected = useCallback(async () => {
    if (feature) {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: { features: [feature], type: MapSelectionTypes.REMOVE }
        },
        'removeFromSelected'
      );
    }
  }, [feature]);

  const highlightIt = useCallback(() => {
    if (mapStore.mode === MapMode.VERTICES_MODIFICATION || errorData) {
      return;
    }

    if (feature) {
      selectedFeaturesStore.setActiveFeature(feature);
    }
  }, [feature, errorData]);

  return (
    <div
      className={cnFeaturesListItem({
        foundFeature: !!searchResultHighlight,
        highlighted: selectedFeaturesStore.isFeatureHighlighted(feature?.id)
      })}
      onDoubleClick={selectIt}
      style={style}
    >
      <div className={cnFeaturesListItem('Id', { verticesModified: verticesModified() })} onClick={highlightIt}>
        {errorData ? errorData.id : feature?.id && extractFeatureId(feature.id)}
      </div>

      <div className={cnFeaturesListItem('Icon')}>
        {feature?.geometry?.type && (
          <FeatureIcon className={cnFeaturesListItem('Svg')} geometryType={feature.geometry.type} />
        )}
      </div>

      <div className={cnFeaturesListItem('Title', { verticesModified: verticesModified() })}>
        {errorData ? errorData.message : titleAndEmptiness?.title}
      </div>
      <div className={cnFeaturesListItem('Layer', { verticesModified: verticesModified() })}>
        {errorData ? errorData.layerTitle : subTitle}
      </div>

      {searchResultHighlight}

      {!errorData && (
        <div className={cnFeaturesListItem('Buttons')}>
          <Tooltip title='Снять выделение с этого объекта'>
            <IconButton
              className={cnFeaturesListItem('RemoveFromSelected')}
              size='small'
              onClick={removeFromSelected}
              disabled={!mapStore.allowedActions.includes(MapAction.REMOVE_FEATURE_FROM_SELECTED)}
            >
              <RectangleSelectionCancel />
            </IconButton>
          </Tooltip>
          {feature && (
            <ZoomToFeature
              disabled={!mapStore.allowedActions.includes(MapAction.ZOOM_TO_FEATURE)}
              featureId={feature.id}
            />
          )}
          <Tooltip title='Открыть'>
            <IconButton
              className={cnFeaturesListItem('OpenEdit')}
              size='small'
              onClick={selectIt}
              disabled={!mapStore.allowedActions.includes(MapAction.OPEN_EDIT_FEATURE)}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
});
