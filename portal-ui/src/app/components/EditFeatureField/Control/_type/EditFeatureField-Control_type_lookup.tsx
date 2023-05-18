import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../../../services/services';
import { ValueType } from '../../../../services/data/schema/schemaOld.models';
import { DocumentListItemData, DocumentsList } from '../../../DocumentsList/DocumentsList';

import { cnEditFeatureFieldControl, EditFeaturesControlProps } from '../EditFeatureField-Control';

@observer
class EditFeatureFieldControlTypeLookup extends Component<EditFeaturesControlProps> {
  @observable lookupValue: DocumentListItemData[];

  constructor(props: EditFeaturesControlProps) {
    super(props);

    makeObservable(this);

    try {
      this.setValue(JSON.parse(props.field.value) as DocumentListItemData[]);
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

export const withTypeLookup = withBemMod<EditFeaturesControlProps, EditFeaturesControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.LOOKUP },
  () => EditFeatureFieldControlTypeLookup
);
