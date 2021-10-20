import React, { Component, createRef } from 'react';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Button, ButtonProps } from '../Button/Button';
import { ProjectForm } from '../ProjectForm/ProjectForm';

const cnProjectsAdd = cn('ProjectsAdd');

interface ProjectsAddProps extends IClassNameProps {
  onClose: () => void;
  onOpen: () => void;
  open: boolean;
  busy: boolean;
  onSubmit: (name: string) => void;
  onChange: () => void;
  buttonProps?: Omit<ButtonProps, 'ref'>;
  errors: string[];
}

@observer
export class ProjectsAdd extends Component<ProjectsAddProps> {
  btnRef = createRef<HTMLButtonElement>();

  render() {
    const { onOpen, open, onClose, busy, onSubmit, className, buttonProps = {}, onChange, errors } = this.props;

    return (
      <>
        <Button
          className={cnProjectsAdd(null, [className])}
          btnRef={this.btnRef}
          onClick={onOpen}
          children='Создать проект'
          variant='outlined'
          {...buttonProps}
        />
        <Popover
          open={open}
          anchorEl={this.btnRef.current}
          onClose={onClose}
          PaperProps={{ elevation: 5, square: true }}
        >
          <ProjectForm
            errors={errors}
            busy={busy}
            onClose={onClose}
            onSubmit={onSubmit}
            onChange={onChange}
            buttonProps={{
              children: 'Создать'
            }}
          />
        </Popover>
      </>
    );
  }
}
