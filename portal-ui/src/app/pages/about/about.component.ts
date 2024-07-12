import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { Help } from '../../components/Help/Help';
import { registry } from '../../services/di-registry';

const HelpWithRegistry = withRegistry(registry)(Help);

@Component({
  selector: 'crg-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('helpReact', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
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

  private renderReactElement() {
    this.root?.render(createElement(HelpWithRegistry));
  }
}
