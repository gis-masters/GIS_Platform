import React, { Component, ReactNode } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { SearchItemData } from '../../services/data/search/search.model';
import { Highlight } from '../Highlight/Highlight';
import SearchResultHighlightItem from '../SearchResultHighlightItem/SearchResultHighlightItem';

import '!style-loader!css-loader!sass-loader!./SearchResultHighlight.scss';

const cnSearchResultHighlight = cn('SearchResultHighlight');

interface SearchResultHighlightProps {
  item: SearchItemData;
}

@observer
export class SearchResultHighlight extends Component<SearchResultHighlightProps> {
  @observable private schema?: Schema;
  @observable private searchPreview: string = '';

  constructor(props: SearchResultHighlightProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.loadSchema();
  }

  render() {
    const { item } = this.props;

    return (
      this.foundItemParts && (
        <SearchResultHighlightItem
          headlines={item.headlines}
          searchPreview={this.searchPreview}
          searchResults={this.foundItemParts}
        />
      )
    );
  }

  private async loadSchema(): Promise<void> {
    const schema = await schemaService.getSchema(this.props.item.source.schema);
    this.setSchema(schema);
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action
  private setSearchPreview(searchPreview: string) {
    this.searchPreview = searchPreview;
  }

  @computed
  private get rawProperties(): Record<string, unknown> {
    const { item } = this.props;

    let rawProperties: Record<string, unknown> = {};

    if (item.type === 'DOCUMENT') {
      rawProperties = item.payload;
    }

    if (item.type === 'FEATURE') {
      rawProperties = item.payload.properties;
    }

    return rawProperties;
  }

  @computed
  private get foundItemParts(): ReactNode {
    if (this.schema) {
      const headlines = this.props.item.headlines;
      const properties = Object.entries(this.rawProperties);
      const foundParts = properties
        .map(property => {
          const foundProperties: string[] = [];

          if (!headlines?.length) {
            return;
          }

          return this.searchForMatches(headlines, property, foundProperties);
        })
        .filter(obj => obj?.length);

      return headlines && this.setHighlights(foundParts, headlines);
    }
  }

  private searchForMatches(headlines: string[], property: [string, unknown], foundProperties: string[]) {
    return headlines
      .map(headline => {
        const propertyValue = String(property[1]);
        const index = propertyValue.indexOf(headline);

        if (index !== -1) {
          let searchResTextForPreview: string = headline;
          searchResTextForPreview =
            index >= 10
              ? ` ...${propertyValue.slice(index - 10, index)} ${searchResTextForPreview}`
              : ` ${propertyValue.slice(0, index)} ${searchResTextForPreview}`;

          searchResTextForPreview =
            `${searchResTextForPreview} ${propertyValue.slice(index + headline.length, index + headline.length + 10)}` +
            (propertyValue.length > index + headline.length + 10 ? '...' : '');

          const schemaProperties = this.schema?.properties;
          const schemaProperty = schemaProperties?.find(
            schemaProp => schemaProp.name === property[0] && !schemaProp.hidden
          );

          if (schemaProperty && !foundProperties.includes(schemaProperty.name)) {
            if (this.searchPreview.length < 60 && !this.searchPreview.includes(searchResTextForPreview)) {
              this.setSearchPreview(this.searchPreview + ' ' + searchResTextForPreview);
            }

            foundProperties.push(schemaProperty.name);

            return [schemaProperty.title, propertyValue];
          }
        }
      })
      .filter(Boolean);
  }

  private setHighlights(foundParts: ((string[] | undefined)[] | undefined)[], headlines: string[]) {
    return foundParts.flat().map((part, i) => {
      if (part && part[0] && part[1]) {
        return (
          <div key={i}>
            <span className={cnSearchResultHighlight('Title')}>{part[0]}</span>:{' '}
            <Highlight searchWords={headlines} enabled>
              {part[1]}
            </Highlight>
          </div>
        );
      }
    });
  }
}
