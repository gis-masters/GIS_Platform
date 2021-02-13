import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { ExplorerProps } from '../Explorer';
import { ExplorerStore } from '../Explorer.store';
import { getDetails, getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerInfoTitle } from '../InfoTitle/Explorer-InfoTitle';

import '!style-loader!css-loader!sass-loader!./Explorer-Info.scss';

export const cnExplorerInfo = cn('Explorer', 'Info');

export interface ExplorerInfoProps extends IClassNameProps {
  store: ExplorerStore;
  renderContent?: (props: ExplorerInfoProps) => ReactNode;
  renderActions?: (props: ExplorerInfoProps) => ReactNode;
  Explorer: React.ComponentType<ExplorerProps>;
}

@observer
export class ExplorerInfo extends Component<ExplorerInfoProps> {
  render() {
    const { renderContent, renderActions, className, store } = this.props;
    const { selectedItem } = store;

    return (
      <Card className={cnExplorerInfo({}, [className])} elevation={3} square>
        <CardContent>
          <ExplorerInfoTitle>{getTitle(selectedItem)}</ExplorerInfoTitle>
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
