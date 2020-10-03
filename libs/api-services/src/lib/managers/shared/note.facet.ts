import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { AccessContextFactory, LogService, AuthUserGuard } from '@ocw/api-core';
import {
  RequestAction,
  NoteMessages,
  SaveNoteRequest,
  DocumentFilter
} from '@ocw/shared-models';
import {
  DocumentInfo,
  SearchNotesRequest,
  DocumentInfoType,
  DocumentInfoFields
} from '@ocw/shared-models';
import { DocumentAccess } from '@ocw/api-access';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class NoteManager {
  constructor(
    private readonly documentAccess: DocumentAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory
  ) {}

  @Post([NoteMessages.Query])
  async [NoteMessages.Query](
    @Body() request: SearchNotesRequest
  ): Promise<DocumentInfo[]> {
    const docRequest = new DocumentFilter();
    docRequest.documentTypeId = DocumentInfoType.Note;
    docRequest.objectId = request.data.objectId;
    docRequest.objectTypeId = request.data.objectTypeId;
    return await this.documentAccess.search(
      docRequest,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([NoteMessages.Mutate])
  async [NoteMessages.Mutate](
    @Body() request: SaveNoteRequest
  ): Promise<DocumentInfo> {
    let document = new DocumentInfo();
    document = Object.assign(document, request.data);
    document[DocumentInfoFields.documentTypeId] = DocumentInfoType.Note;
    if (
      request.action === RequestAction.Create ||
      request.action === RequestAction.Update
    ) {
      return await this.documentAccess.addOrReplaceDocument(
        document,
        this.accessContextFactory.getAccessContext()
      );
    }
    if (request.action === RequestAction.Delete) {
      return await this.documentAccess.delete(
        document,
        this.accessContextFactory.getAccessContext()
      );
    }
  }
}
