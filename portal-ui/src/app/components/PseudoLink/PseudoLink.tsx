import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./PseudoLink.scss';

const cnPseudoLink = cn('PseudoLink');

interface PseudoLinkProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  className?: string;
  disabled?: boolean;
  color?: 'inherit';
  onClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

export class PseudoLink extends Component<PseudoLinkProps> {
  render() {
    const { disabled, className, children, color } = this.props;

    return (
      <span {...this.props} className={cnPseudoLink({ disabled, color }, [className])} onClick={this.handleClick}>
        <span className={cnPseudoLink('Inner')}>{children}</span>
      </span>
    );
  }

  @boundMethod
  private handleClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }
}
