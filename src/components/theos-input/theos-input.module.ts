import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { MoneyDirectiveModule } from 'src/components/_directives/money/money.directive.module';
import { TheosInputComponent } from './theos-input.component';


@NgModule({
  declarations: [TheosInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

	MatTooltipModule,
    NgxMaskModule.forRoot(),

    MoneyDirectiveModule,
  ],
  exports: [TheosInputComponent],
})
export class TheosInputModule {}
