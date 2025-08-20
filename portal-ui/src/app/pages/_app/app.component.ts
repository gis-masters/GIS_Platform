import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { toast, ToastContainer } from 'react-toastify';

import { Toast } from '../../components/Toast/Toast';
import { registry } from '../../services/di-registry';

const ToastContainerWithRegistry = withRegistry(registry)(ToastContainer);

@Component({
  selector: 'crg-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('reactToastContainer', { read: ElementRef, static: true })
  refToastContainer?: ElementRef<HTMLDivElement>;
  private root?: Root;

  async ngOnInit() {
    if (this.refToastContainer?.nativeElement) {
      this.root = createRoot(this.refToastContainer.nativeElement);
      this.renderReactElement();
      this.addOnErrorWindowHandler();

      // Инициализируем сервисы в правильном порядке
      const { serviceInitializer } = await import('../../services/map/ServiceInitializer');
      await serviceInitializer.initialize();
    }
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private addOnErrorWindowHandler() {
    const oldOnError = window.onerror;
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onerror = function (
      event: Event | string,
      source?: string,
      fileno?: number,
      columnNumber?: number,
      error?: Error
    ) {
      if (oldOnError) {
        // eslint-disable-next-line prefer-rest-params
        Reflect.apply(oldOnError, this, arguments);
      }

      Toast.error({
        source,
        fileno,
        columnNumber,
        error,
        canBeSuppressed: true
      });
    };
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

    const reactElement = createElement(ToastContainerWithRegistry, props);

    this.root?.render(reactElement);
  }
}
