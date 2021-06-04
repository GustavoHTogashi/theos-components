import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoneyDirective } from './money.directive';


@NgModule({
  declarations: [MoneyDirective],
  imports: [CommonModule],
  exports: [MoneyDirective],
  providers: [],
})
export class MoneyDirectiveModule {}
