import React, { Component, FormEvent, ChangeEvent } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { printSettings, resolutions, pageFormats, Orientation } from '../../stores/PrintSettings.store';
import { Form, FormField, FormLabel, FormControl } from '../Form/Form';
import { Select } from '../Select/Select';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogProps {
  onSubmit: () => void;
}

@observer
export class PrintDialog extends Component<PrintDialogProps> {
  render() {
    return (
      <Form className={cnPrintDialog()} onSubmit={this.props.onSubmit}>
        <FormField>
          <FormLabel htmlFor='printSettingsPageFormat'>Формат:</FormLabel>
          <FormControl>
            <Select
              id='printSettingsPageFormat'
              options={pageFormats.map(({ id, name }) => ({ value: id, children: name }))}
              onChange={this.handleFormatChange}
              value={printSettings.pageFormat.id}
            />
          </FormControl>
        </FormField>

        <FormField>
          <FormLabel htmlFor='printSettingsResolution'>Разрешение:</FormLabel>
          <FormControl>
            <Select
              id='printSettingsResolution'
              options={resolutions.map(resolution => ({ value: resolution, children: resolution + ' dpi' }))}
              onChange={this.handleResolutionChange}
              value={printSettings.resolution}
            />
          </FormControl>
        </FormField>

        <FormField>
          <FormLabel htmlFor='printSettingsOrientation'>Ориентация:</FormLabel>
          <FormControl>
            <Select
              id='printSettingsOrientation'
              options={[
                {
                  value: 'l',
                  children: 'Ландшафтная'
                },
                {
                  value: 'p',
                  children: 'Портретная'
                }
              ]}
              onChange={this.handleOrientationChange}
              value={printSettings.orientation}
            />
          </FormControl>
        </FormField>
      </Form>
    );
  }

  @boundMethod
  private submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmit();
  }

  @boundMethod
  private handleFormatChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.setPageFormat(e.target.value as string);
  }

  @action.bound
  private handleResolutionChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.resolution = Number(e.target.value);
  }

  @action
  private handleOrientationChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.orientation = e.target.value as Orientation;
  }
}
