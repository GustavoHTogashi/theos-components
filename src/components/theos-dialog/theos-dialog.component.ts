import { Component, EventEmitter, Input, Output } from '@angular/core';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-dialog',
  templateUrl: './theos-dialog.component.html',
  styleUrls: ['./theos-dialog.component.scss'],
})
export class TheosDialogComponent {
  @Input() id = 'THDialog';
  @Input() title = 'Theos dialog example';

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() help: EventEmitter<any> = new EventEmitter();

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.dialog;
}
