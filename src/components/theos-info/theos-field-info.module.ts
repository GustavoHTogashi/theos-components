import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TheosFieldInfoComponent } from './theos-field-info.component';

@NgModule({
  declarations: [TheosFieldInfoComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [TheosFieldInfoComponent],
  providers: [],
})
export class TheosFieldInfoModule {}
