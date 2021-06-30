import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VideoReaderComponent } from 'src/app/shared/video-reader/video-reader.component';
import { SharedMaterialModule } from './shared-material.module';
import { PhotoPlayerComponent } from 'src/app/shared/photo-player/photo-player.component';
import { TraitementMessagesPopupComponent } from 'src/app/shared/traitement-messages-popup/traitement-messages-popup.component';
import { PopupFeedbackComponent } from './popup-feedback/popup-feedback.component';
import { ContainerResolver } from './resolver/container.resolver';
import { ImageViewerModule } from "ngx-image-viewer"; @NgModule({
  declarations: [
    VideoReaderComponent,
    PhotoPlayerComponent,
    TraitementMessagesPopupComponent,
    PopupFeedbackComponent
  ],
  imports: [
    ImageViewerModule.forRoot(),
    CommonModule,
    SharedMaterialModule
  ],
  exports: [
    HttpClientModule,
    VideoReaderComponent,
    PhotoPlayerComponent,
    TraitementMessagesPopupComponent,
    PopupFeedbackComponent
  ],
  entryComponents: [
    VideoReaderComponent,
    PhotoPlayerComponent,
    TraitementMessagesPopupComponent,
    PopupFeedbackComponent
  ],
  providers: [
    ContainerResolver
  ],
})
export class SharedModule { }
