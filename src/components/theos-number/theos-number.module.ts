import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { ChevronDown, ChevronUp } from 'angular-feather/icons';
import { NumberDirectiveModule } from '../_directives/number/number.module';
import { TheosNumberComponent } from './theos-number.component';

const ICONS = {
  ChevronUp,
  ChevronDown,
};

@NgModule({
  declarations: [TheosNumberComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NumberDirectiveModule,

    FeatherModule.pick(ICONS),
    MatTooltipModule,
  ],
  exports: [TheosNumberComponent],
})
export class TheosNumberModule {}
