import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

const cnOrgSchemas = cn('OrgSchemas');

@observer
export class OrgSchemas extends Component {
  render() {
    return <div className={cnOrgSchemas()}>aaa</div>;
  }
}
