import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { Help } from '../../components/Help/Help';

@Component({
  selector: 'crg-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('helpReact', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  private renderReactElement() {
    render(createElement(withRegistry(registry)(Help)), this.ref.nativeElement);
  }
}
