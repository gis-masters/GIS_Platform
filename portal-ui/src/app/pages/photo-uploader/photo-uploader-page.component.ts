import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { createElement } from 'react';

import { environment } from '../../services/environment';
import { PhotoUploader } from '../../../photo-uploader-app/components/PhotoUploader/PhotoUploader';

@Component({
  selector: 'crg-photo-uploader-page',
  template: '<div class="photo-uploader-page" #react></div>',
  styleUrls: ['./photo-uploader-page.component.scss']
})
export class PhotoUploaderPageComponent implements OnInit, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
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
    this.root.render(createElement(PhotoUploader));
  }
}
