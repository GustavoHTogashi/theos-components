import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { ChevronDown } from 'angular-feather/icons';
import { CustomFormControlModule } from '../_directives/customFormControl/custom-form-control.module';
import { TheosSelectComponent } from './theos-select.component';

const ICONS = {
  ChevronDown,
};

@NgModule({
  declarations: [TheosSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

	CustomFormControlModule,

    FeatherModule.pick(ICONS),
    MatTooltipModule,
	MatDialogModule,
  ],
  exports: [TheosSelectComponent],
})
export class TheosSelectModule {}
