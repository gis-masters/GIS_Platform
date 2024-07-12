import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { PhotoUploader } from '../../../photo-uploader-app/components/PhotoUploader/PhotoUploader';
import { environment } from '../../services/environment';

@Component({
  selector: 'crg-photo-uploader-page',
  template: '<div class="photo-uploader-page" #react></div>',
  styleUrls: ['./photo-uploader-page.component.scss']
})
export class PhotoUploaderPageComponent implements OnInit, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (this.ref?.nativeElement) {
      this.root = createRoot(this.ref.nativeElement);
      this.renderReactElement();
    }
  }

  ngOnDestroy() {
    this.root?.unmount();
  }
  backgroundImage = environment.background;

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }

  private renderReactElement() {
    this.root?.render(createElement(PhotoUploader));
  }
}
