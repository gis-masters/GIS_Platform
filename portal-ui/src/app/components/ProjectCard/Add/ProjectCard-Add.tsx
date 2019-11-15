import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';
import { cn } from '@bem-react/classname';

import { ProjectCardForm } from '../Form/ProjectCard-Form';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Add.scss';

const cnProjectCard = cn('ProjectCard');

@observer
export class ProjectCardAdd extends React.Component<{}> {
  @observable
  private active: boolean = false;

  constructor (props: {}) {
    super(props);

    this.toggleActive = this.toggleActive.bind(this);
  }

  render () {
    return this.active ? this.renderForm() : this.renderAdd();
  }

  private renderAdd () {
    return (
      <div className={cnProjectCard('Add')} onClick={this.toggleActive}>
        <AddIcon className={cnProjectCard('AddIcon')} />
        <div className={cnProjectCard('AddCaption')}>
          Создать новый проект
        </div>
      </div>
    );
  }

  private renderForm () {
    return <ProjectCardForm onCancel={this.toggleActive} />;
  }

  @action
  private toggleActive () {
    this.active = !this.active;
  }
}
