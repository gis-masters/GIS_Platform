import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Schema } from '../../services/data/schema/schema.models';
import {
  CustomStyleDescription,
  LABEL_PROPERTY_DEFAULT,
  LineRule,
  PointRule,
  PolygonRule,
  transparent
} from '../../services/geoserver/styles/styles.models';
import { buildCustomSld, getSupGeometryType, parseCustomStyle } from '../../services/geoserver/styles/styles.utils';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { FormControlProps } from '../Form/Control/Form-Control';
import { CustomStyleControlForm } from './Form/CustomStyleControl-Form.composed';
import { CustomStyleControlPreview } from './Preview/CustomStyleControl-Preview';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl.scss';

export const cnCustomStyleControl = cn('CustomStyleControl');

const defaultPointRule: PointRule = {
  markType: 'circle',
  markSize: 20,
  markColor: '#ed5c57',
  strokeColor: '#0f5c1a',
  labelProperty: LABEL_PROPERTY_DEFAULT,
  strokeWidth: 2
};

const defaultLineRule: LineRule = {
  strokeColor: '#0f5c1a',
  labelProperty: LABEL_PROPERTY_DEFAULT,
  strokeWidth: 2
};

const defaultPolygonRule: PolygonRule = {
  fillColor: '#80ff80',
  strokeColor: '#0f5c1a',
  labelProperty: LABEL_PROPERTY_DEFAULT,
  strokeWidth: 2
};

const defaultSimpleCustomStyles: Omit<Record<CustomStyleDescription['type'], CustomStyleDescription>, 'all'> = {
  point: { type: 'point', rule: defaultPointRule },
  line: { type: 'line', rule: defaultLineRule },
  polygon: { type: 'polygon', rule: defaultPolygonRule }
};

const defaultCustomStyles: Record<CustomStyleDescription['type'], CustomStyleDescription> = {
  ...defaultSimpleCustomStyles,
  all: {
    type: 'all',
    rule: [defaultPointRule, defaultLineRule, defaultPolygonRule]
  }
};

@observer
export class CustomStyleControl extends Component<FormControlProps> {
  @observable private type: CustomStyleDescription['type'] = 'all';
  @observable private preview?: string;
  @observable private schema?: Schema;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { formValue, onChange } = this.props;
    const layer = formValue as CrgLayer;

    if (!layer.complexName) {
      throw new Error('Некорректный слой: отсутствует complexName');
    }

    const schema = await getLayerSchema(layer);

    if (!schema?.geometryType) {
      throw new Error('Некорректная схема слоя: отсутствует geometryType');
    }

    this.setSchema(schema);

    if (layer?.type && isVectorFromFile(layer.type)) {
      this.setType('all');
    } else {
      this.setType(getSupGeometryType(schema.geometryType));
    }

    if (!layer.style && onChange) {
      onChange({
        propertyName: 'style',
        value: buildCustomSld(layer.complexName, defaultCustomStyles[this.type])
      });
    }
  }

  render() {
    return (
      <div className={cnCustomStyleControl()}>
        {this.preview && <CustomStyleControlPreview previewSrc={this.preview} />}

        {this.parsedValue && this.schema && (
          <CustomStyleControlForm
            type={this.parsedValue.type}
            value={this.parsedValue}
            onChange={this.onFormChange}
            schema={this.schema}
          />
        )}
      </div>
    );
  }

  @computed
  private get parsedValue(): CustomStyleDescription | undefined {
    const { fieldValue } = this.props;

    if (this.schema) {
      return typeof fieldValue === 'string'
        ? parseCustomStyle(fieldValue, this.schema)
        : defaultCustomStyles[this.type];
    }
  }

  @boundMethod
  private onFormChange(value: CustomStyleDescription) {
    const { onChange, property, formValue } = this.props;

    const complexName = (formValue as CrgLayer).complexName;

    if (!complexName) {
      throw new Error('Некорректный слой: отсутствует complexName');
    }

    if (onChange) {
      if (value.type === 'polygon' && value.rule.fillColor === transparent) {
        value.rule.fillGraphic = undefined;
      }

      onChange({
        propertyName: property.name,
        value: buildCustomSld(complexName, value)
      });
    }
  }

  @action
  private setType(type: CustomStyleDescription['type']) {
    this.type = type;
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}
