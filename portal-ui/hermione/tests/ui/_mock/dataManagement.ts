/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockDataManagement(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '0',
      size: '10',
      sort: 'created_at,desc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 58,
          title: 'Восток Крыма',
          type: 'DATASET',
          identifier: 'workspace_3',
          itemsCount: 10,
          createdAt: '2020-11-27 20:23:50.965997'
        },
        {
          id: 13,
          title: 'Мирновское сельское поселение',
          type: 'DATASET',
          identifier: 'workspace_1077',
          itemsCount: 45,
          createdAt: '2020-11-27 20:23:50.664135'
        },
        {
          id: 7,
          title: 'Краснополянское сельское поселение',
          type: 'DATASET',
          identifier: 'workspace_457',
          itemsCount: 44,
          createdAt: '2020-11-27 20:23:50.297896'
        }
      ],
      page: {
        size: 3,
        totalElements: 315,
        totalPages: 32,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '2',
      size: '10',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 818,
          title: 'Правдовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1175',
          itemsCount: 49,
          createdAt: '2020-11-27 20:23:57.184272'
        },
        {
          id: 870,
          title: 'Железнодорожненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_823',
          itemsCount: 71,
          createdAt: '2020-11-27 20:23:57.573671'
        },
        {
          id: 973,
          title: 'Славновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1197',
          itemsCount: 86,
          createdAt: '2020-11-27 20:23:58.119837'
        }
      ],
      page: {
        size: 3,
        totalElements: 315,
        totalPages: 32,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '3',
      size: '10',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 818,
          title: 'Правдовское сельское поселение',
          type: 'DATASET',
          identifier: 'workspace_1175',
          itemsCount: 49,
          createdAt: '2020-11-27 20:23:57.184272'
        },
        {
          id: 870,
          title: 'Железнодорожненское сельское поселение',
          type: 'DATASET',
          identifier: 'workspace_823',
          itemsCount: 71,
          createdAt: '2020-11-27 20:23:57.573671'
        },
        {
          id: 973,
          title: 'Славновское сельское поселение',
          type: 'DATASET',
          identifier: 'workspace_1197',
          itemsCount: 86,
          createdAt: '2020-11-27 20:23:58.119837'
        }
      ],
      page: {
        size: 3,
        totalElements: 315,
        totalPages: 32,
        number: 2
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '0',
      size: '5',
      sort: 'title,desc',
      title: 'Мир'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 2477,
          title: 'парк Эмира Бухарского',
          type: 'DATASET',
          identifier: 'dataset_ad483a',
          itemsCount: 12,
          createdAt: '2021-04-02 11:16:54.752602'
        },
        {
          id: 2154,
          title: 'Мирновское СП',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_16',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:01.440822'
        },
        {
          id: 13,
          title: 'Мирновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1077',
          itemsCount: 45,
          createdAt: '2020-11-27 20:23:50.664135'
        }
      ],
      page: {
        size: 5,
        totalElements: 3,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457$/,
    status: 200,
    response: JSON.stringify({
      id: 7,
      title: 'Краснополянское сельское поселение',
      type: 'DATASET',
      identifier: 'workspace_457',
      itemsCount: 44,
      createdAt: '2020-11-27T20:23:50.297896',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_3$/,
    status: 200,
    response: JSON.stringify({
      id: 58,
      title: 'Восток Крыма',
      type: 'DATASET',
      identifier: 'workspace_3',
      itemsCount: 10,
      createdAt: '2020-11-27 20:23:50.965997',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/dataset_ad483a$/,
    status: 200,
    response: JSON.stringify({
      id: 2477,
      title: 'парк Эмира Бухарского',
      type: 'DATASET',
      identifier: 'dataset_ad483a',
      itemsCount: 12,
      createdAt: '2021-04-02T11:16:54.752602',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_823$/,
    status: 200,
    response: JSON.stringify({
      id: 870,
      title: 'Железнодорожненское сельское поселение',
      type: 'DATASET',
      identifier: 'workspace_823',
      itemsCount: 71,
      createdAt: '2020-11-27T20:23:57.573671',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/dataset_ad483a\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'OWNER',
          principalId: 2,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 11856
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_1077$/,
    status: 200,
    response: JSON.stringify({
      id: 13,
      title: 'Мирновское сельское поселение',
      type: 'DATASET',
      identifier: 'workspace_1077',
      itemsCount: 45,
      createdAt: '2020-11-27T20:23:50.664135',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_499957\/tables$/,
    params: {
      page: '0',
      size: '10',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      status: 'NOT_FOUND',
      message: 'Ресурс не найден по идентификатору: workspace_499957',
      errors: null
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/tables$/,
    params: {
      page: '2',
      size: '5',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 173,
          title: 'Объекты капитального строительства',
          type: 'TABLE',
          identifier: 'oks_457_87c8',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'oks',
          createdAt: '2020-11-28T13:44:30.720824'
        },
        {
          id: 174,
          title: 'Земельные участки',
          type: 'TABLE',
          identifier: 'zu_457_b83b',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'zu',
          createdAt: '2020-11-28T13:44:31.821638'
        }
      ],
      page: {
        size: 5,
        totalElements: 44,
        totalPages: 9,
        number: 2
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/tables$/,
    params: {
      page: '1',
      size: '5',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 173,
          title: 'Объекты капитального строительства',
          type: 'TABLE',
          identifier: 'oks_457_87c8',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'oks',
          createdAt: '2020-11-28T13:44:30.720824'
        },
        {
          id: 174,
          title: 'Земельные участки',
          type: 'TABLE',
          identifier: 'zu_457_b83b',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'zu',
          createdAt: '2020-11-28T13:44:31.821638'
        }
      ],
      page: {
        size: 5,
        totalElements: 6,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/tables$/,
    params: {
      page: '0',
      size: '5',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 173,
          title: 'Объекты капитального строительства',
          type: 'TABLE',
          identifier: 'oks_457_87c8',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'oks',
          createdAt: '2020-11-28T13:44:30.720824'
        },
        {
          id: 174,
          title: 'Земельные участки',
          type: 'TABLE',
          identifier: 'zu_457_b83b',
          itemsCount: 0,
          crs: 'EPSG:314314',
          schemaId: 'zu',
          createdAt: '2020-11-28T13:44:31.821638'
        }
      ],
      page: {
        size: 5,
        totalElements: 6,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/tables\/oks_457_87c8$/,
    status: 200,
    response: JSON.stringify({
      id: 173,
      title: 'Объекты капитального строительства',
      type: 'TABLE',
      identifier: 'oks_457_87c8',
      itemsCount: 0,
      crs: 'EPSG:314314',
      schemaId: 'oks',
      createdAt: '2020-11-28T13:44:30.720824',
      role: 'OWNER'
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/schemas$/,
    params: {
      schemaIds: 'oks,zu'
    },
    status: 200,
    response: JSON.stringify([
      {
        name: 'zu',
        title: 'Земельные участки',
        description: 'Земельные участки',
        tableName: 'zu',
        properties: [
          {
            name: 'cad_num',
            title: 'Кадастровый номер',
            required: true,
            hidden: false,
            objectIdentityOnUi: true,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 1,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'state',
            title: 'Статус участка',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'CHOICE',
            foreignKeyType: 'INTEGER',
            sequenceNumber: 2,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            enumerations: [
              { value: '1', title: 'Ранее учтенный' },
              { value: '5', title: 'Временный' },
              { value: '6', title: 'Учтенный' }
            ]
          },
          {
            name: 'address_no',
            title: 'Адрес участка',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 3,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'usage',
            title: 'Разрешенное использование',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 4,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'category',
            title: 'Категория землепользования',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'CHOICE',
            foreignKeyType: 'STRING',
            sequenceNumber: 5,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            enumerations: [
              { value: '003001000000', title: 'ЗЕМЛИ СЕЛЬСКОХОЗЯЙСТВЕННОГО НАЗНАЧЕНИЯ' },
              { value: '003001000010', title: 'Сельскохозяйственные угодья' },
              {
                value: '003001000020',
                title:
                  'Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции'
              },
              {
                value: '003001000030',
                title: 'Прочие земельные участки из состава земель сельскохозяйственного назначения'
              },
              { value: '003002000000', title: 'ЗЕМЛИ НАСЕЛЕННЫХ ПУНКТОВ' },
              {
                value: '003002000010',
                title: 'Земельные участки, отнесенные к зонам сельскохозяйственного использования'
              },
              {
                value: '003002000020',
                title:
                  'Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса'
              },
              {
                value: '003002000030',
                title: 'Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства'
              },
              {
                value: '003002000040',
                title:
                  'Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)'
              },
              {
                value: '003002000060',
                title:
                  'Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства'
              },
              {
                value: '003002000090',
                title:
                  'Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур'
              },
              { value: '003002000110', title: 'Земельные участки для обеспечения обороны' },
              { value: '003002000120', title: 'Земельные участки для обеспечения безопасности' },
              { value: '003002000130', title: 'Земельные участки для обеспечения таможенных нужд' },
              { value: '003002000100', title: 'Прочие земельные участки' },
              {
                value: '003003000000',
                title:
                  'ЗЕМЛИ ПРОМЫШЛЕННОСТИ, ЭНЕРГЕТИКИ, ТРАНСПОРТА, СВЯЗИ, РАДИОВЕЩАНИЯ, ТЕЛЕВИДЕНИЯ, ИНФОРМАТИКИ, ЗЕМЛИ ДЛЯ ОБЕСПЕЧЕНИЯ КОСМИЧЕСКОЙ ДЕЯТЕЛЬНОСТИ, ЗЕМЛИ ОБОРОНЫ, БЕЗОПАСНОСТИ И ЗЕМЛИ ИНОГО СПЕЦИАЛЬНОГО НАЗНАЧЕНИЯ'
              },
              { value: '003003000010', title: 'Земельные участки из состава земель промышленности' },
              { value: '003003000020', title: 'Земельные участки из состава земель энергетики' },
              { value: '003003000030', title: 'Земельные участки из состава земель транспорта' },
              {
                value: '003003000040',
                title: 'Земельные участки из состава земель связи, радиовещания, телевидения, информатики'
              },
              { value: '003003000060', title: 'Земельные участки из состава земель обороны' },
              { value: '003003000070', title: 'Земельные участки из состава земель безопасности' },
              { value: '003008000010', title: 'Земельные участки из состава земель для обеспечения таможенных нужд' },
              { value: '003003000080', title: 'Земельные участки из состава земель иного специального назначения' },
              { value: '003004000000', title: 'ЗЕМЛИ ОСОБО ОХРАНЯЕМЫХ ТЕРРИТОРИЙ И ОБЪЕКТОВ' },
              { value: '003005000000', title: 'ЗЕМЛИ ЛЕСНОГО ФОНДА' },
              { value: '003006000000', title: 'ЗЕМЛИ ВОДНОГО ФОНДА' },
              { value: '003007000000', title: 'ЗЕМЛИ ЗАПАСА' },
              { value: '003008000000', title: 'ЗЕМЕЛЬНЫЕ УЧАСТКИ, ДЛЯ КОТОРЫХ КАТЕГОРИЯ ЗЕМЕЛЬ НЕ УСТАНОВЛЕНА' }
            ]
          },
          {
            name: 'Date_Creat',
            title: 'Дата постановки участка на учет',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'DATETIME',
            whiteSpace: 'preserve',
            sequenceNumber: 6,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'Document_D',
            title: 'Дата формирования документа',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'DATETIME',
            whiteSpace: 'preserve',
            sequenceNumber: 6,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'anno_text',
            title: 'Номер участка',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 7,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'cost',
            title: 'Кадастровая стоимость',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'DOUBLE',
            whiteSpace: 'collapse',
            sequenceNumber: 8,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: 38,
            fractionDigits: 8
          },
          {
            name: 'Area',
            title: 'Площадь, кв.м',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'DOUBLE',
            whiteSpace: 'collapse',
            sequenceNumber: 9,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: 38,
            fractionDigits: 8
          },
          {
            name: 'shape',
            required: false,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'GEOMETRY',
            sequenceNumber: 10,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            allowedValues: ['Polygon']
          },
          {
            name: 'ruleid',
            title: 'Идентификатор стиля',
            required: false,
            hidden: true,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'INT',
            whiteSpace: 'collapse',
            sequenceNumber: 11,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          }
        ],
        customRuleFunction: null,
        calcFiledFunction: null,
        originName: 'zu',
        type: null,
        readOnly: false,
        geometryType: 'MultiPolygon',
        contentTypes: []
      },
      {
        name: 'oks',
        title: 'Объекты капитального строительства',
        description: 'Объекты капитального строительства',
        tableName: 'oks',
        properties: [
          {
            name: 'cad_num',
            title: 'Кадастровый номер',
            required: true,
            hidden: false,
            objectIdentityOnUi: true,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 1,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'address',
            title: 'Адрес',
            required: true,
            hidden: false,
            objectIdentityOnUi: true,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 1,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'TypeOTI',
            title: 'Вид объекта',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'CHOICE',
            foreignKeyType: 'STRING',
            sequenceNumber: 5,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            enumerations: [
              { value: '002001000000', title: 'Объекты учёта и регистрации' },
              { value: '002001001000', title: 'Земельный участок' },
              { value: '002001002000', title: 'Здание' },
              { value: '002001003000', title: 'Помещение' },
              { value: '002001004000', title: 'Сооружение' },
              {
                value: '002001004001',
                title: 'Линейное сооружение, расположенное более чем в одном кадастровом округе'
              },
              { value: '002001004002', title: 'Условная часть линейного сооружения' },
              { value: '002001005000', title: 'Объект незавершённого строительства' },
              { value: '002001006000', title: 'Предприятие как имущественный комплекс (ПИК)' },
              { value: '002001007000', title: 'Участок недр' },
              { value: '002001008000', title: 'Единый недвижимый комплекс' },
              { value: '002002000000', title: 'Границы' },
              { value: '002002001000', title: 'Государственная граница Российской Федерации' },
              { value: '002002002000', title: 'Граница между субъектами Российской Федерации' },
              { value: '002002003000', title: 'Граница муниципального образования' },
              { value: '002002004000', title: 'Граница населённого пункта' },
              { value: '002003000000', title: 'Зоны' },
              { value: '002003001000', title: 'Зона с особыми условиями использования территорий' },
              { value: '002003002000', title: 'Территориальная зона' },
              { value: '002003003000', title: 'Особая экономическая зона' },
              { value: '002004000000', title: 'Территория объекта культурного наследия' }
            ]
          },
          {
            name: 'Assignatio',
            title: 'Назначение здания',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'CHOICE',
            foreignKeyType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 6,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            enumerations: [
              { value: '204001000000', title: 'Нежилое здание' },
              { value: '204002000000', title: 'Жилой дом' },
              { value: '204003000000', title: 'Многоквартирный дом' }
            ]
          },
          {
            name: 'Doc_Date',
            title: 'Дата регистрации кадастровой выписки',
            required: true,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'DATETIME',
            whiteSpace: 'preserve',
            sequenceNumber: 6,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          },
          {
            name: 'shape',
            required: false,
            hidden: false,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'GEOMETRY',
            sequenceNumber: 8,
            length: -1,
            minLength: -1,
            maxLength: -1,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1,
            allowedValues: ['Polygon']
          },
          {
            name: 'ruleid',
            title: 'Идентификатор стиля',
            required: true,
            hidden: true,
            objectIdentityOnUi: false,
            multiple: false,
            valueType: 'STRING',
            whiteSpace: 'preserve',
            sequenceNumber: 9,
            length: -1,
            minLength: -1,
            maxLength: 254,
            minInclusive: -1,
            maxInclusive: -1,
            totalDigits: -1,
            fractionDigits: -1
          }
        ],
        customRuleFunction: null,
        calcFiledFunction: null,
        originName: 'oks',
        type: null,
        readOnly: true,
        geometryType: 'MultiPolygon',
        contentTypes: []
      }
    ])
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/tables\/oks_457_87c8\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'VIEWER',
          principalId: 453,
          principalType: 'group',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 481
        },
        {
          role: 'VIEWER',
          principalId: 1278,
          principalType: 'group',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 3862
        },
        {
          role: 'VIEWER',
          principalId: 1301,
          principalType: 'group',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 6125
        },
        {
          role: 'VIEWER',
          principalId: 1300,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 10596
        },
        {
          role: 'VIEWER',
          principalId: 5,
          principalType: 'group',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 10939
        }
      ],
      page: {
        size: 300,
        totalElements: 5,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*projects\/find-related-layers$/,
    params: {
      field: 'table',
      value: 'oks_457_87c8'
    },
    status: 200,
    response: JSON.stringify([
      {
        layer: {
          id: 83930,
          title: 'Объекты капитального строительства',
          type: 'vector',
          dataset: 'workspace_457',
          tableName: 'oks_457_87c8',
          enabled: true,
          position: -42,
          transparency: 70,
          maxZoom: 0,
          minZoom: 0,
          styleName: 'oks',
          nativeCRS: 'EPSG:314314',
          schemaId: 'oks',
          dataSourceUri: '/api/data/datasets/workspace_457/tables/oks_457_87c8',
          complexName: 'scratch_database_1:oks_457_87c8'
        },
        project: {
          id: 7,
          name: 'Симферополь',
          internalName: 'workspace_7',
          organizationId: 1,
          bbox: '[3780848.2369, 5604352.5765, 3807022.922, 5633710.057]',
          createdAt: '2020-02-12T14:35:13.484',
          role: 'OWNER',
          default: false
        }
      }
    ])
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_3\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'OWNER',
          principalId: 2,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 11845
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_457\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'OWNER',
          principalId: 2,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 11845
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_823\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'OWNER',
          principalId: 2,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 11593
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets\/workspace_1077\/roleAssignment$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          role: 'OWNER',
          principalId: 2,
          principalType: 'user',
          createdAt: '2021-07-12T11:45:58.161928',
          id: 11577
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*users$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          enabled: true,
          email: 'arh_grad_rk@mail.ru',
          surname: 'РИСОГД',
          login: 'arh_grad_rk@mail.ru',
          middleName: null,
          job: null,
          phone: null,
          createdAt: '2020-02-10T06:44:14.08',
          authorities: [
            {
              authority: 'ORG_ADMIN'
            }
          ],
          name: 'РИСОГД',
          id: 2
        }
      ],
      page: {
        size: 1000,
        totalElements: 369,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*groups$/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          description: null,
          users: [{ id: 922 }],
          createdAt: '2020-09-09T08:40:54.679706',
          name: 'OkunevskoeSP',
          id: 1078
        },
        {
          description: null,
          users: [{ id: 8 }, { id: 19 }],
          createdAt: '2020-06-22T12:56:50.415',
          name: 'readonly_Aromatnoe',
          id: 3
        },
        {
          description: null,
          users: [{ id: 684 }],
          createdAt: '2020-09-01T12:54:41.59982',
          name: 'BotanicheskoeSP',
          id: 844
        }
      ],
      page: {
        size: 1000,
        totalElements: 283,
        totalPages: 1,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '0',
      size: '300',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 7,
          title: 'Краснополянское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_457',
          itemsCount: 44,
          createdAt: '2020-11-27 20:23:50.297896'
        },
        {
          id: 13,
          title: 'Мирновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1077',
          itemsCount: 45,
          createdAt: '2020-11-27 20:23:50.664135'
        },
        {
          id: 58,
          title: 'Восток Крыма',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_3',
          itemsCount: 10,
          createdAt: '2020-11-27 20:23:50.965997'
        },
        {
          id: 64,
          title: 'Стахановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1174',
          itemsCount: 47,
          createdAt: '2020-11-27 20:23:51.100961'
        },
        {
          id: 121,
          title: 'Тест',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_17',
          itemsCount: 55,
          createdAt: '2020-11-27 20:23:51.420863'
        },
        {
          id: 208,
          title: 'Воинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_919',
          itemsCount: 34,
          createdAt: '2020-11-27 20:23:51.576261'
        },
        {
          id: 261,
          title: 'Бахчисарайский мунициальный округ',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_949',
          itemsCount: 59,
          createdAt: '2020-11-27 20:23:51.847486'
        },
        {
          id: 243,
          title: 'Земляничненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_870',
          itemsCount: 53,
          createdAt: '2020-11-27 20:23:52.432257'
        },
        {
          id: 276,
          title: 'Табачненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_950',
          itemsCount: 47,
          createdAt: '2020-11-27 20:23:52.836518'
        },
        {
          id: 317,
          title: 'Новоселовское СП Раздольненского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_834',
          itemsCount: 48,
          createdAt: '2020-11-27 20:23:53.230773'
        },
        {
          id: 362,
          title: 'Братское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1085',
          itemsCount: 55,
          createdAt: '2020-11-27 20:23:53.620007'
        },
        {
          id: 402,
          title: 'Славянское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_957',
          itemsCount: 47,
          createdAt: '2020-11-27 20:23:54.052956'
        },
        {
          id: 455,
          title: 'Луганское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1104',
          itemsCount: 41,
          createdAt: '2020-11-27 20:23:54.423368'
        },
        {
          id: 510,
          title: 'Токаревское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_597',
          itemsCount: 47,
          createdAt: '2020-11-27 20:23:54.71197'
        },
        {
          id: 561,
          title: 'Белинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_469',
          itemsCount: 62,
          createdAt: '2020-11-27 20:23:55.04333'
        },
        {
          id: 611,
          title: 'Цветочненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_861',
          itemsCount: 37,
          createdAt: '2020-11-27 20:23:55.472193'
        },
        {
          id: 661,
          title: 'Межводненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_455',
          itemsCount: 44,
          createdAt: '2020-11-27 20:23:55.759402'
        },
        {
          id: 714,
          title: 'Филатовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_978',
          itemsCount: 35,
          createdAt: '2020-11-27 20:23:56.076758'
        },
        {
          id: 722,
          title: 'Виноградненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_470',
          itemsCount: 60,
          createdAt: '2020-11-27 20:23:56.344843'
        },
        {
          id: 767,
          title: 'Зыбинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_871',
          itemsCount: 44,
          createdAt: '2020-11-27 20:23:56.78528'
        },
        {
          id: 818,
          title: 'Правдовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1175',
          itemsCount: 49,
          createdAt: '2020-11-27 20:23:57.184272'
        },
        {
          id: 870,
          title: 'Железнодорожненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_823',
          itemsCount: 71,
          createdAt: '2020-11-27 20:23:57.573671'
        },
        {
          id: 973,
          title: 'Славновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1197',
          itemsCount: 86,
          createdAt: '2020-11-27 20:23:58.119837'
        },
        {
          id: 1028,
          title: 'Калиновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_468',
          itemsCount: 60,
          createdAt: '2020-11-27 20:23:58.74552'
        },
        {
          id: 1078,
          title: 'Петровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_775',
          itemsCount: 60,
          createdAt: '2020-11-27 20:23:59.269559'
        },
        {
          id: 1185,
          title: 'Черноземненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1112',
          itemsCount: 39,
          createdAt: '2020-11-27 20:23:59.654214'
        },
        {
          id: 1191,
          title: 'Голубинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1117',
          itemsCount: 127,
          createdAt: '2020-11-27 20:24:00.054991'
        },
        {
          id: 1340,
          title: 'Симферополь',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_7',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:00.893706'
        },
        {
          id: 2100,
          title: 'Ленинский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_12',
          itemsCount: 18,
          createdAt: '2020-11-27 20:24:01.103103'
        },
        {
          id: 1391,
          title: 'Белогорский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1199',
          itemsCount: 10,
          createdAt: '2020-11-27 20:24:01.204139'
        },
        {
          id: 1385,
          title: 'Советский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_11',
          itemsCount: 14,
          createdAt: '2020-11-27 20:24:01.2812'
        },
        {
          id: 1383,
          title: 'Кировский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_10',
          itemsCount: 9,
          createdAt: '2020-11-27 20:24:01.349173'
        },
        {
          id: 2154,
          title: 'Мирновское СП',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_16',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:01.440822'
        },
        {
          id: 1439,
          title: 'Новосельское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_477',
          itemsCount: 43,
          createdAt: '2020-11-27 20:24:01.71982'
        },
        {
          id: 1493,
          title: 'Заветненское сельское поселение Ленинского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_873',
          itemsCount: 62,
          createdAt: '2020-11-27 20:24:02.072013'
        },
        {
          id: 1535,
          title: 'Амурское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1134',
          itemsCount: 57,
          createdAt: '2020-11-27 20:24:02.745202'
        },
        {
          id: 1627,
          title: 'СТП Крыма',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_789',
          itemsCount: 200,
          createdAt: '2020-11-27 20:24:03.223249'
        },
        {
          id: 1709,
          title: 'Челядиновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_493',
          itemsCount: 62,
          createdAt: '2020-11-27 20:24:04.027538'
        },
        {
          id: 1763,
          title: 'ГО Алушта',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_5',
          itemsCount: 75,
          createdAt: '2020-11-27 20:24:04.582271'
        },
        {
          id: 2139,
          title: 'Первомайский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1201',
          itemsCount: 5,
          createdAt: '2020-11-27 20:24:05.073568'
        },
        {
          id: 1813,
          title: 'Крымковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_901',
          itemsCount: 38,
          createdAt: '2020-11-27 20:24:05.162943'
        },
        {
          id: 2130,
          title: 'Черноморский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1207',
          itemsCount: 6,
          createdAt: '2020-11-27 20:24:05.408892'
        },
        {
          id: 1866,
          title: 'Приветненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_496',
          itemsCount: 47,
          createdAt: '2020-11-27 20:24:05.481212'
        },
        {
          id: 1908,
          title: 'Чистопольское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_498',
          itemsCount: 58,
          createdAt: '2020-11-27 20:24:05.829868'
        },
        {
          id: 1925,
          title: 'Кольцовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_922',
          itemsCount: 52,
          createdAt: '2020-11-27 20:24:06.234448'
        },
        {
          id: 1976,
          title: 'Зеленогорское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_510',
          itemsCount: 63,
          createdAt: '2020-11-27 20:24:07.051053'
        },
        {
          id: 2028,
          title: 'Чкаловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_513',
          itemsCount: 34,
          createdAt: '2020-11-27 20:24:07.520011'
        },
        {
          id: 2081,
          title: 'Крайненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_923',
          itemsCount: 50,
          createdAt: '2020-11-27 20:24:07.813357'
        },
        {
          id: 2111,
          title: 'Изумрудновское cельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_517',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:08.256741'
        },
        {
          id: 2117,
          title: 'Жемчужинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_518',
          itemsCount: 36,
          createdAt: '2020-11-27 20:24:08.799971'
        },
        {
          id: 2123,
          title: 'Ровновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_522',
          itemsCount: 54,
          createdAt: '2020-11-27 20:24:09.082768'
        },
        {
          id: 2133,
          title: 'Молодежненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_20',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:09.443489'
        },
        {
          id: 2137,
          title: 'Журавлевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_27',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:09.665973'
        },
        {
          id: 2143,
          title: 'Кольчугинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_28',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:09.924473'
        },
        {
          id: 2150,
          title: 'Мазанское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_29',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:10.220063'
        },
        {
          id: 2153,
          title: 'Карта проектов',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_23',
          itemsCount: 1,
          createdAt: '2020-11-27 20:24:10.441624'
        },
        {
          id: 2156,
          title: 'Николаевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_31',
          itemsCount: 38,
          createdAt: '2020-11-27 20:24:10.513593'
        },
        {
          id: 2157,
          title: 'Тенистовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1055',
          itemsCount: 94,
          createdAt: '2020-11-27 20:24:10.855863'
        },
        {
          id: 2165,
          title: 'Донское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1176',
          itemsCount: 34,
          createdAt: '2020-11-27 20:24:11.734934'
        },
        {
          id: 2167,
          title: 'Красноармейское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1056',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:11.985397'
        },
        {
          id: 2169,
          title: 'Октябрьское СП Первомайского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1186',
          itemsCount: 46,
          createdAt: '2020-11-27 20:24:12.259085'
        },
        {
          id: 2170,
          title: 'Войковское С.П. Первомайского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1054',
          itemsCount: 49,
          createdAt: '2020-11-27 20:24:12.625936'
        },
        {
          id: 2171,
          title: 'Почвы Ароматновского СП',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_46',
          itemsCount: 14,
          createdAt: '2020-11-27 20:24:12.938239'
        },
        {
          id: 2172,
          title: 'Новоандреевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_32',
          itemsCount: 34,
          createdAt: '2020-11-27 20:24:13.049855'
        },
        {
          id: 2173,
          title: 'Чистенское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_22',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:13.268189'
        },
        {
          id: 2174,
          title: 'Добровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_24',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:13.514404'
        },
        {
          id: 2175,
          title: 'Пожарское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_36',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:13.728521'
        },
        {
          id: 2176,
          title: 'Родниковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_37',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:13.986862'
        },
        {
          id: 2177,
          title: 'Широковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_38',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:14.226244'
        },
        {
          id: 2178,
          title: 'Школьненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_39',
          itemsCount: 31,
          createdAt: '2020-11-27 20:24:14.481651'
        },
        {
          id: 2179,
          title: 'Скворцовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_40',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:14.72938'
        },
        {
          id: 2180,
          title: 'Трудовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_41',
          itemsCount: 57,
          createdAt: '2020-11-27 20:24:15.04028'
        },
        {
          id: 2181,
          title: 'Укромновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_42',
          itemsCount: 33,
          createdAt: '2020-11-27 20:24:15.401267'
        },
        {
          id: 2182,
          title: 'Урожайновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_43',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:15.6118'
        },
        {
          id: 2183,
          title: 'Вересаевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_804',
          itemsCount: 41,
          createdAt: '2020-11-27 20:24:15.890297'
        },
        {
          id: 2184,
          title: 'Ленинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1072',
          itemsCount: 64,
          createdAt: '2020-11-27 20:24:16.197198'
        },
        {
          id: 2185,
          title: 'Зиминское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_816',
          itemsCount: 62,
          createdAt: '2020-11-27 20:24:16.876746'
        },
        {
          id: 2186,
          title: 'ГО  Джанкой',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1005',
          itemsCount: 55,
          createdAt: '2020-11-27 20:24:17.279704'
        },
        {
          id: 2187,
          title: 'Луговское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_444',
          itemsCount: 81,
          createdAt: '2020-11-27 20:24:17.650898'
        },
        {
          id: 2188,
          title: 'Горностаевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_450',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:18.137437'
        },
        {
          id: 2189,
          title: 'Берёзовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_805',
          itemsCount: 52,
          createdAt: '2020-11-27 20:24:18.55104'
        },
        {
          id: 2190,
          title: 'Майское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1078',
          itemsCount: 42,
          createdAt: '2020-11-27 20:24:18.911921'
        },
        {
          id: 2191,
          title: 'Ильичевское С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_617',
          itemsCount: 60,
          createdAt: '2020-11-27 20:24:19.200679'
        },
        {
          id: 2192,
          title: 'Серебрянское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_810',
          itemsCount: 77,
          createdAt: '2020-11-27 20:24:19.697524'
        },
        {
          id: 2193,
          title: 'Кировское С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_620',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:20.287015'
        },
        {
          id: 2194,
          title: 'Октябрьское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1086',
          itemsCount: 59,
          createdAt: '2020-11-27 20:24:20.626235'
        },
        {
          id: 2195,
          title: 'Красномакское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1092',
          itemsCount: 81,
          createdAt: '2020-11-27 20:24:21.066473'
        },
        {
          id: 2196,
          title: 'Мельничное сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_836',
          itemsCount: 43,
          createdAt: '2020-11-27 20:24:21.665699'
        },
        {
          id: 2197,
          title: 'Первомайское С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_660',
          itemsCount: 43,
          createdAt: '2020-11-27 20:24:21.979561'
        },
        {
          id: 2198,
          title: 'Рощинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1107',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:22.28822'
        },
        {
          id: 2199,
          title: 'Суворовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_744',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:22.662268'
        },
        {
          id: 2200,
          title: 'Новониколаевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_445',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:23.015901'
        },
        {
          id: 2201,
          title: 'Глазовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_446',
          itemsCount: 66,
          createdAt: '2020-11-27 20:24:23.44079'
        },
        {
          id: 2202,
          title: 'Ильичевское сельское поселение Советского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_843',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:23.896237'
        },
        {
          id: 2203,
          title: 'Светловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1108',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:24.176272'
        },
        {
          id: 2204,
          title: 'Советское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_841',
          itemsCount: 55,
          createdAt: '2020-11-27 20:24:24.470531'
        },
        {
          id: 2205,
          title: 'Кондратьевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1073',
          itemsCount: 43,
          createdAt: '2020-11-27 20:24:25.080889'
        },
        {
          id: 2206,
          title: 'Зеленовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1168',
          itemsCount: 91,
          createdAt: '2020-11-27 20:24:25.444944'
        },
        {
          id: 2207,
          title: 'Щелкинcкое городское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_452',
          itemsCount: 55,
          createdAt: '2020-11-27 20:24:26.08184'
        },
        {
          id: 2208,
          title: 'Степновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1187',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:26.472678'
        },
        {
          id: 2209,
          title: 'Зерновское С.П. Красногвардейского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1044',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:26.835241'
        },
        {
          id: 2210,
          title: 'Воробьевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_862',
          itemsCount: 43,
          createdAt: '2020-11-27 20:24:27.400739'
        },
        {
          id: 2211,
          title: 'Уютненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_745',
          itemsCount: 35,
          createdAt: '2020-11-27 20:24:27.688797'
        },
        {
          id: 2212,
          title: 'Добрушинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_941',
          itemsCount: 50,
          createdAt: '2020-11-27 20:24:27.946811'
        },
        {
          id: 2213,
          title: 'Черноморское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_591',
          itemsCount: 31,
          createdAt: '2020-11-27 20:24:28.274599'
        },
        {
          id: 2214,
          title: 'Мысовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_453',
          itemsCount: 67,
          createdAt: '2020-11-27 20:24:28.54111'
        },
        {
          id: 2215,
          title: 'Пахаревское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1040',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:29.023616'
        },
        {
          id: 2216,
          title: 'Кукушкинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_353',
          itemsCount: 49,
          createdAt: '2020-11-27 20:24:29.358142'
        },
        {
          id: 2217,
          title: 'Красногвардейское сельское поселение СП',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_855',
          itemsCount: 62,
          createdAt: '2020-11-27 20:24:29.71148'
        },
        {
          id: 2218,
          title: 'Крымское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_142',
          itemsCount: 47,
          createdAt: '2020-11-27 20:24:30.120048'
        },
        {
          id: 2219,
          title: 'Островское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_511',
          itemsCount: 42,
          createdAt: '2020-11-27 20:24:30.400586'
        },
        {
          id: 2220,
          title: 'Первомайское СП Симферопольского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1141',
          itemsCount: 41,
          createdAt: '2020-11-27 20:24:30.66718'
        },
        {
          id: 2221,
          title: 'Курское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_991',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:30.943559'
        },
        {
          id: 2222,
          title: 'Вишенское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_874',
          itemsCount: 52,
          createdAt: '2020-11-27 20:24:31.25981'
        },
        {
          id: 2223,
          title: 'Медведевское сельское поселение СП',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_986',
          itemsCount: 42,
          createdAt: '2020-11-27 20:24:31.599273'
        },
        {
          id: 2224,
          title: 'Синицынское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_995',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:31.879914'
        },
        {
          id: 2225,
          title: 'Золотополенское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1018',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:32.253898'
        },
        {
          id: 2226,
          title: 'Новогригорьевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_770',
          itemsCount: 32,
          createdAt: '2020-11-27 20:24:32.577286'
        },
        {
          id: 2227,
          title: 'Ботаническое сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_791',
          itemsCount: 51,
          createdAt: '2020-11-27 20:24:32.836889'
        },
        {
          id: 2228,
          title: 'Митрофановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1007',
          itemsCount: 34,
          createdAt: '2020-11-27 20:24:33.202394'
        },
        {
          id: 2229,
          title: 'Батальненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_465',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:33.472544'
        },
        {
          id: 2230,
          title: 'Каштановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1020',
          itemsCount: 73,
          createdAt: '2020-11-27 20:24:33.953195'
        },
        {
          id: 2231,
          title: 'Восходненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_627',
          itemsCount: 69,
          createdAt: '2020-11-27 20:24:34.662077'
        },
        {
          id: 2232,
          title: 'Семисотское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_479',
          itemsCount: 82,
          createdAt: '2020-11-27 20:24:35.184858'
        },
        {
          id: 2233,
          title: 'Окунёвское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1015',
          itemsCount: 62,
          createdAt: '2020-11-27 20:24:35.744583'
        },
        {
          id: 2234,
          title: 'Масловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_504',
          itemsCount: 49,
          createdAt: '2020-11-27 20:24:36.21488'
        },
        {
          id: 2235,
          title: 'Почвы Ароматновсеого селького поселения',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_202',
          itemsCount: 15,
          createdAt: '2020-11-27 20:24:36.49734'
        },
        {
          id: 2236,
          title: 'Ильинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_914',
          itemsCount: 37,
          createdAt: '2020-11-27 20:24:36.637917'
        },
        {
          id: 2237,
          title: 'Виноградовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_934',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:36.903168'
        },
        {
          id: 2238,
          title: 'ГО Саки',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1037',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:37.157619'
        },
        {
          id: 2239,
          title: 'Марьяновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_527',
          itemsCount: 51,
          createdAt: '2020-11-27 20:24:37.515582'
        },
        {
          id: 2240,
          title: 'Роскошненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1039',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:37.876552'
        },
        {
          id: 2241,
          title: 'Колодезянское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_532',
          itemsCount: 50,
          createdAt: '2020-11-27 20:24:38.220606'
        },
        {
          id: 2242,
          title: 'Стальненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1045',
          itemsCount: 57,
          createdAt: '2020-11-27 20:24:38.725974'
        },
        {
          id: 2244,
          title: 'Test_stp_oks',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1046',
          itemsCount: 1,
          createdAt: '2020-11-27 20:24:39.120183'
        },
        {
          id: 2243,
          title: 'Желябовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_543',
          itemsCount: 31,
          createdAt: '2020-11-27 20:24:39.178943'
        },
        {
          id: 2245,
          title: 'Кировское сельское поселение Черноморского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_593',
          itemsCount: 41,
          createdAt: '2020-11-27 20:24:39.416806'
        },
        {
          id: 2246,
          title: 'Чайкинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1074',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:39.68816'
        },
        {
          id: 2247,
          title: 'ГО Керчь',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1016',
          itemsCount: 64,
          createdAt: '2020-11-27 20:24:39.959631'
        },
        {
          id: 2248,
          title: 'Зоркинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_747',
          itemsCount: 33,
          createdAt: '2020-11-27 20:24:40.360915'
        },
        {
          id: 2249,
          title: 'Угловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_842',
          itemsCount: 41,
          createdAt: '2020-11-27 20:24:40.584739'
        },
        {
          id: 2250,
          title: 'Ручьевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_811',
          itemsCount: 75,
          createdAt: '2020-11-27 20:24:40.928683'
        },
        {
          id: 2251,
          title: 'Калининское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1170',
          itemsCount: 42,
          createdAt: '2020-11-27 20:24:41.436556'
        },
        {
          id: 2252,
          title: 'Зaвет-Ленинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_515',
          itemsCount: 51,
          createdAt: '2020-11-27 20:24:41.816332'
        },
        {
          id: 2253,
          title: 'Ишуньское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_916',
          itemsCount: 36,
          createdAt: '2020-11-27 20:24:42.165234'
        },
        {
          id: 2254,
          title: 'Марьевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_448',
          itemsCount: 63,
          createdAt: '2020-11-27 20:24:42.415794'
        },
        {
          id: 2255,
          title: 'Криничненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_987',
          itemsCount: 74,
          createdAt: '2020-11-27 20:24:42.928928'
        },
        {
          id: 2256,
          title: 'ГО Феодосия',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_308',
          itemsCount: 45,
          createdAt: '2020-11-27 20:24:43.38476'
        },
        {
          id: 2257,
          title: 'Совхозненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_761',
          itemsCount: 36,
          createdAt: '2020-11-27 20:24:43.645565'
        },
        {
          id: 2258,
          title: 'Приозерновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1094',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:43.880269'
        },
        {
          id: 2259,
          title: 'Сусанинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1188',
          itemsCount: 51,
          createdAt: '2020-11-27 20:24:44.289564'
        },
        {
          id: 2260,
          title: 'Багеровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1001',
          itemsCount: 64,
          createdAt: '2020-11-27 20:24:44.675592'
        },
        {
          id: 2261,
          title: 'Кировское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_463',
          itemsCount: 64,
          createdAt: '2020-11-27 20:24:45.084855'
        },
        {
          id: 2262,
          title: 'Новожиловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_863',
          itemsCount: 59,
          createdAt: '2020-11-27 20:24:45.583694'
        },
        {
          id: 2263,
          title: 'Васильевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_867',
          itemsCount: 69,
          createdAt: '2020-11-27 20:24:46.033934'
        },
        {
          id: 2264,
          title: 'Абрикосовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1181',
          itemsCount: 45,
          createdAt: '2020-11-27 20:24:46.440462'
        },
        {
          id: 2265,
          title: 'Краснознаменское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1019',
          itemsCount: 56,
          createdAt: '2020-11-27 20:24:46.787876'
        },
        {
          id: 2266,
          title: 'Партизанское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_509',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:47.254176'
        },
        {
          id: 2267,
          title: 'Чапаевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1109',
          itemsCount: 72,
          createdAt: '2020-11-27 20:24:47.576974'
        },
        {
          id: 2268,
          title: 'Зуйское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_885',
          itemsCount: 55,
          createdAt: '2020-11-27 20:24:48.169994'
        },
        {
          id: 2269,
          title: 'Лесновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1190',
          itemsCount: 47,
          createdAt: '2020-11-27 20:24:48.549733'
        },
        {
          id: 2270,
          title: 'Уваровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_505',
          itemsCount: 58,
          createdAt: '2020-11-27 20:24:48.960138'
        },
        {
          id: 2271,
          title: 'Новокрымское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1114',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:49.368907'
        },
        {
          id: 2272,
          title: 'Далёковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_512',
          itemsCount: 48,
          createdAt: '2020-11-27 20:24:49.723524'
        },
        {
          id: 2273,
          title: 'Целинное сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_894',
          itemsCount: 40,
          createdAt: '2020-11-27 20:24:50.047816'
        },
        {
          id: 2274,
          title: 'Марфовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_996',
          itemsCount: 64,
          createdAt: '2020-11-27 20:24:50.378918'
        },
        {
          id: 2275,
          title: 'Богатовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_826',
          itemsCount: 67,
          createdAt: '2020-11-27 20:24:50.928378'
        },
        {
          id: 2276,
          title: 'Краснофлотское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_910',
          itemsCount: 65,
          createdAt: '2020-11-27 20:24:51.458529'
        },
        {
          id: 2277,
          title: 'Нижнегорское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1002',
          itemsCount: 31,
          createdAt: '2020-11-27 20:24:51.985615'
        },
        {
          id: 2278,
          title: 'Охотниковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_524',
          itemsCount: 47,
          createdAt: '2020-11-27 20:24:52.266721'
        },
        {
          id: 2279,
          title: 'Орловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1124',
          itemsCount: 36,
          createdAt: '2020-11-27 20:24:52.730188'
        },
        {
          id: 2280,
          title: 'Войковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1013',
          itemsCount: 61,
          createdAt: '2020-11-27 20:24:53.02595'
        },
        {
          id: 2281,
          title: 'Долинненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_399',
          itemsCount: 65,
          createdAt: '2020-11-27 20:24:53.471255'
        },
        {
          id: 2282,
          title: 'Чернопольское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_534',
          itemsCount: 53,
          createdAt: '2020-11-27 20:24:54.212181'
        },
        {
          id: 2283,
          title: 'Митяевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_925',
          itemsCount: 65,
          createdAt: '2020-11-27 20:24:54.667211'
        },
        {
          id: 2284,
          title: 'Крымскорозовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_536',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:55.131718'
        },
        {
          id: 2285,
          title: 'Ореховское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_926',
          itemsCount: 47,
          createdAt: '2020-11-27 20:24:55.520224'
        },
        {
          id: 2286,
          title: 'Русаковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1022',
          itemsCount: 44,
          createdAt: '2020-11-27 20:24:55.855285'
        },
        {
          id: 2287,
          title: 'Сарыбашское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_541',
          itemsCount: 46,
          createdAt: '2020-11-27 20:24:56.163013'
        },
        {
          id: 2288,
          title: 'Красногорское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_545',
          itemsCount: 63,
          createdAt: '2020-11-27 20:24:56.557161'
        },
        {
          id: 2289,
          title: 'Заветненское сельское поселение Советского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_932',
          itemsCount: 39,
          createdAt: '2020-11-27 20:24:57.141541'
        },
        {
          id: 2290,
          title: 'ГО Евпатория',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1026',
          itemsCount: 86,
          createdAt: '2020-11-27 20:24:57.414873'
        },
        {
          id: 2291,
          title: 'Гвардейское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1142',
          itemsCount: 35,
          createdAt: '2020-11-27 20:24:57.980398'
        },
        {
          id: 2292,
          title: 'Почтовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_943',
          itemsCount: 96,
          createdAt: '2020-11-27 20:24:58.343673'
        },
        {
          id: 2293,
          title: 'Черновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1151',
          itemsCount: 52,
          createdAt: '2020-11-27 20:24:58.969987'
        },
        {
          id: 2294,
          title: 'Изобильненское СП Нижнегорского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_771',
          itemsCount: 31,
          createdAt: '2020-11-27 20:24:59.29181'
        },
        {
          id: 2295,
          title: 'Фрунзенское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1041',
          itemsCount: 34,
          createdAt: '2020-11-27 20:24:59.49796'
        },
        {
          id: 2296,
          title: 'Яркополенское сельское поселение Кировского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_548',
          itemsCount: 51,
          createdAt: '2020-11-27 20:24:59.766661'
        },
        {
          id: 2297,
          title: 'Вилинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_549',
          itemsCount: 55,
          createdAt: '2020-11-27 20:25:00.091656'
        },
        {
          id: 2298,
          title: 'Нeкрасовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_550',
          itemsCount: 60,
          createdAt: '2020-11-27 20:25:00.428151'
        },
        {
          id: 2299,
          title: 'Азовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1068',
          itemsCount: 37,
          createdAt: '2020-11-27 20:25:00.800432'
        },
        {
          id: 2300,
          title: 'Победненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_552',
          itemsCount: 44,
          createdAt: '2020-11-27 20:25:01.094046'
        },
        {
          id: 2301,
          title: 'Просторненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_553',
          itemsCount: 56,
          createdAt: '2020-11-27 20:25:01.462933'
        },
        {
          id: 2302,
          title: 'Лобановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1075',
          itemsCount: 40,
          createdAt: '2020-11-27 20:25:01.828923'
        },
        {
          id: 2303,
          title: 'Красноярское сельское поселение ',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_596',
          itemsCount: 41,
          createdAt: '2020-11-27 20:25:02.164318'
        },
        {
          id: 2304,
          title: 'Акимовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_601',
          itemsCount: 38,
          createdAt: '2020-11-27 20:25:02.493884'
        },
        {
          id: 2305,
          title: 'ГО Красноперекопск',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1009',
          itemsCount: 45,
          createdAt: '2020-11-27 20:25:02.74506'
        },
        {
          id: 2306,
          title: 'Скалистовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_752',
          itemsCount: 82,
          createdAt: '2020-11-27 20:25:03.080344'
        },
        {
          id: 2307,
          title: 'Льговское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_607',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:03.611883'
        },
        {
          id: 2308,
          title: 'Гришинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_609',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:03.939591'
        },
        {
          id: 1558,
          title: 'Генеральный план Симферопольского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1130',
          itemsCount: 137,
          createdAt: '2020-11-27 20:25:04.28422'
        },
        {
          id: 2309,
          title: 'Ивановское сельское поселение Нижнегорского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_610',
          itemsCount: 34,
          createdAt: '2020-11-27 20:25:04.872891'
        },
        {
          id: 2310,
          title: 'Крестьяновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1171',
          itemsCount: 48,
          createdAt: '2020-11-27 20:25:05.320454'
        },
        {
          id: 2311,
          title: 'Перовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1137',
          itemsCount: 41,
          createdAt: '2020-11-27 20:25:05.61496'
        },
        {
          id: 2312,
          title: 'Гвардейское С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_612',
          itemsCount: 47,
          createdAt: '2020-11-27 20:25:05.909217'
        },
        {
          id: 2313,
          title: 'Останинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1089',
          itemsCount: 64,
          createdAt: '2020-11-27 20:25:06.238569'
        },
        {
          id: 2314,
          title: 'Клепининское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_650',
          itemsCount: 51,
          createdAt: '2020-11-27 20:25:06.661271'
        },
        {
          id: 2315,
          title: 'Новоивановское сельское поселение ',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_614',
          itemsCount: 41,
          createdAt: '2020-11-27 20:25:07.015455'
        },
        {
          id: 2316,
          title: 'Ермаковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1102',
          itemsCount: 39,
          createdAt: '2020-11-27 20:25:07.444382'
        },
        {
          id: 2317,
          title: 'Александровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1191',
          itemsCount: 48,
          createdAt: '2020-11-27 20:25:07.769137'
        },
        {
          id: 2318,
          title: 'Верхореченское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_783',
          itemsCount: 93,
          createdAt: '2020-11-27 20:25:08.260099'
        },
        {
          id: 2319,
          title: 'Новопокровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_623',
          itemsCount: 57,
          createdAt: '2020-11-27 20:25:08.963381'
        },
        {
          id: 2320,
          title: 'Найденовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_626',
          itemsCount: 51,
          createdAt: '2020-11-27 20:25:09.376848'
        },
        {
          id: 2321,
          title: 'Пятихатское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_630',
          itemsCount: 55,
          createdAt: '2020-11-27 20:25:09.76387'
        },
        {
          id: 2322,
          title: 'Калининское СП Красногвардейского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_680',
          itemsCount: 58,
          createdAt: '2020-11-27 20:25:10.189924'
        },
        {
          id: 2323,
          title: 'Веселовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1125',
          itemsCount: 43,
          createdAt: '2020-11-27 20:25:10.565787'
        },
        {
          id: 2324,
          title: 'Плодовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_819',
          itemsCount: 82,
          createdAt: '2020-11-27 20:25:10.942275'
        },
        {
          id: 2325,
          title: 'Косточковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_651',
          itemsCount: 31,
          createdAt: '2020-11-27 20:25:11.536852'
        },
        {
          id: 2326,
          title: 'Октябрьское СП Красногвардейского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_683',
          itemsCount: 45,
          createdAt: '2020-11-27 20:25:11.763532'
        },
        {
          id: 2327,
          title: 'Старый Крым городское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1143',
          itemsCount: 37,
          createdAt: '2020-11-27 20:25:12.086671'
        },
        {
          id: 2328,
          title: 'Красногвардейское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_647',
          itemsCount: 47,
          createdAt: '2020-11-27 20:25:12.309285'
        },
        {
          id: 2329,
          title: 'Янтарненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_675',
          itemsCount: 56,
          createdAt: '2020-11-27 20:25:13.136323'
        },
        {
          id: 2330,
          title: 'Лиственское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_655',
          itemsCount: 32,
          createdAt: '2020-11-27 20:25:13.511182'
        },
        {
          id: 2331,
          title: 'Кормовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_661',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:13.762873'
        },
        {
          id: 2332,
          title: 'Емельяновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_679',
          itemsCount: 30,
          createdAt: '2020-11-27 20:25:14.096034'
        },
        {
          id: 2333,
          title: 'Михайловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_682',
          itemsCount: 32,
          createdAt: '2020-11-27 20:25:14.312541'
        },
        {
          id: 2334,
          title: 'Журавское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_684',
          itemsCount: 48,
          createdAt: '2020-11-27 20:25:14.559138'
        },
        {
          id: 2335,
          title: 'Лениново сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_685',
          itemsCount: 62,
          createdAt: '2020-11-27 20:25:14.871939'
        },
        {
          id: 2336,
          title: 'Абрикосовское сельское поселение Кировский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_687',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:15.323293'
        },
        {
          id: 2337,
          title: 'Полтавское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_688',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:15.670137'
        },
        {
          id: 2338,
          title: 'Ивановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1167',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:16.015171'
        },
        {
          id: 2339,
          title: 'Табачненскoе С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_692',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:16.43795'
        },
        {
          id: 2340,
          title: 'Яркополенское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_693',
          itemsCount: 58,
          createdAt: '2020-11-27 20:25:16.888319'
        },
        {
          id: 2341,
          title: 'Охотское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_695',
          itemsCount: 31,
          createdAt: '2020-11-27 20:25:17.266577'
        },
        {
          id: 2342,
          title: 'Куйбышевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_755',
          itemsCount: 102,
          createdAt: '2020-11-27 20:25:17.591829'
        },
        {
          id: 2343,
          title: 'Дрофинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_718',
          itemsCount: 32,
          createdAt: '2020-11-27 20:25:18.271187'
        },
        {
          id: 2344,
          title: 'Чернышевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_956',
          itemsCount: 56,
          createdAt: '2020-11-27 20:25:18.805927'
        },
        {
          id: 2345,
          title: 'Ярковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_698',
          itemsCount: 42,
          createdAt: '2020-11-27 20:25:19.412203'
        },
        {
          id: 2346,
          title: 'Пшеничненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_699',
          itemsCount: 34,
          createdAt: '2020-11-27 20:25:19.720579'
        },
        {
          id: 2348,
          title: 'Яснополянское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_700',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:20.023258'
        },
        {
          id: 2349,
          title: 'Садовое сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_701',
          itemsCount: 31,
          createdAt: '2020-11-27 20:25:20.378306'
        },
        {
          id: 2351,
          title: 'Заречненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_702',
          itemsCount: 48,
          createdAt: '2020-11-27 20:25:20.657686'
        },
        {
          id: 2352,
          title: 'Уваровское сельское поселение Нижнегорского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_703',
          itemsCount: 31,
          createdAt: '2020-11-27 20:25:21.012583'
        },
        {
          id: 2353,
          title: 'Прудовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_704',
          itemsCount: 39,
          createdAt: '2020-11-27 20:25:21.227969'
        },
        {
          id: 2354,
          title: 'Новопавловское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1116',
          itemsCount: 34,
          createdAt: '2020-11-27 20:25:21.563288'
        },
        {
          id: 2347,
          title: 'Котельниковское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_706',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:22.060706'
        },
        {
          id: 2350,
          title: 'Владиславовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_773',
          itemsCount: 47,
          createdAt: '2020-11-27 20:25:22.68175'
        },
        {
          id: 2355,
          title: 'Почётненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_720',
          itemsCount: 34,
          createdAt: '2020-11-27 20:25:23.0124'
        },
        {
          id: 2356,
          title: 'Урожайновское С. П.',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_710',
          itemsCount: 60,
          createdAt: '2020-11-27 20:25:23.280954'
        },
        {
          id: 2357,
          title: 'Пушкинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_711',
          itemsCount: 39,
          createdAt: '2020-11-27 20:25:23.692626'
        },
        {
          id: 2358,
          title: 'Ароматненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_784',
          itemsCount: 74,
          createdAt: '2020-11-27 20:25:24.050338'
        },
        {
          id: 2359,
          title: 'Муромское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_859',
          itemsCount: 58,
          createdAt: '2020-11-27 20:25:24.637216'
        },
        {
          id: 2360,
          title: 'Сизовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_827',
          itemsCount: 47,
          createdAt: '2020-11-27 20:25:25.115535'
        },
        {
          id: 2361,
          title: 'ГО Ялта',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_989',
          itemsCount: 148,
          createdAt: '2020-11-27 20:25:25.566263'
        },
        {
          id: 2362,
          title: 'Вишнёвское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_716',
          itemsCount: 37,
          createdAt: '2020-11-27 20:25:26.141966'
        },
        {
          id: 2363,
          title: 'Оленёвское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_721',
          itemsCount: 46,
          createdAt: '2020-11-27 20:25:26.394881'
        },
        {
          id: 2364,
          title: 'Зерновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_786',
          itemsCount: 41,
          createdAt: '2020-11-27 20:25:26.762735'
        },
        {
          id: 2365,
          title: 'Молочненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_828',
          itemsCount: 37,
          createdAt: '2020-11-27 20:25:27.052495'
        },
        {
          id: 2366,
          title: 'Городское поселение Белогорск',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_977',
          itemsCount: 40,
          createdAt: '2020-11-27 20:25:27.309418'
        },
        {
          id: 2367,
          title: 'Штормовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_737',
          itemsCount: 45,
          createdAt: '2020-11-27 20:25:27.599332'
        },
        {
          id: 2368,
          title: 'Ковыльновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_794',
          itemsCount: 59,
          createdAt: '2020-11-27 20:25:27.947875'
        },
        {
          id: 2369,
          title: 'Ромашкинскoе сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_727',
          itemsCount: 39,
          createdAt: '2020-11-27 20:25:28.366984'
        },
        {
          id: 2370,
          title: 'Столбовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_738',
          itemsCount: 40,
          createdAt: '2020-11-27 20:25:28.716109'
        },
        {
          id: 2371,
          title: 'Проектные границы',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1198',
          itemsCount: 1,
          createdAt: '2020-11-27 20:25:28.998136'
        },
        {
          id: 2372,
          title: 'Первомайское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_730',
          itemsCount: 53,
          createdAt: '2020-11-27 20:25:29.112227'
        },
        {
          id: 2373,
          title: 'Песчановское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1103',
          itemsCount: 57,
          createdAt: '2020-11-27 20:25:29.473312'
        },
        {
          id: 2374,
          title: 'Раздольненское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_814',
          itemsCount: 32,
          createdAt: '2020-11-27 20:25:29.871243'
        },
        {
          id: 2376,
          title: 'Мичуринское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1121',
          itemsCount: 44,
          createdAt: '2020-11-27 20:25:30.148191'
        },
        {
          id: 2377,
          title: 'Геройское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_920',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:30.493113'
        },
        {
          id: 2379,
          title: 'Джанкойский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1200',
          itemsCount: 9,
          createdAt: '2020-11-27 20:25:30.796165'
        },
        {
          id: 2378,
          title: 'Алексеевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1131',
          itemsCount: 47,
          createdAt: '2020-11-27 20:25:30.883151'
        },
        {
          id: 2380,
          title: 'Дмитровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_906',
          itemsCount: 65,
          createdAt: '2020-11-27 20:25:31.312217'
        },
        {
          id: 2381,
          title: 'Медведевское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_912',
          itemsCount: 40,
          createdAt: '2020-11-27 20:25:31.803673'
        },
        {
          id: 2382,
          title: 'Новофедоровское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_936',
          itemsCount: 35,
          createdAt: '2020-11-27 20:25:32.101712'
        },
        {
          id: 2383,
          title: 'Ароматновское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1017',
          itemsCount: 53,
          createdAt: '2020-11-27 20:25:32.448729'
        },
        {
          id: 2384,
          title: 'ГО Армянск',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_944',
          itemsCount: 49,
          createdAt: '2020-11-27 20:25:32.915386'
        },
        {
          id: 2385,
          title: 'ГО Судак',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1035',
          itemsCount: 309,
          createdAt: '2020-11-27 20:25:33.576735'
        },
        {
          id: 2386,
          title: 'Магазинское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1133',
          itemsCount: 58,
          createdAt: '2020-11-27 20:25:35.927832'
        },
        {
          id: 2387,
          title: 'Новоселовское сельское поселение',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1139',
          itemsCount: 31,
          createdAt: '2020-11-27 20:25:36.632464'
        },
        {
          id: 2388,
          title: 'Бахчисарайский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1202',
          itemsCount: 4,
          createdAt: '2020-11-27 20:25:36.896321'
        },
        {
          id: 2389,
          title: 'Ленинское СП Красногвардейского района',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_694',
          itemsCount: 50,
          createdAt: '2020-11-27 20:25:36.980614'
        },
        {
          id: 2391,
          title: 'Красноперекопский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1203',
          itemsCount: 5,
          createdAt: '2020-11-27 20:25:37.303527'
        },
        {
          id: 2393,
          title: 'Сакский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1204',
          itemsCount: 5,
          createdAt: '2020-11-27 20:25:37.344641'
        },
        {
          id: 2392,
          title: 'Раздольненский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1205',
          itemsCount: 5,
          createdAt: '2020-11-27 20:25:37.379905'
        },
        {
          id: 2390,
          title: 'Красногвардейский район',
          details: 'null',
          type: 'DATASET',
          identifier: 'workspace_1206',
          itemsCount: 5,
          createdAt: '2020-11-27 20:25:37.418059'
        },
        {
          id: 2135,
          title: 'Ленинский район',
          type: 'DATASET',
          identifier: 'dataset_cbb30a',
          itemsCount: 2,
          createdAt: '2020-12-01 11:37:59.607017'
        },
        {
          id: 1701,
          title: 'Тестовые слои',
          details: 'НТО',
          type: 'DATASET',
          identifier: 'dataset_2acad7',
          itemsCount: 48,
          createdAt: '2020-12-04 13:25:57.827853'
        },
        {
          id: 2395,
          title: 'test2',
          details: 'asdf',
          type: 'DATASET',
          identifier: 'dataset_a47f83',
          itemsCount: 6,
          createdAt: '2020-12-11 09:53:28.490646'
        },
        {
          id: 2409,
          title: 'ТЕСТ Канивец',
          type: 'DATASET',
          identifier: 'dataset_1d3037',
          itemsCount: 3,
          createdAt: '2020-12-15 14:03:00.768215'
        },
        {
          id: 2470,
          title: 'РНГП',
          details: 'Региональные нормативы градостроительного проектирования',
          type: 'DATASET',
          identifier: 'dataset_d9e378',
          itemsCount: 6,
          createdAt: '2021-03-30 12:41:53.636203'
        },
        {
          id: 2477,
          title: 'парк Эмира Бухарского',
          type: 'DATASET',
          identifier: 'dataset_ad483a',
          itemsCount: 12,
          createdAt: '2021-04-02 11:16:54.752602'
        },
        {
          id: 2496,
          title: 'Test Ibader',
          type: 'DATASET',
          identifier: 'dataset_3be852',
          itemsCount: 1,
          createdAt: '2021-04-19 12:31:30.882138'
        },
        {
          id: 2498,
          title: 'Вольновское сельское поселение',
          type: 'DATASET',
          identifier: 'dataset_a5f213',
          itemsCount: 2,
          createdAt: '2021-04-22 07:51:17.840334'
        },
        {
          id: 2519,
          title: 'Проект дороги Грушева-Судак',
          type: 'DATASET',
          identifier: 'dataset_cdb1de',
          itemsCount: 2,
          createdAt: '2021-05-17 12:59:32.887408'
        },
        {
          id: 100002,
          title: 'Надзор',
          type: 'DATASET',
          identifier: 'dataset_926066',
          itemsCount: 0,
          createdAt: '2021-07-14 09:34:11.353725'
        },
        {
          id: 100011,
          title: 'Дежурные данные',
          type: 'DATASET',
          identifier: 'dataset_8538a0',
          itemsCount: 0,
          createdAt: '2021-09-14 06:38:10.842578'
        },
        {
          id: 100014,
          title: 'тестовый гмл от севы',
          details: 'test',
          type: 'DATASET',
          identifier: 'dataset_21d6a1',
          itemsCount: 0,
          createdAt: '2021-09-15 15:13:30.517406'
        },
        {
          id: 100123,
          title: 'Генеральный план Армянск 2021 10K',
          details: 'Зловещий эксперимент',
          type: 'DATASET',
          identifier: 'dataset_021898',
          itemsCount: 0,
          createdAt: '2021-09-16 14:01:45.721594'
        },
        {
          id: 100134,
          title: 'Фиолент',
          type: 'DATASET',
          identifier: 'dataset_c5682d',
          itemsCount: 0,
          createdAt: '2021-09-17 13:33:55.870462'
        },
        {
          id: 100142,
          title: 'пример 1г',
          details: 'пар',
          type: 'DATASET',
          identifier: 'dataset_578cc6',
          itemsCount: 0,
          createdAt: '2021-09-22 11:57:16.745143'
        }
      ],
      page: {
        size: 300,
        totalElements: 328,
        totalPages: 2,
        number: 0
      }
    })
  });

  await mockApi(browser, {
    method: 'get',
    url: /.*data\/datasets$/,
    params: {
      page: '9999',
      size: '10',
      sort: 'created_at,asc'
    },
    status: 200,
    response: JSON.stringify({
      page: {
        size: 10,
        totalElements: 328,
        totalPages: 33,
        number: 9999
      }
    })
  });
}
