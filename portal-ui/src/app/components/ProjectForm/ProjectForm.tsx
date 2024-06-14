import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Button, ButtonProps } from '../Button/Button';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./ProjectForm.scss';

const cnProjectForm = cn('ProjectForm');

interface ProjectFormProps {
  busy: boolean;
  errors?: string[];
  buttonProps?: Omit<ButtonProps, 'ref'>;
  onClose(): void;
  onSubmit(name: string): void;
  onChange(): void;
}

@observer
export class ProjectForm extends Component<ProjectFormProps> {
  @observable private newProjectName = '';

  private maxLength = 250;

  constructor(props: ProjectFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { busy, errors = [], buttonProps = {}, onClose } = this.props;

    return (
      <form className={cnProjectForm({ busy })} onSubmit={this.handleSubmit} noValidate autoComplete='off'>
        <TextField
          label='Название проекта'
          className={cnProjectForm('Input')}
          helperText={`${this.newProjectName.length}/${this.maxLength}`}
          autoFocus
          inputProps={{ maxLength: this.maxLength }}
          FormHelperTextProps={{ className: cnProjectForm('HelperText') }}
          onChange={this.handleChange}
          variant='standard'
        />

        {errors.map((error, index) => (
          <div key={index} className={cnProjectForm('Error')}>
            {error}
          </div>
        ))}

        {busy && <Loading global />}

        <div className={cnProjectForm('Footer')}>
          <Button
            type='submit'
            disabled={!this.newProjectName}
            className={cnProjectForm('Button', { action: 'submit' })}
            color='primary'
            {...buttonProps}
          />
          <Button type='button' onClick={onClose} className={cnProjectForm('Button', { action: 'cancel' })}>
            Отмена
          </Button>
        </div>
      </form>
    );
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newProjectName = e.target.value;
    this.props.onChange();
  }

  @boundMethod
  private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.props.onSubmit(this.newProjectName);
  }
}
