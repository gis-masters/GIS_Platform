import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { cn } from '@bem-react/classname';

import { services } from '../../../services/services';
import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Form.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardFormProps {
  onCancel: () => void;
}

@observer
export class ProjectCardForm extends React.Component<ProjectCardFormProps> {
  @observable private newProjectName = '';
  @observable private error = '';
  @observable private busy = false;

  private maxLength = 50;

  constructor (props: ProjectCardFormProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render () {
    return (
      <form className={cnProjectCard('Form')} onSubmit={this.handleSubmit} noValidate autoComplete='off'>
        <TextField
            label='Название проекта'
            className={cnProjectCard('FormField')}
            helperText={`${this.newProjectName.length}/${this.maxLength}`}
            autoFocus={true}
            inputProps={{maxLength: this.maxLength}}
            FormHelperTextProps={{className: cnProjectCard('FormHelperText')}}
            onChange={this.handleChange}
        />

        {this.error ? (
          <div className={cnProjectCard('FormError')}>
            {this.error}
          </div>
        ) : null}

        {this.busy ? <Loading noBackdrop={true} /> : null}

        <div className={cnProjectCard('Footer')}>
          <Button type='button' onClick={this.props.onCancel} className={cnProjectCard('FormButton')}>
            Отмена
          </Button>
          <Button type='submit' disabled={!this.newProjectName} className={cnProjectCard('FormButton')}>
            Сохранить
          </Button>
        </div>
      </form>
    );
  }

  @action
  private handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    this.newProjectName = e.target.value;
    this.error = '';
  }

  @action
  setError (error: string) {
    this.error = error;
  }

  @action
  setBusy (busy: boolean) {
    this.busy = busy;
  }

  private async handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.busy) {
      return;
    }

    this.setError('');
    this.setBusy(true);

    try {
      await services.projectsService.create(this.newProjectName);
      await services.projectsService.fetchProjects();

      this.setBusy(false);
      this.props.onCancel();
    } catch (err) {
      this.setBusy(false);
      if (err.error.status === 409) {
        this.setError(err.error.message);
      } else {
        this.setError('Ошибка при создании проекта');
      }
    }
  }
}
