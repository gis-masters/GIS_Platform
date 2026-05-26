import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { type FileInfo } from '../../../../services/data/files/files.models';
import { checkFileEcp, verifyEcp } from '../../../../services/data/files/files.service';
import { isFileInfo } from '../../../../services/data/files/files.typeguards';
import { type LibraryRecord } from '../../../../services/data/library/library.models';
import { type PropertySchemaFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { isArrayOf } from '../../../../services/util/typeGuards/isArrayOf';
import { Files } from '../../../Files/Files';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, type FormControlProps } from '../Form-Control';

@observer
class FormControlTypeFile extends Component<FormControlProps> {
  @observable private statusText: Record<string, string> = {};

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.checkEcpFile();
  }

  async componentDidUpdate(prevProps: Readonly<FormControlProps>): Promise<void> {
    const { fieldValue } = this.props;

    if (prevProps.fieldValue !== fieldValue) {
      const files = fieldValue;
      const prevFiles = prevProps.fieldValue;

      if (isArrayOf(files, isFileInfo) && isArrayOf(prevFiles, isFileInfo)) {
        const ecpFiles = files
          .filter(file => {
            return !prevFiles.some(({ id }) => file.id === id);
          })
          .filter(({ title }) => title.includes('.sig'));

        await this.checkEcpFile(ecpFiles);
      }
    }
  }

  render() {
    const { className, inSet, property, formRole, errors, warnings, fieldValue, formValue, fullWidthForOldForm } =
      this.props;
    let value: FileInfo[] = [];

    try {
      if (fieldValue && typeof fieldValue === 'string') {
        const parsedValue = JSON.parse(fieldValue) as unknown;
        value = isArrayOf(parsedValue, isFileInfo) ? parsedValue : [];
      } else if (isArrayOf(fieldValue, isFileInfo)) {
        value = fieldValue;
      }
    } catch {
      value = [];
    }

    if (value.length) {
      value = this.sortEcpFiles(value);
    }

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Files
          showPlaceAction={formRole === 'viewDocument'}
          document={formRole === 'viewDocument' ? (formValue as LibraryRecord) : undefined}
          value={value}
          statusText={this.statusText}
          property={property as PropertySchemaFile}
          editable
          onChange={this.handleChange}
        />
        <FormErrors warnings={warnings} errors={errors} />
      </div>
    );
  }

  private sortEcpFiles(files: FileInfo[]): FileInfo[] {
    const filesCopy = [...files];

    filesCopy.sort((a, b) => {
      const aContains = a.title.includes('.sig');
      const bContains = b.title.includes('.sig');

      if (aContains && !bContains) {
        return 1;
      }
      if (!aContains && bContains) {
        return -1;
      }

      return 0;
    });

    return filesCopy;
  }

  private async checkEcpFile(newEcpFiles?: FileInfo[]) {
    const filesStatusText: Record<string, string> = {};
    const { fieldValue } = this.props;

    let files: FileInfo[] = [];

    if (isArrayOf(fieldValue, isFileInfo)) {
      files = fieldValue;
    }

    const ecpFiles = newEcpFiles?.length ? newEcpFiles : files.filter(file => file.title.includes('.sig'));

    if (!ecpFiles.length) {
      return;
    }

    const promises = ecpFiles.map(async file => {
      const originalFileName = file.title.split('.sig')[0];
      const fileForEcp = files.find(({ title }) => title === originalFileName);

      if (!fileForEcp) {
        filesStatusText[file.id] = `Загрузить файл подписи "${file.title}" невозможно. ЭЦП недействительна.`;

        return;
      }

      try {
        const verifyFileEcp = await checkFileEcp(fileForEcp?.id, file.id);
        const findNotValidSigns = verifyFileEcp.some(({ verified }) => !verified);

        if (findNotValidSigns) {
          filesStatusText[file.id] = `Загрузить файл подписи "${file.title}" невозможно. ЭЦП недействительна.`;

          return;
        }

        const existingEcp = await verifyEcp(fileForEcp?.id);

        if (existingEcp.length) {
          filesStatusText[file.id] =
            `Загрузить файл подписи невозможно - для файла "${file.title}" уже существует ЭЦП.\n` +
            'Используйте инструмент "Доподписать"';
        }
      } catch {
        // do nothing
      }
    });

    await Promise.all(promises);
    this.setStatusText(filesStatusText);
  }

  @action.bound
  private setStatusText(statusText: Record<string, string>) {
    this.statusText = statusText;
  }

  @boundMethod
  private handleChange(value: FileInfo[]) {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }
  }
}

export const withTypeFile = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FILE },
  () => FormControlTypeFile
);
