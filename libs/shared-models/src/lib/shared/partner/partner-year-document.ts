import { ReferenceItem } from '../reference-base';
import { IsDefined, Min, ValidateNested, IsIn } from 'class-validator';
import { BaseDocument } from '../../base-models';
import { ServiceRequest } from '../request-response/service-response';
import { Type } from 'class-transformer';
import { RequestAction } from '../request-response/request-action';

export enum AgencyRateField {
  rateCategory = 'rateCategory',
  rateType = 'rateType',
  rate = 'rate',
}

export enum PartnerYearDocumentField {
  id = 'id',
  partnerId = 'partnerId',
  fiscalYear = 'fiscalYear',
  startDate = 'startDate',
  rates = 'rates',
  val = 'val',
}

export class AgencyRate extends ReferenceItem {
  [AgencyRateField.rateCategory]: number;
  [AgencyRateField.rateType]: number;
  [AgencyRateField.rate]: number;
}

export class PartnerYearDocument extends BaseDocument {
  @IsDefined()
  [PartnerYearDocumentField.partnerId]: string;
  //@IsDefined()
  //@Min(1)
  //[PartnerYearDocumentField.fiscalYear]: number;
  [PartnerYearDocumentField.startDate]: number;
  @IsDefined()
  [PartnerYearDocumentField.rates]: AgencyRate[] = new Array<AgencyRate>();
}

export class PartnerYearData {
  @IsDefined()
  sourcePartnerYearId: string;
  @IsDefined()
  @Min(1)
  startDate: number;
}

export class ClonePartnerYearRequest extends ServiceRequest<PartnerYearData> {
  @ValidateNested()
  @Type(() => PartnerYearData)
  @IsDefined()
  data: PartnerYearData = new PartnerYearData();
  action: RequestAction;
}
