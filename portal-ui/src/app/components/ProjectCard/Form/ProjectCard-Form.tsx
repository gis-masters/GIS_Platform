import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { projectsService } from '../../../services/crg/projects.service';
import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Form.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardFormProps {
  onCancel: () => void;
}

@observer
export class ProjectCardForm extends Component<ProjectCardFormProps> {
  @observable private newProjectName = '';
  @observable private error = '';
  @observable private busy = false;

  private maxLength = 50;

  render() {
    return (
      <form className={cnProjectCard('Form')} onSubmit={this.handleSubmit} noValidate autoComplete='off'>
        <TextField
          label='Название проекта'
          className={cnProjectCard('FormField')}
          helperText={`${this.newProjectName.length}/${this.maxLength}`}
          autoFocus={true}
          inputProps={{ maxLength: this.maxLength }}
          FormHelperTextProps={{ className: cnProjectCard('FormHelperText') }}
          onChange={this.handleChange}
        />

        {this.error ? <div className={cnProjectCard('FormError')}>{this.error}</div> : null}

        {this.busy ? <Loading noBackdrop={true} /> : null}

        <div className={cnProjectCard('Footer')}>
          <Button type='button' onClick={this.props.onCancel} className={cnProjectCard('FormButton')} variant='text'>
            Отмена
          </Button>
          <Button type='submit' disabled={!this.newProjectName} className={cnProjectCard('FormButton')} variant='text'>
            Сохранить
          </Button>
        </div>
      </form>
    );
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newProjectName = e.target.value;
    this.error = '';
  }

  @action
  setError(error: string) {
    this.error = error;
  }

  @action
  setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.busy) {
      return;
    }

    this.setError('');
    this.setBusy(true);

    try {
      await projectsService.create(this.newProjectName);
      await projectsService.fetchProjects();

      this.props.onCancel();
    } catch (err) {
      if (err.error.status === 409) {
        this.setError(err.error.message);
      } else {
        this.setError('Ошибка при создании проекта');
      }
    } finally {
      this.setBusy(false);
    }
  }
}
