import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { HelpCircle, X } from 'angular-feather/icons';
import { TheosDialogComponent } from './theos-dialog.component';

const ICONS = {
  X,
  HelpCircle,
};

@NgModule({
  declarations: [TheosDialogComponent],
  exports: [TheosDialogComponent],
  entryComponents: [TheosDialogComponent],
  imports: [CommonModule, FeatherModule.pick(ICONS)],
})
export class TheosDialogModule {}
