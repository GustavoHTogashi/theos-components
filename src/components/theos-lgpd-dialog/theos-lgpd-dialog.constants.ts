import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

export const THEOS_LGPD_DIALOG_CONFIG: MatDialogConfig = {
  width: '960px',
  height: '518px',
  disableClose: true,
  backdropClass: 'th-mat-dialog__darker',
  panelClass: ['th-mat-dialog__no-padding'],
};

export const THEOS_LGPD_ALERT_CONFIG: MatDialogConfig = {
  width: '600px',
  disableClose: true,
  backdropClass: 'th-mat-dialog__darker',
  panelClass: ['th-mat-dialog__no-padding'],
};

export const LGPD_CONTROL_NAME = {
  ID: 'id',
  CODIGO_ORIGEM: 'codigoOrigem',
  TIPO_DE_CONSENTIMENTO: 'tipoDeConsentimento',
  CHAVE_BIOMETRIA: 'chaveBiometria',
  SERIAL_LEITOR_BIOMETRICO: 'serialLeitorBiometrico',
  TELA_ACEITE_ID: 'telaAceiteId',
};

export enum LGPDConsentiment {
  None = 0,
  Print = 1,
  Bio = 2,
}

export const PARAMETERS_DATA = new InjectionToken<{}>('PARAMETERS_DATA');
