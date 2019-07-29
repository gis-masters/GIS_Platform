import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'crg-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SimpleDialogData) { }

}

export interface SimpleDialogData {
  title: string;
  approveBtnName: string;
}
