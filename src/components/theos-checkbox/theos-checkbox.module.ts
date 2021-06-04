import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TheosCheckboxComponent } from './theos-checkbox.component';
import { Check, HelpCircle } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { MatTooltipModule } from '@angular/material/tooltip';

const ICONS = {
  Check,
  HelpCircle
};

@NgModule({
  declarations: [TheosCheckboxComponent],
  imports: [CommonModule, ReactiveFormsModule, FeatherModule.pick(ICONS), MatTooltipModule],
  exports: [TheosCheckboxComponent],
})
export class TheosCheckboxModule {}
