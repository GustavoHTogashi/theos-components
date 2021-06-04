import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { TheosIconMenuComponent } from './theos-icon-menu.component';

@NgModule({
  declarations: [TheosIconMenuComponent],
  imports: [CommonModule, MatDialogModule, FeatherModule.pick(allIcons)],
  exports: [TheosIconMenuComponent],
})
export class TheosIconMenuModule {}
