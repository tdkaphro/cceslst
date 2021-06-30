import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { LoaderInterceptorService } from './utils/loader/loader-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { PublicContainerComponent } from './components/public/public-container/public-container.component';
import { VitrineComponent } from './components/public/vitrine/vitrine.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PresentationComponent } from './components/public/presentation/presentation.component';
import { AvantagesComponent } from './components/public/avantages/avantages.component';
import { ModeUtilisationComponent } from './components/public/mode-utilisation/mode-utilisation.component';
import { CompositionComponent } from './components/public/composition/composition.component';
import { EntretienComponent } from './components/public/entretien/entretien.component';
import { ContactComponent } from './components/public/contact/contact.component';
import { SharedMaterialModule } from './shared/shared-material.module';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    PublicContainerComponent,
    VitrineComponent,
    FooterComponent,
    ContactComponent,
    EntretienComponent,
    CompositionComponent,
    ModeUtilisationComponent,
    AvantagesComponent,
    PresentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
    SharedMaterialModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.2)',
      backdropBorderRadius: '4px',
      primaryColour: 'var(--primary-color)',
      secondaryColour: 'var(--primary-color)',
      tertiaryColour: 'var(--primary-color)'
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  },
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
