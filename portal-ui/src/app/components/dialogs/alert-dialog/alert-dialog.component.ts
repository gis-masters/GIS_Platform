import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'crg-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  constructor(public dialogRef: MatDialogRef<AlertDialogData>, @Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {}

  close(): void {
    this.dialogRef.close();
  }
}

export interface AlertDialogData {
  message: string;
}
