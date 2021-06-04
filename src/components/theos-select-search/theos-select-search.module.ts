import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { ChevronDown, Search, X } from 'angular-feather/icons';
import { TheosInputModule } from '../theos-input/theos-input.module';
import { TheosSelectSearchComponent } from './theos-select-search.component';

const ICONS = {
  X,
  ChevronDown,
  Search,
};

@NgModule({
  declarations: [TheosSelectSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FeatherModule.pick(ICONS),
    MatMenuModule,
    MatTooltipModule,
	MatInputModule,
	TheosInputModule,
  ],
  exports: [TheosSelectSearchComponent],
})
export class TheosSelectSearchModule {}
