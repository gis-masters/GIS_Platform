import React, { Component, createRef, ReactElement, RefObject } from 'react';
import { parseInt } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';

import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./TextOverflow.scss';

const MAX_SHOWING_TEXT_LINES = 3;

const cnTextOverflow = cn('TextOverflow');

interface TextOverflowProps {
  value: string | number | (string | ReactElement)[];
}

@observer
export class TextOverflow extends Component<TextOverflowProps> {
  @observable private textOverflow = false;
  @observable private isAllTextVisible = false;

  private ref: RefObject<HTMLSpanElement> = createRef();
  private wrapperRef: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.resizeHandler);

  constructor(props: TextOverflowProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount(): void {
    if (this.wrapperRef.current) {
      this.resizeObserver.observe(this.wrapperRef.current);
    }

    this.setTextOverflow();
  }

  componentDidUpdate(prevProps: Readonly<TextOverflowProps>): void {
    if (prevProps.value !== this.props.value) {
      this.setTextOverflow();
      this.hideText();
    }
  }

  componentWillUnmount() {
    if (this.wrapperRef.current) {
      this.resizeObserver.unobserve(this.wrapperRef.current);
    }
  }

  render() {
    const { value } = this.props;

    return (
      <div ref={this.wrapperRef} className={cnTextOverflow()}>
        <span ref={this.ref} className={cnTextOverflow('Value', { hidePartOfText: !this.isAllTextVisible })}>
          {value}
        </span>

        {this.textOverflow &&
          (this.isAllTextVisible ? (
            <PseudoLink className={cnTextOverflow('PseudoLink')} onClick={this.hideText}>
              Свернуть
            </PseudoLink>
          ) : (
            <PseudoLink className={cnTextOverflow('PseudoLink')} onClick={this.showAllText}>
              Показать всё
            </PseudoLink>
          ))}
      </div>
    );
  }

  @action.bound
  private showAllText() {
    this.isAllTextVisible = true;
  }

  @action.bound
  private hideText() {
    this.isAllTextVisible = false;
  }

  @action.bound
  private setTextOverflow() {
    const height = this.ref.current.scrollHeight;
    const lineHeight = parseInt(window.getComputedStyle(this.ref.current).getPropertyValue('line-height'));

    this.textOverflow = height / lineHeight > MAX_SHOWING_TEXT_LINES;
  }

  @boundMethod
  private resizeHandler() {
    this.setTextOverflow();
  }
}
