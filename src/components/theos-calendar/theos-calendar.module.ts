import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp
} from 'angular-feather/icons';
import { TheosCalendarComponent } from './theos-calendar.component';

const ICONS = {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
};

@NgModule({
  declarations: [TheosCalendarComponent],
  imports: [CommonModule, FeatherModule.pick(ICONS)],
  exports: [TheosCalendarComponent],
  entryComponents: [TheosCalendarComponent]
})
export class TheosCalendarModule {}
