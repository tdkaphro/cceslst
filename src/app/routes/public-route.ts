import { Routes } from '@angular/router';
import { PublicContainerComponent } from '../components/public/public-container/public-container.component';
import { VitrineComponent } from '../components/public/vitrine/vitrine.component';

export const publicRoutes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  {
    path: 'public',
    component: PublicContainerComponent,
    children: [
      { path: 'main', component: VitrineComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'public', pathMatch: 'full' }
];