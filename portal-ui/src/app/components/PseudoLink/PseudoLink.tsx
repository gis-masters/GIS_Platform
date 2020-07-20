import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./PseudoLink.scss';

const cnPseudoLink = cn('PseudoLink');

interface PseudoLinkProps {
  onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
}

export class PseudoLink extends Component<PseudoLinkProps> {
  render() {
    const { disabled, className, children } = this.props;

    return (
      <span className={cnPseudoLink({ disabled }, [className])} onClick={this.clickHandler}>
        <span className={cnPseudoLink('Inner')}>{children}</span>
      </span>
    );
  }

  @boundMethod
  private clickHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }
}
