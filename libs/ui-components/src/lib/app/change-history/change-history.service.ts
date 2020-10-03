import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchStoreService } from '@ocw/ui-core';
import { BaseSearchEnum } from '@ocw/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ChangeHistoryService {
  public dataList$: Observable<unknown[]>;

  constructor(private searchService: SearchStoreService) {
    this.dataList$ = this.searchService.Searche$(BaseSearchEnum.ChangeHistory);
  }
}
