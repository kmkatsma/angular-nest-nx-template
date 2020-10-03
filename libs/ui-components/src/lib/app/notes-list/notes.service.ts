import {
  SaveNoteRequest,
  BaseSearchEnum,
  BaseResourceEnum,
  NoteMessages,
  NoteFilter
} from '@ocw/shared-models';
import { SearchStoreService, ResourceStoreService } from '@ocw/ui-core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NoteDocument,
  ObjectType,
  SearchNotesRequest
} from '@ocw/shared-models';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public noteUpdate$: Observable<NoteDocument>;
  public note$: Observable<NoteDocument[]>;

  constructor(
    private searchService: SearchStoreService,
    private resourceService: ResourceStoreService
  ) {
    this.note$ = this.searchService.Searche$(BaseSearchEnum.Notes);
    this.noteUpdate$ = this.resourceService.ResourceSave$(
      BaseResourceEnum.Note
    );
  }

  searchNotes(id: string, objectTypeId: ObjectType) {
    if (!id || id.length === 0) {
      return;
    }
    const request = new NoteFilter();
    request.objectId = id;
    request.objectTypeId = objectTypeId;
    this.searchService.processMessage(
      request,
      BaseSearchEnum.Notes,
      NoteMessages.Query
    );
  }

  saveNote(request: SaveNoteRequest) {
    request.messageType = NoteMessages.Mutate;
    this.resourceService.executeServiceRequest(request, BaseResourceEnum.Note);
  }
}
