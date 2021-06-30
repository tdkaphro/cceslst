import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-video-reader',
  templateUrl: './video-reader.component.html',
  styleUrls: ['./video-reader.component.css']
})
export class VideoReaderComponent implements OnInit {

  fileContent: any;
  libelle: any;

  constructor(
    private dialogRef: MatDialogRef<VideoReaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.fileContent = data.fileContent;
      this.libelle = data.libelle;

      //window.open(this.fileContent);
    }

  ngOnInit() {
  }

}
