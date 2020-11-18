import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { getDetails, getTitle } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-Info.scss';

export const cnExplorerInfo = cn('Explorer', 'Info');

export interface ExplorerInfoProps extends IClassNameProps {
  store: ExplorerStore;
  renderContent?: (props: ExplorerInfoProps) => ReactNode;
  renderActions?: (props: ExplorerInfoProps) => ReactNode;
}

@observer
export class ExplorerInfo extends Component<ExplorerInfoProps> {
  render() {
    const { renderContent, renderActions, className, store } = this.props;
    const { selectedItem } = store;

    return (
      <Card className={cnExplorerInfo({}, [className])} elevation={3} square>
        <CardContent>
          <h4>{getTitle(selectedItem)}</h4>
          {renderContent ? renderContent(this.props) : this.renderContent()}
        </CardContent>
        {renderActions && <CardActions>{renderActions(this.props)}</CardActions>}
      </Card>
    );
  }

  private renderContent() {
    const details = getDetails(this.props.store.selectedItem);

    return <>{details && <p>{details}</p>}</>;
  }
}
