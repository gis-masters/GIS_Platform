import { getFileDownloadUrl } from '../../data/files/files.service';
import { type TemplateInfo } from '../../reportTemplate/reportTemplate.models';
import { downloadByUrl } from '../../util/FileSaver';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { reportClient } from '../report.client';
import { type CreateReportRequest, type PrintPreparedData } from '../report.models';
import { prepareReportData } from '../utils/prepareReportData';

export abstract class PrintTemplate<T> {
  readonly name: string;
  readonly title: string;

  constructor(info: TemplateInfo) {
    this.name = info.name;
    this.title = info.title;
  }

  abstract getData(entity: T): Promise<PrintPreparedData | void>;

  abstract getFileName(entity: T): Promise<string>;

  protected getTemplateName(_prepared: PrintPreparedData, _entity: T): string {
    return this.name;
  }

  /**
   * Генерирует отчёт через report-service (Carbon).
   * Base64-картинки из `data` автоматически выносятся в `media`.
   * Если передан `fileName`, файл автоматически скачивается пользователю через браузер.
   * @returns Идентификатор сгенерированного файла.
   */
  protected async printWithCarbon(
    data: unknown,
    templateName: string,
    outputFormat: CreateReportRequest['outputFormat'],
    fileName?: string
  ): Promise<string> {
    if (!isRecordStringUnknown(data)) {
      throw new Error('Некорректные данные шаблона печати: ожидается объект');
    }
    const { data: preparedData, media } = prepareReportData(data);
    const fileId = await reportClient.createReport({
      outputFormat,
      templateName,
      media,
      data: preparedData
    });

    if (fileName) {
      await downloadByUrl(getFileDownloadUrl(fileId), fileName);
    }

    return fileId;
  }

  async print(entity: T): Promise<void> {
    const prepared = await this.getData(entity);
    if (prepared == null) {
      return;
    }
    const fileName = await this.getFileName(entity);
    const templateName = this.getTemplateName(prepared, entity);
    const { outputFormat, templateData } = prepared;
    await this.printWithCarbon(templateData, templateName, outputFormat, fileName);
  }
}
