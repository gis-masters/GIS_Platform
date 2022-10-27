import { LibraryRecord } from '../data/doc-library.service';
import { schemaService } from '../data/schema.service';
import { Schema } from '../data/schema.models';
import { featureExtractRejectionTemplate } from './templates/featureExtractRejection';
import { rawDataTemplate } from './templates/rawData';

export interface PrintTemplate {
  name: string;
  title: string;
  margin: [number, number, number, number];
  orientation: 'p' | 'portrait' | 'l' | 'landscape';
  format: string | number[];
  print(document: LibraryRecord, schema: Schema): string;
}

export const printTemplates: PrintTemplate[] = [featureExtractRejectionTemplate, rawDataTemplate];

export async function printDocument(document: LibraryRecord, templateName: string): Promise<void> {
  const template = printTemplates.find(({ name }) => name === templateName);
  const schema = await schemaService.getSchema(document.schemaId);

  if (!template) {
    throw `Не найден шаблон печати "${templateName}"`;
  }

  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF(template.orientation, 'px', template.format);
  doc.addFileToVFS('roboto.ttf', await getFont());
  doc.addFont('roboto.ttf', 'roboto', 'normal');
  doc.setFont('roboto');

  await doc.html(template.print(document, schema), {
    callback: pdf => {
      pdf.save(document.title + '.pdf');
    },
    margin: template.margin
  });
}

let font: string;

async function getFont() {
  if (!font) {
    const response = await fetch('/assets/fonts/Roboto/Roboto-Regular.ttf.base64');
    font = await response.text();
  }

  return font;
}
