import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Projection } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { FormControlProps } from '../Form/Control/Form-Control';
import { SelectProjection } from '../SelectProjection/SelectProjection';

const cnSelectProjectionCodeControl = cn('SelectProjectionCodeControl');

@observer
export default class SelectProjectionCodeControl extends Component<FormControlProps> {
  @observable private selectedProjection?: Projection;

  async componentDidMount(): Promise<void> {
    await this.setProjectionFromFieldValue();
  }

  async componentDidUpdate(prevProps: FormControlProps): Promise<void> {
    const { fieldValue } = this.props;
    if (fieldValue !== prevProps.fieldValue) {
      await this.setProjectionFromFieldValue();
    }
  }

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <SelectProjection
        className={cnSelectProjectionCodeControl()}
        onChange={this.handleSelect}
        value={this.selectedProjection}
        fullWidth
      />
    );
  }

  private async setProjectionFromFieldValue() {
    const { fieldValue } = this.props;
    if (typeof fieldValue === 'string') {
      const projection = await getProjectionByCode(fieldValue);
      if (!projection) {
        return;
      }
      this.setSelectedProjection(projection);
    }
  }

  @boundMethod
  private handleSelect(projection: Projection) {
    const { property, onChange } = this.props;
    onChange?.({ value: getProjectionCode(projection), propertyName: property.name });
  }

  @action
  private setSelectedProjection(projection: Projection) {
    this.selectedProjection = projection;
  }
}
