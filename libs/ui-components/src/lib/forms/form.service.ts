import { Injectable } from '@angular/core';
import { FORM_MODE } from './enums';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  public getFormTitle(entityName: string, formMode: FORM_MODE) {
    let title = '';
    if (formMode === FORM_MODE.UPDATE) {
      title = 'Edit ';
    } else {
      title = 'Add';
    }
    return (title += ' ' + entityName);
  }
}
