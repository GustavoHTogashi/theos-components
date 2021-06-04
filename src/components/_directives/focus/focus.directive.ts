import {
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	HostListener,
	Input
} from '@angular/core';
import { noop } from 'rxjs';

// ! Classes dos elementos que devem ser desconsiderados
const excludeClasses = [
  'clear',
  'ag-paging-button',
  'ag-hidden',
  'ag-checkbox-input',
  'invisible',
  'dropdown-item',
  'ck-button',
  'ckbx',
  'btn-calcula-saldo',

  // ! Classes desconsideradas nos componentes novos
  'th-ipt-search__btn-search',
  'th-ipt-search__btn-remove',
  'th-float-btn',
  'th-date__btn-calendar',
  'th-ipt__inactive-button',
  'th-ipt__avatar',
  'th-ag-date-cell-editor',
  'th-ipt-file',
  'th-ipt-file-remove'
];

@Directive({
  selector: '[theosCustomFocus]',
})
export class TheosCustomFocusDirective implements AfterViewInit {
  private formNodeAList: NodeList = null;
  private formNodeTabList: NodeList = null;

  private formNodeList: NodeList = null;
  private focusableElementList = [];

  private tagsToFocusList = ['input', 'textarea', 'button', 'select'];
  private tabsHeader = [];
  private tabsNodeList = [];

  private currTab = 0;
  private currentElementIndex = 0;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  /**
   * @param firstToFocus -  primeiro indice a ser focado
   */
  @Input() firstToFocus = 0;

  /**
   * @param tabMode - habilita ou não o foco nas abas
   */
  @Input() tabMode = false;
  @Input() startOverOnFocusListEnds: boolean = false;

  ngAfterViewInit(): void {
    this.getForms();
    this.focusFirst(this.firstToFocus);
    this.cdr.detectChanges();
  }

  getForms() {
    this.tabsHeader = [];
    this.tabsNodeList = [];
    this.focusableElementList = [];
    if (this.tabMode) {
      this.formNodeAList = this.getNodeList(this.elementRef.nativeElement, [
        'a',
      ]);
      this.formNodeTabList = this.getNodeList(this.elementRef.nativeElement, [
        'tab',
      ]);

      Object.values(this.formNodeAList).filter(
        (formNode: HTMLAnchorElement) => {
          if (formNode.className.includes('nav-link')) {
            this.tabsHeader.push(formNode);
          }
        }
      );

      this.formNodeTabList.forEach((formNodeTab) => {
        let nodeList = this.getNodeList(formNodeTab, this.tagsToFocusList);
        let toPush = false;
        let nodes = [];

        nodeList.forEach((node: any) => {
          let nodeClassName = node.className;
          toPush =
            nodeClassName && nodeClassName !== null && nodeClassName !== ''
              ? false
              : true;
          excludeClasses.filter((excludeClass) => {
            if (nodeClassName.includes(excludeClass)) {
              toPush = false;
            } else {
              toPush = true;
              return;
            }
          });
          if (toPush) {
            nodes.push(node);
          }
        });
        this.tabsNodeList.push(nodes);
      });
    } else {
      this.formNodeList = this.getNodeList(
        this.elementRef.nativeElement,
        this.tagsToFocusList
        );
      Object.values(this.formNodeList).filter((formNode: HTMLElement) => {
        let formNodeClasses = Array.from(formNode.classList);
        let formNodeParentClasses = Array.from(
          formNode.parentElement.classList
        );

        let toPush =
          formNodeParentClasses && formNodeParentClasses.length > 0
            ? false
            : true;
        formNodeClasses.filter((formNodeClass) => {

          if (!excludeClasses.includes(formNodeClass)) {
            toPush = true;
            return;
          } else {
            toPush = false;
          }
        });

        formNodeParentClasses.filter((formNodeParentClass) => {
          if (!excludeClasses.includes(formNodeParentClass)) {
            if (formNodeClasses.length > 0) {
              formNodeClasses.filter((formNodeClass) => {
                if (!excludeClasses.includes(formNodeClass)) {
                  toPush = true;
                  return;
                } else {
                  toPush = false;
                }
              });
            } else {
              toPush = true;
            }
          } else {
            toPush = false;
          }
        });

        if (toPush) {
          this.focusableElementList.push(formNode);
        }
      });
    }
  }

