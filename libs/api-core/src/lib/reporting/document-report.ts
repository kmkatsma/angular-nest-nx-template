import * as officegen from 'officegen';
import { Response } from 'express';

export class DocumentReport {
  docx: any;

  constructor() {
    this.docx = officegen({
      type: 'docx',
      pageMargins: {
        top: 1008,
        right: 1440,
        bottom: 1440,
        left: 1440,
      },
    });
  }

  writeToResponse(res: Response, fileName) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    this.docx.generate(res);
  }
}
