import { describe, expect, test } from '@jest/globals';

import { prepareReportData } from './prepareReportData';

const PNG_1X1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWNgYGD4DwABDQEC81VxbAAAAABJRU5ErkJggg==';

const JPEG_1X1 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//AP8=';

describe('prepareReportData', () => {
  test('данные без картинок возвращаются как есть, media пуст', () => {
    const data = { title: 'Заголовок', count: 42, flag: true };
    const result = prepareReportData(data);

    expect(result.data).toStrictEqual(data);
    expect(result.media).toStrictEqual({});
  });

  test('не мутирует исходный объект', () => {
    const data = { map: PNG_1X1 };
    const copy = { ...data };

    prepareReportData(data);

    expect(data).toStrictEqual(copy);
  });

  test('извлекает картинку на верхнем уровне', () => {
    const data = { header: 'Отчёт', map: PNG_1X1 };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared.map).toBe('{%map%}');
    expect(media['{%map%}']).toBe(PNG_1X1);
    expect(prepared.header).toBe('Отчёт');
  });

  test('извлекает картинку из вложенного объекта', () => {
    const data = { section: { photo: JPEG_1X1 } };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual({ section: { photo: '{%section.photo%}' } });
    expect(media['{%section.photo%}']).toBe(JPEG_1X1);
  });

  test('извлекает картинку из массива', () => {
    const data = { images: [PNG_1X1, JPEG_1X1] };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual({ images: ['{%images.0%}', '{%images.1%}'] });
    expect(media['{%images.0%}']).toBe(PNG_1X1);
    expect(media['{%images.1%}']).toBe(JPEG_1X1);
  });

  test('извлекает картинку из объекта внутри массива', () => {
    const data = {
      items: [
        { name: 'Фото 1', src: PNG_1X1 },
        { name: 'Фото 2', src: JPEG_1X1 }
      ]
    };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual({
      items: [
        { name: 'Фото 1', src: '{%items.0.src%}' },
        { name: 'Фото 2', src: '{%items.1.src%}' }
      ]
    });
    expect(Object.keys(media)).toHaveLength(2);
  });

  test('глубокая вложенность — путь формируется корректно', () => {
    const data = { a: { b: { c: { d: PNG_1X1 } } } };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual({ a: { b: { c: { d: '{%a.b.c.d%}' } } } });
    expect(media['{%a.b.c.d%}']).toBe(PNG_1X1);
  });

  test('несколько картинок на разных уровнях', () => {
    const data = {
      map: PNG_1X1,
      details: { photo: JPEG_1X1 },
      gallery: [PNG_1X1]
    };
    const { media } = prepareReportData(data);

    expect(Object.keys(media)).toHaveLength(3);
    expect(media['{%map%}']).toBe(PNG_1X1);
    expect(media['{%details.photo%}']).toBe(JPEG_1X1);
    expect(media['{%gallery.0%}']).toBe(PNG_1X1);
  });

  test('обычные строки, содержащие "base64", не считаются картинками', () => {
    const data = { note: 'Файл закодирован в base64', path: '/images/base64/logo.png' };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual(data);
    expect(media).toStrictEqual({});
  });

  test('примитивы (числа, boolean, null) проходят без изменений', () => {
    const data = { num: 0, flag: false, empty: null as unknown };
    const { data: prepared, media } = prepareReportData(data);

    expect(prepared).toStrictEqual(data);
    expect(media).toStrictEqual({});
  });

  test('пустой объект → пустой результат', () => {
    const { data: prepared, media } = prepareReportData({});

    expect(prepared).toStrictEqual({});
    expect(media).toStrictEqual({});
  });
});
