import { Injectable } from '@angular/core';
import {
  BaseResourceEnum,
  BaseSearchEnum,
  ColumnDataType,
  ColumnDefinition,
  ReferenceItem,
  ServiceRequest,
  TenantAttribute,
  TenantDocument,
  TenantMessages,
} from '@ocw/shared-models';
import { ResourceStoreService, SearchStoreService } from '@ocw/ui-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  tenant$: Observable<TenantDocument[]>;

  constructor(
    private searchService: SearchStoreService,
    private resourceService: ResourceStoreService
  ) {
    this.tenant$ = this.searchService.Searche$(BaseSearchEnum.Tenants);
  }

  getColumns() {
    const columns: ColumnDefinition[] = [];
    columns.push({
      cdkColumnDef: 'Name',
      cdkHeaderCellDef: 'Name',
      dataType: ColumnDataType.string,
      fieldName: `${TenantAttribute.tenantName}`,
    });
    columns.push({
      cdkColumnDef: 'Domain Name',
      cdkHeaderCellDef: 'Domain Name',
      dataType: ColumnDataType.string,
      fieldName: `${TenantAttribute.domainName}`,
      hideXs: true,
    });
    columns.push({
      cdkColumnDef: 'Tenant State',
      cdkHeaderCellDef: 'Tenant State',
      dataType: ColumnDataType.string,
      fieldName: `${TenantAttribute.tenantState}`,
      hideXs: true,
    });
    columns.push({
      cdkColumnDef: 'Deleted',
      cdkHeaderCellDef: 'Deleted',
      dataType: ColumnDataType.Boolean,
      fieldName: `${TenantAttribute.isDeleted}`,
    });

    return columns;
  }

  search() {
    this.searchService.processMessage(
      {},
      BaseSearchEnum.Tenants,
      TenantMessages.GetAll
    );
  }

  save(filter: TenantDocument) {
    const serviceRequest = new ServiceRequest<TenantDocument>();
    serviceRequest.data = filter;
    this.resourceService.executeService({
      data: filter,
      messageType: TenantMessages.Mutate,
      resourceEnum: BaseResourceEnum.Tenant,
    });
  }

  addState(uid: number, code: string, name: string) {
    const st = new ReferenceItem(uid, code);
    st.val = code;
    st.name = name;
    return st;
  }

  populateStates(): ReferenceItem[] {
    const list = [];
    list.push(this.addState(1, 'AL', 'Alabama'));
    list.push(this.addState(2, 'AK', 'Alaska'));
    list.push(this.addState(3, 'AZ', 'Arizona'));
    list.push(this.addState(4, 'AR', 'Arkansas'));
    list.push(this.addState(5, 'CA', 'California'));
    list.push(this.addState(6, 'CO', 'Colorado'));
    list.push(this.addState(7, 'CT', 'Connecticut'));
    list.push(this.addState(8, 'DE', 'Delaware'));
    list.push(this.addState(9, 'FL', 'Florida'));
    list.push(this.addState(10, 'GA', 'Georgia'));
    list.push(this.addState(11, 'HI', 'Hawaii'));
    list.push(this.addState(12, 'ID', 'Idaho'));
    list.push(this.addState(13, 'IL', 'Illinois'));
    list.push(this.addState(14, 'IN', 'Indiana'));
    list.push(this.addState(15, 'IA', 'IOWA'));
    list.push(this.addState(16, 'KS', 'Kansas'));
    list.push(this.addState(17, 'KY', 'Kentucky'));
    list.push(this.addState(18, 'LA', 'Louisiana'));
    list.push(this.addState(19, 'ME', 'Maine'));
    list.push(this.addState(20, 'MD', 'Maryland'));
    list.push(this.addState(21, 'MA', 'Massachusetts'));
    list.push(this.addState(22, 'MI', 'Michigan'));
    list.push(this.addState(23, 'MN', 'Minnesota'));
    list.push(this.addState(24, 'MS', 'Mississippi'));
    list.push(this.addState(25, 'MO', 'Missouri'));
    list.push(this.addState(26, 'MT', 'Montana'));
    list.push(this.addState(27, 'NE', 'Nebraska'));
    list.push(this.addState(28, 'NV', 'Nevada'));
    list.push(this.addState(29, 'NH', 'New Hampshire'));
    list.push(this.addState(30, 'NJ', 'New Jersey'));
    list.push(this.addState(31, 'NM', 'New Mexico'));
    list.push(this.addState(32, 'NY', 'New York'));
    list.push(this.addState(33, 'NC', 'North Carolina'));
    list.push(this.addState(34, 'ND', 'North Dakota'));
    list.push(this.addState(35, 'OH', 'Ohio'));
    list.push(this.addState(36, 'OK', 'Oklahoma'));
    list.push(this.addState(37, 'OR', 'Oregon'));
    list.push(this.addState(38, 'PA', 'Pennsylvania'));
    list.push(this.addState(39, 'RI', 'Rhode Island'));
    list.push(this.addState(40, 'SC', 'South Carolina'));
    list.push(this.addState(41, 'SD', 'South Dakota'));
    list.push(this.addState(42, 'TN', 'Tennessee'));
    list.push(this.addState(43, 'TX', 'Texas'));
    list.push(this.addState(44, 'UT', 'Utah'));
    list.push(this.addState(45, 'VT', 'Vermont'));
    list.push(this.addState(46, 'VA', 'Virginia'));
    list.push(this.addState(47, 'WA', 'Washington'));
    list.push(this.addState(48, 'WV', 'West Virginia'));
    list.push(this.addState(49, 'WI', 'Wisconsin'));
    list.push(this.addState(50, 'WY', 'Wyoming'));
    list.push(this.addState(51, 'DC', 'District of Columbia'));

    return list;
  }
}
