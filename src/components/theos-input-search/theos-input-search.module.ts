import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherModule } from 'angular-feather';
import { Search, X } from 'angular-feather/icons';
import { TheosSearchDialogComponent } from '../theos-search-dialog/theos-search-dialog.component';
import { TheosSearchDialogModule } from '../theos-search-dialog/theos-search-dialog.module';
import { TheosInputSearchComponent } from './theos-input-search.component';

const ICONS = {
	X,
	Search
}

@NgModule({
  declarations: [TheosInputSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
	HttpClientModule,
	
	MatDialogModule,
	MatProgressSpinnerModule,
	FeatherModule.pick(ICONS),

	TheosSearchDialogModule,
  ],
  entryComponents: [TheosSearchDialogComponent],
  exports: [TheosInputSearchComponent],
})
export class TheosInputSearchModule {}
