import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { FeatherModule } from 'angular-feather';
import { Check, Search, X } from 'angular-feather/icons';
import { TheosButtonModule } from '../theos-button/theos-button.module';
import { TheosCheckboxModule } from '../theos-checkbox/theos-checkbox.module';
import { TheosDateModule } from '../theos-date/theos-date.module';
import { TheosInputModule } from '../theos-input/theos-input.module';
import { TheosNumberModule } from '../theos-number/theos-number.module';
import { TheosPaginationModule } from '../theos-pagination/theos-pagination.module';
import { TheosSelectModule } from '../theos-select/theos-select.module';
import { FocusDirectiveModule } from '../_directives/focus/focus.module';
import { TheosSearchDialogGenericComponent } from './theos-search-dialog-generic.component';
import { TheosSearchDialogComponent } from './theos-search-dialog.component';
import { TheosSearchDialogService } from './theos-search-dialog.service';




const ICONS = {
  X,
  Search,
  Check,
};

@NgModule({
  declarations: [TheosSearchDialogComponent, TheosSearchDialogGenericComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FeatherModule.pick(ICONS),
    PortalModule,

    AgGridModule.withComponents([]),

    TheosSelectModule,
    TheosInputModule,
    TheosButtonModule,
    TheosNumberModule,
    TheosDateModule,
    TheosPaginationModule,
    TheosCheckboxModule,

    MatDialogModule,
    FocusDirectiveModule,
  ],
  exports: [TheosSearchDialogComponent, TheosSearchDialogGenericComponent],
  providers: [TheosSearchDialogService],
})
export class TheosSearchDialogModule {}
