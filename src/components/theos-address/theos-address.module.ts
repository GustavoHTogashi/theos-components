import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { FeatherModule } from 'angular-feather';
import { Map } from 'angular-feather/icons';
import { TheosAgButtonsComponent } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.component';
import { TheosAgButtonsModule } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.module';
import { TheosButtonModule } from '../theos-button/theos-button.module';
import { TheosCheckboxModule } from '../theos-checkbox/theos-checkbox.module';
import { TheosDialogModule } from '../theos-dialog/theos-dialog.module';
import { TheosInputModule } from '../theos-input/theos-input.module';
import { TheosSelectModule } from '../theos-select/theos-select.module';
import { TheosAddressComponent } from './theos-address.component';


const ICONS = {
  Map,
};

@NgModule({
  declarations: [TheosAddressComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TheosButtonModule,
    TheosDialogModule,
    TheosSelectModule,
    TheosInputModule,
    TheosCheckboxModule,
    TheosAgButtonsModule,
    AgGridModule.withComponents([TheosAgButtonsComponent]),
    MatTooltipModule,
    FeatherModule.pick(ICONS),
  ],
  exports: [TheosAddressComponent],
  providers: [],
})
export class TheosAddressModule {}
