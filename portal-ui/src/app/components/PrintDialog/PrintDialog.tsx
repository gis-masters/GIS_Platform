import React, { Component, FormEvent, ChangeEvent } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { printSettings, resolutions, pageFormats, Orientation, scales } from '../../stores/PrintSettings.store';
import { Form, FormField, FormLabel, FormControl } from '../Form/Form';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';
import { mapService } from '../../services/map/map.service';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogProps {
  open: boolean;
  onClose: () => void;
}

@observer
export class PrintDialog extends Component<PrintDialogProps> {
  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintDialog() }}>
        <DialogContent>
          <Form className={cnPrintDialog('Form')} onSubmit={this.submitHandler} id='printDialogForm'>
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
              <FormLabel htmlFor='printSettingsScale'>Масштаб:</FormLabel>
              <FormControl>
                <Select
                  id='printSettingsScale'
                  options={scales.map(scale => ({ value: scale, children: '1 : ' + scale }))}
                  onChange={this.handleScaleChange}
                  value={printSettings.scale}
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
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='printDialogForm' color='primary'>
            Печать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mapService.print();
    this.props.onClose();
  }

  @boundMethod
  private handleFormatChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.setPageFormat(e.target.value as string);
  }

  @action.bound
  private handleResolutionChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.resolution = Number(e.target.value);
  }

  @action.bound
  private handleScaleChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.scale = Number(e.target.value);
  }

  @action
  private handleOrientationChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.orientation = e.target.value as Orientation;
  }
}
