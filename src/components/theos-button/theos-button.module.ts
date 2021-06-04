import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { TheosButtonComponent } from './theos-button.component';

@NgModule({
  declarations: [TheosButtonComponent],
  imports: [CommonModule, FeatherModule.pick(allIcons)],
  exports: [TheosButtonComponent],
})
export class TheosButtonModule {}
