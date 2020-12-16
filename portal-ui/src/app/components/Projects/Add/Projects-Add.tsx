import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Button, Popover } from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';

import { ProjectForm } from '../../ProjectForm/ProjectForm';

import '!style-loader!css-loader!sass-loader!./Projects-Add.scss';

const cnProjectsAdd = cn('Projects', 'Add');

@observer
export class ProjectsAdd extends Component {
  btnRef = createRef<HTMLButtonElement>();
  @observable private open = false;

  render() {
    return (
      <>
        <Button
          className={cnProjectsAdd()}
          variant='contained'
          color='primary'
          startIcon={<AddBoxOutlined />}
          ref={this.btnRef}
          onClick={this.handleClick}
        >
          Создать проект
        </Button>
        <Popover
          open={this.open}
          anchorEl={this.btnRef.current}
          onClose={this.close}
          PaperProps={{ elevation: 5, square: true }}
        >
          <ProjectForm onClose={this.close} />
        </Popover>
      </>
    );
  }

  @action.bound
  private handleClick() {
    this.open = !this.open;
  }

  @action.bound
  private close() {
    this.open = false;
  }
}
