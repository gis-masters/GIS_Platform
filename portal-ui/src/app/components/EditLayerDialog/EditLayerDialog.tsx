import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { communicationService } from '../../services/communication.service';
import { FilePlacementMode } from '../../services/data/file-placement/file-placement.models';
import { getSrid } from '../../services/data/projections/projections.util';
import {
  PropertyOption,
  PropertySchema,
  PropertyType,
  Schema,
  SimpleSchema
} from '../../services/data/schema/schema.models';
import { applyView } from '../../services/data/schema/schema.utils';
import { flags } from '../../services/feature-flags';
import { buildComplexName } from '../../services/geoserver/featureType/featureType.util';
import { CUSTOM_STYLE_NAME } from '../../services/geoserver/styles/styles.models';
import { getSimpleStylesListForGeometryType, getStyleSld } from '../../services/geoserver/styles/styles.service';
import { getStyleTitle } from '../../services/geoserver/styles/styles.utils';
import { GeometryType } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayer, crgLayerSchema, CrgLayerType } from '../../services/gis/layers/layers.models';
import { createLayer, getViewChoiceOptions } from '../../services/gis/layers/layers.service';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { services } from '../../services/services';
import { patch } from '../../services/util/patch';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { CustomStyleControl } from '../CustomStyleControl/CustomStyleControl';
import { FormProps } from '../Form/Form';
import { FormDialog } from '../FormDialog/FormDialog';
import { Loading } from '../Loading/Loading';
import { TextBadge } from '../TextBadge/TextBadge';
import { EditLayerDialogStyleIcon } from './StyleIcon/EditLayerDialog-StyleIcon';

const cnEditLayerDialog = cn('EditLayerDialog');

interface EditLayerDialogProps {
  open: boolean;
  layer: CrgLayer;
  schema?: Schema;
  geometryType?: GeometryType;
  onClose(): void;
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

  componentDidMount() {
    this.init();
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
        onFormChange={this.handleFormChange}
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

  private init() {
    const { nativeCRS, title } = this.props.layer;

    if (!nativeCRS) {
      services.logger.error('Отсутствует nativeCRS у слоя ' + title);
    }
  }

  @action.bound
  private handleFormChange(changedValue: Partial<CrgLayer>) {
    const currentValue = { ...this.props.layer, ...this.currentFormValue };

    if (currentValue.view !== changedValue.view && currentValue.styleName === this.schemaWithAppliedView?.styleName) {
      this.currentFormValue = changedValue;
      this.currentFormValue.styleName = this.schemaWithAppliedView?.styleName;
      this.formInvoke?.setValue?.({
        ...changedValue,
        styleName: this.schemaWithAppliedView?.styleName
      });

      return;
    }

    this.currentFormValue = changedValue;
  }

  @computed
  private get propertiesTypeFileOptions(): PropertyOption[] {
    if (!this.props.schema) {
      return [];
    }

    return this.props.schema.properties
      .filter(({ propertyType, hidden }) => propertyType === PropertyType.FILE && !hidden)
      .map(({ title, name }) => ({ title, value: name }));
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

    let view = this.props.layer.view;

    if (this.currentFormValue && (this.currentFormValue.view || this.currentFormValue.view === '')) {
      view = this.currentFormValue.view === '' ? undefined : this.currentFormValue.view;
    }

    return applyView(this.props.schema, view);
  }

  @computed
  private get layerSchema(): SimpleSchema {
    const { layer, schema } = this.props;
    let properties: PropertySchema[] = cloneDeep(crgLayerSchema.properties);

    properties = properties.map(property => {
      if (!flags.allowProjectionsForAllLayers && property.name === 'nativeCRS') {
        // TODO: выпилить этот костыль после #2075
        if (layer.nativeCRS && !layer.complexName?.endsWith(`__${getSrid(layer.nativeCRS)}`)) {
          property.hidden = true;
        }

        if (
          layer.type &&
          [CrgLayerType.EXTERNAL, CrgLayerType.EXTERNAL_GEOSERVER, CrgLayerType.EXTERNAL_NSPD].includes(layer.type)
        ) {
          property.hidden = true;
        }
      }

      return property;
    });

    if (layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)) {
      properties.push({
        propertyType: PropertyType.CHOICE,
        name: 'styleName',
        title: 'Стиль',
        options: [
          ...this.defaultStylesOptions,
          ...this.simpleStylesOptions,
          ...(schema?.geometryType
            ? [
                {
                  startIcon: (
                    <EditLayerDialogStyleIcon styleName={CUSTOM_STYLE_NAME} layerComplexName={layer.complexName} />
                  ),
                  title: 'Настраиваемый',
                  value: CUSTOM_STYLE_NAME
                }
              ]
            : [])
        ]
      });

      if ({ ...layer, ...this.currentFormValue }.styleName === CUSTOM_STYLE_NAME && schema?.geometryType) {
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
          options: getViewChoiceOptions(schema) || [],
          defaultValue: '',
          propertyType: PropertyType.CHOICE
        });
      }
    }

    if (this.propertiesTypeFileOptions.length) {
      properties.push({
        name: 'photoMode',
        title: 'Фоторежим',
        multiple: true,
        description:
          'Если опция включена, при выделении на карте объектов этого слоя открываются фотографии из этих объектов',
        propertyType: PropertyType.CHOICE,
        defaultValue: layer.photoMode || '',
        options: this.propertiesTypeFileOptions
      });
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

    if (patch.photoMode !== undefined) {
      layer.photoMode = patch.photoMode;
    }

    if (patch.nativeCRS !== undefined && layer.nativeCRS !== patch.nativeCRS && layer.tableName) {
      void this.changeLayerProjection(layer, patch.nativeCRS);
    } else {
      communicationService.layerUpdated.emit({ type: 'update', data: layer });
    }
  }

  private async changeLayerProjection(layer: CrgLayer, projectionCode: string): Promise<void> {
    await createLayer({ ...layer, mode: FilePlacementMode.GEOSERVER, nativeCRS: projectionCode }, currentProject.id);

    if (!layer.tableName) {
      throw new Error('Отсутствует tableName у слоя');
    }

    patch(layer, {
      nativeCRS: projectionCode,
      complexName: buildComplexName(currentUser.workspaceName, layer.tableName, projectionCode)
    });

    communicationService.layerUpdated.emit({ type: 'update', data: layer });
  }

  private async loadStylesOptions(): Promise<void> {
    if (!this.props.geometryType) {
      return;
    }

    this.setBusy(true);

    const stylesList = await getSimpleStylesListForGeometryType(this.props.geometryType);
    const stylesListOptions: PropertyOption[] = await Promise.all(
      stylesList.map(async styleName => {
        let title: string = styleName;
        try {
          const sldStyle = await getStyleSld(styleName);
          const titleFromStyle = getStyleTitle(sldStyle);
          if (typeof titleFromStyle === 'string') {
            title = titleFromStyle;
          }
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
