import React, { Component, FC } from 'react';
import { cn } from '@bem-react/classname';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { toast, Id, ToastOptions } from 'react-toastify';
import nl2br from 'react-nl2br';
import { IconButton } from '@material-ui/core';
import { CheckCircle, Error, Info, Warning, Close } from '@material-ui/icons';
import { SvgIconProps } from '@material-ui/core/SvgIcon/';

import { env } from '../../stores/Env.store';
import { sendTelegramError } from '../../services/telegram.service';

import '!style-loader!css-loader!sass-loader!./Toast.scss';

const cnToast = cn('Toast');

interface ToastOpts extends ToastOptions {
  message?: JSX.Element | string;
  details?: JSX.Element | string;
}

interface ToastErrorOpts extends ToastOpts {
  source?: string;
  fileno?: number;
  columnNumber?: number;
  error?: Error;
}

interface ToastProps extends ToastOpts {
  toastInfo: {
    id: Id;
  };
  icon: JSX.Element;
}

@observer
export class Toast extends Component<ToastProps> {
  static defaultDuration = 5000;

  private static icons: { [key: string]: FC<SvgIconProps> } = {
    error: Error,
    success: CheckCircle,
    warning: Warning,
    info: Info
  };

  @observable
  open = false;

  static show(message: JSX.Element | string | ToastOpts, opts?: ToastOpts) {
    const normalizedOpts = this.normalizeOpts(message, opts);
    const Icon = this.icons[normalizedOpts.type] || null;
    const toastInfo: { id: Id } = { id: '0' };
    const closeHandler = () => {
      toast.dismiss(toastInfo.id);
    };

    opts = {
      ...normalizedOpts,
      className: 'Toast-Toastify',
      closeButton: (
        <>
          <IconButton type='button' className={cnToast('Close')} onClick={closeHandler}>
            <Close className={cnToast('CloseIcon')} />
          </IconButton>
        </>
      )
    };

    const props: ToastProps = {
      ...opts,
      icon: Icon ? <Icon className={cnToast('Icon')} /> : null,
      toastInfo
    };

    toastInfo.id = toast(<Toast {...props} />, opts);
  }

  static info(message: JSX.Element | string | ToastOpts, opts?: ToastOpts) {
    this.show({
      ...this.normalizeOpts(message, opts),
      type: 'info'
    } as ToastOpts);
  }

  static warn(message: JSX.Element | string | ToastOpts, opts?: ToastOpts) {
    this.show({
      ...this.normalizeOpts(message, opts),
      type: 'warning'
    } as ToastOpts);
  }

  static success(message: JSX.Element | string | ToastOpts, opts?: ToastOpts) {
    this.show({
      ...this.normalizeOpts(message, opts),
      type: 'success'
    } as ToastOpts);
  }

  private static normalizeOpts(message: JSX.Element | string | ToastOpts, opts?: ToastOpts): ToastOpts {
    if (!opts) {
      if (message.hasOwnProperty('message')) {
        opts = message as ToastOpts;
        message = opts.message;
      } else {
        opts = {};
      }
    }

    return {
      ...opts,
      message: message as JSX.Element | string
    };
  }

  static error(messageOrOpts: JSX.Element | string | ToastErrorOpts, opts?: ToastErrorOpts, canBeSupresed?: boolean) {
    let message = messageOrOpts;
    if (!opts) {
      if (
        messageOrOpts.hasOwnProperty('message') ||
        messageOrOpts.hasOwnProperty('error') ||
        messageOrOpts.hasOwnProperty('details') ||
        messageOrOpts.hasOwnProperty('source')
      ) {
        opts = messageOrOpts as ToastErrorOpts;
        message = opts.message;
      } else {
        opts = {};
      }
    }

    if (!message) {
      message = 'Произошла ошибка.';
    }

    const { source, error, details, fileno, columnNumber } = opts;
    const sourceFile = source ? new URL(source).pathname : '';
    const protocol = window.location.protocol.slice(0, -1);

    let tgMsg = '';
    if (typeof message === 'string') {
      tgMsg = message;
    } else {
      try {
        tgMsg = JSON.stringify(message, null, 2) || String(message);
      } catch (e) {}
    }
    if (details) {
      tgMsg += `
${details}`;
    }
    if (error) {
      tgMsg += `
${error.message ? error.message : error.toString()}`;
    }

    sendTelegramError(tgMsg);

    if (env.supressToastErrors[protocol] && canBeSupresed) {
      return;
    }

    this.show({
      autoClose: 10000,
      ...opts,
      type: 'error',
      message: message as JSX.Element | string,
      details:
        error || details || source ? (
          <>
            <div className={cnToast('Message')}>
              {nl2br(details)}
              {error ? nl2br(error.message ? error.message : error.toString()) : null}
            </div>
            {sourceFile ? (
              <div className={cnToast('File')}>
                <div className={cnToast('Source')}>{sourceFile}</div>
                <div className={cnToast('FileNums')}>
                  {fileno}:{columnNumber}
                </div>
              </div>
            ) : null}
          </>
        ) : null
    } as ToastOpts);
  }

  render() {
    const { details, message, type } = this.props;

    return (
      <div className={cnToast({ type })}>
        <div className={cnToast('Head')}>
          {this.props.icon}
          <div className={cnToast('Title')}>{nl2br(message)}</div>
          {details ? (
            <div className={cnToast('Moar')} onClick={this.toggleOpen}>
              {this.open ? 'Скрыть' : 'Подробнее'}
            </div>
          ) : null}
        </div>
        {this.open ? <div className={cnToast('Details')}>{nl2br(details)}</div> : null}
      </div>
    );
  }

  @action.bound
  private toggleOpen() {
    this.open = !this.open;
    toast.update(this.props.toastInfo.id, {
      autoClose: !this.open && (this.props.hasOwnProperty('autoClose') ? this.props.autoClose : Toast.defaultDuration)
    });
  }
}
