interface PrintTemplateOptions<T> {
  name: string;
  title: string;
  format?: string | number[]; // Формат бумаги (A4, A3 или [ширина, высота])
  margin?: [number, number, number, number]; // Отступы: [верх, право, низ, лево]
  orientation?: 'p' | 'portrait' | 'l' | 'landscape'; // Ориентация страницы
  render: (entity: T) => Promise<string | void>;
  getFileName(entity: T): string | Promise<string>;
}

export class PrintTemplate<T> {
  name: string;
  title: string;
  private format?: string | number[];
  private margin?: [number, number, number, number];
  private orientation?: 'p' | 'portrait' | 'l' | 'landscape';
  private render: (entity: T) => Promise<string | void>;
  getFileName: (entity: T) => string | Promise<string>;

  private roboto?: string;
  private htmlFiles: Record<string, Promise<string>> = {};

  constructor({ name, title, format, margin, orientation, render, getFileName }: PrintTemplateOptions<T>) {
    this.name = name;
    this.title = title;
    this.format = format;
    this.margin = margin || [0, 0, 0, 0];
    this.orientation = orientation || 'p';
    this.render = render;
    this.getFileName = getFileName;
  }

  private async getHtmlFile(filename: string): Promise<string> {
    if (!this.htmlFiles[filename]) {
      // Загрузка HTML-файла из папки assets
      this.htmlFiles[filename] = fetch(`/assets/templates/${this.name}/${filename}.html`).then(r => r.text());
    }

    return await this.htmlFiles[filename];
  }

  // Основной метод для печати документа
  async print(entity: T): Promise<void> {
    // Рендеринг HTML-контента с использованием переданной функции render
    const html = await this.render(entity);

    if (!html || !this.orientation || !this.format || !this.margin) {
      return;
    }

    // Печать сгенерированного HTML
    await this.printHtml(html, await this.getFileName(entity), this.orientation, this.format, this.margin);
  }

  // Метод для рендеринга фрагментов шаблона с подстановкой данных
  async renderFragment(filename: string, data: Record<string, string | number | boolean>): Promise<string> {
    let file = await this.getHtmlFile(filename);

    // eslint-disable-next-line regexp/match-any
    const ifPattern = /{{#if\s+([\w-]+)}}([\S\s]*?){{\/if}}/g;
    file = file.replaceAll(ifPattern, (_, condition: string, content: string) => {
      const trimmedCondition = condition.trim();

      if (!(trimmedCondition in data)) {
        return '';
      }

      const conditionValue = data[trimmedCondition];
      const isTruthy = this.isTruthy(conditionValue);

      return isTruthy ? content : '';
    });

    const varPattern = /{{([\w-]+)}}/g;

    return file.replaceAll(varPattern, (_, key: string) => {
      const trimmedKey = key.trim();

      return trimmedKey in data ? String(data[trimmedKey]) : '';
    });
  }

  private isTruthy(value: string | number | boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }

    return value !== 'false' && value !== '0' && value !== '';
  }

  // Метод для создания PDF из HTML
  private async printHtml(
    html: string,
    fileName: string,
    orientation: 'p' | 'portrait' | 'l' | 'landscape',
    format: string | number[],
    margin: number[] = [0, 0, 0, 0]
  ): Promise<void> {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF(orientation, 'px', format);

    doc.addFileToVFS('roboto.ttf', await this.getFont());
    doc.addFont('roboto.ttf', 'roboto', 'normal');
    doc.setFont('roboto');

    await doc.html(html, {
      callback: pdf => {
        pdf.save(fileName + '.pdf');
      },
      margin
    });
  }

  // Получение шрифта Roboto в формате base64 с кэшированием
  private async getFont() {
    if (!this.roboto) {
      // Загрузка предварительно сконвертированного шрифта
      const response = await fetch('/assets/fonts/Roboto/Roboto-Regular.ttf.base64');
      this.roboto = await response.text();
    }

    return this.roboto;
  }
}
