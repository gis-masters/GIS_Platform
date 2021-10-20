import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ImportToProject } from '../ImportToProject/ImportToProject';
import { LibraryRecord } from '../../services/crg/doc-library.service';

import '!style-loader!css-loader!sass-loader!./Icon/DocumentActionsWidget-Icon.scss';

const cnDocumentActionsWidget = cn('DocumentActionsWidget');

interface ImportGmlWidgetProps {
  document: LibraryRecord;
}

@observer
export class DocumentActionsWidget extends Component<ImportGmlWidgetProps> {
  render() {
    const { intents } = this.props.document;

    return (
      <div className={cnDocumentActionsWidget()}>
        {intents?.indexOf('PROJECT') > -1 && <ImportToProject document={this.props.document} />}
      </div>
    );
  }
}
