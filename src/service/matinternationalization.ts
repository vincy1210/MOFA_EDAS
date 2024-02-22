import {Component, Injectable, NgModule} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';



@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {

    constructor(private translate:TranslateService){
    }
  changes = new Subject<void>();

  
//   "getRangeLabel": "الصفحة {page} من {amountPages}"

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = this.translate.instant(`First page`);
  itemsPerPageLabel = this.translate.instant(`Items per page:`);
  lastPageLabel =this.translate.instant(`Last page`);

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = this.translate.instant('Next page');
  previousPageLabel = this.translate.instant('Previous page');

//   getRangeLabel(page: number, pageSize: number, length: number): string {
//     if (length === 0) {
//       return `Page 1 of 1`;
//     }
//     const amountPages = Math.ceil(length / pageSize);
//     return `Page ${page + 1} of ${amountPages}`;
//   }

getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this.translate.instant('Page 1 of 1');
    }

    const amountPages = Math.ceil(length / pageSize);

    return this.translate.instant('Page {{page}} of {{amountPages}}', {
      page: page + 1,
      amountPages
    });
  }
}
