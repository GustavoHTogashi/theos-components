import { CurrencyPipe, getCurrencySymbol } from '@angular/common';
import {
	Directive,
	ElementRef,
	HostListener,
	Input,
	OnInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';

@Directive({
  selector: 'input[money]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MoneyDirective,
      multi: true,
    },
  ],
})
export class MoneyDirective implements OnInit {
  // ? CONFIG
  @Input() maskType = 'symbol'; // ? symbol (R$), code (BRL), or hide (hide it) - default is symbol;
  @Input() decimalDigits = 2; // ? default is .00 (2 digits after dot);

  private _onTouched: any;
  private _onChange: any;

  private _currencyCode = 'BRL';
  private _currencyDisplay = 'symbol';
  private _currencyDigitsInfo = '';
  private _locale = 'pt-BR';

  private _cursorPos = 0;
  //   private decimalCursorPos = 0;
  private _decimalSize = 0;

  private _decimalSymbol = '';
  private _thousandSymbol = '';
  private _currencySymbolLength = 0;

  private _validNumberKeys = [...range(48, 57, 1), ...range(96, 105, 1)];
  private _validKeys = [
    ...(<string[]>Object.values(specialKeys)),
    ...(<string[]>Object.values(navigationKeys)),
    ...(<string[]>Object.values(separatorKeys)),
    ...(<string[]>Object.values(ignoreKeys)),
  ];
  private _deleteKeys = [
    'deleteContentForward',
    'deleteWordForward',
    'deleteWordBackward',
    'deleteByCut',
    'insertFromPaste',
  ];
  private _negativeKeys = [...(<string[]>Object.values(negativeKeys))];
  private _positiveKeys = [...(<string[]>Object.values(positiveKeys))];

  private _valueAsNumber = null;

  private _inDecimalMode = false;
  //   private isFirstClick = true;

  private _input: HTMLInputElement;

  private _currencyPipe = new CurrencyPipe(this._locale);
  private _isPristine = true;

  constructor(private _el: ElementRef) {}

