import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  templateUrl: './theos-loader.component.html',
  styleUrls: ['./theos-loader.component.scss'],
})
export class TheosLoaderComponent implements OnInit, OnDestroy {
  @Input() id = 'THLoader';

  prefix = THEOS_COMPONENTS_PREFIXES.loader;

  timeout = 10000;

  private _timer: any;

  messages = {
    loading: `Carregando...`,
    takingLonger: `O processo está demorando mais que o esperado, aguarde...`,
  };

  timerSender$ = new Subject<boolean>();

  ngOnInit(): void {
    // TODO Explorar alteranativa com RXJS Scheduler;
    this._timer = setTimeout(() => this.timerSender$.next(true), this.timeout);
  }

  ngOnDestroy(): void {
    clearTimeout(this._timer);
    this.timerSender$.complete();
  }
}
