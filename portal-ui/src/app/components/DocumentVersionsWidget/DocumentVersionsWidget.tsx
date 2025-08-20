import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Restore, RestoreOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../services/data/library/library.models';
import { Button } from '../Button/Button';
import { Explorer } from '../Explorer/Explorer';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./DocumentVersionsWidget.scss';

const cnDocumentVersionsWidget = cn('DocumentVersionsWidget');

interface DocumentVersionsWidgetProps {
  document: LibraryRecord;
}

@observer
export class DocumentVersionsWidget extends Component<DocumentVersionsWidgetProps> {
  @observable private dialogOpen = false;

  constructor(props: DocumentVersionsWidgetProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const EditIcon = this.dialogOpen ? Restore : RestoreOutlined;

    return (
      <>
        <Button
          className={cnDocumentVersionsWidget('Button')}
          endIcon={<EditIcon fontSize='inherit' />}
          variant='text'
          onClick={this.openModal}
        >
          Версии документа
        </Button>

        <Dialog
          className={cnDocumentVersionsWidget()}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          fullWidth
          maxWidth='xl'
        >
          <DialogTitle>Версии документа</DialogTitle>

          <DialogContent className={cnDocumentVersionsWidget(null, ['scroll'])}>
            <Explorer
              className={cnDocumentVersionsWidget('Explorer')}
              explorerRole='DocumentVersions'
              path={this.path}
              withInfoPanel
              withoutTitle
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return [{ type: ExplorerItemType.DOCUMENT_VERSIONS_ROOT, payload: this.props.document }];
  }

  @action.bound
  private openModal() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
