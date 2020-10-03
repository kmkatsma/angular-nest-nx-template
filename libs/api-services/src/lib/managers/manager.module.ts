import { Module } from '@nestjs/common';
import { CoreModule } from '@ocw/api-core';
import { AccessModule } from '@ocw/api-access';
import { EngineModule } from '../engines/engine.module';
import { PartnerManager } from './data-entry/partner.manager';
import { DocumentManager } from './shared/document.manager';
import { NoteManager } from './shared/note.facet';
import { UserManager } from './user/user-manager';
import { ReferenceDataManager } from './shared/reference-data.manager';
import { JobQueueManager } from './shared/job-queue.manager';
import { AttributeValueManager } from './shared/attribute-value.manager';
import { AddressManager } from './shared/address.manager';
import { AuditEventManager } from './shared/audit-event.manager';

@Module({
  imports: [AccessModule, CoreModule, EngineModule],
  providers: [JobQueueManager],
  exports: [JobQueueManager],
  controllers: [
    AttributeValueManager,
    ReferenceDataManager,
    UserManager,
    DocumentManager,
    NoteManager,
    PartnerManager,
    AddressManager,
    AuditEventManager
  ]
})
export class ManagerModule {}
