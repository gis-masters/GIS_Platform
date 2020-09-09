import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ProjectCardForm } from '../Form/ProjectCard-Form';
import { ProjectCardAddIcon } from '../AddIcon/ProjectCard-AddIcon';
import { ProjectCardAddCaption } from '../AddCaption/ProjectCard-AddCaption';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Add.scss';

const cnProjectCardAdd = cn('ProjectCard', 'Add');

@observer
export class ProjectCardAdd extends Component {
  @observable
  private active: boolean = false;

  render() {
    return this.active ? this.renderForm() : this.renderAdd();
  }

  private renderAdd() {
    return (
      <div className={cnProjectCardAdd()} onClick={this.toggleActive}>
        <ProjectCardAddIcon />
        <ProjectCardAddCaption />
      </div>
    );
  }

  private renderForm() {
    return <ProjectCardForm onCancel={this.toggleActive} />;
  }

  @action.bound
  private toggleActive() {
    this.active = !this.active;
  }
}
