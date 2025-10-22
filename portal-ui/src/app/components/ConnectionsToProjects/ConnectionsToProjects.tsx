import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { type FileConnection } from '../../services/data/files/files.models';
import { ConnectionsToProjectsList } from './List/ConnectionsToProjects-List.composed';

import './ConnectionsToProjects.scss';

interface ConnectionsToProjectsProps {
  type: ConnectionsToProjectsType;
  connections?: FileConnection[];
}

export type ConnectionsToProjectsType = 'list' | 'text';

@observer
export class ConnectionsToProjects extends Component<ConnectionsToProjectsProps> {
  render() {
    const { type, connections } = this.props;

    return <ConnectionsToProjectsList connections={connections} type={type} />;
  }
}
