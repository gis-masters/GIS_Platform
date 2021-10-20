import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { cn } from '@bem-react/classname';

import { Link } from '../Link/Link';
import { ImportResult } from '../../services/crg/processes.service';
import { ImportGmlResultDialog } from '../ImportGmlResultDialog/ImportGmlResultDialog';
import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./ImportGmlResultsLink.scss';

const cnImportGmlResultsLink = cn('ImportGmlResultsLink');

interface ImportGmlResultsLinkProps {
  reports: ImportResult;
}

@observer
export class ImportGmlResultsLink extends Component<ImportGmlResultsLinkProps> {
  @observable private open = false;

  render() {
    const { importLayerReports, projectId } = this.props.reports;

    return importLayerReports?.length ? (
      <div className={cnImportGmlResultsLink()}>
        <PseudoLink className={cnImportGmlResultsLink('Info')} onClick={this.openDialog}>
          Отчет
        </PseudoLink>
        <Link url={`/projects/${projectId}/map`}>Перейти в проект</Link>
        <ImportGmlResultDialog open={this.open} onClose={this.onClose} reports={this.props.reports} />
      </div>
    ) : null;
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private onClose() {
    this.open = false;
  }
}
