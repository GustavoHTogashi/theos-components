import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NumberDirective } from './number.directive';

@NgModule({
  declarations: [NumberDirective],
  imports: [CommonModule, PlatformModule],
  exports: [NumberDirective],
  providers: [],
})
export class NumberDirectiveModule {}
