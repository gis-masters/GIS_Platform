import { debounce, type DebouncedFunc } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { convertOldToNewSchema } from '../schema/utils/convertOldToNewSchema';
import { schemaTemplateClient } from './schemaTemplate.client';
import { type SchemaTemplate, type SchemaTemplateWithOldSchema } from './schemaTemplate.models';

function toSchemaTemplate(item: SchemaTemplateWithOldSchema): SchemaTemplate {
  return {
    ...item,
    classRule: convertOldToNewSchema(item.classRule)
  };
}

class SchemaTemplateService {
  private static _instance: SchemaTemplateService;
  static get instance(): SchemaTemplateService {
    return this._instance || (this._instance = new this());
  }

  private templates: { [key: string]: Promise<SchemaTemplateWithOldSchema> } = {};

  private templatesResolvers: {
    [key: string]: (value: SchemaTemplateWithOldSchema | PromiseLike<SchemaTemplateWithOldSchema>) => void;
  } = {};

  private templatesRejecters: { [key: string]: (reason?: unknown) => void } = {};

  private fetchingPool: string[] = [];

  private fetchingAllTemplates?: Promise<void>;

  private fetchingNow = 0;

  private readonly debouncedFetch: DebouncedFunc<(fetchAll?: boolean) => Promise<void>>;

  private constructor() {
    // fetch запускается из таймера debounce вне контекста вызывающего кода,
    // поэтому его ошибку гасим здесь: ожидающим она уже доставлена через reject()
    // в checkForsakenResolvers, а необработанный reject таймера дал бы глобальную ошибку.
    this.debouncedFetch = debounce(async (fetchAll?: boolean) => {
      try {
        await this.fetch(fetchAll);
      } catch {
        // ошибка доставлена ожидающим промисам в checkForsakenResolvers
      }
    }, 20);
  }

  clearCache(): void {
    this.templates = {};
    this.templatesResolvers = {};
    this.templatesRejecters = {};
    this.fetchingPool = [];
    this.fetchingAllTemplates = undefined;
    this.fetchingNow = 0;
  }

  async getSchemaTemplateWithOldSchema(name: string): Promise<SchemaTemplateWithOldSchema> {
    return this.getByName(name);
  }

  async getSchemaTemplatesWithOldSchema(schemaIds: string[] = []): Promise<SchemaTemplateWithOldSchema[]> {
    if (!schemaIds.length) {
      return this.getAll();
    }

    return Promise.all(schemaIds.map(id => this.getSchemaTemplateWithOldSchema(id)));
  }

  async getSchemaTemplate(name: string): Promise<SchemaTemplate> {
    return toSchemaTemplate(await this.getSchemaTemplateWithOldSchema(name));
  }

  async getSchemaTemplates(schemaIds: string[] = []): Promise<SchemaTemplate[]> {
    const items = await this.getSchemaTemplatesWithOldSchema(schemaIds);

    return items.map(toSchemaTemplate);
  }

  private async getByName(name: string): Promise<SchemaTemplateWithOldSchema> {
    if (!this.templates[name]) {
      const templatePromise = new Promise<SchemaTemplateWithOldSchema>((resolve, reject) => {
        this.templatesResolvers[name] = resolve;
        this.templatesRejecters[name] = reject;
      });
      this.templates[name] = templatePromise;
      this.fetchingPool.push(name);
      // debounce возвращает управление до реального fetch, поэтому отклонять шаблон здесь нельзя.
      // Резолв/реджект придёт из fetch -> checkForsakenResolvers после ответа сервера.
      void this.debouncedFetch();

      return templatePromise;
    }

    return this.templates[name];
  }

  private async getAll(): Promise<SchemaTemplateWithOldSchema[]> {
    if (!this.fetchingAllTemplates) {
      this.fetchingAllTemplates = this.fetch(true);
    }

    await this.fetchingAllTemplates;

    return Promise.all(Object.values(this.templates));
  }

  private async fetch(fetchAll?: boolean): Promise<void> {
    this.fetchingNow++;
    const payload = fetchAll ? [] : this.fetchingPool.splice(0);
    const response = await schemaTemplateClient.getSchemaTemplates(payload);

    if (!response) {
      const fetchError = new Error(`Getting schema templates ${JSON.stringify(payload)} error`);
      this.fetchingNow--;
      this.checkForsakenResolvers(fetchError);
      throw fetchError;
    }

    response.forEach(template => {
      if (!template) {
        Toast.error('Возникла ошибка при загрузке шаблона схемы');

        return;
      }

      const { name } = template;
      if (this.templatesResolvers[name]) {
        this.templatesResolvers[name](template);
        delete this.templatesResolvers[name];
        delete this.templatesRejecters[name];
      } else if (!this.templates[name]) {
        this.templates[name] = Promise.resolve(template);
      }
    });

    this.fetchingNow--;
    this.checkForsakenResolvers();
  }

  private rejectForsakenTemplate(name: string, error: Error): void {
    const reject = this.templatesRejecters[name];
    if (!reject) {
      return;
    }

    reject(error);
    delete this.templates[name];
    delete this.templatesResolvers[name];
    delete this.templatesRejecters[name];
  }

  private checkForsakenResolvers(fetchError?: Error): void {
    if (!this.fetchingPool.length && !this.fetchingNow) {
      for (const [name] of Object.entries(this.templatesRejecters)) {
        this.rejectForsakenTemplate(name, fetchError ?? new Error('Не найдена схема ' + name));
      }
    }
  }
}

export const schemaTemplateService = SchemaTemplateService.instance;