  @HostListener('keydown', ['$event'])
  onkeydown(event: KeyboardEvent) {
    this.getForms();
    switch (event.keyCode) {
      case KeyboardKey.enter:
        if (this.tabMode) {
          const elementIndex = this.getElementIndex(
            this.tabsHeader,
            event.target
          );

          if (this.tabsNodeList[elementIndex].length > 0) {
            this.enterFocus(elementIndex);
            break;
          } else break;
        } else {
          const elementIndex = this.getElementIndex(
            this.focusableElementList,
            event.target
          );
          const node = this.focusableElementList[elementIndex];
          const nodeName = node ? node.nodeName : '';
          if (
            (nodeName === 'INPUT' &&
              node.className.indexOf('tag-input') === -1) ||
            nodeName === 'SELECT'
          ) {
            if (
              elementIndex >= 0 &&
              elementIndex < this.focusableElementList.length - 1
            ) {
              this.blockEvent(event);
              this.enterFocus(elementIndex);
              break;
            } else if (
              this.startOverOnFocusListEnds &&
              elementIndex === this.focusableElementList.length - 1
            ) {
              this.blockEvent(event);
              this.tabFocus(-1);
              break;
            }
          } else {
            break;
          }
        }

      case KeyboardKey.tab:
        // ? TAB Foward
        if (event.shiftKey === false) {
          if (this.tabMode) {
            const elementIndex = this.getElementIndex(
              this.tabsHeader,
              event.target
            );

            this.blockEvent(event);
            this.tabFocus(elementIndex);

            break;
          } else {
            const elementIndex = this.getElementIndex(
              this.focusableElementList,
              event.target
            );

            if (
              elementIndex >= 0 &&
              elementIndex < this.focusableElementList.length - 1
            ) {
              this.blockEvent(event);
              this.tabFocus(elementIndex);
              break;
            } else if (elementIndex === this.focusableElementList.length - 1) {
              this.blockEvent(event);
              this.tabFocus(-1);
              break;
            } else {
              break;
            }
          }
        }
        // ? SHIFT+TAB Backward
        else {
          if (this.tabMode) {
            const elementIndex = this.getElementIndex(
              this.tabsHeader,
              event.target
            );

            this.blockEvent(event);

            this.tabRevFocus(elementIndex);

            break;
          } else {
            const elementIndex = this.getElementIndex(
              this.focusableElementList,
              event.target
            );

            if (
              elementIndex > 0 &&
              elementIndex < this.focusableElementList.length
            ) {
              this.blockEvent(event);
              this.tabRevFocus(elementIndex);
              break;
            } else if (elementIndex === 0) {
              this.blockEvent(event);
              this.tabRevFocus(this.focusableElementList.length);
              break;
            } else {
              break;
            }
          }
        }

      default:
        break;
    }
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeyboardKey.enter:
        if (event.shiftKey) break;
        else {
          this.blockEvent(event);
          break;
        }
      case KeyboardKey.tab:
        this.blockEvent(event);
        break;

      default:
        break;
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    let id = event.target.id || event.target.parent?.id || '';
    let arr = [...this.tabsHeader.map((tabHeader) => tabHeader.id)];

    if (arr.includes(id)) {
      this.tabMode = true;
      this.currTab = arr.indexOf(id);
    } else {
      if (!this.tabMode) {
        this.formNodeList = this.getNodeList(
          this.elementRef.nativeElement,
          this.tagsToFocusList
        );
        this.focusableElementList = [];
        Object.values(this.formNodeList).filter((formNode: HTMLElement) => {
          let formNodeClasses = formNode.classList;
          let toPush =
            formNodeClasses && formNodeClasses.length > 0 ? false : true;
          formNodeClasses.forEach((formNodeClass) => {
            if (!excludeClasses.includes(formNodeClass)) {
              toPush = true;
              return;
            } else toPush = false;
          });
          if (toPush) {
            this.focusableElementList.push(formNode);
          }
        });
      } else {
        this.focusableElementList = [];
        this.focusableElementList = this.tabsNodeList[this.currTab];
      }

      this.tabMode = false;
    }
  }

  private getElementIndex(nodes: any[], target: EventTarget): number {
    return Object.values(nodes).findIndex((x) => x === target);
  }

  private getNodeList(parentElement: any, itemsToQuery: string[]): NodeList {
    return parentElement.querySelectorAll(itemsToQuery);
  }

  private tabFocus(elementIndex: number) {
	const i = elementIndex + 1;

    if (this.tabMode) {
      this.focusableElementList = this.tabsHeader;

      const elementToFocus: any = this.focusableElementList[i];

      i < this.focusableElementList.length
        ? (elementToFocus.focus(), (this.currentElementIndex = i))
        : this.tabFocus(-1);
    } else {

      const elementToFocus: any = this.focusableElementList[i];

      elementToFocus.disabled === false &&
      !elementToFocus.parentNode.classList.contains('inactive') &&
      !elementToFocus.hasAttribute('hidden')
        ? (elementToFocus.focus(), (this.currentElementIndex = i))
        : i < this.focusableElementList.length - 1
        ? this.tabFocus(i)
        : this.tabFocus(-1);
    }
  }

