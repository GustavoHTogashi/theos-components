import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TheosWindowComponent } from './theos-window.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';
import { Search, X } from 'angular-feather/icons';
import { RouterModule } from '@angular/router';

const ICONS = {
  X,
  Search,
};

@NgModule({
  declarations: [TheosWindowComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    HttpClientModule,
	FeatherModule.pick(ICONS),
	RouterModule
  ],
  exports: [TheosWindowComponent],
})
export class TheosWindowModule {}
