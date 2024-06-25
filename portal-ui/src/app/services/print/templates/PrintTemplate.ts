interface PrintTemplateOptions<T> {
  name: string;
  title: string;
  format: string | number[];
  margin: [number, number, number, number];
  orientation: 'p' | 'portrait' | 'l' | 'landscape';
  render: (entity: T) => string | Promise<string>;
  getFileName(entity: T): string | Promise<string>;
}

export class PrintTemplate<T> {
  name: string;
  title: string;
  private format: string | number[];
  private margin: [number, number, number, number];
  private orientation: 'p' | 'portrait' | 'l' | 'landscape';
  private render: (entity: T) => string | Promise<string>;
  private getFileName: (entity: T) => string | Promise<string>;

  private roboto?: string;
  private htmlFiles: Record<string, Promise<string>> = {};

  constructor({ name, title, format, margin, orientation, render, getFileName }: PrintTemplateOptions<T>) {
    this.name = name;
    this.title = title;
    this.format = format;
    this.margin = margin;
    this.orientation = orientation;
    this.render = render;
    this.getFileName = getFileName;
  }

  private async getHtmlFile(filename: string): Promise<string> {
    if (!this.htmlFiles[filename]) {
      this.htmlFiles[filename] = fetch(`/assets/templates/${this.name}/${filename}.html`).then(r => r.text());
    }

    return await this.htmlFiles[filename];
  }

  async print(entity: T): Promise<void> {
    const html = await this.render(entity);

    if (!html) {
      return;
    }
    await this.printHtml(html, await this.getFileName(entity), this.orientation, this.format, this.margin);
  }

  async renderFragment(filename: string, data: Record<string, string | number>): Promise<string> {
    const file = await this.getHtmlFile(filename);

    return file.replaceAll(/{{(.*?)}}/g, (_, key: string) => String(data[key]));
  }

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

  private async getFont() {
    if (!this.roboto) {
      const response = await fetch('/assets/fonts/Roboto/Roboto-Regular.ttf.base64');
      this.roboto = await response.text();
    }

    return this.roboto;
  }
}
