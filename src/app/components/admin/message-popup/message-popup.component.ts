import { AnonymsMessage } from 'src/app/models/anonyms-message.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {

  message: AnonymsMessage

  constructor(
    private dialogRef: MatDialogRef<MessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.message = data.message;
  }

  ngOnInit() {
  }

}
