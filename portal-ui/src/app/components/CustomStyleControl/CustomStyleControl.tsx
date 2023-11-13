import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { CustomStyleDescription } from '../../services/geoserver/styles/styles.models';
import { buildCustomSld, parseCustomStyle } from '../../services/geoserver/styles/styles.utils';
import { getSupGeometryType } from '../../services/geoserver/styles/styles.service';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { FormControlProps } from '../Form/Control/Form-Control';

import { CustomStyleControlForm } from './Form/CustomStyleControl-Form.composed';
import { schemaService } from '../../services/data/schema/schema.service';

const cnCustomStyleControl = cn('CustomStyleControl');

const defaultCustomStyles: Record<CustomStyleDescription['type'], CustomStyleDescription> = {
  line: {
    type: 'line',
    rule: {
      strokeColor: '#ff0000',
      strokeWidth: 2
    }
  },
  point: {
    type: 'point',
    rule: {
      markType: 'circle',
      markSize: 5,
      markColor: '#ff0000'
    }
  },
  polygon: {
    type: 'polygon',
    rule: {
      fillColor: '#ff55ff',
      strokeColor: '#ff0000',
      strokeWidth: 2
    }
  }
};

@observer
export class CustomStyleControl extends Component<FormControlProps> {
  @observable private type?: CustomStyleDescription['type'];

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { schemaId } = this.props.formValue as CrgLayer;

    if (!schemaId) {
      throw new Error('Некорректный слой');
    }

    const schema = await schemaService.getSchema(schemaId);

    if (!schema.geometryType) {
      throw new Error('Некорректная схема слоя: отсутствует geometryType');
    }

    this.setType(getSupGeometryType(schema.geometryType));
  }

  render() {
    return (
      <div className={cnCustomStyleControl()}>
        {this.parsedValue && (
          <CustomStyleControlForm type={this.parsedValue.type} value={this.parsedValue} onChange={this.onFormChange} />
        )}
      </div>
    );
  }

  @computed
  private get parsedValue(): CustomStyleDescription | undefined {
    const { fieldValue } = this.props;

    if (!this.type) {
      return;
    }

    return typeof fieldValue === 'string' ? parseCustomStyle(fieldValue) : defaultCustomStyles[this.type];
  }

  @boundMethod
  private onFormChange(value: CustomStyleDescription) {
    const { onChange, property, formValue } = this.props;
    const complexName = (formValue as CrgLayer).complexName;

    if (!complexName) {
      throw new Error('Некорректный слой: отсутствует complexName');
    }

    if (onChange) {
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
}
