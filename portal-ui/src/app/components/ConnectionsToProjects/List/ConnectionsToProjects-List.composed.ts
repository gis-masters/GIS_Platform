import { compose, HOC } from '@bem-react/core';

import { withTypeList } from './_type/ConnectionsToProjects-List_type_list';
import { withTypeText } from './_type/ConnectionsToProjects-List_type_text';
import { ConnectionsToProjectsListBase, ConnectionsToProjectsListProps } from './ConnectionsToProjects-List.base';

export const ConnectionsToProjectsList = compose(
  withTypeList as HOC<ConnectionsToProjectsListProps>,
  withTypeText as HOC<ConnectionsToProjectsListProps>
)(ConnectionsToProjectsListBase);
