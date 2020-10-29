import React, { Component } from 'react';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { DataSet } from '../../../services/data.service';
import { Button } from '../../Button/Button';

import { ExplorerStore } from '../Explorer.store';

const cnExplorerInfo = cn('Explorer', 'Info');

interface ExplorerInfoProps {
  store: ExplorerStore;
}

@observer
export class ExplorerInfo extends Component<ExplorerInfoProps> {
  render() {
    const { store } = this.props;
    const item = store.path[store.path.length - 1];
    const selectedItem = item && (item.payload as DataSet);

    return (
      <Card className={cnExplorerInfo()} square>
        <CardContent>
          <h4>{selectedItem && selectedItem.title}</h4>
          {selectedItem && <p>{selectedItem.details}</p>}
        </CardContent>
        <CardActions>
          <Button variant='text' startIcon={<Edit />}>
            Редактировать
          </Button>
          <Button variant='text' startIcon={<Delete />}>
            Удалить
          </Button>
        </CardActions>
      </Card>
    );
  }
}
