import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { PropertySchemaDocument } from '../../services/crg/schema.models';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { LookupList } from '../Lookup/List/Lookup-List';
import { Lookup } from '../Lookup/Lookup';

import { DocumentsItem } from './Item/Documents-Item';
import { DocumentsAdd } from './Add/Documents-Add';
import { computed } from 'mobx';

const cnDocuments = cn('Documents');

export type DocumentInfo = Pick<LibraryRecord, 'id' | 'title' | 'libraryId'>;

interface DocumentsProps {
  value: DocumentInfo[];
  property: PropertySchemaDocument;
  editable?: boolean;
  onChange?(value: DocumentInfo[]): void;
}

const defaultMaxDocuments = 100;

@observer
export class Documents extends Component<DocumentsProps> {
  render() {
    const { value, property, editable } = this.props;
    const { multiple, library } = property;
    const numerous = value.length > 1;

    return (
      <Lookup className={cnDocuments()}>
        {!!value.length && (
          <LookupList multiple={multiple} numerous={numerous} editable={editable}>
            {value.map((item, i) => {
              return (
                <DocumentsItem
                  item={item}
                  onDelete={this.deleteHandler}
                  key={`${item.id}_${i}`}
                  editable={editable}
                  numerous={numerous}
                  multiple={multiple}
                />
              );
            })}
          </LookupList>
        )}
        {editable && value.length < this.max && (
          <DocumentsAdd
            filled={Boolean(value.length)}
            onChange={this.addHandler}
            value={value}
            libraryIdentifier={library}
          />
        )}
      </Lookup>
    );
  }

  @computed
  private get max(): number {
    const { multiple, maxDocuments } = this.props.property;

    return multiple ? maxDocuments || defaultMaxDocuments : 1;
  }

  @boundMethod
  private deleteHandler(deletingItem: DocumentInfo) {
    const { onChange, value } = this.props;
    onChange(value.filter(({ id, libraryId }) => !(id === deletingItem.id && libraryId === deletingItem.libraryId)));
  }

  @boundMethod
  private addHandler(selectedDocuments: DocumentInfo[]) {
    const { onChange, value } = this.props;
    onChange([...value, ...selectedDocuments]);
  }
}
