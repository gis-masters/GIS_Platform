import { observable } from 'mobx';
import moment from 'moment';

import { type FormProps } from '../../../../components/Form/Form';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { SelectPropertiesControl } from '../../../../components/SelectPropertiesControl/SelectPropertiesControl';
import { doFormPrompt } from '../../../answer-modals.service';
import { type PropertySchema, PropertyType } from '../../../data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { hideNumberFeaturesOnMap, numberFeaturesOnMap } from '../../helpers/numberFeaturesOnMap';
import { PrintTemplateOld } from '../PrintTemplateOld';

interface SituationalPlanFormData {
  title: string;
  image: string;
  properties: PropertySchema[];
  displayNumbers: boolean;
}

export const situationalPlan: PrintTemplateOld<WfsFeature[]> = new PrintTemplateOld({
  name: 'situationalPlan',
  title: 'Схема расположения объектов',
  margin: [5, 10, 20, 10],
  orientation: 'landscape',
  format: 'a4',

  async render(this: PrintTemplateOld<WfsFeature[]>, data: WfsFeature[]): Promise<string> {
    const layer = getLayerByFeatureInCurrentProject(data[0]);
    if (!layer) {
      throw new Error('Не удалось сформировать ситуационный план. Не найден слой для объекта: ' + data[0].id);
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось сформировать ситуационный план. Не удалось получить схему слоя ${layer.title}`);
    }
    const schemaWithAppliedView = applyView(schema, layer.view);
    const properties = schemaWithAppliedView.properties.filter(({ hidden }) => !hidden);

    await numberFeaturesOnMap(data);

    // карта

    const formInvoke: FormProps<SituationalPlanFormData>['invoke'] = observable({});

    const { formValue: mapDialogResult } = await doFormPrompt<SituationalPlanFormData>({
      title: 'Параметры печати',
      message: this.title,
      submitProps: { children: 'Печать (PDF)' },
      schema: {
        properties: [
          {
            name: 'title',
            title: 'Название',
            propertyType: PropertyType.STRING,
            defaultValue: layer.title
          },
          {
            name: 'image',
            title: 'Карта',
            propertyType: PropertyType.CUSTOM,
            ControlComponent: PrintMapImageControl,
            format: 'a5'
          },
          {
            name: 'properties',
            title: 'Выбор колонок для печати',
            propertyType: PropertyType.CUSTOM,
            ControlComponent: SelectPropertiesControl,
            properties
          },
          {
            name: 'displayNumbers',
            title: 'Выводить номера на карте',
            description: 'При изменении этой настройки нужно будет заново выбрать фрагмент карты',
            propertyType: PropertyType.BOOL,
            defaultValue: true
          }
        ]
      },
      formProps: {
        async onFieldChange(
          value: unknown,
          propertyName: string,
          prevValue: unknown,
          formValue: SituationalPlanFormData
        ) {
          if (propertyName === 'displayNumbers' && value !== prevValue) {
            if (value) {
              await numberFeaturesOnMap(data);
            } else {
              hideNumberFeaturesOnMap();
            }

            formInvoke.setValue?.({ ...formValue, image: '' });
          }
        },

        invoke: formInvoke
      }
    });

    hideNumberFeaturesOnMap();

    if (!mapDialogResult) {
      return '';
    }

    const printableCols = mapDialogResult.properties?.length ? mapDialogResult.properties : properties;

    // заголовки таблицы

    const headersFragments = await Promise.all(
      printableCols.map(async ({ title }) => {
        return await this.renderFragment('oneTableHeader', { title });
      })
    );

    // строки таблицы

    const rowsFragments = await Promise.all(
      data.map(async (feature, i) => {
        const cellsFragments = await Promise.all(
          printableCols.map(
            async property =>
              await this.renderFragment('oneTableCell', {
                content: getReadablePropertyValue(feature.properties[property.name], property)
              })
          )
        );

        return await this.renderFragment('oneTableRow', {
          num: i + 1,
          cells: cellsFragments.join('')
        });
      })
    );

    return await this.renderFragment('main', {
      title: mapDialogResult.title,
      image: mapDialogResult.image,
      currentDate: moment().format('LL'),
      tableHeaders: headersFragments.join(''),
      tableRows: rowsFragments.join('')
    });
  },

  getFileName(this: PrintTemplateOld<WfsFeature[]>, entity: WfsFeature[]) {
    const layer = getLayerByFeatureInCurrentProject(entity[0]);
    if (!layer) {
      throw new Error('Не удалось получить имя файла. Не найден слой для объекта');
    }

    return `${layer.title} [${this.title}]`;
  }
});
