import moment from 'moment';

import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { schemaService } from '../../../data/schema/schema.service';
import { PropertyType } from '../../../data/schema/schema.models';
import { formPrompt } from '../../../utility-dialogs.service';
import { PrintTemplate } from '../PrintTemplate';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';

export const situationalPlan: PrintTemplate<WfsFeature[]> = new PrintTemplate({
  name: 'situationalPlan',
  title: 'Схема расположения объектов',
  margin: [5, 10, 20, 10],
  orientation: 'landscape',
  format: 'a4',

  async render(this: PrintTemplate<WfsFeature[]>, data: WfsFeature[]): Promise<string> {
    const layer = getLayerByFeatureInCurrentProject(data[0]);

    if (!layer) {
      throw new Error('Не найден слой для объекта');
    }

    const schema = await schemaService.getSchema(layer.schemaId);
    const schemaWithAppliedView = applyView(schema, layer.view);
    const properties = schemaWithAppliedView.properties.filter(({ hidden }) => !hidden);

    // карта
    const mapDialogResult = await formPrompt<{ title: string; image: string }>({
      title: 'Параметры печати',
      message: this.title,
      schema: {
        properties: [
          {
            name: 'title',
            propertyType: PropertyType.STRING,
            title: 'Название',
            defaultValue: layer.title
          },
          {
            name: 'image',
            propertyType: PropertyType.CUSTOM,
            title: 'Карта',
            ControlComponent: PrintMapImageControl,
            format: 'a5'
          }
        ]
      }
    });
    if (!mapDialogResult) {
      return '';
    }

    // заголовки таблицы
    const headersFragments = await Promise.all(
      properties.map(async ({ title }) => {
        return await this.renderFragment('oneTableHeader', { title });
      })
    );

    // строки таблицы
    const rowsFragments = await Promise.all(
      data.map(async (feature, i) => {
        const cellsFragments = await Promise.all(
          properties.map(
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

  getFileName(this: PrintTemplate<WfsFeature[]>, entity: WfsFeature[]) {
    const layer = getLayerByFeatureInCurrentProject(entity[0]);

    if (!layer) {
      throw new Error('Не найден слой для объекта');
    }

    return `${layer.title} [${this.title}]`;
  }
});
