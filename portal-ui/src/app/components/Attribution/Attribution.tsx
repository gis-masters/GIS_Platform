import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { environment } from '../../services/environment';

import '!style-loader!css-loader!sass-loader!../Attribution/Attribution.scss';

const cnAttribution = cn('Attribution');

@observer
export class Attribution extends Component {
  render() {
    const year = new Date().getFullYear();
    const { url, title } = environment.attribution;

    return (
      <div className={cnAttribution()}>
        <a
          className={cnAttribution('Link')}
          href={`${url ?? 'https://gis-masters.ru'}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {title ?? 'ГИС-мастерская'}
        </a>{' '}
        {year} &copy;
      </div>
    );
  }
}
