import { unparse } from 'papaparse';
import * as XLSX from 'xlsx';

import { saveAsCsv } from './FileSaver';

export function exportAsCSV(data: unknown[][], filename: string): void {
  saveAsCsv(filename + '.csv', unparse(data, { delimiter: ';', quotes: true, escapeChar: ',' }));
}

export function exportAsXLSX(data: unknown[][], filename: string, sheetName = 'Лист 1'): void {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename + '.xlsx');
}
