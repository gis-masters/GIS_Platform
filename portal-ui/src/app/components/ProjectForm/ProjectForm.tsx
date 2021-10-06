import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { TextField } from '@mui/material';

import { communicationService } from '../../services/communication.service';
import { projectsService } from '../../services/crg/projects.service';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./ProjectForm.scss';

const cnProjectForm = cn('ProjectForm');

interface ProjectFormProps {
  onClose: () => void;
}

@observer
export class ProjectForm extends Component<ProjectFormProps> {
  @observable private newProjectName = '';
  @observable private error: string[] = [];
  @observable private busy = false;

  private maxLength = 50;

  render() {
    return (
      <form className={cnProjectForm({ busy: this.busy })} onSubmit={this.handleSubmit} noValidate autoComplete='off'>
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

        {this.error.map((error, index) => (
          <div key={index} className={cnProjectForm('Error')}>
            {error}
          </div>
        ))}

        {this.busy ? <Loading global /> : null}

        <div className={cnProjectForm('Footer')}>
          <Button type='submit' disabled={!this.newProjectName} className={cnProjectForm('Button')} color='primary'>
            Создать
          </Button>
          <Button type='button' onClick={this.props.onClose} className={cnProjectForm('Button')}>
            Отмена
          </Button>
        </div>
      </form>
    );
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newProjectName = e.target.value;
    this.error = [];
  }

  @action
  setError(error: string[]): void {
    this.error = error;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.busy) {
      return;
    }

    this.setError([]);
    this.setBusy(true);

    try {
      const newProject = await projectsService.create(this.newProjectName);
      communicationService.projectsUpdated.emit();
      communicationService.allProjectsFetched.once(() => {
        communicationService.projectCreated.emit(newProject);
      });
      Toast.success('Проект создан');
      this.props.onClose();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[] }>;
      if (err.response?.status === 409) {
        this.setError([err?.message]);
      } else {
        const errors = ['Ошибка при создании проекта'];
        err.response?.data?.errors?.forEach(({ message }) => errors.push(message as string));
        this.setError(errors);
      }
    } finally {
      this.setBusy(false);
    }
  }
}
