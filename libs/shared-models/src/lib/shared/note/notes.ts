import { BaseDocument } from '../../base-models';
import { ServiceRequest } from '../request-response/service-response';
import { RequestAction } from '../request-response/request-action';

export enum NoteDocumentFields {
  objectId = 'objectId',
  objectTypeId = 'objectTypeId',
  notes = 'notes'
}

export class NoteDocument extends BaseDocument {
  [NoteDocumentFields.objectId]: string;
  [NoteDocumentFields.objectTypeId]: number;
  [NoteDocumentFields.notes]: string;
}

export class NoteFilter {
  objectId: string;
  objectTypeId: number;
}

export class SearchNotesRequest extends ServiceRequest<NoteFilter> {
  data: NoteFilter = new NoteFilter();  
}

export class SaveNoteRequest extends ServiceRequest<NoteDocument> {
  data: NoteDocument = new NoteDocument();
  action: RequestAction;
}
