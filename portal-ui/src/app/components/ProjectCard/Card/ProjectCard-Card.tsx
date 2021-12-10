import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';
import { Link } from '../../Link/Link';

import { ProjectCardName } from '../Name/ProjectCard-Name';
import { ProjectCardFooter } from '../Footer/ProjectCard-Footer';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Card.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardCardProps {
  project: CrgProject;
}

@observer
export class ProjectCardCard extends Component<ProjectCardCardProps> {
  render() {
    const { project } = this.props;

    return (
      <Link className={cnProjectCard('Card')} href={this.url}>
        <ProjectCardName>{project.name}</ProjectCardName>
        <ProjectCardFooter />
      </Link>
    );
  }

  @computed
  private get url(): string {
    const { id } = this.props.project;

    return `/projects/${id}/map`;
  }
}
