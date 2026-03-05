import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type Basemap } from '../../services/data/basemaps/basemaps.models';
import { createBasemap } from '../../services/data/basemaps/basemaps.service';
import { type PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { Mime } from '../../services/util/Mime';
import { getDefaultValues } from '../Form/Form.utils';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const cnCreateBasemap = cn('CreateBasemap');

type BasemapFormValue = Partial<Omit<Basemap, 'id'>>;

const THUMBNAIL_EMPTY = '/assets/images/thumbnail-empty.jpg';
const THUMBNAIL_YANDEX_MAP = '/assets/images/thumbnail-yandex-map.jpg';
const THUMBNAIL_ESRI_SPUTNIK = '/assets/images/thumbnail-esri-sputnik.jpg';
const THUMBNAIL_TOPO = '/assets/images/thumbnail-topo.jpg';

const GEOSERVER_PROPS_RULE = "return {hidden: obj?.type === 'XYZ', required: obj?.type === 'WMTS'}";

@observer
export class CreateBasemap extends Component {
  @observable private dialogOpen = false;
  @observable private formValue: Partial<BasemapFormValue> = {};

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать картографическую подоснову'>
          <span>
            <IconButton className={cnCreateBasemap()} onClick={this.openDialog}>
              <PlaylistAdd />
            </IconButton>
          </span>
        </Tooltip>

        <FormDialog
          className={cnCreateBasemap('Form')}
          open={this.dialogOpen}
          schema={{ properties: this.fields }}
          actionFunction={this.create}
          onFormChange={this.handleFormChange}
          actionButtonProps={{ children: 'Создать' }}
          onClose={this.closeDialog}
          value={this.formValue}
          title='Создать картографическую подоснову'
        />
      </>
    );
  }

  @computed
  private get fields(): PropertySchema[] {
    return [
      {
        name: 'type',
        title: 'Тип картографической подосновы',
        defaultValue: 'XYZ',
        required: true,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: 'XYZ',
            title: 'Внешняя картографическая подоснова с указанием ссылки'
          },
          {
            value: 'WMTS',
            title: 'Внутренняя картографическая подоснова из Geoserver'
          },
          {
            value: 'WMTS_P',
            title: 'Расширенная'
          }
        ]
      },
      {
        name: 'name',
        title: 'Системное имя',
        required: true,
        description: 'Введите краткое системное имя картографической подосновы латиницей',
        propertyType: PropertyType.STRING
      },
      {
        name: 'title',
        title: 'Наименование',
        required: true,
        description: 'Наименование будет отображаться в проекте, в меню выбора картографической подосновы.',
        propertyType: PropertyType.STRING
      },
      {
        name: 'thumbnailUrn',
        title: 'Эскиз',
        description: 'Эскиз будет отображаться в проекте, в меню выбора картографической подосновы.',
        required: true,
        defaultValue: THUMBNAIL_ESRI_SPUTNIK,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: THUMBNAIL_EMPTY,
            title: 'Пустой эскиз'
          },
          {
            value: THUMBNAIL_ESRI_SPUTNIK,
            title: 'Спутник'
          },
          {
            value: THUMBNAIL_TOPO,
            title: 'Топография'
          },
          {
            value: THUMBNAIL_YANDEX_MAP,
            title: 'Карта'
          }
        ]
      },
      {
        name: 'url',
        title: 'Ссылка на ресурс',
        required: true,
        description:
          'Пример для Geoserver https://localhost/api/geoserver/gwc/service/wmts.' +
          ' Пример ссылки внешнего ресурса https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        propertyType: PropertyType.STRING
      },
      {
        name: 'layerName',
        title: 'Идентификатор слоя на Geoserver',
        description: 'Убедитесь в корректности имени. Маска: workspace:name',
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.STRING
      },
      {
        name: 'style',
        title: 'Стиль',
        defaultValue: 'raster',
        description: 'Убедитесь в своём решении прежде чем менять это поле',
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.STRING
      },
      {
        name: 'projection',
        title: 'Проекция',
        defaultValue: 'EPSG:3857',
        description: 'Поддерживаются проекции охватывающие всю планету',
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: 'EPSG:900913',
            title: 'EPSG:900913'
          },
          {
            value: 'EPSG:3857',
            title: 'EPSG:3857'
          }
        ]
      },
      {
        name: 'format',
        title: 'Формат тайлов WMTS',
        defaultValue: Mime.IMAGE_PNG,
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.CHOICE,
        options: [
          {
            value: Mime.IMAGE_PNG,
            title: Mime.IMAGE_PNG
          },
          {
            value: Mime.IMAGE_JPEG,
            title: Mime.IMAGE_JPEG
          }
        ]
      },
      {
        name: 'resolution',
        title: 'Разрешение',
        description:
          'От 0 до 40 влияет на детализацию при приближении. Чем число меньше, тем раньше подложка' +
          ' перестанет генерировать тайлы под нужный масштаб',
        defaultValue: 31,
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.INT
      },
      {
        name: 'matrixIds',
        title: 'Матрица',
        description: 'Значение должно быть равно значению из поля Разрешение',
        defaultValue: 31,
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.INT
      },
      {
        name: 'size',
        title: 'Размер',
        defaultValue: 256,
        dynamicPropertyFormula: GEOSERVER_PROPS_RULE,
        propertyType: PropertyType.INT
      }
    ];
  }

  @action.bound
  private openDialog() {
    this.formValue = getDefaultValues(this.fields);
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.clearForm();
    this.dialogOpen = false;
  }

  @action.bound
  private handleFormChange(formValue: BasemapFormValue) {
    this.formValue = formValue;
  }

  @action.bound
  private clearForm() {
    this.formValue = getDefaultValues(this.fields);
  }

  //TODO: избавиться от ! и as, добавив проверки типов (Azure № 3984)
  @boundMethod
  private async create(formValue: BasemapFormValue) {
    await createBasemap(formValue as Omit<Basemap, 'id'>);
  }
}
