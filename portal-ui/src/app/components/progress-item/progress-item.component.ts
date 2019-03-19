import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crg-progress-item',
  templateUrl: './progress-item.component.html',
  styleUrls: ['./progress-item.component.css']
})
export class ProgressItemComponent implements OnInit {
  isDone = false;
  isHide = false;

  constructor() { }

  ngOnInit() {
  }

  clickByLeft() {
    this.isDone = !this.isDone;
  }

  closeNotice() {
    this.isHide = true;
  }
}
