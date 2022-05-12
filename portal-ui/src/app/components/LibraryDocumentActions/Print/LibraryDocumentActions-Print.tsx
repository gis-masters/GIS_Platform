import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Print, PrintOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/crg/doc-library.service';
import { printDocument, printTemplates } from '../../../services/print/print.service';
import { Schema } from '../../../services/crg/schema.models';
import { Button } from '../../Button/Button';

import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { PseudoLink } from '../../PseudoLink/PseudoLink';

const cnLibraryDocumentActionsPrint = cn('LibraryDocumentActionsPrint');

interface LibraryDocumentActionsPrintProps {
  document: LibraryRecord;
  schema: Schema<LibraryRecord>;
  as: ActionsItemVariant;
}

interface TemplateData {
  name: string;
  title: string;
  print: () => void;
}

@observer
export class LibraryDocumentActionsPrint extends Component<LibraryDocumentActionsPrintProps> {
  @observable private busy = false;
  @observable private selectTemplateDialogOpen = false;

  render() {
    const { as } = this.props;

    return (
      <>
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsPrint()}
          title='Печать документа (PDF)'
          as={as}
          icon={this.selectTemplateDialogOpen ? <Print /> : <PrintOutlined />}
          disabled={this.busy}
          loading={this.busy}
          onClick={this.handlePrintButtonClick}
        />
        <Dialog open={this.selectTemplateDialogOpen} onClose={this.closeSelectTemplateDialog}>
          <DialogTitle>Выберите шаблон печати</DialogTitle>
          <DialogContent>
            {this.printTemplates.map(({ name, title, print }) => (
              <p key={name}>
                <PseudoLink onClick={print}>{title}</PseudoLink>
              </p>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeSelectTemplateDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get printTemplates(): TemplateData[] {
    const { schema } = this.props;

    return schema.printTemplates
      .map(templateName => ({
        name: templateName,
        title: printTemplates.find(({ name }) => name === templateName)?.title,
        print: this.print.bind(this, templateName)
      }))
      .filter(({ title }) => title);
  }

  private async print(templateName: string) {
    const { document } = this.props;
    this.closeSelectTemplateDialog();
    this.setBusy(true);
    try {
      await printDocument(document, templateName);
    } catch (error) {
      this.setBusy(false);
      throw error;
    } finally {
      this.setBusy(false);
    }
  }

  @boundMethod
  private async handlePrintButtonClick() {
    const { schema } = this.props;

    if (schema.printTemplates.length === 1) {
      await this.print(schema.printTemplates[0]);
    } else {
      this.openSelectTemplateDialog();
    }
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private openSelectTemplateDialog() {
    this.selectTemplateDialogOpen = true;
  }

  @action.bound
  private closeSelectTemplateDialog() {
    this.selectTemplateDialogOpen = false;
  }
}
