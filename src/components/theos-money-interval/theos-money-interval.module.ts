import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MoneyDirectiveModule } from 'src/components/_directives/money/money.directive.module';
import { TheosInputModule } from '../theos-input/theos-input.module';
import { TheosMoneyIntervalComponent } from './theos-money-interval.component';

@NgModule({
  declarations: [TheosMoneyIntervalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TheosInputModule,
    MoneyDirectiveModule,
  ],
  exports: [TheosMoneyIntervalComponent],
})
export class TheosMoneyIntervalModule {}
