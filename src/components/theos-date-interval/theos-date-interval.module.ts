import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TheosCalendarComponent } from '../theos-calendar/theos-calendar.component';
import { TheosDateModule } from '../theos-date/theos-date.module';
import { TheosDateIntervalComponent } from './theos-date-interval.component';

@NgModule({
  declarations: [TheosDateIntervalComponent],
  imports: [CommonModule, ReactiveFormsModule, TheosDateModule],
  exports: [TheosDateIntervalComponent],
  entryComponents: [TheosCalendarComponent],
})
export class TheosDateIntervalModule {}
