import { PDFDocument, PDFString, PDFNumber, PDFName, PDFBool } from 'pdf-lib';
import { Response } from 'express';
import { DateUtil } from '@ocw/shared-core';

export const pdfPath = `/assets/pdf/`;

export class PdfUtil {
  static setPdfResponseHeaders(res: Response, fileName: string) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  }
}

export const fillForm = async (pdfDoc: PDFDocument, data) => {
  const form: any = pdfDoc.context.lookup(
    pdfDoc.catalog.get(PDFName.of('AcroForm'))
  );
  if (!form) {
    throw new Error('PDF does not contain a form');
  }

  form.set(PDFName.of('NeedAppearances'), PDFBool.True);

  const fieldRefs = (form as any).context.lookup(
    (form as any).get(PDFName.of('Fields'))
  );
  if (!fieldRefs) {
    throw new Error('PDF form does not contain any fields');
  }

  const fields = fieldRefs.array.map((ref: any) =>
    (form as any).context.lookup(ref)
  );

  fields.forEach((field) => {
    const name = field.get(PDFName.of('T'));
    console.log('name', name.value);
    if (name) {
      const newValue = data[name.value];
      if (newValue) {
        /*if (
          name.value === 'Black' ||
          name.value === 'Hispanic' ||
          name.value === 'AmericanIndian' ||
          name.value === 'Hawaiian' ||
          name.value === 'White' ||
          name.value === 'Asian' ||
          name.value === 'NonHispanic'
        ) {
          console.log('setting Black/Hispanic', newValue);
          field.set(PDFName.of('V'), PDFName.of('Yes'));
          field.set(PDFName.of('AS'), PDFName.of('Yes'));
        } else {*/
        console.log('setting value', newValue);
        field.set(PDFName.of('V'), PDFString.of(newValue));
        field.set(PDFName.of('Ff'), PDFNumber.of(1));
        //}
      }
    }
  });

  return await pdfDoc.save();

  //pdfDoc.save()
};

/*const fillInField = (pdfDoc: PDFDocument, fieldName, text, fontSize) => {
  const field = findAcroFieldByName(pdfDoc, fieldName);
  if (!field) throw new Error(`Missing AcroField: ${fieldName}`);
  fillAcroTextField(pdfDoc, field, text, fontSize);
};*/

/*const pdfDoc = PDFDocumentFactory.load(fs.readFileSync('./template.pdf'));

// ...Embed fonts and images...
// ...Define hardcoded field names dictionary...



fillInField(fieldNames.name, 'Mario');
fillInField(fieldNames.age, '24 years');
fillInField(fieldNames.height, `5' 1"`);
fillInField(fieldNames.weight, '196 lbs');
fillInField(fieldNames.eyes, 'blue');
fillInField(fieldNames.skin, 'white');
fillInField(fieldNames.hair, 'brown');

// ...Fill in remaining fields...

const contentStream = pdfDoc.register(
  pdfDoc.createContentStream(
    drawImage('MarioImage', {
      x: 50,
      y: 450,
      width: marioImageDims.width * 0.6,
      height: marioImageDims.height * 0.6,
    }),
    drawImage('MarioEmblem', {
      x: 447,
      y: 520,
      width: marioEmblemDims.width * 0.75,
      height: marioEmblemDims.height * 0.75,
    }),
  ),
);

const pages = pdfDoc.getPages();

pages[0]
  .addImageObject('MarioImage', marioImageRef)
  .addImageObject('MarioEmblem', marioEmblemRef)
  .addContentStreams(contentStream);

const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
*/
