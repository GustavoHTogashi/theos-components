import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './numberonly.directive';

@NgModule({
  declarations: [NumberOnlyDirective],
  imports: [CommonModule],
  exports: [NumberOnlyDirective],
})
export class NumberOnlyDirectiveModule {}
