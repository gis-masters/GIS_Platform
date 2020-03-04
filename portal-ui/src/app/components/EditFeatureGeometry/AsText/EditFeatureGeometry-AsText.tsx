import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, TextField, IconButton, Tooltip } from '@material-ui/core';
import { ListAlt } from '@material-ui/icons';
import { isEqual } from 'lodash';

import { Button } from '../../Button/Button';
import { CoordinateEdited } from '../../../services/geoserver/wfs-models';

import '!style-loader!css-loader!sass-loader!../AsTextDialog/EditFeatureGeometry-AsTextDialog.scss';
import '!style-loader!css-loader!sass-loader!../Text/EditFeatureGeometry-Text.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAsTextProps {
  coordinates: CoordinateEdited[];
  mustBeClosed: boolean;
}

@observer
export class EditFeatureGeometryAsText extends React.Component<EditFeatureGeometryAsTextProps> {
  @observable private isOpen = false;
  @observable private text: string;

  constructor (props: EditFeatureGeometryAsTextProps) {
    super(props);

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.save = this.save.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
  }

  render () {
    return (
      <>
        <Tooltip title='Как текст'>
          <IconButton
              className={cnEditFeatureGeometry('AsText')}
              color={this.isOpen ? 'secondary' : 'primary'}
              onClick={this.openDialog}>
            <ListAlt />
          </IconButton>
        </Tooltip>
        <Dialog open={this.isOpen}
                PaperProps={{ className: cnEditFeatureGeometry('AsTextDialog') }}
                onKeyDown={this.keyHandler}>
          <DialogContent>
            <TextField
                className={cnEditFeatureGeometry('Text')}
                value={this.text}
                onChange={this.changeHandler}
                variant="outlined"
                multiline={true}
                autoFocus={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.save} color='primary'  variant='outlined'>
              Изменить
            </Button>
            <Button onClick={this.closeDialog} variant='outlined'>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private keyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && e.ctrlKey) {
      this.save();
    }
    if (e.key === 'Escape') {
      this.closeDialog();
    }
  }

  private initText() {
    this.setText(this.props.coordinates.map(coord => coord.join('\t')).join('\n'));
  }

  private changeHandler (e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setText(e.target.value);
  }

  @action
  private setText (text: string) {
    this.text = text;
  }

  @action
  private openDialog () {
    this.initText();
    this.isOpen = true;
  }

  @action
  private closeDialog () {
    this.isOpen = false;
  }

  @action
  private save () {
    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates = this.text
                               .replace(/,/g,'.')
                               .split('\n')
                               .map(row => row.trim().replace(/\s+/g, ' '))
                               .filter(row => row)
                               .map(row => row.split(/\s/));

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates[newCoordinates.length - 1])) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
    this.closeDialog();
  }
}
