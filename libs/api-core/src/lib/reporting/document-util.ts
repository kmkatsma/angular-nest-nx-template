import { Response } from 'express';
import * as path from 'path';

export const wordPath = `/assets/word/`;

export class DocumentUtil {
  static setResponseHeaders(res: Response, fileName: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  }

  static setTemplateResponseHeaders(res: Response, fileName: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  }
}
