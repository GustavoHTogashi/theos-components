import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TheosLoaderComponent } from './theos-loader.component';

@Injectable()
export class TheosLoaderService {
  constructor(private _dialog: MatDialog) {}

  private _dialogRef: MatDialogRef<TheosLoaderComponent> = null;

  private _COMPONENT_DESTROY$: Subject<boolean>;

  open() {
    if (this._dialogRef) return;

    this._dialogRef = this._dialog.open(TheosLoaderComponent, {
      hasBackdrop: true,
      minWidth: '200px',
      maxWidth: '400px',
      backdropClass: 'th-mat-dialog__darkest',
      panelClass: 'th-mat-dialog__loader',
      disableClose: true,
    });

    this._COMPONENT_DESTROY$ = new Subject<boolean>();

    this._dialogRef
      .afterClosed()
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(() => {
        this._dialogRef = null;
        this._COMPONENT_DESTROY$.next();
        this._COMPONENT_DESTROY$.complete();
      });
  }

  close() {
    if (!this._dialogRef) return;
    this._dialogRef.close();
  }
}
