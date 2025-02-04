import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { ValueType } from '../../../../services/data/schema/schemaOld.models';
import { services } from '../../../../services/services';
import { DocumentListItemData, DocumentsList } from '../../../DocumentsList/DocumentsList';
import { cnEditFeatureFieldControl, EditFeatureFieldControlProps } from '../EditFeatureField-Control.base';

@observer
class EditFeatureFieldControlTypeLookup extends Component<EditFeatureFieldControlProps> {
  @observable lookupValue?: DocumentListItemData[];

  constructor(props: EditFeatureFieldControlProps) {
    super(props);

    makeObservable(this);

    try {
      this.setValue(JSON.parse(props.field.value || '') as DocumentListItemData[]);
    } catch {
      services.logger.warn('Incorrect lookup value: ', props.field.value);
    }
  }

  render() {
    const { className, field, featureInfo } = this.props;

    return (
      <div className={className}>
        <DocumentsList
          documents={this.lookupValue}
          editedField={field}
          featureInfo={featureInfo}
          modifyCallback={this.updateChild}
        />
      </div>
    );
  }

  @boundMethod
  updateChild(data: DocumentListItemData[]) {
    this.setValue(data);
  }

  @action
  private setValue(newValue: DocumentListItemData[]) {
    this.lookupValue = newValue ?? [];
  }
}

export const withTypeLookup = withBemMod<EditFeatureFieldControlProps, EditFeatureFieldControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.LOOKUP },
  () => EditFeatureFieldControlTypeLookup
);
