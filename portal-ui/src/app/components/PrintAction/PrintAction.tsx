import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Print, PrintOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PrintTemplate } from '../../services/print/templates/PrintTemplate';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../Actions/Item/Actions-Item.composed';
import { IconButtonProps } from '../IconButton/IconButton';
import { PrintActionDialog } from './Dialog/PrintAction-Dialog';

const cnPrintAction = cn('PrintAction');

interface PrintActionProps<T> extends IClassNameProps {
  entity: T;
  templates: PrintTemplate<T>[];
  as: ActionsItemVariant;
  size?: IconButtonProps['size'];
}

@observer
export class PrintAction<T> extends Component<PrintActionProps<T>> {
  @observable private selectTemplateDialogOpen = false;
  @observable private busy = false;

  constructor(props: PrintActionProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, size, className, templates, entity } = this.props;
    const title = (templates.length === 1 ? templates[0].title : 'Печать') + ' (PDF)';

    return (
      <>
        <ActionsItem
          icon={this.selectTemplateDialogOpen ? <Print fontSize={size} /> : <PrintOutlined fontSize={size} />}
          className={cnPrintAction(null, [className])}
          title={title}
          as={as}
          loading={this.busy}
          disabled={this.busy}
          size={size}
          onClick={this.handlePrintButtonClick}
        />

        <PrintActionDialog<T>
          open={this.selectTemplateDialogOpen}
          entity={entity}
          templates={templates}
          onClose={this.closeSelectTemplateDialog}
        />
      </>
    );
  }

  @boundMethod
  private async handlePrintButtonClick() {
    const { entity, templates } = this.props;

    if (templates.length === 1) {
      this.setBusy(true);
      try {
        await templates[0].print(entity);
      } catch (error) {
        this.setBusy(false);
        throw error;
      } finally {
        this.setBusy(false);
      }
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
