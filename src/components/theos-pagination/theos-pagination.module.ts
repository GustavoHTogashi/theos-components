import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheosPaginationComponent } from './theos-pagination.component';
import { FeatherModule } from 'angular-feather';
import { ChevronLeft, ChevronRight } from 'angular-feather/icons';

const ICONS = {
  ChevronLeft,
  ChevronRight,
};

@NgModule({
  declarations: [TheosPaginationComponent],
  imports: [CommonModule, FeatherModule.pick(ICONS)],
  exports: [TheosPaginationComponent]
})
export class TheosPaginationModule {}
