import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, TextField, IconButton, Tooltip } from '@material-ui/core';
import { ListAlt } from '@material-ui/icons';
import { isEqual, clone } from 'lodash';
import { boundMethod } from 'autobind-decorator';

import { Button } from '../../Button/Button';
import { CoordinateEdited } from '../../../services/geoserver/wfs.models';

import '!style-loader!css-loader!sass-loader!../AsTextDialog/EditFeatureGeometry-AsTextDialog.scss';
import '!style-loader!css-loader!sass-loader!../Text/EditFeatureGeometry-Text.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAsTextProps {
  coordinates: CoordinateEdited[];
  mustBeClosed: boolean;
}

@observer
export class EditFeatureGeometryAsText extends Component<EditFeatureGeometryAsTextProps> {
  @observable private isOpen = false;
  @observable private text: string;

  render() {
    return (
      <>
        <Tooltip title='Как текст'>
          <IconButton
            className={cnEditFeatureGeometry('AsText')}
            color={this.isOpen ? 'secondary' : 'default'}
            onClick={this.openDialog}
          >
            <ListAlt />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.isOpen}
          onClose={this.closeDialog}
          PaperProps={{ className: cnEditFeatureGeometry('AsTextDialog') }}
        >
          <DialogContent>
            <TextField
              className={cnEditFeatureGeometry('Text')}
              value={this.text}
              onChange={this.changeHandler}
              multiline={true}
              autoFocus={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.save} color='primary'>
              Изменить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private initText() {
    this.setText(this.props.coordinates.map(coord => clone(coord).reverse().join('\t')).join('\n'));
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setText(e.target.value);
  }

  @action
  private setText(text: string) {
    this.text = text;
  }

  @action.bound
  private openDialog() {
    this.initText();
    this.isOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.isOpen = false;
  }

  @action.bound
  private save() {
    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates = this.text
      .replace(/,/g, '.')
      .split('\n')
      .map(row => row.trim().replace(/\s+/g, ' '))
      .filter(row => row)
      .map(row => row.split(/\s/).reverse());

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates[newCoordinates.length - 1])) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
    this.closeDialog();
  }
}
