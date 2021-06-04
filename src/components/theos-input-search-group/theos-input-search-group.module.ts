import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FeatherModule } from 'angular-feather';
import { Search, X } from 'angular-feather/icons';
import { TheosSearchDialogComponent } from '../theos-search-dialog/theos-search-dialog.component';
import { TheosSearchDialogModule } from '../theos-search-dialog/theos-search-dialog.module';
import { NumberOnlyDirectiveModule } from '../_directives/number-only/numberonly.module';
import { TheosInputSearchGroupComponent } from './theos-input-search-group.component';

const ICONS = {
  X,
  Search,
};

@NgModule({
  declarations: [TheosInputSearchGroupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TheosSearchDialogModule,
    MatDialogModule,
    FeatherModule.pick(ICONS),

    TheosSearchDialogModule,
    NumberOnlyDirectiveModule,
  ],
  entryComponents: [TheosSearchDialogComponent],
  exports: [TheosInputSearchGroupComponent],
})
export class TheosInputSearchGroupModule {}
