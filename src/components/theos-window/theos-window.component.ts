import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { LGPDConsentiment } from '../theos-lgpd-dialog/theos-lgpd-dialog.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-window',
  templateUrl: './theos-window.component.html',
  styleUrls: ['./theos-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosWindowComponent implements OnInit {
  @Input() id = 'THWindow';

  @Input() title = `title goes here`;
  @Input() windowStatus = WindowStatus.create;

  @Input() showRequiredHelper = true;
  @Input() organism: Organism = null;
  @Input() lgpdConsentiment: LGPDConsentiment = null;

  get organismName() {
    return this.organism.descricao;
  }

  consentimentEnum = LGPDConsentiment;

  @Output() search = new EventEmitter<any>();

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.window;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  handleSearch() {
    this.search.emit();
  }

  handleClose() {
    let routeArr = this._router.url.split('/');
    this._router.navigate([routeArr[routeArr.length - 2]]);
  }
}

export enum WindowStatus {
  create = 'Incluindo',
  read = 'Visualizando',
  update = 'Alterando',
}

export interface Organism {
  id: number;
  descricao: string;
  codigo: number;
}
