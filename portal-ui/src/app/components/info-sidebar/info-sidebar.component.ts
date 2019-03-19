import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'crg-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.css']
})
export class InfoSidebarComponent implements OnInit {

  @Input() isActive;

  constructor() { }

  ngOnInit() {
  }

}
