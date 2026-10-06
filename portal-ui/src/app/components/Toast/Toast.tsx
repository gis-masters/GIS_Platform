import React, { Component, type FC, type ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import nl2br from 'react-nl2br';
import { type Id, toast, type ToastOptions, type TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { environment } from '../../services/environment';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { ToastCloseButton } from './CloseButton/Toast-CloseButton';
import { ToastLoader } from './Loader/Toast-Loader';
import { cnToast } from './Toast.classname';

import './Toast.scss';

interface ToastOpts extends ToastOptions {
  message?: ReactNode;
  details?: ReactNode;
  duration?: number;
  loader?: boolean;
}

interface ToastErrorOpts extends ToastOpts {
  source?: string;
  fileno?: number;
  columnNumber?: number;
  error?: Error;
  canBeSuppressed?: boolean;
  suppress?: boolean;
}

interface ToastProps extends Omit<ToastOpts, 'icon'> {
  toastInfo: {
    id: Id;
  };
  icon: ReactNode;
}

@observer
export class Toast extends Component<ToastProps> {
  static readonly defaultDuration = 5000;

  private static icons: Record<TypeOptions, FC<SvgIconProps>> = {
    error: Error,
    success: CheckCircle,
    warning: Warning,
    info: Info,
    default: Info
  };

  @observable open = false;

  constructor(props: ToastProps) {
    super(props);
    makeObservable(this);
  }

  static dismiss(id: Id): void {
    toast.dismiss(id);
  }

  static show(message: ReactNode | ToastOpts, opts?: ToastOpts): Id {
    const { toastifyOpts, props, toastInfo } = this.prepare(message, opts);

    toastInfo.id = toast(<Toast {...props} />, toastifyOpts);

    return toastInfo.id;
  }

  static update(id: Id, message: ReactNode | ToastOpts, opts?: ToastOpts): void {
    const { toastifyOpts, props, toastInfo } = this.prepare(message, opts);
    toastInfo.id = id;

    toast.update(id, {
      ...toastifyOpts,
      autoClose: toastifyOpts.autoClose ?? Toast.defaultDuration,
      render: <Toast {...props} />
    });
  }

  static info(message: ReactNode | ToastOpts, opts?: ToastOpts): Id {
    return this.show({
      ...this.normalizeOpts(message, opts),
      type: 'info'
    } as ToastOpts);
  }

  static warn(message: ReactNode | ToastOpts, opts?: ToastOpts): Id {
    return this.show({
      ...this.normalizeOpts(message, opts),
      type: 'warning'
    } as ToastOpts);
  }

  static success(message: ReactNode | ToastOpts, opts?: ToastOpts): Id {
    return this.show({
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

  private static prepare(
    message: ReactNode | ToastOpts,
    opts?: ToastOpts
  ): { toastifyOpts: ToastOpts; props: ToastProps; toastInfo: { id: Id } } {
    const normalizedOpts = this.normalizeOpts(message, opts);
    const Icon = this.icons[normalizedOpts.type || 'default'] || null;
    const toastInfo: { id: Id } = { id: normalizedOpts.toastId ?? '0' };

    let icon: ReactNode = null;
    if (normalizedOpts.loader) {
      icon = <ToastLoader />;
    } else if (Icon) {
      icon = <Icon className={cnToast('Icon')} />;
    }

    const toastifyOpts: ToastOpts = {
      ...normalizedOpts,
      className: cnToast('Toastify'),
      closeButton: normalizedOpts.closeButton === false ? false : <ToastCloseButton toastId={toastInfo} />,
      icon: false
    };

    const props: ToastProps = {
      ...toastifyOpts,
      icon,
      toastInfo
    };

    return { toastifyOpts, props, toastInfo };
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

    if (
      (isRecordStringUnknown(environment.suppressToastErrors) &&
        environment.suppressToastErrors[protocol] &&
        canBeSuppressed) ||
      suppress
    ) {
      return;
    }

    const errorToastOpts = {
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
    } as ToastOpts;

    if (opts.toastId != null) {
      this.update(opts.toastId, errorToastOpts);

      return;
    }

    this.show(errorToastOpts);
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
  private toggleOpen(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    this.open = !this.open;

    if (this.props.autoClose === false) {
      return;
    }

    const autoClose = this.open ? false : this.props.autoClose ?? Toast.defaultDuration;

    toast.update(this.props.toastInfo.id, { autoClose });
  }
}