  private tabRevFocus(elementIndex: number) {
    const i = elementIndex - 1;

    if (this.tabMode) {
      this.focusableElementList = this.tabsHeader;

      const elementToFocus: any = this.focusableElementList[i];

      i !== -1
        ? (elementToFocus.focus(), (this.currentElementIndex = i))
        : this.tabRevFocus(this.focusableElementList.length);
    } else {
      const elementToFocus: any = this.focusableElementList[i];

      elementToFocus.disabled === false &&
      !elementToFocus.parentNode.classList.contains('inactive') &&
      !elementToFocus.hasAttribute('hidden')
        ? (elementToFocus.focus(), (this.currentElementIndex = i))
        : i !== 0
        ? this.tabRevFocus(i)
        : this.tabRevFocus(this.focusableElementList.length);
    }
  }

  private enterFocus(elementIndex: number) {
	const i = elementIndex + 1;

    if (this.tabMode) {
      this.focusableElementList = this.tabsNodeList[elementIndex];
      this.tabMode = false;
      this.enterFocus(-1);
    } else {
      const elementToFocus = this.focusableElementList[i];

      if (!elementToFocus || !elementToFocus.nodeName) return;
      if (
        elementToFocus.nodeName === 'INPUT' ||
        elementToFocus.nodeName === 'SELECT' ||
        elementToFocus.nodeName === 'TEXTAREA'
      ) {
        !elementToFocus.disabled &&
        !elementToFocus.parentNode.classList.contains('inactive') &&
        !elementToFocus.hasAttribute('hidden')
          ? (elementToFocus.focus(), (this.currentElementIndex = i))
          : this.enterFocus(i);
      } else if (elementToFocus.nodeName === 'BUTTON') {
        const exclusions = [
          'btn-calendar',
          'btn-outline-secondary',
		  'th-float-btn',
		  'ck-button'
        ];
        let toFocus = true;
        exclusions.filter((exclusion) => {
          if (elementToFocus.className.includes(exclusion)) {
            toFocus = false;
            return;
          }
        });

        toFocus
          ? !elementToFocus.disabled &&
            !elementToFocus.parentNode.classList.contains('inactive') &&
            !elementToFocus.hasAttribute('hidden')
            ? (elementToFocus.focus(), (this.currentElementIndex = i))
            : this.enterFocus(i)
          : this.enterFocus(i);
      } else {
        this.enterFocus(i);
      }
    }
  }

  private focusFirst(firstToFocus: number) {
    if (/Edge/.test(window.navigator.userAgent)) {
      return;
    }

    if (this.tabMode) {
      this.tabsNodeList[0]
        ? (this.tabsNodeList[0][0].focus(), (this.currentElementIndex = 0))
        : noop();
      this.tabMode = false;
    } else {
      this.focusableElementList
        ? (this.focusableElementList[firstToFocus]?.focus(),
          (this.currentElementIndex = firstToFocus))
        : console.error(
            `Unable to find first element, focusableElementList is Null`
          );
    }
  }

  private blockEvent(event: KeyboardEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * Focus next element
   */
  next() {
    this.currentElementIndex++;
    this.focusableElementList[this.currentElementIndex].focus();
  }

  /**
   * - Busca um item na lista de elementos focáveis que contenha o texto da queryString.
   * - Foca este elemento.
   * @param queryString texto a ser procurado.
   */
  focus(queryString: string) {
    const el = this.focusableElementList.find((el) => {
      return el.outerHTML.includes(queryString) ? el : null;
    });

    el && el.disabled
      ? observer.observe(el, { attributes: true })
      : el
      ? el.focus()
      : null;
  }
}

var observer = new MutationObserver(function (mutations) {
  for (let mutation of mutations) {
    if (mutation.attributeName === 'disabled') {
      let el: any = mutation.target;
      !el.disabled ? el.focus() : null;
    }
  }
});

export enum KeyboardKey {
  backspace = 8,
  tab = 9,
  enter = 13,
  ctrl = 17,
  alt = 18,
  esc = 27,
  arrowLeft = 37,
  arrowUp = 38,
  arrowRight = 39,
  arrowDown = 40,
  delete = 46,
  f1 = 112,
  f2 = 113,
}
