import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { AG_GRID_LOCALE } from 'src/features/ag-grid-components/theos-ag-resources/theos-ag-locale.res';
import { SearchGenericConfig } from './theos-search-dialog-generic.component';
import { SearchConfig } from './theos-search-dialog.component';


@Injectable()
export class TheosSearchDialogService {
  private _dialogIsOpen = false;

  private _dialogRef = null;

  constructor(private _matDialog: MatDialog) {}

  open(component: any, data: SearchGenericConfig | SearchConfig) {
    const HTML = document.querySelector('html');
    HTML.scrollTop = 0;

    this._dialogIsOpen = true;

    return (this._dialogRef = this._matDialog.open(component, {
      maxWidth: '1140px',
      hasBackdrop: true,
      backdropClass: 'th-mat-dialog__darker',
      panelClass: 'th-mat-dialog__no-padding',
      data: data,
      autoFocus: false,
    }));
  }

  close() {
    this._dialogRef.close();
  }

  createGridOptions() {
    return {
      overlayLoadingTemplate: 'Digite algo para pesquisar',
      defaultColDef: {
        resizable: true,
        sortable: true,
        suppressMovable: true,
        suppressSizeToFit: true,
      },
      localeText: AG_GRID_LOCALE.localeText,
      rowSelection: 'single',
      suppressPropertyNamesCheck: true,
      suppressCellSelection: true,
      rowMultiSelectWithClick: false,
    } as GridOptions;
  }
}
