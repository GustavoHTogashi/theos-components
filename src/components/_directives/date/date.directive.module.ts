import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateDirective } from './date.directive';

@NgModule({
  declarations: [DateDirective],
  imports: [CommonModule],
  exports: [DateDirective],
  providers: [],
})
export class DateDirectiveModule {}
