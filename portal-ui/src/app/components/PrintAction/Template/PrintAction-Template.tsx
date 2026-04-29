import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type PrintableTemplate } from '../../../services/report/report.models';
import { PseudoLink } from '../../PseudoLink/PseudoLink';

import './PrintAction-Template.scss';

const cnPrintActionTemplate = cn('PrintAction', 'Template');

interface PrintActionTemplateProps<T> {
  entity: T;
  template: PrintableTemplate<T>;
  onPrint(): void;
}

export class PrintActionTemplate<T> extends Component<PrintActionTemplateProps<T>> {
  render() {
    const { template } = this.props;

    return (
      <div className={cnPrintActionTemplate()}>
        <PseudoLink onClick={this.handleClick}>{template.title}</PseudoLink>
      </div>
    );
  }

  @boundMethod
  private async handleClick() {
    const { template, entity, onPrint } = this.props;
    await template.print(entity);
    onPrint();
  }
}
