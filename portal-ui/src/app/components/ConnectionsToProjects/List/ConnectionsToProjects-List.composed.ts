import { HOC, compose } from '@bem-react/core';

import { ConnectionsToProjectsListProps, ConnectionsToProjectsListBase } from './ConnectionsToProjects-List.base';
import { withTypeList } from './_type/ConnectionsToProjects-List_type_list';
import { withTypeText } from './_type/ConnectionsToProjects-List_type_text';

export const ConnectionsToProjectsList = compose(
  withTypeList as HOC<ConnectionsToProjectsListProps>,
  withTypeText as HOC<ConnectionsToProjectsListProps>
)(ConnectionsToProjectsListBase);
