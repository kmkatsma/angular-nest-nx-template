import { Injectable, UseGuards, Controller, Post, Body } from '@nestjs/common';
import { AccessContextFactory, LogService, AuthUserGuard } from '@ocw/api-core';
import {
  RequestAction,
  DocumentMessages,
  ServiceRequest,
  DocumentFilter,
  SaveDocumentRequest,
  DocumentInfoType,
  ReferenceItem,
} from '@ocw/shared-models';
import { DocumentInfo } from '@ocw/shared-models';
import { DocumentAccess } from '@ocw/api-access';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class DocumentManager {
  constructor(
    private readonly documentAccess: DocumentAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory
  ) {}

  @Post([DocumentMessages.Get])
  async [DocumentMessages.Get](
    @Body() request: ServiceRequest<string>
  ): Promise<DocumentInfo> {
    return await this.documentAccess.get(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([DocumentMessages.Query])
  async [DocumentMessages.Query](
    @Body() request: ServiceRequest<DocumentFilter>
  ): Promise<DocumentInfo[]> {
    return await this.documentAccess.search(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([DocumentMessages.TemplateList])
  async [DocumentMessages.TemplateList](): Promise<ReferenceItem[]> {
    const filter = new DocumentFilter();
    const templates: ReferenceItem[] = [];
    filter.documentTypeId = DocumentInfoType.DocumentTemplate;
    const docs = await this.documentAccess.search(
      filter,
      this.accessContextFactory.getAccessContext()
    );
    docs.forEach((p) => {
      const template = new ReferenceItem();
      template.id = p.id;
      template.val = p.name;
      template.auditInfo = p.auditInfo;
      template.rowVersion = p.rowVersion;
      templates.push(template);
    });
    return templates;
  }

  @Post([DocumentMessages.Mutate])
  async [DocumentMessages.Mutate](
    @Body() request: SaveDocumentRequest
  ): Promise<DocumentInfo> {
    if (
      request.action === RequestAction.Create ||
      request.action === RequestAction.Update
    ) {
      return await this.documentAccess.addOrReplaceDocument(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
    if (request.action === RequestAction.Delete) {
      return await this.documentAccess.delete(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
  }
}
