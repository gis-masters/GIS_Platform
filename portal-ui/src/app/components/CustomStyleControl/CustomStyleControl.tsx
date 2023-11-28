import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { buildCustomSld, parseCustomStyle } from '../../services/geoserver/styles/styles.utils';
import { CustomStyleDescription } from '../../services/geoserver/styles/styles.models';
import { getSupGeometryType } from '../../services/geoserver/styles/styles.service';
import { schemaService } from '../../services/data/schema/schema.service';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { FormControlProps } from '../Form/Control/Form-Control';

import { CustomStyleControlForm } from './Form/CustomStyleControl-Form.composed';
import { getLegendGraphic } from '../../services/geoserver/wms/wms.service';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl.scss';
import { CustomStyleControlPreview } from './Preview/CustomStyleControl-Preview';

const cnCustomStyleControl = cn('CustomStyleControl');

const defaultCustomStyles: Record<CustomStyleDescription['type'], CustomStyleDescription> = {
  line: {
    type: 'line',
    rule: {
      strokeColor: '#0f5c1a',
      strokeWidth: 2
    }
  },
  point: {
    type: 'point',
    rule: {
      markType: 'circle',
      markSize: 20,
      markColor: '#ed5c57'
    }
  },
  polygon: {
    type: 'polygon',
    rule: {
      fillColor: '#ffff80',
      strokeColor: '#0f5c1a',
      strokeWidth: 2
    }
  }
};

@observer
export class CustomStyleControl extends Component<FormControlProps> {
  @observable private type?: CustomStyleDescription['type'];
  @observable private preview?: string;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { formValue, onChange } = this.props;
    const { schemaId, style, complexName } = formValue as CrgLayer;

    if (!schemaId || !complexName) {
      throw new Error('Некорректный слой');
    }

    const schema = await schemaService.getSchema(schemaId);

    if (!schema.geometryType) {
      throw new Error('Некорректная схема слоя: отсутствует geometryType');
    }

    this.setType(getSupGeometryType(schema.geometryType));

    if (!style && this.type && onChange) {
      onChange({
        propertyName: 'style',
        value: buildCustomSld(complexName, defaultCustomStyles[this.type])
      });
    }

    await this.loadPreview();
  }

  async componentDidUpdate(prevProps: Readonly<FormControlProps>) {
    if (this.props.fieldValue !== prevProps.fieldValue) {
      await this.loadPreview();
    }
  }

  render() {
    return (
      <div className={cnCustomStyleControl()}>
        {this.preview && <CustomStyleControlPreview previewSrc={this.preview} />}

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

  private async loadPreview() {
    const { fieldValue, formValue } = this.props;
    const complexName = (formValue as CrgLayer).complexName;

    if (!fieldValue || typeof fieldValue !== 'string') {
      return;
    }

    const preview = await getLegendGraphic(complexName, null, null, fieldValue);
    this.setPreview(preview && undefined); // временно отключил отображение превью, будет включено вскоре
  }

  @action
  private setType(type: CustomStyleDescription['type']) {
    this.type = type;
  }

  @action
  private setPreview(preview: string) {
    this.preview = preview;
  }
}
