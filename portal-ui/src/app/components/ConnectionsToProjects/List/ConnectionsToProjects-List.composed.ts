import { compose } from '@bem-react/core';

import { ConnectionsToProjectsList as Presenter } from './ConnectionsToProjects-List';
import { withTypeList } from './_type/ConnectionsToProjects-List_type_list';
import { withTypeText } from './_type/ConnectionsToProjects-List_type_text';

export const ConnectionsToProjectsList = compose(withTypeList, withTypeText)(Presenter) as typeof Presenter;
