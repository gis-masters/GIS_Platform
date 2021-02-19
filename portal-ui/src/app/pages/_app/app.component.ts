import { Component, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges, ViewEncapsulation } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';

import { getEnvironment } from '../../services/environment';
import { Toast } from '../../components/Toast/Toast';

@Component({
  selector: 'crg-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../../node_modules/react-toastify/dist/ReactToastify.css']
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('reactToastContainer', { read: ElementRef, static: true }) refToastContainer: ElementRef;

  constructor(private logger: NGXLogger) {
    this.getEnv();
  }

  ngOnInit() {
    this.renderReactElement();

    this.addOnErrorWindowHandler();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.refToastContainer.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private addOnErrorWindowHandler() {
    const oldOnError = window.onerror;

    window.onerror = function (
      event: Event | string,
      source?: string,
      fileno?: number,
      columnNumber?: number,
      error?: Error
    ) {
      if (oldOnError) oldOnError.apply(this, arguments);

      Toast.error(
        {
          source,
          fileno,
          columnNumber,
          error
        },
        null,
        true
      );
    };
  }

  private async getEnv() {
    const environment = await getEnvironment();
    this.logger.debug('Env: ', environment);
  }

  private renderReactElement() {
    const props = {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: Toast.defaultDuration,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: false,
      rtl: false,
      pauseOnVisibilityChange: false,
      draggable: false,
      pauseOnHover: true
    };

    const reactElement = createElement(ToastContainer, props);

    render(reactElement, this.refToastContainer.nativeElement);
  }
}
