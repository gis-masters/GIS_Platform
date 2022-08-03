import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { ArchiveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { DocumentLibrary, getAllLibraryRecords, LibraryRecord } from '../../../services/data/doc-library.service';
import {
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertyType,
  Schema
} from '../../../services/data/schema.models';
import { exportAsCSV, exportAsXLSX } from '../../../services/util/export';
import { formatDate } from '../../../services/util/date.util';
import { PageOptions } from '../../../services/models';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { XTableColumn } from '../../XTable/XTable';
import { FileIcon } from '../../FileIcon/FileIcon';
import { sleep } from '../../../services/util/sleep';

const cnLibraryRegistryExport = cn('LibraryRegistry', 'Export');

interface LibraryRegistryExportProps {
  library: DocumentLibrary;
  schema: Schema;
  tablePageOptions: PageOptions;
  cols: XTableColumn<LibraryRecord>[];
  properties: PropertySchema[];
}

@observer
export class LibraryRegistryExport extends Component<LibraryRegistryExportProps> {
  @observable private loading = false;

  private transformCellContent: Partial<Record<PropertyType, (content: unknown, property: PropertySchema) => string>> =
    {
      [PropertyType.BOOL]: (content: unknown) => (['true', '1'].includes(String(content).toLowerCase()) ? 'да' : 'нет'),
      [PropertyType.CHOICE]: (content: unknown, property: PropertySchema) =>
        (property as PropertySchemaChoice).options.find(({ value }) => value === content)?.title || String(content),
      [PropertyType.DATETIME]: (content: unknown, property: PropertySchema) => {
        return typeof content === 'number' || typeof content === 'string' || content instanceof Date
          ? formatDate(content, (property as PropertySchemaDatetime).format)
          : '';
      }
    };

  constructor(props: LibraryRegistryExportProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Tooltip title='Экспортировать реестр' placement='top'>
        <MenuIconButton
          className={cnLibraryRegistryExport()}
          icon={<ArchiveOutlined />}
          loading={this.loading}
          disabled={this.loading}
        >
          <MenuItem onClick={this.exportCSV}>
            <ListItemIcon>
              <FileIcon ext='CSV' outlined />
            </ListItemIcon>
            Экспортировать в CSV
          </MenuItem>
          <MenuItem onClick={this.exportXLSX}>
            <ListItemIcon>
              <FileIcon ext='XLS' outlined />
            </ListItemIcon>
            Экспортировать в XLSX
          </MenuItem>
        </MenuIconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private async exportCSV() {
    this.setLoading(true);
    await sleep(100);
    exportAsCSV(await this.getData(), 'documents');
    this.setLoading(false);
  }

  @boundMethod
  private async exportXLSX() {
    this.setLoading(true);
    await sleep(100);
    exportAsXLSX(await this.getData(), 'documents');
    this.setLoading(false);
  }

  private async getData(): Promise<unknown[][]> {
    const { tablePageOptions, library, schema, properties, cols } = this.props;

    const records = await getAllLibraryRecords(library.identifier, schema.name, tablePageOptions);
    const fields = cols.filter(({ field }) => field);
    const data: unknown[][] = [fields.map(({ title }) => title)];

    for (const record of records) {
      data.push(
        fields.map(({ field }) => {
          const property = properties.find(({ name }) => name === field);
          const content = record[field] === null ? '' : record[field];
          if (this.transformCellContent[property.propertyType]) {
            return this.transformCellContent[property.propertyType](content, property);
          }

          return content;
        })
      );
    }

    return data;
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
