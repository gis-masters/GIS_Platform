import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { UnarchiveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { unparse } from 'papaparse';

import { DocumentLibrary, getAllLibraryRecords, LibraryRecord } from '../../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../../services/crg/schema.models';
import { OldFeatureDescription } from '../../../services/crg/schemaOld.models';
import { saveAsCsv } from '../../../services/util/FileSaver';
import { IconButton } from '../../IconButton/IconButton';
import { PageOptions } from '../../../services/models';
import { XTableColumn } from '../../XTable/XTable';

const cnLibraryRegistryCSV = cn('LibraryRegistry', 'CSV');

interface LibraryRegistryCSVProps {
  library: DocumentLibrary;
  schema: OldFeatureDescription;
  tablePageOptions: PageOptions;
  cols: XTableColumn<LibraryRecord>[];
  properties: PropertySchema[];
}

@observer
export class LibraryRegistryCSV extends Component<LibraryRegistryCSVProps> {
  @observable private loading = false;

  render() {
    return (
      <Tooltip title='Экспортировать реестр в CSV'>
        <span>
          <IconButton
            className={cnLibraryRegistryCSV()}
            onClick={this.exportCSV}
            loading={this.loading}
            disabled={this.loading}
          >
            <UnarchiveOutlined />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private async exportCSV() {
    const { tablePageOptions, library, schema, properties, cols } = this.props;

    if (!library || !schema || this.loading) {
      return;
    }

    this.setExportCSVLoading(true);

    const transformCellContent: Partial<Record<PropertyType, (content: unknown) => string>> = {
      [PropertyType.BOOL]: (content: unknown) => (['true', '1'].includes(String(content).toLowerCase()) ? 'да' : 'нет')
    };

    const records = await getAllLibraryRecords(library.identifier, schema.name, tablePageOptions);
    const fields = cols.filter(({ field }) => field);
    const result: unknown[][] = [fields.map(({ title }) => title)];

    for (const record of records) {
      result.push(
        fields.map(({ field }) => {
          const property = properties.find(({ name }) => name === field);
          if (transformCellContent[property.propertyType]) {
            return transformCellContent[property.propertyType](record[field]);
          }

          return record[field];
        })
      );
    }

    saveAsCsv('documents.csv', unparse(result, { delimiter: ';' }));

    this.setExportCSVLoading(false);
  }

  @action.bound
  private setExportCSVLoading(loading: boolean) {
    this.loading = loading;
  }
}