  ngOnInit(): void {
    this._input = this._el.nativeElement;
    this._input.style.textAlign = 'right';
    this._input.addEventListener('mouseup', (ev) => {
      ev.preventDefault();
      return false;
    });
    this._input.addEventListener('drop', (ev) => {
      ev.preventDefault();
      return false;
    });

    this._currencyDigitsInfo = `1.${this.decimalDigits}-${this.decimalDigits}`;
    this._currencyDisplay = this.maskType;

    this._decimalSize = Number(this._currencyDigitsInfo.split('-')[1]);
    this._currencySymbolLength =
      this.maskType.length !== 0
        ? getCurrencySymbol(this._currencyCode, 'narrow', this._locale).length
        : -1;

    this._decimalSymbol = this.getDecimalSymbol();
    this._thousandSymbol = this.getThousandSymbol();

    this._cursorPos = this._currencySymbolLength + 2;
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  writeValue(value: any): void {
    value
      ? (this._input.value = this.asMoney(parseFloat(value)))
      : (this._input.value = '');

    value && value !== null && value > 0
      ? this._input.setSelectionRange(
          this._currencySymbolLength + 1,
          this._input.value.length,
          'forward'
        )
      : this._input.setSelectionRange(
          this._currencySymbolLength + 2,
          this._currencySymbolLength + 2,
          'forward'
        );
  }

  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  @HostListener('focus', ['$event'])
  onFocus($event: any) {
    if(this._onTouched) this._onTouched();
    this.setValueAsNumber();
    !this._input.value && this.resetToDefaultState();

    if (!this.isMobile()) {
      this._input.selectionStart =
        this._currencySymbolLength +
        (this._input.value.indexOf('-') === -1 ? 1 : 2);
      this._input.selectionEnd = this._input.value.length;
    } else {
      if (this._input.selectionStart < 3) {
        this._input.selectionStart = this._input.selectionEnd =
          this._currencySymbolLength + 1;
      }
    }
  }

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    this.onFocus($event);

    if ($event.detail > 1) {
      if (!this.isMobile()) {
        this._input.selectionStart = this._currencySymbolLength + 2;
        this._input.selectionEnd = this._currencySymbolLength + 2;
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    const { value: VALUE } = this._input;
    const EMPTY_VALUE = this.asMoney(0);

    this._cursorPos = this._currencySymbolLength + 2;

    if (VALUE === EMPTY_VALUE && this._isPristine) {
      this._input.value = null;
      return;
    }
  }

  @HostListener('input', ['$event'])
  onInput($e: any) {
    if (this._isPristine) this._isPristine = false;
    let $event = null;

    if ($e.inputType === 'deleteContentBackward') {
      $event = { key: 'Backspace', keyCode: 8 };
    } else {
      // Se for delete ou recortar ou colar
      if (this._deleteKeys.indexOf($e.inputType) !== -1) {
        $event = { key: 'Delete', keyCode: 46 };
      } else {
        // Se for vírgula ou ponto
        if (
          $e.data &&
          ($e.data.indexOf(',') !== -1 || $e.data.indexOf('.') !== -1)
        ) {
          this._input.value =
            typeof this._valueAsNumber === 'string'
              ? this._valueAsNumber
              : this.asMoney(this._valueAsNumber);
          this._onChange(this._valueAsNumber);
          if (
            $e.data[$e.data.length - 1] === ',' ||
            $e.data[$e.data.length - 1] === '.'
          ) {
            this._cursorPos = this._input.value.length - this._decimalSize;
          } else {
            this._cursorPos = this._input.selectionStart - 1;
          }
          this._input.setSelectionRange(
            this._cursorPos,
            this._cursorPos,
            'forward'
          );
          this.blockEvent($e);
          return;
        } else {
          $event = {
            key: $e.data,
            keyCode: $e.data.charCodeAt(0) ? $e.data.charCodeAt(0) : null,
          };
        }
      }
    }
    // Se for caractere numérico
    if (this._validNumberKeys.includes($event.keyCode)) {
      let stringNumber = this.proccessInsert(this._input.value, '');
      this._valueAsNumber = Number(stringNumber);
      this._valueAsNumber =
        this._input.value.indexOf('-') >= 0
          ? 0 - this._valueAsNumber
          : this._valueAsNumber;
      let money = this.asMoney(this._valueAsNumber);
      // Verifica a posição do cursor (se é no decimal ou no inteiro)
      this._input.selectionStart === 1
        ? (this._cursorPos = money.length - (this._decimalSize + 1))
        : (this._cursorPos =
            this._input.selectionStart >=
            this._input.value.length - this._decimalSize
              ? this._input.selectionStart
              : money.length - this._input.value.length === 1 &&
                stringNumber[0] !== '0'
              ? this._input.selectionStart + 1
              : stringNumber[0] !== '0'
              ? this._input.selectionStart
              : this._input.selectionStart - 1);

      this._input.value = money;
      this._onChange(this._valueAsNumber);
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
      this.blockEvent($e);
      return;
    } else if (this._validKeys.includes($event.key)) {
      // Se for caractere separador ou especial ou function
      if (this.isSpecialKeys($event)) {
        this.processSpecial($e, $event);
        this.blockEvent($e);
        return;
      } else if (this.isFunctionKeys($event)) return;
    } else if (this._negativeKeys.includes($event.key)) {
      // Se for caractere '-'
      let stringNumber = this.proccessInsert(this._input.value, '');
      this._valueAsNumber = Number(stringNumber);
      if (this._input.value.charAt(0) !== '-') {
        if (this._valueAsNumber === 0) {
          this._cursorPos = this._currencySymbolLength + 3;
        } else {
          this._cursorPos = this._input.selectionStart;
        }
      } else {
        if (this._valueAsNumber === 0) {
          this._cursorPos = this._currencySymbolLength + 3;
        } else {
          this._cursorPos = this._input.selectionStart - 1;
        }
      }
      this._valueAsNumber = -this._valueAsNumber;
      this._input.value =
        (this._valueAsNumber === 0 ? '-' : '') +
        this.asMoney(this._valueAsNumber);
      this._onChange(this._valueAsNumber);
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
      this.blockEvent($e);
      return;
    } else if (this._positiveKeys.includes($event.key)) {
      // Se for caractere '+'
      let stringNumber = this.proccessInsert(this._input.value, '');
      this._valueAsNumber = Number(stringNumber);
      if (this._input.value.charAt(0) === '-') {
        if (this._valueAsNumber === 0) {
          this._cursorPos = this._currencySymbolLength + 2;
        } else {
          this._cursorPos = this._input.selectionStart - 2;
        }
      } else {
        if (this._valueAsNumber === 0) {
          this._cursorPos = this._currencySymbolLength + 2;
        } else {
          this._cursorPos = this._input.selectionStart - 1;
        }
      }
      this._input.value = this.asMoney(this._valueAsNumber);
      this._onChange(this._valueAsNumber);
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
      this.blockEvent($e);
      return;
    } else {
      // Se for caractere dead
      this._input.value =
        typeof this._valueAsNumber === 'string'
          ? this._valueAsNumber
          : this.asMoney(this._valueAsNumber);
      this._onChange(this._valueAsNumber);
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
      this.blockEvent($e);
      return;
    }
  }

  @HostListener('keydown', ['$event'])
  onkeydown($event: KeyboardEvent) {
    // Navegação por setas (left e right)
    this._validKeys.includes($event.key) && this.isNavigationKeys($event)
      ? this.processNavigation($event, $event)
      : noop();
  }

  @HostListener('keyup', ['$event'])
  onkeyup($event: KeyboardEvent) {
    if (
      this._currencySymbolLength <= 0 &&
      this.isMobile() &&
      this._input.selectionStart === 0
    ) {
      this._input.selectionStart = this._input.selectionEnd = 1;
    } else {
      // Se no keyup a posição do cursor for menor que 3 (cursor está no "R$|" ou "R|$" ou "|R$"), o cursor é posicionado no "|0,00"
      this._currencySymbolLength > 0 &&
      this._input.selectionStart < this._currencySymbolLength + 1
        ? (this._input.selectionStart = this._input.selectionEnd =
            this._currencySymbolLength + 2)
        : noop();
      if (this.isMobile())
        this._input.selectionStart = this._input.selectionEnd = this._cursorPos;
    }
  }

  private processNavigation($e: any, $event: any) {
    let selectionInterval =
      this._input.selectionEnd - this._input.selectionStart;
    switch ($event.key) {
      case navigationKeys.left:
        if ($event.shiftKey) {
          if (
            this._input.selectionStart - 1 <
            this._currencySymbolLength +
              (this._input.value.indexOf('-') === -1 ? 1 : 2)
          ) {
            this.blockEvent($e);
          } else {
            this._inDecimalMode =
              this._input.selectionStart <=
              this._input.value.length - this._decimalSize
                ? false
                : true;
          }
        } else {
          if (selectionInterval === 0) {
            if (
              this._input.selectionStart <=
              this._currencySymbolLength +
                (this._input.value.indexOf('-') === -1 ? 1 : 2)
            ) {
              this.blockEvent($e);
              break;
            } else {
              this._cursorPos = $event.ctrlKey
                ? this._currencySymbolLength + 1
                : this._input.selectionEnd - 1;
              this._input.selectionEnd <
              this._input.value.length - this._decimalSize + 1
                ? (this._inDecimalMode = false)
                : noop();
              this._input.selectionEnd >=
              this._input.value.length - this._decimalSize + 1
                ? (this._inDecimalMode = true)
                : noop();
            }
          }
        }
        break;
      case navigationKeys.right:
        if ($event.shiftKey) {
          if (this._input.selectionStart + 1 < this._currencySymbolLength + 1) {
            this.blockEvent($e);
          } else {
            this._input.selectionStart >
            this._input.value.length - this._decimalSize
              ? (this._inDecimalMode = true)
              : (this._inDecimalMode = false);
          }
        } else {
          if (selectionInterval === 0) {
            if (this._input.selectionStart >= this._input.value.length) {
              this.blockEvent($e);
            } else {
              this._cursorPos = $event.ctrlKey
                ? this._input.value.length
                : this._input.selectionEnd - 1;
              this._input.selectionEnd <
              this._input.value.length - this._decimalSize - 1
                ? (this._inDecimalMode = false)
                : noop();
              this._input.selectionEnd >=
              this._input.value.length - this._decimalSize - 1
                ? (this._inDecimalMode = true)
                : noop();
            }
          }
        }
        break;
      case navigationKeys.down:
      case navigationKeys.up:
        this.blockEvent($e);
      case navigationKeys.home:
        this._cursorPos = this._currencySymbolLength + 1;
        this._input.setSelectionRange(
          this._cursorPos,
          this._cursorPos,
          'forward'
        );
        this.blockEvent($e);
        break;
      case navigationKeys.a:
        $event.ctrlKey
          ? this._input.setSelectionRange(
              this._currencySymbolLength + 1,
              this._input.value.length,
              'forward'
            )
          : noop();
        this._cursorPos = this._input.selectionStart;
        this.blockEvent($e);
        break;
      default:
        break;
    }
  }

  private processSpecial($e: any, $event: any) {
    switch ($event.key) {
      case specialKeys.backspace:
        // ? apagando 1
        if (
          this._input.selectionEnd - this._input.selectionStart === 0 &&
          Number(this.proccessInsert(this._input.value, '')) > 0
        ) {
          // Backspace na ',' e no 'decimal' (... ,00)
          if (
            this._input.selectionStart >=
            this._input.value.length - this._decimalSize
          ) {
            // Backspace na ','
            if (
              this._input.selectionStart ===
              this._input.value.length - this._decimalSize
            ) {
              this._input.value = this.addCharByIndex(
                this._input.value,
                ',',
                this._input.selectionStart
              );
              this._cursorPos =
                this._input.value.length - (this._decimalSize + 1);
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'forward'
              );
            } else {
              // Backspace no 'decimal'
              if (this._input.value.indexOf(',') !== -1) {
                var posAdd =
                  this._input.selectionStart -
                  (this._input.value.length - this._decimalSize);
                this._valueAsNumber = Number(
                  this.proccessInsert(
                    this.addCharByIndex(
                      this._input.value,
                      '0',
                      this._input.selectionStart
                    ),
                    ''
                  )
                );
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
                this._input.value = this.asMoney(this._valueAsNumber);
                this._cursorPos =
                  this._input.value.length + posAdd - (this._decimalSize + 1);
                this._input.setSelectionRange(
                  this._cursorPos,
                  this._cursorPos,
                  'forward'
                );
              } else {
                // Backspace em um intervalo selecionado
                this._valueAsNumber = Number(
                  this.proccessInsert(this._input.value, '')
                );
                this._input.value = this.asMoney(this._valueAsNumber);
                this._cursorPos =
                  this._input.value.length - this._decimalSize - 1;
                this._input.setSelectionRange(
                  this._cursorPos,
                  this._cursorPos,
                  'forward'
                );
              }
            }
            let stringNumber = this.proccessInsert(this._input.value, '');
            this._valueAsNumber = Number(stringNumber);
            this._valueAsNumber =
              this._input.value.indexOf('-') >= 0
                ? 0 - this._valueAsNumber
                : this._valueAsNumber;
            this._onChange(this._valueAsNumber);
            this.blockEvent($e);
            break;
          } else {
            // Backspace no 'R$ 00.000.000' (R$ 00.000.000 ...)
            const range = this._input.selectionEnd - this._input.selectionStart;
            this._cursorPos = this._input.selectionStart;
            var oldValue = this._input.value;

            // Se o valor removido for '$' ou 'R' ou ' '
            if (
              ['R', '$', undefined].indexOf(
                this._input.value[this._input.selectionStart - 1]
              ) !== -1
            ) {
              let stringNumber =
                range > 0
                  ? this.proccessInsert(this.asMoney(0), '')
                  : this.proccessInsert(this._input.value, '');
              this._valueAsNumber = Number(stringNumber);
              this._valueAsNumber =
                this._input.value.indexOf('-') >= 0
                  ? 0 - this._valueAsNumber
                  : this._valueAsNumber;
              let money = this.asMoney(this._valueAsNumber);
              this._input.value = money;
              this._onChange(this._valueAsNumber);
              this._cursorPos =
                this._currencySymbolLength +
                (this._input.value.charAt(0) !== '-' ? 1 : 2);
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'forward'
              );
              this.blockEvent($e);
              break;
            } else {
              let stringNumber =
                range > 0
                  ? this.proccessInsert(this.asMoney(0), '')
                  : this.proccessInsert(this._input.value, '');
              let currentValueAsNumber = Number(stringNumber);
              // Se o valor removido for um valor numérico
              if (
                this._valueAsNumber !== this.asMoney(currentValueAsNumber) &&
                this._valueAsNumber !== currentValueAsNumber
              ) {
                this._valueAsNumber = currentValueAsNumber;
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
              } else {
                // Se o valor removido for '.', remove o próximo valor numérico
                stringNumber = this.proccessInsert(
                  this.removeCharByIndex(
                    this.asMoney(currentValueAsNumber),
                    this._cursorPos - 1
                  ),
                  ''
                );
                currentValueAsNumber = Number(stringNumber);
                this._valueAsNumber = currentValueAsNumber;
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
              }
              let money = this.asMoney(this._valueAsNumber);
              this._input.value = money;
              this._onChange(this._valueAsNumber);
              this._cursorPos =
                this._valueAsNumber === 0
                  ? this._currencySymbolLength + 2
                  : oldValue.length === this._input.value.length
                  ? this._cursorPos
                  : this._cursorPos - 1;
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'forward'
              );
              this.blockEvent($e);
              break;
            }
          }
          // ? apagando tudo
        } else if (
          !this._input.value ||
          this._input.value === null ||
          this._input.value === '' ||
          Number(this.proccessInsert(this._input.value, '')) <= 0
        ) {
          this._valueAsNumber = 0;
          this._cursorPos = this._currencySymbolLength + 2;
          this._input.value = this.asMoney(this._valueAsNumber);
          this._onChange(this._valueAsNumber);
          this._input.setSelectionRange(
            this._cursorPos,
            this._cursorPos,
            'forward'
          );
          this.blockEvent($e);
          break;
        }
      case specialKeys.delete:
        // ? apagando 1
        if (
          this._input.selectionEnd - this._input.selectionStart === 0 &&
          Number(this.proccessInsert(this._input.value, '')) > 0
        ) {
          // Backspace na ',' e no 'decimal' (... ,00)
          if (
            this._input.selectionStart >=
            this._input.value.length - this._decimalSize
          ) {
            // Backspace na ','
            if (
              this._input.selectionStart ===
              this._input.value.length - this._decimalSize
            ) {
              this._input.value = this.addCharByIndex(
                this._input.value,
                ',',
                this._input.selectionStart
              );
              this._cursorPos =
                this._input.value.length - (this._decimalSize + 1);
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'backward'
              );
            } else {
              // Backspace no 'decimal'
              if (this._input.value.indexOf(',') !== -1) {
                var posAdd =
                  this._input.selectionStart -
                  (this._input.value.length - this._decimalSize);
                this._valueAsNumber = Number(
                  this.proccessInsert(
                    this.addCharByIndex(
                      this._input.value,
                      '0',
                      this._input.selectionStart
                    ),
                    ''
                  )
                );
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
                this._input.value = this.asMoney(this._valueAsNumber);
                this._cursorPos =
                  this._input.value.length + posAdd - (this._decimalSize + 1);
                this._input.setSelectionRange(
                  this._cursorPos,
                  this._cursorPos,
                  'backward'
                );
              } else {
                // Backspace em um intervalo selecionado
                this._valueAsNumber = Number(
                  this.proccessInsert(this._input.value, '')
                );
                this._input.value = this.asMoney(this._valueAsNumber);
                this._cursorPos =
                  this._input.value.length - this._decimalSize - 1;
                this._input.setSelectionRange(
                  this._cursorPos,
                  this._cursorPos,
                  'backward'
                );
              }
            }
            let stringNumber = this.proccessInsert(this._input.value, '');
            this._valueAsNumber = Number(stringNumber);
            this._valueAsNumber =
              this._input.value.indexOf('-') >= 0
                ? 0 - this._valueAsNumber
                : this._valueAsNumber;
            this._onChange(this._valueAsNumber);
            this.blockEvent($e);
            break;
          } else {
            // Backspace no 'R$ 00.000.000' (R$ 00.000.000 ...)
            const range = this._input.selectionEnd - this._input.selectionStart;
            this._cursorPos = this._input.selectionStart;
            var oldValue = this._input.value;

            // Se o valor removido for '$' ou 'R' ou ' '
            if (
              ['R', '$', undefined].indexOf(
                this._input.value[this._input.selectionStart - 1]
              ) !== -1
            ) {
              let stringNumber =
                range > 0
                  ? this.proccessInsert(this.asMoney(0), '')
                  : this.proccessInsert(this._input.value, '');
              this._valueAsNumber = Number(stringNumber);
              this._valueAsNumber =
                this._input.value.indexOf('-') >= 0
                  ? 0 - this._valueAsNumber
                  : this._valueAsNumber;
              let money = this.asMoney(this._valueAsNumber);
              this._input.value = money;
              this._onChange(this._valueAsNumber);
              this._cursorPos =
                this._currencySymbolLength +
                (this._input.value.charAt(0) !== '-' ? 1 : 2);
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'backward'
              );
              this.blockEvent($e);
              break;
            } else {
              let stringNumber =
                range > 0
                  ? this.proccessInsert(this.asMoney(0), '')
                  : this.proccessInsert(this._input.value, '');
              let currentValueAsNumber = Number(stringNumber);
              // Se o valor removido for um valor numérico
              if (
                this._valueAsNumber !== this.asMoney(currentValueAsNumber) &&
                this._valueAsNumber !== currentValueAsNumber
              ) {
                this._valueAsNumber = currentValueAsNumber;
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
              } else {
                // Se o valor removido for '.', remove o próximo valor numérico
                stringNumber = this.proccessInsert(
                  this.removeCharByIndex(
                    this.asMoney(currentValueAsNumber),
                    this._cursorPos - 1
                  ),
                  ''
                );
                currentValueAsNumber = Number(stringNumber);
                this._valueAsNumber = currentValueAsNumber;
                this._valueAsNumber =
                  this._input.value.indexOf('-') >= 0
                    ? 0 - this._valueAsNumber
                    : this._valueAsNumber;
              }
              let money = this.asMoney(this._valueAsNumber);
              this._input.value = money;
              this._onChange(this._valueAsNumber);
              this._cursorPos =
                this._valueAsNumber === 0
                  ? this._currencySymbolLength + 2
                  : oldValue.length === this._input.value.length
                  ? this._cursorPos
                  : this._cursorPos - 1;
              this._input.setSelectionRange(
                this._cursorPos,
                this._cursorPos,
                'backward'
              );
              this.blockEvent($e);
              break;
            }
          }
          // ? apagando tudo
        } else if (
          !this._input.value ||
          this._input.value === null ||
          this._input.value === '' ||
          Number(this.proccessInsert(this._input.value, '')) <= 0
        ) {
          this._valueAsNumber = 0;
          this._cursorPos = this._currencySymbolLength + 2;
          this._input.value = this.asMoney(this._valueAsNumber);
          this._onChange(this._valueAsNumber);
          this._input.setSelectionRange(
            this._cursorPos,
            this._cursorPos,
            'forward'
          );
          this.blockEvent($e);
          break;
        }
    }
  }

  private setCursorDecimalPos(pos: number) {
    this._cursorPos = pos;
    this._input.setSelectionRange(this._cursorPos, this._cursorPos, 'forward');
  }

  private asMoney(n: number) {
    return this._currencyPipe.transform(
      n,
      this._currencyCode,
      this._currencyDisplay,
      this._currencyDigitsInfo,
      this._locale
    );
  }

  private blockEvent(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  private isNavigationKeys($event: any): boolean {
    return (<string[]>Object.values(navigationKeys)).includes($event.key);
  }

  private isSeparatorKeys($event: any): boolean {
    return (<string[]>Object.values(separatorKeys)).includes($event.key);
  }

  private isSpecialKeys($event: any): boolean {
    return (<string[]>Object.values(specialKeys)).includes($event.key);
  }

  private isFunctionKeys($event: any): boolean {
    return (<string[]>Object.values(ignoreKeys)).includes($event.key);
  }

  private proccessRemove(
    value: string,
    length: number = 1,
    x: number = null,
    y: number = null
  ): string {
    let interval = y - x;
    if (this._inDecimalMode) {
      if (x && y) {
        const fill = '0'.repeat(this._decimalSize);
        value =
          value.substr(0, this._cursorPos - this._decimalSize) +
          fill +
          value.substr(this._cursorPos);
        this._cursorPos = x - 1;
      } else {
        const fill = '0'.repeat(length);
        value =
          value.substr(0, this._cursorPos - length) +
          fill +
          value.substr(this._cursorPos);
        this._cursorPos = this._cursorPos - interval;
      }
    } else {
      if (x && y) {
        value = this._input.value.substring(x, y).includes(this._decimalSymbol)
          ? this._input.value.substr(0, x) +
            this._decimalSymbol +
            this._input.value.substr(y)
          : value.substr(0, x) + value.substr(y);
        this._cursorPos = x - 1;
      } else {
        value =
          value.substr(0, this._cursorPos - length) +
          value.substr(this._cursorPos);
        this._cursorPos = this._cursorPos - interval;
      }
    }
    return this.proccess(value);
  }

  private proccessInsert(value: string, typed: string): string {
    value =
      value.substr(0, this._cursorPos) + typed + value.substr(this._cursorPos);
    return this.proccess(value);
  }

  private proccess(value: string): string {
    let r = new RegExp(`\\${this._thousandSymbol}`, 'g');

    const fill = '0'.repeat(this._decimalSize);
    let a = value
      .replace(/[^0-9\,\.]/g, '')
      .replace(r, '')
      .replace(this._decimalSymbol, '.');
    let a1 = a.split('.')[1] === undefined ? fill : a.split('.')[1];
    let b0 = a1.length > this._decimalSize;

    a1 = b0 ? a1.substr(0, a1.length - 1) : a1.substr(0, a1.length);

    let a0 = a.split('.')[0];
    let b1 = a0.length < 17 - this._decimalSize;
    let c: string = '';

    c = b1 ? a0 + '.' + a1 : a0.substring(0, a0.length - 1) + '.' + a1;
    return c;
  }

  private getThousandSymbol(): string {
    return this.asMoney(1000).substring(
      this._currencySymbolLength + 2,
      this._currencySymbolLength + 3
    );
  }

  private getDecimalSymbol(): string {
    return this.asMoney(1.11).substring(
      this._currencySymbolLength + 2,
      this._currencySymbolLength + 3
    );
  }

  private onClickUpdateCursorSingle(endOfClick: number) {
    if (endOfClick <= this._currencySymbolLength) {
      this._cursorPos = this._currencySymbolLength + 1;
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
    } else if (endOfClick < this._input.value.length - this._decimalSize) {
      this._cursorPos = endOfClick;
      this._inDecimalMode = false;
    } else if (endOfClick >= this._input.value.length - this._decimalSize) {
      this._cursorPos = endOfClick;
      this._inDecimalMode = true;
    } else {
      noop();
    }
  }

  private onClickUpdateCursorMultiple(endOfClick: number) {
    if (endOfClick <= this._currencySymbolLength + 1) {
      this._cursorPos = this._currencySymbolLength + 1;
      this._input.selectionStart = this._currencySymbolLength + 1;
    } else if (endOfClick < this._input.value.length - this._decimalSize) {
      this._cursorPos = endOfClick;
      this._inDecimalMode = false;
    } else if (endOfClick >= this._input.value.length - this._decimalSize) {
      this._cursorPos = endOfClick;
      this._inDecimalMode = true;
    } else {
      noop();
    }
  }

  private resetToDefaultState() {
    this._valueAsNumber = 0;
    this._input.value = this.asMoney(this._valueAsNumber);
    this._inDecimalMode = false;
    if (!this.isMobile()) {
      this._cursorPos = this._currencySymbolLength + 2;
      this._input.setSelectionRange(
        this._cursorPos,
        this._cursorPos,
        'forward'
      );
    }
  }

  private setValueAsNumber() {
    this._valueAsNumber = !this._input.value ? 0 : this._input.value;
  }

  private addCharByIndex(value: string, char: string, index: number): string {
    if (index === 0) {
      return char + value;
    } else if (index === value.length - 1) {
      return value + char;
    } else {
      return value.slice(0, index) + char + value.slice(index, value.length);
    }
  }

  private removeCharByIndex(value: string, index: number): string {
    if (index === 0) {
      return value.slice(1, value.length);
    } else if (index === value.length - 1) {
      return value.slice(0, value.length - 1);
    } else {
      return value.slice(0, index) + value.slice(index + 1, value.length);
    }
  }
}

enum specialKeys {
  enter = 'Enter',
  tab = 'Tab',
  backspace = 'Backspace',
  delete = 'Delete',
  shift = 'Shift',
  control = 'Control',
}

enum navigationKeys {
  up = 'ArrowUp',
  right = 'ArrowRight',
  down = 'ArrowDown',
  left = 'ArrowLeft',
  home = 'Home',
  a = 'a',
}

enum separatorKeys {
  dot = '.',
  comma = ',',
}

enum ignoreKeys {
  f1 = 'F1',
  f2 = 'F2',
  f3 = 'F3',
  f4 = 'F4',
  f5 = 'F5',
  f6 = 'F6',
  f7 = 'F7',
  f8 = 'F8',
  f9 = 'F9',
  f10 = 'F10',
  f11 = 'F11',
  f12 = 'F12',
  scrLock = 'ScrollLock',
  numLock = 'NumLock',
  prtScreen = 'PrintScreen',
}

enum negativeKeys {
  minus = '-',
  numpadSubtract = '-',
}

enum positiveKeys {
  equal = '+',
  numpadAdd = '+',
}

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
