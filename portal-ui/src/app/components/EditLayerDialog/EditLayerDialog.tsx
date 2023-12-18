import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';

import {
  PropertyOption,
  PropertySchema,
  PropertyType,
  Schema,
  SimpleSchema
} from '../../services/data/schema/schema.models';
import { getSimpleStylesListForGeometryType, getStyleSld } from '../../services/geoserver/styles/styles.service';
import { CrgLayer, CrgLayerType, crgLayerSchema } from '../../services/gis/layers/layers.models';
import { CUSTOM_STYLE_NAME } from '../../services/geoserver/styles/styles.models';
import { getStyleTitle } from '../../services/geoserver/styles/styles.utils';
import { communicationService } from '../../services/communication.service';
import { GeometryType } from '../../services/geoserver/wfs/wfs.models';
import { applyView } from '../../services/data/schema/schema.utils';
import { getViewChoiceOptions } from '../Form/Form.utils';
import { CustomStyleControl } from '../CustomStyleControl/CustomStyleControl';
import { FormDialog } from '../FormDialog/FormDialog';
import { TextBadge } from '../TextBadge/TextBadge';
import { Loading } from '../Loading/Loading';
import { FormProps } from '../Form/Form';

import { EditLayerDialogStyleIcon } from './StyleIcon/EditLayerDialog-StyleIcon';

const cnEditLayerDialog = cn('EditLayerDialog');

interface EditLayerDialogProps {
  open: boolean;
  onClose(): void;
  layer: CrgLayer;
  schema?: Schema;
  geometryType?: GeometryType;
}

@observer
export class EditLayerDialog extends Component<EditLayerDialogProps> {
  @observable private simpleStylesOptions: PropertyOption[] = [];
  @observable private currentFormValue?: Partial<CrgLayer>;
  @observable private busy: boolean = false;
  private formInvoke: FormProps<Partial<CrgLayer>>['invoke'] = {};

  constructor(props: EditLayerDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidUpdate(prevProps: EditLayerDialogProps) {
    const { layer, open } = this.props;

    if (!prevProps.open && open && (layer.type === CrgLayerType.VECTOR || layer.type === CrgLayerType.SHP)) {
      await this.loadStylesOptions();
    }
  }

  render() {
    const { layer, open, onClose } = this.props;

    return (
      <FormDialog<Partial<CrgLayer>>
        className={cnEditLayerDialog()}
        open={open}
        invoke={this.formInvoke}
        schema={this.layerSchema}
        value={layer}
        afterForm={<Loading visible={this.busy} />}
        actionFunction={this.editLayer}
        onFormChange={this.formChangeHandler}
        actionButtonProps={{ children: 'Изменить' }}
        onClose={onClose}
        title={
          <>
            Свойства слоя
            <TextBadge id={layer.id} />
          </>
        }
      />
    );
  }

  @action.bound
  private formChangeHandler(changedValue: Partial<CrgLayer>) {
    const currentValue = { ...this.props.layer, ...this.currentFormValue };

    if (currentValue.view !== changedValue.view && currentValue.styleName === this.schemaWithAppliedView?.styleName) {
      this.currentFormValue = changedValue;
      this.currentFormValue.styleName = this.schemaWithAppliedView?.styleName;
      this.formInvoke?.setValue?.({ ...changedValue, styleName: this.schemaWithAppliedView?.styleName });

      return;
    }

    this.currentFormValue = changedValue;
  }

  @computed
  private get defaultStylesOptions(): PropertyOption[] {
    const { layer } = this.props;

    return this.schemaWithAppliedView?.styleName
      ? [
          {
            startIcon: (
              <EditLayerDialogStyleIcon
                styleName={this.schemaWithAppliedView.styleName}
                layerComplexName={layer.complexName}
              />
            ),
            title: `По-умолчанию (${this.schemaWithAppliedView.styleName})`,
            value: this.schemaWithAppliedView.styleName
          }
        ]
      : [];
  }

  @computed
  private get schemaWithAppliedView(): Schema | undefined {
    if (!this.props.schema) {
      return;
    }

    return applyView(this.props.schema, this.currentFormValue?.view || this.props.layer.view);
  }

  @computed
  private get layerSchema(): SimpleSchema {
    const { layer, schema } = this.props;
    const properties: PropertySchema[] = [...crgLayerSchema.properties];

    if (
      layer.type === CrgLayerType.VECTOR ||
      layer.type === CrgLayerType.SHP ||
      layer.type === CrgLayerType.TAB ||
      layer.type === CrgLayerType.MID
    ) {
      properties.push({
        propertyType: PropertyType.CHOICE,
        name: 'styleName',
        title: 'Стиль',
        options: [
          ...this.defaultStylesOptions,
          ...this.simpleStylesOptions,
          {
            startIcon: <EditLayerDialogStyleIcon styleName={CUSTOM_STYLE_NAME} layerComplexName={layer.complexName} />,
            title: 'Настраиваемый',
            value: CUSTOM_STYLE_NAME
          }
        ]
      });

      if ({ ...layer, ...this.currentFormValue }.styleName === CUSTOM_STYLE_NAME) {
        properties.push({
          name: 'style',
          title: 'Настройки стиля',
          propertyType: PropertyType.CUSTOM,
          ControlComponent: CustomStyleControl
        });
      }

      if (schema?.views) {
        properties.unshift({
          name: 'view',
          title: 'Представление',
          options: getViewChoiceOptions(schema.views) || [],
          defaultValue: '',
          propertyType: PropertyType.CHOICE
        });
      }
    }

    return { properties };
  }

  @action.bound
  private editLayer(patch: Partial<CrgLayer>) {
    const { layer } = this.props;

    if (patch.title !== undefined) {
      layer.title = patch.title;
    }

    layer.maxZoom = patch.maxZoom;
    layer.minZoom = patch.minZoom;

    if (patch.view !== undefined) {
      layer.view = patch.view;
    }

    if (patch.styleName !== undefined) {
      layer.styleName = patch.styleName;
    }

    if (patch.style !== undefined) {
      layer.style = patch.style;
    }

    communicationService.layerUpdated.emit({ type: 'update', data: layer });
  }

  private async loadStylesOptions(): Promise<void> {
    this.setBusy(true);

    if (!this.props.geometryType) {
      throw new Error('Отсутствует тип геометрии');
    }
    const stylesList = await getSimpleStylesListForGeometryType(this.props.geometryType);
    const stylesListOptions: PropertyOption[] = await Promise.all(
      stylesList.map(async styleName => {
        let title = styleName;
        try {
          const sldStyle = await getStyleSld(styleName);
          title = getStyleTitle(sldStyle);
        } catch {
          // ничего не делаем, так как если не удалось получить название стиля, то мы выводим его имя
        }

        return {
          startIcon: <EditLayerDialogStyleIcon layerComplexName={this.props.layer.complexName} styleName={styleName} />,
          title,
          value: styleName
        };
      })
    );

    this.setSimpleStylesOptions(stylesListOptions);
    this.setBusy(false);
  }

  @action
  private setSimpleStylesOptions(options: PropertyOption[]) {
    this.simpleStylesOptions = options;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
