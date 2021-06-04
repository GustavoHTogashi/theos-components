import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';


@Component({
  selector: 'theos-pagination',
  templateUrl: './theos-pagination.component.html',
  styleUrls: ['./theos-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosPaginationComponent implements OnInit, OnDestroy {
  @Input() id = 'THPagination';

  startPage = 1;
  lastPage = 0;
  currentPage = 0;

  pageSize = 50;
  disabled = true;

  pageDataStart = 0;
  pageDataEnd = 0;

  totalData = 0;

  pages$ = new Subject<any[]>();

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.pagination;

  private readonly _MAX_PAGES = 5;
  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  @Input() newResponse$: Subject<any>;
  @Output() newSearch = new EventEmitter<number>();

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.newResponse$
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((response) => {
        if (response.totalData === 0) {
          this.lastPage = 0;
          this.currentPage = 0;
          this.disabled = true;
        } else if (response.totalData <= this.pageSize) {
          this.lastPage = 1;
          this.currentPage = 1;
          this.disabled = false;
        } else {
          this.lastPage = Math.ceil(response.totalData / this.pageSize);
          this.currentPage = response.page;
          this.disabled = false;
        }
        this.totalData = response.totalData;
        this._calcPageDataInterval();
        this._buildPages();

        this._cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.pages$.next();
    this.pages$.complete();
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  set = {
    [pageState.PAGE]: (p: number) => {
      this.currentPage = p;
      this.set.default();
    },
    [pageState.FIRST]: () => {
      if (this.currentPage === this.startPage) return;
      this.currentPage = 1;
      this.set.default();
    },
    [pageState.LAST]: () => {
      if (this.currentPage === this.lastPage) return;
      this.currentPage = this.lastPage;
      this.set.default();
    },
    [pageState.NEXT]: () => {
      if (this.currentPage === this.lastPage) return;
      this.currentPage++;
      this.set.default();
    },
    [pageState.BACK]: () => {
      if (this.currentPage === this.startPage) return;
      this.currentPage--;
      this.set.default();
    },
    default: () => {
      this.newSearch.emit(this.currentPage);
    },
  };

  private _calcPageDataInterval() {
    const FORMULA = this.pageSize * this.currentPage;
    if (FORMULA === 0) {
      this.pageDataEnd = 0;
      this.pageDataStart = 0;
      return;
    }

    this.pageDataEnd = FORMULA < this.totalData ? FORMULA : this.totalData;
    this.pageDataStart = FORMULA - this.pageSize + 1;
  }

  private _buildPages() {
    let arr = [];
    const VAL =
      this.lastPage < this._MAX_PAGES ? this.lastPage : this._MAX_PAGES;

    if (VAL === 0) {
      this.pages$.next([]);
      return;
    }

    if (this.currentPage === this.lastPage) {
      let num = this.currentPage;
      let aux = Array((VAL || 1) - 1)
        .fill(null)
        .map(() => {
          num -= 1;
          return num;
        })
        .reverse();
      arr = [...aux, this.currentPage];
      this.pages$.next(arr);
      return;
    }

    if (this.currentPage === this.startPage) {
      let num = this.currentPage;
      let aux = Array(VAL - 1)
        .fill(null)
        .map(() => {
          num += 1;
          return num;
        });
      arr = [this.currentPage, ...aux];
      this.pages$.next(arr);
      return;
    }

    const PAIR =
      this.lastPage < this._MAX_PAGES
        ? this.lastPage % 2 === 0
        : this._MAX_PAGES % 2 === 0;

    if (PAIR) {
      let num = this.currentPage;
      let numB = this.currentPage;
      let auxB = Array(Math.floor(VAL / 2) - 1)
        .fill(null)
        .map(() => {
          num -= 1;
          if (numB < this.startPage) return;
          return num;
        })
        .filter(Number)
        .reverse();
      let auxA = Array(Math.floor(VAL / 2))
        .fill(null)
        .map(() => {
          numB += 1;
          if (numB > this.lastPage) return;
          return numB;
        })
        .filter(Number);

      if (auxA.length < Math.floor(VAL / 2)) {
        for (let i = 0; i < Math.floor(VAL / 2) - auxA.length; i++) {
          auxB.unshift(auxB[0] - 1);
        }
      }
      if (auxB.length < Math.floor(VAL / 2) - 1) {
        auxA.push(auxA[auxA.length - 1] + 1);
      }
      arr = [...auxB, this.currentPage, ...auxA];
      this.pages$.next(arr);
      return;
    }

    let num = this.currentPage;
    let numB = this.currentPage;
    let auxB = Array(Math.floor((VAL - 1) / 2))
      .fill(null)
      .map(() => {
        num -= 1;
        if (numB < this.startPage) return;
        return num;
      })
      .filter(Number)
      .reverse();
    let auxA = Array(Math.floor((VAL - 1) / 2))
      .fill(null)
      .map(() => {
        numB += 1;
        if (numB > this.lastPage) return;
        return numB;
      })
      .filter(Number);
    if (auxA.length < Math.floor((VAL - 1) / 2)) {
      auxB.unshift(auxB[0] - 1);
    }
    if (auxB.length < Math.floor((VAL - 1) / 2)) {
      auxA.push(auxA[auxA.length - 1] + 1);
    }
    arr = [...auxB, this.currentPage, ...auxA];
    this.pages$.next(arr);
    return;
  }
}

enum pageState {
  FIRST = 'first',
  LAST = 'last',
  NEXT = 'next',
  BACK = 'back',
  PAGE = 'page',
}
