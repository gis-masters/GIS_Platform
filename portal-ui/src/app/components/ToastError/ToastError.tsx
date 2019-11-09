import * as React from 'react';
import { cn } from '@bem-react/classname';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { toast, ToastId } from 'react-toastify';
import nl2br from 'react-nl2br';

import '!style-loader!css-loader!sass-loader!./ToastError.scss';

const cnToastError = cn('ToastError');

interface ToastErrorOpts {
  source?: string;
  fileno?: number;
  columnNumber?: number;
  error?: Error;
  message?: JSX.Element | string;
  details?: JSX.Element | string;
}

interface ToastErrorProps extends ToastErrorOpts {
  toastInfo: {
    id: ToastId;
  };
}

@observer
export class ToastError extends React.Component<ToastErrorProps> {

  constructor (props: ToastErrorProps) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  @observable
  open = false;

  static show (opts: ToastErrorOpts) {
    const toastInfo: {id: ToastId} = { id: '0' };

    const props: ToastErrorProps = {
      ...opts,
      toastInfo
    };

    toastInfo.id = toast.error(<ToastError {...props} />, { autoClose: 10000 });
  }

  render () {
    const { error, details, source, fileno, columnNumber, message } = this.props;
    const sourceFile = source ? (new URL(source)).pathname : '';

    return (
      <div className={cnToastError()}>
        <div className={cnToastError('Head')}>
          <div className={cnToastError('Title')}>
            {nl2br(message) || 'Произошла ошибка.'}
          </div>
          {error || details || source ? (
            <div className={cnToastError('Moar')} onClick={this.toggleOpen}>
              {this.open ? 'Скрыть подробности' : 'Подробнее'}
            </div>
          ) : null}
        </div>
        {this.open ? (
          <div className={cnToastError('Details')}>
            <div className={cnToastError('Message')}>
              {nl2br(details)}
              {error ? nl2br(error.message ? error.message : error.toString()) : null}
            </div>
            {sourceFile ? (
              <div className={cnToastError('File')}>
                <div className={cnToastError('Source')}>
                  {sourceFile}
                </div>
                <div className={cnToastError('FileNums')}>
                  {fileno}:{columnNumber}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  @action
  private toggleOpen () {
    this.open = !this.open;
    toast.update(this.props.toastInfo.id, {autoClose: !this.open && 10000});
  }
}
