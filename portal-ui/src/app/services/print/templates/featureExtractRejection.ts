import { LibraryRecord } from '../../data/docLibrary/docLibrary.models';
import { PrintTemplate } from '../print.service';

function print(document: LibraryRecord): string {
  return `
    <h1 style="font-size: 14px; width: 410px; text-align: center;">${document.title}</h1>
    <p style="font-size: 10px; width: 410px; text-indent: 10px; margin: 0 0 5px 0;">
      Уважаемый <u>${String(document.applicant_name)}</u>, вам отказано в предоставлении сведений об объекте,
      расположенном по адресу <u>${String(document.address)}</u>.
    </p>
    <p style="font-size: 10px; width: 463px; text-indent: 10px; margin: 0 0 5px 0;">
      Причина отказа: <u>${String(document.rejection_reason)}</u>.
    </p>
    <p style="font-size: 10px; width: 463px; text-indent: 10px; margin: 0 0 5px 0;">
      Оператор _______________________________ _______
    </p>
    <p style="font-size: 10px; width: 463px; text-indent: 10px; margin: 0 0 5px 0;">
      Дата _________
    </p>
  `;
}

export const featureExtractRejectionTemplate: PrintTemplate = {
  name: 'featureExtractRejection',
  title: 'Отказ в предоставлении сведений',
  margin: [10, 15, 40, 25],
  orientation: 'portrait',
  format: 'a4',
  print
};
