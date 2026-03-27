import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { PublishOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';
import { currentImport } from '../../stores/CurrentImport.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { IconButton } from '../IconButton/IconButton';
import { ImportFileChooserDialog } from '../ImportFileChooserDialog/ImportFileChooserDialog';

const cnImportButton = cn('ImportButton');

@observer
export class ImportButton extends Component {
  @observable private chooserOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const disabled = !currentUser.isAdmin || !organizationSettings.importShp;

    return (
      <>
        <Tooltip title='Импорт данных'>
          <span>
            <IconButton className={cnImportButton()} color='inherit' disabled={disabled} onClick={this.openChooser}>
              <PublishOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <ImportFileChooserDialog
          open={this.chooserOpen}
          onClose={this.closeChooser}
          onFileChosen={this.handleFileChosen}
        />
      </>
    );
  }

  @action.bound
  private openChooser() {
    this.chooserOpen = true;
  }

  @action.bound
  private closeChooser() {
    this.chooserOpen = false;
  }

  @action.bound
  private handleFileChosen(file: File) {
    this.chooserOpen = false;

    currentImport.reset({ file });
    const importUrl = `/projects/${currentProject.id}/import`;

    void services.ngZone.run(async () => {
      await services.router.navigate([importUrl]);
    });
  }
}
