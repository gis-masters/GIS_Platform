import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { services } from '../../../../services/services';
import { cnEditFeatureFieldControl, EditFeaturesControlProps } from '../EditFeatureField-Control';
import { DocumentsList } from '../../../DocumentsList/DocumentsList';
import { FieldType } from '../../../../services/crg/schema.service';
import { action, observable } from 'mobx';

export interface DocumentListItemData {
  id: string;
  title: string;
}

@observer
class EditFeatureFieldControlTypeLookup extends Component<EditFeaturesControlProps> {
  @observable lookupValue: DocumentListItemData[];

  constructor (props: EditFeaturesControlProps) {
    super(props);

    try {
      this.setValue(JSON.parse(props.field.value));
    } catch (e) {
      services.logger.warn('Incorrect lookup value: ', props.field.value);
    }

    this.updateChild = this.updateChild.bind(this);
  }

  render () {
    const { className, field } = this.props;

    return (
      <div className={className}>
        <DocumentsList
          documents={this.lookupValue}
          editedField={field}
          featureInfo={this.props.featureInfo}
          modifyCallback={this.updateChild}/>
      </div>
    );
  }

  updateChild = (data: DocumentListItemData[]) => {
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
  { type: FieldType.LOOKUP },
  () => EditFeatureFieldControlTypeLookup
);
