import React from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./HtmlContent.scss';

const cnHtmlContent = cn('HtmlContent');

interface HtmlContentProps extends IClassNameProps {
  content: string;
}

const rebaseLinks = (html: string): string => {
  const baseUrl = location.href.substring(0,location.href.lastIndexOf(location.hash));

  return html.replace(/(href=")(#)([^"]+)/ig, `$1${baseUrl}#$3`);
}

export const HtmlContent: React.FC<HtmlContentProps> = ({ content, className }) => (
  <div className={cnHtmlContent(null, [className])} dangerouslySetInnerHTML={{__html: rebaseLinks(content)}} />
);
