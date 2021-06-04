import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TheosLoaderComponent } from './theos-loader.component';
import { TheosLoaderService } from './theos-loader.service';

@NgModule({
  declarations: [TheosLoaderComponent],
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  providers: [TheosLoaderService],
  entryComponents: [TheosLoaderComponent],
})
export class TheosLoaderModule {}
