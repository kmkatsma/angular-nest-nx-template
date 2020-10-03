import { DateUtil } from '@ocw/shared-core';
import { CurrentUser } from '../../middleware/models';
import { AuditBase, AuditInfo, BaseDocument } from '@ocw/shared-models';

export class AuditUtil {
  constructor() {}

  static setCreateAudit(userName: string, item: AuditBase) {
    item.auditInfo = new AuditInfo();
    item.auditInfo.updBy = userName.toUpperCase();
    item.auditInfo.crtBy = userName.toUpperCase();
    item.auditInfo.updTs = DateUtil.getGMTTimestamp();
    item.auditInfo.crtTs = DateUtil.getGMTTimestamp();
  }

  static setUpdateAudit(userName: string, item: AuditBase) {
    if (!item.auditInfo) {
      item.auditInfo = new AuditInfo();
    }
    item.auditInfo.updBy = userName.toUpperCase();
    item.auditInfo.updTs = DateUtil.getGMTTimestamp();
  }

  static setCreateAuditInfo(user: CurrentUser, doc: BaseDocument) {
    if (!doc.auditInfo) {
      doc.auditInfo = new AuditInfo();
    }

    if (!doc.auditInfo.crtBy) {
      doc.auditInfo.crtBy = doc.auditInfo.updBy = user.userName.toUpperCase();
      if (doc['create_ts']) {
        doc.auditInfo.crtTs = doc.auditInfo.updTs = doc['create_ts'];
      } else {
        doc.auditInfo.crtTs = doc.auditInfo.updTs = DateUtil.getGMTTimestamp();
      }
    }
  }

  static setUpdateAuditInfo(user: CurrentUser, doc: BaseDocument) {
    if (!doc.auditInfo) {
      doc.auditInfo = new AuditInfo();
    }
    doc.auditInfo.updBy = user.userName.toUpperCase();
    doc.auditInfo.updTs = DateUtil.getGMTTimestamp();
  }

  static setDeleteAuditInfo(user: CurrentUser, doc: BaseDocument) {
    doc.auditInfo.delBy = user.userName.toUpperCase();
    doc.auditInfo.delTs = DateUtil.getGMTTimestamp();
  }
}
