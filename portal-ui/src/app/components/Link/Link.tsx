import { HttpErrorResponse } from '@angular/common/http';
import React, { Component } from 'react';
import { OpenInNew } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { serverProperties } from '../../services/server-properties.service';

import '!style-loader!css-loader!sass-loader!./Link.scss';

const cnLink = cn('Link');

interface LinkProps {
  url: string;
  className?: string;
  children?: React.ReactChild;
  target?: string;
  download?: boolean | string;
}

export class Link extends Component<LinkProps> {
  render() {
    const { children, className, url, target } = this.props;

    return (
      <a href={url} target={target} onClick={this.navigate} className={cnLink(null, [className])}>
        {target === '_blank' ? (
          <>
            <OpenInNew className={cnLink('Icon')} />
            &nbsp;
          </>
        ) : null}
        {children}
      </a>
    );
  }

  @boundMethod
  private async navigate(e: React.MouseEvent<HTMLAnchorElement>) {
    const { url, target, download } = this.props;

    if (!target) {
      e.preventDefault();

      if (!download) {
        services.ngZone.run(() => {
          services.router.navigateByUrl(url);
        });
      } else if (download) {
        const baseUrl = await serverProperties.baseUrl;

        services.httpq.get(url, { responseType: 'blob' })
          .then(response => {
            const objectURL = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = download === true ? new URL(url, baseUrl).pathname.split('/').pop() : download;
            a.click();
          })
          .catch((eResponse: HttpErrorResponse) => {
            if (eResponse.status === 404) {
              Toast.error('Файл отсутствует, обратитиесь к администратору.');
            } else if (eResponse.status === 403) {
              Toast.error('Нет доступа к файлу, обратитиесь к администратору.');
            } else {
              Toast.error('Возникла ошибка при получении файла');
              services.logger.error('Возникла ошибка при получении файла: ', eResponse.message);
            }
          });
      }
    }
  }
}
