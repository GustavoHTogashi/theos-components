import { Component, Input } from '@angular/core';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import { DEFAULT_CONFIG } from './theos-field-info.constants';
import { TheosFieldInfo } from './theos-field-info.interface';

@Component({
  selector: 'theos-field-info',
  templateUrl: './theos-field-info.component.html',
  styleUrls: ['./theos-field-info.component.scss'],
})
export class TheosFieldInfoComponent {
  @Input() config: TheosFieldInfo = DEFAULT_CONFIG;
  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.fieldInfo;
}
