import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { Help } from '../../components/Help/Help';

const HelpWithRegistry = withRegistry(registry)(Help);

@Component({
  selector: 'crg-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('helpReact', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  private renderReactElement() {
    this.root.render(createElement(HelpWithRegistry));
  }
}
