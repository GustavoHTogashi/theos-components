import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { WindowStatus } from 'src/components/theos-window/theos-window.component';
import { environment } from 'src/environments/environment';
import {
	COMPONENTS_CONFIGS,
	CONTROL_NAMES,
	CREATE_FORM,
	GET_CONTROL,
	GET_GROUP
} from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly WINDOW_ID = 'app';
  readonly WINDOW_TITLE = 'Tela App';
  windowStatus = WindowStatus.create;

  readonly CONTROL_NAMES = CONTROL_NAMES;
  readonly CONTROL = (controlName: string) =>
    GET_CONTROL(controlName, this._fg);
  readonly GROUP = (controlName: string) => GET_GROUP(controlName, this._fg);
  private _fg: FormGroup = CREATE_FORM(this._fb);
  readonly COMP_CONFIGS = COMPONENTS_CONFIGS(this.WINDOW_ID, this._fg);

  readonly PRODUCTION = environment.production;

  initialState = {};
  lastState = {};
  constructor(private _fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.initialState = this._fg.value;
    this.lastState = this._fg.value;
  }

  ngAfterViewInit(): void {
	setTimeout(() => {
		this.CONTROL(CONTROL_NAMES.select).setValue(1)
		this.CONTROL(CONTROL_NAMES.moneyInitial).setValue(1)
		this.CONTROL(CONTROL_NAMES.moneyFinal).setValue(2)
		this.CONTROL(CONTROL_NAMES.number).setValue(2)
		this.CONTROL(CONTROL_NAMES.date).setValue('2021-02-22')
		this.CONTROL(CONTROL_NAMES.dateInitial).setValue('2021-01-01')
		this.CONTROL(CONTROL_NAMES.dateFinal).setValue('2021-01-31')

	}, 2000)

    // setTimeout(() => {
    // 	this._fg.disable()
    // }, 1000)
    // setTimeout(() => {
    //   this.CONTROL(CONTROL_NAMES.dateInitial).setValue('1995-09-20');
    //   setTimeout(() => {
    //     this.CONTROL(CONTROL_NAMES.dateInitial).setValue(null);
    //     setTimeout(() => {
    //       this._validateForm(this._fg);
    //       setTimeout(() => {
    //         this._fg.disable();
    //         setTimeout(() => {
    //           this._fg.enable();
    //           setTimeout(() => {
    //             this.CONTROL(CONTROL_NAMES.dateInitial).setValue('1995-09-20');
    //             setTimeout(() => {
    //               this.CONTROL(CONTROL_NAMES.dateInitial).setValue(
    //                 '1995-09-20'
    //               );
    //               this.CONTROL(CONTROL_NAMES.dateFinal).setValue('1995-09-21');
    //               setTimeout(() => {
    //                 this._fg.reset(this.initialState);
    //                 this._fg.markAsPristine();
    //                 this._fg.markAsUntouched();
    //               }, 500);
    //             }, 500);
    //           }, 500);
    //         }, 500);
    //       }, 500);
    //     }, 500);
    //   }, 500);
    // }, 500);
  }

  private _validateForm(group: FormGroup) {
    group.markAllAsTouched();
    this.markAllAsDirty(group);
  }

  markAllAsDirty = (g: FormGroup) => {
    Object.keys(g.controls).forEach((key) => {
      const CONTROL = g.controls[key];
      if (CONTROL instanceof FormGroup) {
        this.markAllAsDirty(CONTROL as FormGroup);
        return;
      }

      CONTROL.markAsDirty();
      return;
    });
  };

  handleSearch() {}

  handleReset() {
    this._fg.reset(this.initialState);
    this._fg.markAsPristine();
    this._fg.markAsUntouched();
  }

  handleValidate() {
    this._validateForm(this._fg);
  }

  // ! DEBUG CONSOLE
  collapsed = false;
  uncollapsed = true;
  route = window.location.pathname.split('/').pop();
  //   get state() {
  //     const STATE_TEXT = JSON.stringify(this.initialState, null, 4);
  //     const CODE_COLORIZED_STATE = this._buildCodeColorizedState(STATE_TEXT);

  //     return this._sanitizer.bypassSecurityTrustHtml(CODE_COLORIZED_STATE);
  //   }

  state = {
    initial: () =>
      this._sanitizer.bypassSecurityTrustHtml(
        this._buildCodeColorizedState(
          JSON.stringify(this.initialState, null, 4)
        )
      ),
    current: () =>
      this._sanitizer.bypassSecurityTrustHtml(
        this._buildCodeColorizedState(JSON.stringify(this._fg.value, null, 4))
      ),
    last: () =>
      this._sanitizer.bypassSecurityTrustHtml(
        this._buildCodeColorizedState(JSON.stringify(this.lastState, null, 4))
      ),
  };

  //   get currentState() {
  //     const STATE_TEXT = JSON.stringify(this._fg.value, null, 4);
  //     const CODE_COLORIZED_STATE = this._buildCodeColorizedState(STATE_TEXT);

  //     return this._sanitizer.bypassSecurityTrustHtml(CODE_COLORIZED_STATE);
  //   }

  handleCollapse() {
    this.collapsed = !this.collapsed;
    this.uncollapsed = !this.uncollapsed;
  }

  handleItemCollapse(collapsed) {
    return (collapsed = !collapsed);
  }

  private _buildCodeColorizedState(text: string) {
    return text
      .replace(/true|false/g, (s) => `<span class="bool"> ${s}</span>`)
      .replace(/\d+(\.\d{1,2})?/g, (n) => `<span class="num">${n}</span>`)
      .replace(/\}|\{/g, (o) => `<span class="obj">${o}</span>`)
      .replace(/\]|\[/g, (a) => `<span class="arr">${a}</span>`)
      .replace(/null/g, (x) => `<span class="null">${x}</span>`);
    //   .replace(/(?<=\:\s)[^,]*/g, (t) => {
    //     if (t.startsWith('<span')) return t;
    //     return `<span class="txt">${t}</span>`;
    //   });
  }
}
