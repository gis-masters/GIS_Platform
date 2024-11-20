import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { FileInfo } from '../../../../services/data/files/files.models';
import { checkFileEcp, verifyEcp } from '../../../../services/data/files/files.service';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { PropertySchemaFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { Files } from '../../../Files/Files';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

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
      await this.checkEcpFile();
    }
  }

  render() {
    const { className, inSet, property, formRole, errors, fieldValue, formValue, fullWidthForOldForm } = this.props;
    let value = (fieldValue || []) as FileInfo[];

    try {
      if (fieldValue && typeof fieldValue === 'string') {
        value = JSON.parse(fieldValue) as FileInfo[];
      }
    } catch {
      value = [];
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
        <FormErrors errors={errors} />
      </div>
    );
  }

  private async checkEcpFile() {
    const { fieldValue } = this.props;
    const files = (fieldValue || []) as FileInfo[];
    const filesStatusText: Record<string, string> = {};

    const promises = files
      .filter(file => file.title.includes('.sig'))
      .map(async file => {
        const originalFileName = file.title.split('.sig')[0];
        const fileForEcp = files.find(({ title }) => title === originalFileName);

        if (!fileForEcp) {
          return;
        }

        try {
          const fileEcp = await checkFileEcp(fileForEcp?.id, file.id);

          if (fileEcp.length && !fileEcp[0].verified) {
            filesStatusText[file.id] = 'Подпись не действительна';
          }
        } catch {
          // do nothing
        }

        try {
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
