import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { boundMethod } from 'autobind-decorator';

export type Direction = 'top' | 'right' | 'bottom' | 'left';

const cursors = {
  top: 'n-resize',
  right: 'e-resize',
  bottom: 's-resize',
  left: 'w-resize'
};

@Directive({
  selector: '[resizable-bar]'
})
export class ResizableBarDirective implements OnInit {
  @Input('resizable-bar') direction: Direction;

  initialCursor: string;

  initialPos: number;

  initialSize: number;

  resizeReady = false;

  cursor: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.initialCursor = this.el.nativeElement.style.cursor;
    this.cursor = cursors[this.direction];
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
    this.setResizeReadyState(this.testResizeZone(this.getPosFromE(e)));
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(e: MouseEvent) {
    this.setResizeReadyState(this.testResizeZone(this.getPosFromE(e)));
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setResizeReadyState(false);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (this.resizeReady) {
      this.initialPos = this.getPosFromE(e);
      this.initialSize = this.size;

      document.addEventListener('mousemove', this.onDocumentMouseMove);
      document.addEventListener('mouseup', this.onDocumentMouseOff);
      document.addEventListener('mouseleave', this.onDocumentMouseOff);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = this.cursor;
    }
  }

  @boundMethod
  private onDocumentMouseMove(e: MouseEvent) {
    this.size = this.initialSize - this.getPosFromE(e) + this.initialPos;
    window.dispatchEvent(new Event('resize'));
  }

  @boundMethod
  private onDocumentMouseOff() {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseOff);
    document.removeEventListener('mouseleave', this.onDocumentMouseOff);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  private testResizeZone(pos: number): boolean {
    const dragZoneSize = 3;
    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    let offset: number;

    if (this.direction === 'top') {
      offset = rect.top;
    }

    return pos >= offset && pos <= offset + dragZoneSize;
  }

  private setResizeReadyState(ready: boolean): void {
    if (this.resizeReady !== ready) {
      this.el.nativeElement.style.cursor = ready ? this.cursor : this.initialCursor;
      this.resizeReady = ready;
    }
  }

  private getPosFromE(e: MouseEvent): number {
    const x = e.screenX;
    const y = e.pageY;
    let pos: number;

    switch (this.direction) {
      case 'top':
        pos = y;
        break;
      case 'right':
        pos = x;
        break;
      case 'bottom':
        pos = document.body.clientHeight - y;
        break;
      case 'left':
        pos = document.body.clientWidth - x;
        break;
    }

    return pos;
  }

  private get size(): number {
    if (this.direction === 'top' || this.direction === 'bottom') {
      return this.el.nativeElement.offsetHeight;
    } else {
      return this.el.nativeElement.offsetWidth;
    }
  }

  private set size(size: number) {
    if (this.direction === 'top' || this.direction === 'bottom') {
      this.el.nativeElement.style.height = `${size}px`;
    } else {
      this.el.nativeElement.style.width = `${size}px`;
    }
  }
}
