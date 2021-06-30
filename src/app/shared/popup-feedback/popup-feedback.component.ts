import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-popup-feedback',
  templateUrl: './popup-feedback.component.html',
  styleUrls: ['./popup-feedback.component.css']
})
export class PopupFeedbackComponent implements OnInit {

  message: string;
  title: string;
  showAction: boolean;
  color: any;
  bg_color: any;
  closeResult: string;

  constructor(private dialogRef: MatDialogRef<PopupFeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
    this.showAction = data.showAction;
    this.color = data.color;
    this.bg_color = data.bg_color;
  }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }
  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
