import React, { Component, CSSProperties, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ArrowForward } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { observable, action, makeObservable, computed } from 'mobx';

import { Highlight } from '../Highlight/Highlight';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';
import { Schema } from '../../services/data/schema/schema.models';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { extractFeatureId } from '../../services/geoserver/feature.util';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { FeatureError } from '../../services/map/map-link-following.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { FeaturesListItemTitle, getFeaturesListItemTitle } from './FeaturesListItem.util';
import { applyView, changeSchemaNamesCaseByFeature } from '../../services/data/schema/schema.utils';
import FeaturesListItemSearchResult from '../FeaturesListItemSearchResult/FeaturesListItemSearchResult';

import '!style-loader!css-loader!sass-loader!./FeaturesListItem.scss';

const cnFeaturesListItem = cn('FeaturesListItem');
const cnFeaturesListItemOpenEdit = cn('FeaturesListItem', 'OpenEdit');
const cnFeaturesListItemPopoverItemTitle = cn('FeaturesListItem', 'PopoverItemTitle');

interface FeaturesListItemProps {
  feature?: WfsFeature;
  headlines?: string[];
  onSelect?: (item: WfsFeature) => void;
  onHighlight?: (item: WfsFeature | null) => void;
  highlighted?: boolean;
  errorData?: FeatureError;
  message?: string;
  style?: CSSProperties;
  isSearchList?: boolean;
}

@observer
export class FeaturesListItem extends Component<FeaturesListItemProps> {
  @observable private rawSchema?: Schema;
  @observable private searchPreview: string = '';
  @observable private searchResult?: ReactNode;

  constructor(props: FeaturesListItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.loadSchema();
    this.setSearchResult(this.foundFeatureParts());
  }

  async componentDidUpdate(prevProps: FeaturesListItemProps) {
    if (prevProps.feature?.id !== this.props.feature?.id) {
      await this.loadSchema();
      this.setSearchResult(this.foundFeatureParts());
    }
  }

  render() {
    const { feature, highlighted, headlines, errorData, style } = this.props;

    return (
      <div className={cnFeaturesListItem({ highlighted, foundFeature: !!headlines?.length })} style={style}>
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
        {headlines?.length && this.searchResult && this.searchPreview && (
          <FeaturesListItemSearchResult
            headlines={headlines}
            searchPreview={this.searchPreview}
            searchResults={this.searchResult}
          />
        )}
        {!errorData && (
          <div className={cnFeaturesListItem('Buttons')}>
            {feature && <ZoomToFeature feature={feature} onClick={this.zoomHandler} />}
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
      const tableName = this.extractTableName(feature?.id);

      return isSearchList
        ? currentProject.getLayerByTableNameFromAllVectorLayers(tableName)
        : currentProject.getLayerByTableNameFromVisibleVectorLayers(tableName);
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
  private zoomHandler() {
    const { onHighlight, feature } = this.props;
    if (onHighlight && feature) {
      onHighlight(feature);
    }
  }

  private async loadSchema(): Promise<void> {
    if (!this.props.errorData && this.layer && this.layer.schemaId) {
      this.setRawSchema(await getLayerSchema(this.layer));
    }
  }

  @action
  private setRawSchema(schema: Schema) {
    this.rawSchema = schema;
  }

  @action
  private setSearchPreview(searchPreview: string) {
    this.searchPreview = searchPreview;
  }

  @action
  private setSearchResult(searchResult: ReactNode) {
    this.searchResult = searchResult;
  }

  private extractTableName(id: string) {
    const [tableName] = id.split('.');
    if (!tableName) {
      throw new Error('Incorrect wfs feature id: ' + id);
    }

    return tableName;
  }

  @boundMethod
  private foundFeatureParts(): ReactNode {
    const { feature, headlines } = this.props;

    if (this.rawSchema && feature) {
      const properties = Object.entries(feature.properties);
      const foundParts = properties
        .map(property => {
          const foundProperties: string[] = [];

          if (!headlines?.length) {
            return;
          }

          return this.searchForMatches(headlines, property, foundProperties);
        })
        .filter(item => item?.length);

      return headlines && this.setHighlights(foundParts, headlines);
    }
  }

  private searchForMatches(headlines: string[], property: [string, unknown], foundProperties: string[]) {
    return headlines
      .map(headline => {
        const propertyValue = String(property[1]);
        const index = propertyValue.indexOf(headline);

        if (index !== -1) {
          let searchResTextForPreview: string = headline;
          searchResTextForPreview =
            index >= 10
              ? ` ...${propertyValue.slice(index - 10, index)} ${searchResTextForPreview}`
              : ` ${propertyValue.slice(0, index)} ${searchResTextForPreview}`;

          searchResTextForPreview =
            `${searchResTextForPreview} ${propertyValue.slice(index + headline.length, index + headline.length + 10)}` +
            (propertyValue.length > index + headline.length + 10 ? '...' : '');

          const schemaProperties = this.rawSchema?.properties;
          const schemaProperty = schemaProperties?.find(
            schemaProp => schemaProp.name === property[0] && !schemaProp.hidden
          );

          if (schemaProperty && !foundProperties.includes(schemaProperty.name)) {
            if (this.searchPreview.length < 60 && !this.searchPreview.includes(searchResTextForPreview)) {
              this.setSearchPreview(this.searchPreview + ' ' + searchResTextForPreview);
            }

            foundProperties.push(schemaProperty.name);

            return [schemaProperty.title, propertyValue];
          }
        }
      })
      .filter(Boolean);
  }

  private setHighlights(foundParts: ((string[] | undefined)[] | undefined)[], headlines: string[]) {
    return foundParts.flat().map((part, i) => {
      if (part && part[0] && part[1]) {
        return (
          <div key={i}>
            <span className={cnFeaturesListItemPopoverItemTitle()}>{part[0]}</span>:{' '}
            <Highlight searchWords={headlines} enabled>
              {part[1]}
            </Highlight>
          </div>
        );
      }
    });
  }
}
