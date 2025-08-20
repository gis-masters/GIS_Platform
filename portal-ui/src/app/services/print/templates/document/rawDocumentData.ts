import { LibraryRecord } from '../../../data/library/library.models';
import { getLibrary } from '../../../data/library/library.service';
import { applyContentType, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { PrintTemplate } from '../PrintTemplate';

export const rawDocumentData: PrintTemplate<LibraryRecord> = new PrintTemplate({
  name: 'rawDocumentData',
  title: 'Данные',
  margin: [5, 10, 20, 10],
  orientation: 'portrait',
  format: 'a4',

  async render(this: PrintTemplate<LibraryRecord>, entity: LibraryRecord) {
    const library = await getLibrary(entity.libraryTableName);
    const schemaWithAppliedContentType = applyContentType(library.schema, entity.content_type_id);

    const propertiesHtmlFragments = await Promise.all(
      Object.entries(entity).map(async ([key, value]) => {
        const property =
          schemaWithAppliedContentType.properties.find(({ name }) => name === key) ||
          library.schema.properties.find(({ name }) => name === key);

        return await this.renderFragment('property', {
          title: property?.title || key,
          value: getReadablePropertyValue(value, property)
        });
      })
    );

    return this.renderFragment('main', {
      title: entity.title || '',
      properties: propertiesHtmlFragments.join('')
    });
  },

  getFileName(this: PrintTemplate<LibraryRecord>, entity: LibraryRecord) {
    return `${entity.title} [${this.title}]`;
  }
});
