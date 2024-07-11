import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ImportResult } from '../../services/data/processes/processes.models';
import { ImportGmlResultDialog } from '../ImportGmlResultDialog/ImportGmlResultDialog';
import { Link } from '../Link/Link';
import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./ImportGmlResultsLink.scss';

const cnImportGmlResultsLink = cn('ImportGmlResultsLink');

export interface ImportGmlResultsLinkProps {
  reports?: ImportResult;
}

@observer
export default class ImportGmlResultsLink extends Component<ImportGmlResultsLinkProps> {
  @observable private open = false;

  constructor(props: ImportGmlResultsLinkProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { reports } = this.props;
    const { importLayerReports, projectId } = reports || {};

    return reports && importLayerReports?.length ? (
      <div className={cnImportGmlResultsLink()}>
        <PseudoLink className={cnImportGmlResultsLink('Info')} onClick={this.openDialog}>
          Отчет
        </PseudoLink>
        <Link href={`/projects/${projectId}/map`}>Перейти в проект</Link>
        <ImportGmlResultDialog open={this.open} onClose={this.onClose} reports={reports} />
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
