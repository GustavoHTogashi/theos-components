export const DIALOG_CONFIG = (
  size: DialogConfigSizesEnum = DialogConfigSizesEnum.SMALL
) => ({
  width: DIALOG_CONFIG_SIZES[size],
  backdropClass: 'th-mat-dialog__darker',
  panelClass: ['th-mat-dialog__no-padding'],
});

export enum DialogConfigSizesEnum {
  SMALL,
  MEDIUM,
  LARGE,
  EXTRA_LARGE,
}
export const DIALOG_CONFIG_SIZES = {
  [DialogConfigSizesEnum.SMALL]: '360px',
  [DialogConfigSizesEnum.MEDIUM]: '480px',
  [DialogConfigSizesEnum.LARGE]: '600px',
  [DialogConfigSizesEnum.EXTRA_LARGE]: '760px',
};
