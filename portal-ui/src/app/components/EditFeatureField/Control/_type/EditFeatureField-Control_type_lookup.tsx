import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../../../services/services';
import { ValueType } from '../../../../services/crg/schema.models';
import { DocumentListItemData, DocumentsList } from '../../../DocumentsList/DocumentsList';

import { cnEditFeatureFieldControl, EditFeaturesControlProps } from '../EditFeatureField-Control';

@observer
class EditFeatureFieldControlTypeLookup extends Component<EditFeaturesControlProps> {
  @observable lookupValue: DocumentListItemData[];

  constructor(props: EditFeaturesControlProps) {
    super(props);

    try {
      this.setValue(JSON.parse(props.field.value));
    } catch (e) {
      services.logger.warn('Incorrect lookup value: ', props.field.value);
    }
  }

  render() {
    const { className, field } = this.props;

    return (
      <div className={className}>
        <DocumentsList
          documents={this.lookupValue}
          editedField={field}
          featureInfo={this.props.featureInfo}
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
    if (!newValue) {
      return [];
    }

    this.lookupValue = newValue;
  }
}

export const withTypeLookup = withBemMod<{}, EditFeaturesControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.LOOKUP },
  () => EditFeatureFieldControlTypeLookup
);
