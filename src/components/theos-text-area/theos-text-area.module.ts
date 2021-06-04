import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TheosTextAreaComponent } from './theos-text-area.component';

@NgModule({
  declarations: [TheosTextAreaComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TheosTextAreaComponent],
})
export class TheosTextAreaModule {}
