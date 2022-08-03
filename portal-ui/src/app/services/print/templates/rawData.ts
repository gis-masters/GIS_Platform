import { LibraryRecord } from '../../data/doc-library.service';
import { Schema } from '../../data/schema.models';
import { PrintTemplate } from '../print.service';

function print(document: LibraryRecord, schema: Schema): string {
  let html = `
    <h1 style="font-size: 14px; width: 420px; text-align: center;">${document.title}</h1>
    <table
      style="height: auto; font-size: 10px; width: 420px;"
      cellpadding="2"
      cellspacing="2"
    >
      <tbody>
  `;

  for (const [key, value] of Object.entries(document)) {
    html += `
    <tr>
      <td style="color:#666;">${schema.properties.find(({ name }) => name === key)?.title || key}</td>
      <td style="word-break: break-all;">
        ${typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
      </td>
    </tr>
    `;
  }

  html += '</tbody></table>';

  return html;
}

export const rawDataTemplate: PrintTemplate = {
  name: 'rawData',
  title: 'Данные',
  margin: [5, 10, 20, 10],
  orientation: 'portrait',
  format: 'a4',
  print
};
