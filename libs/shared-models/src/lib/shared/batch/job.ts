import { BaseDocument } from '../../base-models';

export enum JobStatus {
  Staged = 1,
  InProcess = 2,
  Complete = 3,
  Failed = 4,
}

export enum JobType {
  Import = 1,
}

export const JobSubTypeList = new Map<number, string>([]);

export const JobStatusList = new Map<number, string>([
  [JobStatus.Staged, 'Staged'],
  [JobStatus.InProcess, 'In Process'],
  [JobStatus.Complete, 'Complete'],
  [JobStatus.Failed, 'Complete'],
]);

export enum JobDocumentAttribute {
  type = 'type',
  subType = 'subType',
  startDt = 'startDt',
  endDt = 'endDt',
  status = 'status',
  data = 'data',
}

export class JobDocument<T> extends BaseDocument {
  [JobDocumentAttribute.type]: JobType;
  [JobDocumentAttribute.subType]: number;
  [JobDocumentAttribute.startDt]: number;
  [JobDocumentAttribute.endDt]: number;
  [JobDocumentAttribute.status]: JobStatus;
  [JobDocumentAttribute.data]: T;
}

export enum JobQueueDocumentAttribute {
  jobId = 'jobId',
  data = 'data',
  status = 'status',
}

export class JobQueueDocument<T> extends BaseDocument {
  [JobQueueDocumentAttribute.jobId]: string;
  [JobQueueDocumentAttribute.data]: T;
  [JobQueueDocumentAttribute.status]: JobStatus;
}

export class JobQueueSearchRequest {
  jobIdEquals: string;
  jobTypeEquals: string;
  statusEquals: string;
}

export class JobSearchRequest {
  startDt: number;
  endDate: number;
  jobTypeEquals: JobType;
  jobSubTypeEquals: number;
  jobStatusEquals: JobStatus;
}
