import { Module, DynamicModule } from '@nestjs/common';
import { DomainsAccess } from './services/shared/domains.access';
import { DocumentAccess } from './services/shared/document.access';
import { PartnerAccess } from './services/shared/partner/partner.access';
import { PartnerYearAccess } from './services/shared/partner/partner-year.access';
import { SystemSettingAccess } from './services/shared/system-setting.access';
import { JobQueueAccess } from './services/shared/batch/job-queue.access';
import { JobAccess } from './services/shared/batch/job.access';
import { JobTaskAccess } from './services/shared/batch/job-task.access';
import { AttributeValueAccess } from './services/shared/attribute-value.access';

@Module({
  providers: [
    DomainsAccess,
    DocumentAccess,
    PartnerAccess,
    PartnerYearAccess,
    SystemSettingAccess,
    JobQueueAccess,
    JobAccess,
    JobTaskAccess,
    AttributeValueAccess
  ],
  exports: [
    DomainsAccess,
    DocumentAccess,
    PartnerAccess,
    PartnerYearAccess,
    SystemSettingAccess,
    JobQueueAccess,
    JobAccess,
    JobTaskAccess,
    AttributeValueAccess
  ]
})
export class AccessModule {
  static forTest(): DynamicModule {
    return {
      module: AccessModule,
      providers: [
        { provide: DomainsAccess, useValue: {} },
        { provide: JobQueueAccess, useValue: {} },
        { provide: JobAccess, useValue: {} },
        { provide: JobTaskAccess, useValue: {} }
      ],
      exports: [DomainsAccess, JobQueueAccess, JobAccess, JobTaskAccess]
    };
  }
}
