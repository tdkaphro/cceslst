import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule, MatTooltipModule, MatMenuModule, MatStepperModule, MatSelectModule,
  MatButtonToggleModule, MatListModule, MatIconModule, MatSidenavModule, MatInputModule,
  MatButtonModule, MatFormFieldModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule,
  MatRadioModule,
  MatDividerModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatCardModule,
  MatBadgeModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatStepperModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDividerModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatBadgeModule
]
})
export class SharedMaterialModule { }
