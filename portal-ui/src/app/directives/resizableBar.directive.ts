import { Directive, ElementRef, HostListener, Input } from '@angular/core';

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
export class ResizableBarDirective {
  @Input('resizable-bar') direction: Direction;

  initialCursor: string;

  initialPos: number;

  initialSize: number;

  resizeReady: boolean = false;

  cursor: string;

  constructor(private el: ElementRef) {
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseOff = this.onDocumentMouseOff.bind(this);
  }

  ngOnInit() {
    this.initialCursor = this.el.nativeElement.style.cursor;
    this.cursor = cursors[this.direction];
  }

  @HostListener('mousemove', ['$event']) onMouseMove (e: MouseEvent) {
    this.setResizeReadyState(this.testResizeZone(this.getPosFromE(e)));
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(e: MouseEvent){
    this.setResizeReadyState(this.testResizeZone(this.getPosFromE(e)));
  }

  @HostListener('mouseleave') onMouseLeave () {
    this.setResizeReadyState(false);
  }

  @HostListener('mousedown', ['$event']) onMouseDown (e: MouseEvent) {
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

  onDocumentMouseMove (e: MouseEvent) {
    this.size = this.initialSize - this.getPosFromE(e) + this.initialPos;
    window.dispatchEvent(new Event('resize'));
  }

  onDocumentMouseOff () {
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseOff);
    document.removeEventListener('mouseleave', this.onDocumentMouseOff);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  testResizeZone (pos: number):boolean {
    const dragZoneSize = 3;

    let offset: number;

    if (this.direction === 'top') {
      offset = this.el.nativeElement.offsetTop;
    }

    return pos >= offset && pos <= offset + dragZoneSize;
  }

  setResizeReadyState (ready: boolean): void {
    if (this.resizeReady !== ready) {
      this.el.nativeElement.style.cursor = ready ? this.cursor : this.initialCursor;
      this.resizeReady = ready;
    }
  }

  getPosFromE (e: MouseEvent): number {
    let pos: number;

    switch(this.direction) {
      case 'top':
        pos = e.y;
        break;
      case 'right':
        pos = e.x;
        break;
      case 'bottom':
        pos = document.body.clientHeight - e.y;
        break;
      case 'left':
        pos = document.body.clientWidth - e.x;
        break;
    }

    return pos;
  }

  get size (): number {
    if (this.direction === 'top' || this.direction === 'bottom') {
      return this.el.nativeElement.offsetHeight;
    } else {
      return this.el.nativeElement.offsetWidth;
    }
  }

  set size (size: number) {
    if (this.direction === 'top' || this.direction === 'bottom') {
      this.el.nativeElement.style.height = `${size}px`;
    } else {
      this.el.nativeElement.style.width = `${size}px`;
    }
  }
}
