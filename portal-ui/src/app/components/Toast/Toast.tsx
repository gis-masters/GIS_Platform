import React, { Component, FC, ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { CheckCircle, Close, Error, Info, Warning } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/';
import { cn } from '@bem-react/classname';
import nl2br from 'react-nl2br';
import { Id, toast, ToastOptions, TypeOptions } from 'react-toastify';
import '!style-loader!css-loader!sass-loader!../../../../node_modules/react-toastify/dist/ReactToastify.css';

import { environment } from '../../services/environment';
import { sendTelegramError } from '../../services/telegram.service';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';

import '!style-loader!css-loader!sass-loader!./Toast.scss';

const cnToast = cn('Toast');

interface ToastOpts extends ToastOptions {
  message?: ReactNode;
  details?: ReactNode;
  duration?: number;
}

interface ToastErrorOpts extends ToastOpts {
  source?: string;
  fileno?: number;
  columnNumber?: number;
  error?: Error;
  canBeSuppressed?: boolean;
  suppress?: boolean;
}

interface ToastProps extends ToastOpts {
  toastInfo: {
    id: Id;
  };
  icon: ReactNode;
}

@observer
export class Toast extends Component<ToastProps> {
  static defaultDuration = 5000;

  private static icons: Record<TypeOptions, FC<SvgIconProps>> = {
    error: Error,
    success: CheckCircle,
    warning: Warning,
    info: Info,
    default: Info,
    dark: Info
  };

  @observable open = false;

  constructor(props: ToastProps) {
    super(props);
    makeObservable(this);
  }

  static show(message: ReactNode | ToastOpts, opts?: ToastOpts): void {
    const normalizedOpts = this.normalizeOpts(message, opts);
    const Icon = this.icons[normalizedOpts.type || 'default'] || null;
    const toastInfo: { id: Id } = { id: '0' };
    const handleClose = () => {
      toast.dismiss(toastInfo.id);
    };

    opts = {
      ...normalizedOpts,
      className: 'Toast-Toastify',
      closeButton: (
        <>
          <IconButton type='button' className={cnToast('Close')} onClick={handleClose}>
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

  static info(message: ReactNode | ToastOpts, opts?: ToastOpts): void {
    this.show({
      ...this.normalizeOpts(message, opts),
      type: 'info'
    } as ToastOpts);
  }

  static warn(message: ReactNode | ToastOpts, opts?: ToastOpts): void {
    this.show({
      ...this.normalizeOpts(message, opts),
      type: 'warning'
    } as ToastOpts);
  }

  static success(message: ReactNode | ToastOpts, opts?: ToastOpts): void {
    this.show({
      ...this.normalizeOpts(message, opts),
      autoClose: opts?.duration || Toast.defaultDuration,
      type: 'success'
    } as ToastOpts);
  }

  private static normalizeOpts(message: ReactNode | ToastOpts, opts?: ToastOpts): ToastOpts {
    if (!opts) {
      if ((message as ToastOpts).message) {
        opts = message as ToastOpts;
        message = opts.message;
      } else {
        opts = {};
      }
    }

    return {
      ...opts,
      message: message as ReactNode
    };
  }

  static error(messageOrOpts: ReactNode | ToastErrorOpts, opts?: ToastErrorOpts): void {
    let message = messageOrOpts;
    if (!opts) {
      if (
        (messageOrOpts as ToastErrorOpts).message ||
        (messageOrOpts as ToastErrorOpts).error ||
        (messageOrOpts as ToastErrorOpts).details ||
        (messageOrOpts as ToastErrorOpts).source
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

    const { source, error, details, fileno, columnNumber, canBeSuppressed, suppress } = opts;
    const sourceFile = source ? new URL(source).pathname : '';
    const protocol = window.location.protocol.slice(0, -1);

    let tgMsg = '';
    if (typeof message === 'string') {
      tgMsg = message;
    } else {
      try {
        tgMsg = JSON.stringify(message, null, 2) || String(message);
      } catch {}
    }
    if (details) {
      tgMsg += `
${String(details)}`;
    }
    if (error) {
      tgMsg += `
${error.message || error.toString()}`;
    }

    void sendTelegramError(tgMsg);

    if (
      (isRecordStringUnknown(environment.suppressToastErrors) &&
        environment.suppressToastErrors[protocol] &&
        canBeSuppressed) ||
      suppress
    ) {
      return;
    }

    this.show({
      autoClose: 10_000,
      ...opts,
      type: 'error',
      message: message as ReactNode,
      details:
        error || details || source ? (
          <>
            <div className={cnToast('Message')}>
              {nl2br(details)}
              {error ? nl2br(error.message || error.toString()) : null}
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
    const { details, message, type, icon } = this.props;

    return (
      <div className={cnToast({ type })}>
        <div className={cnToast('Head')}>
          {icon}
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
      autoClose: !this.open && (this.props.autoClose || Toast.defaultDuration)
    });
  }
}
