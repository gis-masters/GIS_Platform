import React, { type ChangeEvent, Component, type SyntheticEvent } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Button, type ButtonProps } from '../Button/Button';
import { Loading } from '../Loading/Loading';

import './ProjectForm.scss';

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
          onChange={this.handleChange}
          variant='standard'
          slotProps={{
            htmlInput: { maxLength: this.maxLength },
            formHelperText: { className: cnProjectForm('HelperText') }
          }}
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
  private handleChange(e: ChangeEvent<HTMLInputElement>) {
    this.newProjectName = e.target.value;
    this.props.onChange();
  }

  @boundMethod
  private handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    this.props.onSubmit(this.newProjectName);
  }
}
