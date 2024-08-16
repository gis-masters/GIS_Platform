import React, { Component, CSSProperties, ReactNode } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Schema } from '../../services/data/schema/schema.models';
import { applyView, changeSchemaNamesCaseByFeature } from '../../services/data/schema/schema.utils';
import { extractFeatureId, extractTableNameFromFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { FeatureError } from '../../services/map/map-link-following.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { FeaturesListItemTitle, getFeaturesListItemTitle } from './FeaturesListItem.util';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');
const cnFeaturesListItemOpenEdit = cn('FeaturesListItem', 'OpenEdit');

interface FeaturesListItemProps {
  feature?: WfsFeature;
  searchResultHighlight?: ReactNode;
  highlighted?: boolean;
  errorData?: FeatureError;
  message?: string;
  style?: CSSProperties;
  isSearchList?: boolean;
  onSelect?(item: WfsFeature): void;
  onHighlight?(item: WfsFeature | null): void;
}

@observer
export class FeaturesListItem extends Component<FeaturesListItemProps> {
  @observable private rawSchema?: Schema;

  constructor(props: FeaturesListItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.loadSchema();
  }

  async componentDidUpdate(prevProps: FeaturesListItemProps) {
    if (prevProps.feature?.id !== this.props.feature?.id) {
      await this.loadSchema();
    }
  }

  render() {
    const { feature, highlighted, searchResultHighlight, errorData, style } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted, foundFeature: !!searchResultHighlight })} style={style}>
        <div
          className={cnFeaturesListItem('Id', { disabled: !!errorData })}
          onDoubleClick={this.selectIt}
          onClick={this.highlightIt}
        >
          {errorData ? errorData.id : feature?.id && extractFeatureId(feature.id)}
        </div>
        <div className={cnFeaturesListItem('Icon')}>
          {feature?.geometry?.type && (
            <FeatureIcon geometryType={feature?.geometry?.type} className={cnFeaturesListItem('Svg')} />
          )}
        </div>
        <div
          className={cnFeaturesListItem('Title', { disabled: !!errorData, isEmpty: this.titleAndEmptiness?.isEmpty })}
        >
          {errorData ? errorData.message : this.titleAndEmptiness?.title}
        </div>
        <div className={cnFeaturesListItem('Layer')}>{errorData ? errorData.layerTitle : this.subTitle}</div>
        {searchResultHighlight}
        {!errorData && (
          <div className={cnFeaturesListItem('Buttons')}>
            {feature && <ZoomToFeature feature={feature} onClick={this.handleZoom} />}
            <Tooltip title='Открыть'>
              <IconButton className={cnFeaturesListItemOpenEdit()} onClick={this.selectIt}>
                <ArrowForward />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  @computed
  private get schema(): Schema | undefined {
    return this.layer?.view && this.rawSchema ? applyView(this.rawSchema, this.layer?.view) : this.rawSchema;
  }

  @computed
  private get subTitle(): string {
    return this.layer?.title || this.schema?.title || '';
  }

  @computed
  private get titleAndEmptiness(): FeaturesListItemTitle | undefined {
    if (this.schema && this.props.feature) {
      return getFeaturesListItemTitle(
        this.props.feature,
        changeSchemaNamesCaseByFeature(this.schema, this.props.feature)
      );
    }
  }

  @computed
  private get layer(): CrgLayer | undefined {
    const { feature, isSearchList } = this.props;

    if (feature) {
      const tableName = extractTableNameFromFeatureId(feature.id);

      return isSearchList
        ? currentProject.getLayerByTableNameFromAllVectorableLayers(tableName)
        : currentProject.getLayerByTableNameFromVisibleAndHiddenByZoomVectorLayers(tableName);
    }
  }

  @boundMethod
  private selectIt() {
    if (!this.props.errorData) {
      const { onSelect, feature } = this.props;
      if (onSelect && feature) {
        onSelect(feature);
      }
    }

    if (this.layer?.tableName) {
      projectsService.enableLayersByTableNames([this.layer.tableName]);
    }
  }

  @boundMethod
  private highlightIt() {
    if (!this.props.errorData) {
      const { feature, highlighted, onHighlight } = this.props;
      if (onHighlight && feature) {
        onHighlight(highlighted ? null : feature);
      }
    }
  }

  @boundMethod
  private handleZoom() {
    const { onHighlight, feature } = this.props;
    if (onHighlight && feature) {
      onHighlight(feature);
    }
  }

  private async loadSchema(): Promise<void> {
    if (!this.props.errorData && this.layer) {
      const schema = await getLayerSchema(this.layer);
      if (schema) {
        this.setRawSchema(schema);
      }
    }
  }

  @action
  private setRawSchema(schema: Schema) {
    this.rawSchema = schema;
  }
}
