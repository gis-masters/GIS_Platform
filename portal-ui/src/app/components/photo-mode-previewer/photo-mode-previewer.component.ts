import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { PhotoModePreviewer } from '../PhotoModePreviewer/PhotoModePreviewer';

const PhotoModePreviewerWithRegistry = withRegistry(registry)(PhotoModePreviewer);

@Component({
  selector: 'crg-photo-mode-previewer',
  template: '<div class="photo-mode-previewer" #react></div>',
  styleUrls: ['./photo-mode-previewer.component.scss']
})
export class PhotoModePreviewerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(PhotoModePreviewerWithRegistry);
    this.root?.render(reactElement);
  }
}
