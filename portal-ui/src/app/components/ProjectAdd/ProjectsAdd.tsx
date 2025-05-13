import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Button, ButtonProps } from '../Button/Button';
import { ProjectForm } from '../ProjectForm/ProjectForm';

const cnProjectsAdd = cn('ProjectsAdd');

interface ProjectsAddProps extends IClassNameProps {
  open: boolean;
  busy: boolean;
  buttonProps?: Omit<ButtonProps, 'ref'>;
  errors: string[];
  title: string;
  onClose(): void;
  onOpen(): void;
  onSubmit(name: string): void;
  onChange(): void;
}

export const ProjectsAdd = observer((props: ProjectsAddProps) => {
  const { onOpen, open, onClose, title, busy, onSubmit, className, buttonProps = {}, onChange, errors } = props;
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        className={cnProjectsAdd(null, [className])}
        ref={btnRef}
        onClick={onOpen}
        children={title}
        variant='outlined'
        {...buttonProps}
      />

      <Popover
        open={open}
        anchorEl={btnRef.current}
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
});
