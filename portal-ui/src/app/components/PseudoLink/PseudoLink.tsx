import React from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PseudoLink.scss';

const cnPseudoLink = cn('PseudoLink');

interface PseudoLinkProps {
  onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
}

export class PseudoLink extends React.Component<PseudoLinkProps> {
  constructor (props: PseudoLinkProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render () {
    const { disabled, className, children } = this.props;

    return (
      <span className={cnPseudoLink({ disabled }, [className])} onClick={this.clickHandler}>
        <span className={cnPseudoLink('Inner')}>
          {children}
        </span>
      </span>
    );
  }

  private clickHandler (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }
};
