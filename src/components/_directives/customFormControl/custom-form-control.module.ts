import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomFormControlDirective } from './custom-form-control.directive';

@NgModule({
  declarations: [CustomFormControlDirective],
  imports: [CommonModule],
  exports: [CustomFormControlDirective],
  providers: [],
})
export class CustomFormControlModule {}
