import { Injectable } from '@nestjs/common';
import {
  JobQueueAccess,
  JobQueueTable,
  JobTaskAccess,
  JobAccess,
} from '@ocw/api-access';
import {
  AccessContextFactory,
  CurrentUser,
  LogService,
  RequestContext,
  ServiceRegistry,
  AccessContext,
} from '@ocw/api-core';
import { CloneUtil } from '@ocw/shared-core';
import { ServiceRequest } from '@ocw/shared-models';

export const systemUser: CurrentUser = {
  userName: 'SYSTEM',
  id: 'SYSTEM',
  tenantId: 0,
  tenantDomain: 'opencasework.com',
  tenantState: 'IL',
  isProvider: false,
  constituentId: undefined,
  providerId: undefined,
  roles: [],
  email: undefined,
  container: undefined,
  locationId: 0,
  userId: undefined,
};

@Injectable()
export class JobQueueManager {
  constructor(
    private readonly jobQueueAccess: JobQueueAccess,
    private readonly jobTaskAccess: JobTaskAccess,
    private readonly jobAccess: JobAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly serviceRegistry: ServiceRegistry
  ) {}

  async executeJob(jobId: string): Promise<boolean> {
    this.logService.log('Start', '[JobQueueManager.executeJob]');
    const accessContext = this.accessContextFactory.getAccessContext();
    let results: JobQueueTable<any>[] = [];
    let originaldata: any;
    let result: boolean;

    await accessContext.beginTransaction();
    try {
      results = await this.jobQueueAccess.getJobQueueItem(jobId, accessContext);
      if (results.length === 0) {
        await this.jobQueueAccess.markJobCompleteOrFailed(jobId, accessContext);
        await accessContext.commitTransaction();
        return true;
      }
      originaldata = CloneUtil.cloneDeep(results[0].json_document);
      console.log('getJobQueueItem results', results);
      const serviceRequest = new ServiceRequest();
      serviceRequest.messageType = results[0].message_type;
      serviceRequest.data = results[0].json_document;
      console.log('servicerequest.data', serviceRequest.data);

      //set user
      const user = Object.assign({}, systemUser);
      user.tenantId = results[0].tenant_id;
      RequestContext.setCurrentUser(user);

      result = await this.serviceRegistry.execute(serviceRequest);
      if (result) {
        await this.jobTaskAccess.markTaskComplete(
          results[0].job_task_id.toString(),
          accessContext
        );
        await this.jobAccess.updateJobTimestamp(jobId, accessContext);
      } else {
        await this.retry(jobId, originaldata, results, accessContext);
      }
    } catch (err) {
      this.logService.exception(err, '[JobQueueManager.executeJob exception]');
    }
    await accessContext.commitTransaction();
    return false;
  }

  private async retry(
    jobId: string,
    originalData: any,
    results: JobQueueTable<any>[],
    accessContext: AccessContext
  ) {
    if (results.length > 0) {
      const attempts = await this.jobTaskAccess.markTaskAttempted(
        results[0].job_task_id.toString(),
        accessContext
      );
      if (attempts < 5) {
        await this.jobQueueAccess.add(
          results[0].message_type,
          jobId,
          results[0].job_task_id.toString(),
          originalData,
          accessContext
        );
      }
    }
  }
}
