import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[number-only]',
})
export class NumberOnlyDirective {
  private regex: RegExp = new RegExp(/^[0-9]*$/g);
  private specialKeys: string[] = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'Enter',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'F12',
    'Delete',
  ];

  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) return;

    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) event.preventDefault();

    return Number(next);
  }
}
