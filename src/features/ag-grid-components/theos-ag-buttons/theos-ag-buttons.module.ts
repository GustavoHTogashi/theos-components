import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { TheosAgButtonsComponent } from './theos-ag-buttons.component';

@NgModule({
  declarations: [TheosAgButtonsComponent],
  imports: [CommonModule, MatTooltipModule, FeatherModule.pick(allIcons)],
  exports: [TheosAgButtonsComponent],
})
export class TheosAgButtonsModule {}
