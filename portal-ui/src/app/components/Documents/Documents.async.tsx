import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { LibraryRecord } from '../../services/data/library/library.models';
import { PropertySchemaDocument } from '../../services/data/schema/schema.models';
import { LookupList } from '../Lookup/List/Lookup-List';
import { Lookup } from '../Lookup/Lookup';
import { DocumentsAdd } from './Add/Documents-Add';
import { DocumentsItem } from './Item/Documents-Item';

const cnDocuments = cn('Documents');

export interface DocumentInfo extends Pick<LibraryRecord, 'id' | 'title'> {
  libraryId?: string;
  libraryTableName?: string;
}

export interface DocumentsProps {
  value: DocumentInfo[];
  property: PropertySchemaDocument;
  editable?: boolean;
  onChange?(value: DocumentInfo[]): void;
}

const defaultMaxDocuments = 100;

@observer
export default class Documents extends Component<DocumentsProps> {
  constructor(props: DocumentsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { value, property, editable = false } = this.props;
    const { multiple = false, maxDocuments } = property;
    const numerous = value.length > 1;

    return (
      <Lookup className={cnDocuments()}>
        {!!value.length && (
          <LookupList multiple={multiple} numerous={numerous} editable={editable}>
            {value.map((item, i) => {
              return (
                <DocumentsItem
                  item={item}
                  onDelete={this.handleDelete}
                  key={`${item.libraryTableName}_${item.id}_${i}`}
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
            onChange={this.handleAdd}
            value={value}
            maxDocuments={multiple ? maxDocuments : 1}
            librariesTableNames={this.librariesTableNames}
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

  private get librariesTableNames(): string[] {
    const { library, libraries } = this.props.property;

    return libraries || (library ? [library] : []);
  }

  @boundMethod
  private handleDelete(deletingItem: DocumentInfo) {
    const { onChange, value } = this.props;
    onChange?.(
      value.filter(
        ({ id, libraryTableName }) => !(id === deletingItem.id && libraryTableName === deletingItem.libraryTableName)
      )
    );
  }

  @boundMethod
  private handleAdd(selectedDocuments: DocumentInfo[]) {
    const { onChange, value } = this.props;
    onChange?.([...value, ...selectedDocuments]);
  }
}
