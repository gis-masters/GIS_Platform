import React, { Component, ReactNode } from 'react';
import { HttpErrorResponse } from '@angular/common/http';
import { OpenInNew } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { getBaseUrl } from '../../services/server-urls.service';
import { sleep } from '../../services/util/sleep';
import { http } from '../../services/http.service';
import { services } from '../../services/services';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./Link.scss';

const cnLink = cn('Link');

interface LinkProps {
  url: string;
  theme?: 'normal' | 'none';
  className?: string;
  children?: ReactNode;
  target?: string;
  download?: boolean | string;
  disabled?: boolean;
  delay?: number;
}

export class Link extends Component<LinkProps> {
  render() {
    const { children, className, url, target, theme } = this.props;

    return (
      <a
        href={url}
        target={target}
        onClick={this.navigate}
        className={cnLink({ theme: theme || 'normal' }, [className])}
      >
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
    const { url, target, download, disabled, delay } = this.props;

    if (!target || disabled || delay) {
      e.preventDefault();

      if (disabled) {
        return;
      }

      if (delay) {
        await sleep(delay);
      }

      if (!download) {
        services.ngZone.run(() => {
          services.router.navigateByUrl(url);
        });
      } else if (download) {
        const baseUrl = await getBaseUrl();

        http
          .get(url, { responseType: 'blob' })
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
