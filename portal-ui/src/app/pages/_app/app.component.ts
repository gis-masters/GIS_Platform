import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Component, ElementRef, type OnChanges, type OnDestroy, type OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { toast, ToastContainer } from 'react-toastify';

import { Toast } from '../../components/Toast/Toast';
import { registry } from '../../services/di-registry';

const ToastContainerWithRegistry = withRegistry(registry)(ToastContainer);

@Component({
  selector: 'crg-root',
  templateUrl: './app.component.html',
  standalone: false
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
      const { initializeMapServices } = await import('../../services/map/initializeMapServices');
      await initializeMapServices();
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
    // addEventListener('error') не даёт source/fileno/columnNumber/error и не сохраняет предыдущий onerror
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onerror = function (
      event: Event | string,
      source?: string,
      fileno?: number,
      columnNumber?: number,
      error?: Error
    ) {
      if (oldOnError) {
        Reflect.apply(oldOnError, this, [event, source, fileno, columnNumber, error]);
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
