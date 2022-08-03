import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { PageOptions } from '../../../services/models';
import { XTableInvoke } from '../../XTable/XTable';

import { AttributesTable } from '../Table/Attributes-Table';
import { AttributesBarHead } from '../BarHead/Attributes-BarHead';
import { AttributesCounter } from '../Counter/Attributes-Counter';
import { AttributesBarTitle } from '../BarTitle/Attributes-BarTitle';
import { AttributesBarClose } from '../BarClose/Attributes-BarClose';
import { AttributesBarMinimize } from '../BarMinimize/Attributes-BarMinimize';

import '!style-loader!css-loader!sass-loader!./Attributes-Bar.scss';

const cnAttributesBar = cn('Attributes', 'Bar');

interface AttributesBarProps {
  layer: CrgVectorLayer;
  tableInvoke: XTableInvoke;
  onMinimize(): void;
  onClose(): void;
  onPageOptionsChange(pageOptions: PageOptions): void;
}

@observer
export class AttributesBar extends Component<AttributesBarProps> {
  @observable featuresMatched = 0;
  @observable featuresTotal = 0;

  constructor(props: AttributesBarProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layer, tableInvoke, onMinimize, onClose, onPageOptionsChange } = this.props;

    return (
      <div className={cnAttributesBar()}>
        <AttributesBarHead>
          <AttributesBarTitle>{layer.title}</AttributesBarTitle>
          <AttributesCounter layer={layer} featuresMatched={this.featuresMatched} featuresTotal={this.featuresTotal} />
          <AttributesBarMinimize onClick={onMinimize} />
          <AttributesBarClose onClick={onClose} />
        </AttributesBarHead>
        <AttributesTable
          layer={layer}
          invoke={tableInvoke}
          onFeaturesMatchedChange={this.featuresMatchedChangeHandler}
          onFeaturesTotalChange={this.featuresTotalChangeHandler}
          onPageOptionsChange={onPageOptionsChange}
        />
      </div>
    );
  }

  @action.bound
  private featuresMatchedChangeHandler(count: number) {
    this.featuresMatched = count;
  }

  @action.bound
  private featuresTotalChangeHandler(count: number) {
    this.featuresTotal = count;
  }
}
