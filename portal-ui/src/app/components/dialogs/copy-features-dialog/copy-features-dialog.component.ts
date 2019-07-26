import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'crg-copy-features-dialog',
  templateUrl: './copy-features-dialog.component.html',
  styleUrls: ['./copy-features-dialog.component.css']
})
export class CopyFeaturesDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log('--------', this.data);
  }

}
