import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { Calendar } from 'angular-feather/icons';
import { DateDirectiveModule } from 'src/components/_directives/date/date.directive.module';
import { TheosCalendarModule } from '../theos-calendar/theos-calendar.module';
import { TheosDateComponent } from './theos-date.component';

const ICONS = {
  Calendar,
};

@NgModule({
  declarations: [TheosDateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
	MatTooltipModule,
    FeatherModule.pick(ICONS),

    DateDirectiveModule,
    TheosCalendarModule,
  ],
  exports: [TheosDateComponent],
})
export class TheosDateModule {}
