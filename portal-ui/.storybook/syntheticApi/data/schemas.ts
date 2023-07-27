import { OldSchema, ValueType } from '../../../src/app/services/data/schema/schemaOld.models';
import { GeometryType } from '../../../src/app/services/geoserver/wfs/wfs.models';

export const schemas: OldSchema[] = [
  {
    name: 'projects',
    title: 'Проекты',
    description: 'Проекты',
    tableName: 'projects',
    properties: [
      {
        name: 'name',
        title: 'Наименование проекта',
        required: true,
        objectIdentityOnUi: true,
        valueType: ValueType.STRING,
        maxLength: 254
      },
      // @ts-ignore - в реальной схеме нет title
      {
        name: 'shape',
        required: true,
        valueType: ValueType.GEOMETRY,
        allowedValues: ['Polygon']
      },
      {
        name: 'state',
        title: 'Статус проекта',
        required: true,
        valueType: ValueType.CHOICE,
        foreignKeyType: 'INTEGER',
        enumerations: [
          { value: '2', title: 'Не выполнялось' },
          { value: '1', title: 'Готов' },
          { value: '3', title: 'Загружены растровые ПЗЗ' },
          { value: '4', title: 'Данные устарели' },
          { value: '6', title: 'Прозрачность' }
        ]
      },
      {
        name: 'project',
        title: 'Ссылка на проект',
        required: true,
        valueType: ValueType.URL
      },
      {
        name: 'ruleid',
        title: 'Идентификатор стиля',
        required: true,
        hidden: true,
        valueType: ValueType.STRING,
        maxLength: 254
      },
      {
        name: 'proj_date',
        title: 'Дата формирования проекта',
        valueType: ValueType.DATETIME
      },
      {
        name: 'last_apd',
        title: 'Дата последнего обновления данных',
        valueType: ValueType.DATETIME
      },
      {
        name: 'contact',
        title: 'Контактное лицо',
        valueType: ValueType.STRING,
        maxLength: 254
      },
      {
        name: 'phone_numb',
        title: 'Телефон',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254
      },
      {
        name: 'usage',
        title: 'Использование',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        enumerations: [
          { value: '1', title: 'Доступ предоставлен' },
          { value: '1', title: 'Доступ не предоставлен' },
          { value: '3', title: 'Активное пользование' }
        ]
      },
      {
        name: 'acces_date',
        title: 'Дата предоставления доступа к проекту',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME
      },
      {
        name: 'note',
        title: 'Комментарий к проекту',
        required: false,
        hidden: false,
        objectIdentityOnUi: true,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254
      },
      {
        name: 'creator',
        title: 'Исполнитель',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        foreignKeyType: 'STRING',
        enumerations: [
          { value: 'Соколова', title: 'Соколова' },
          { value: 'Лютикова', title: 'Лютикова' },
          { value: 'Матвеева', title: 'Матвеева' },
          { value: 'Куклина', title: 'Куклина' },
          { value: 'Машталер', title: 'Машталер' },
          { value: 'Мушинская', title: 'Мушинская' },
          { value: 'Горбань', title: 'Горбань' },
          { value: 'Косенко', title: 'Косенко' },
          { value: 'Соловьев', title: 'Соловьев' }
        ]
      }
    ],
    originName: 'projects',
    type: null,
    readOnly: false,
    geometryType: GeometryType.MULTI_POLYGON,
    contentTypes: [],
    printTemplates: [],
    relations: []
  },
  {
    name: 'dl_data_section5_schema',
    title: 'Раздел5.Градостроительное зонирование',
    description: 'Раздел5.Градостроительное зонирование',
    tableName: 'dl_data_section5',
    properties: [
      {
        name: 'id',
        title: 'Идентификатор',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.INT,
        minWidth: 0
      },
      {
        name: 'is_folder',
        title: 'Признак раздела',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.BOOLEAN,
        minWidth: 0
      },
      {
        name: 'path',
        title: 'Полный путь, отражающий иерархию объектов',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        minWidth: 0
      },
      {
        name: 'size',
        title: 'Размер в kb',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.INT,
        minWidth: 0
      },
      {
        name: 'title',
        title: 'Наименование документа',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 500,
        minWidth: 0
      },
      {
        name: 'created_by',
        title: 'Создатель',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'inner_path',
        title: 'Где лежит',
        required: true,
        hidden: true,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        minWidth: 0
      },
      {
        name: 'type',
        title: 'Тип',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'oktmo',
        title: 'ОКТМО',
        required: true,
        hidden: true,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 11,
        minWidth: 0
      },
      {
        name: 'content_type_id',
        title: 'Идентификатор контент типа',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'created_at',
        title: 'Дата создания',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'last_modified',
        title: 'Дата последней модификации',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'classid',
        title: 'Класс данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: '1.01', title: 'Схема территориального планирования Российской Федерации' },
          { value: '2.01', title: 'Схема территориального планирования двух и более субъектов Российской Федерации' },
          { value: '2.02', title: 'Схемы территориального планирования субъекта Российской Федерации' },
          { value: '3.01', title: 'Схема территориального планирования муниципального района' },
          { value: '3.02', title: 'Генеральный план поселения' },
          { value: '3.03', title: 'Генеральный план городского округа, муниципального округа' },
          { value: '4.01', title: 'Региональные нормативы градостроительного проектирования' },
          { value: '4.02', title: 'Местные нормативы градостроительного проектирования поселения' },
          { value: '4.03', title: 'Местные нормативы градостроительного проектирования муниципального района' },
          {
            value: '4.04',
            title: 'Местные нормативы градостроительного проектирования городского округа, муниципального округа'
          },
          { value: '5.01', title: 'Правила землепользования и застройки' },
          { value: '6.01', title: 'Правила благоустройства территории' },
          { value: '7.01', title: 'Проект планировки территории' },
          { value: '7.02', title: 'Проект межевания территории' },
          { value: '8.01', title: 'Материалы и результаты инженерных изысканий' },
          { value: '9.01', title: 'Разрешение на создание искусственного земельного участка' },
          { value: '9.02', title: 'Разрешение на проведение работ по созданию искусственного земельного участка' },
          { value: '9.03', title: 'Разрешение на ввод искусственно созданного земельного участка в эксплуатацию' },
          { value: '10.01', title: 'Решение об установлении зоны с особыми условиями использования территории' },
          {
            value: '10.02',
            title: 'Решение о прекращении существования зоны с особыми условиями использования территории'
          },
          { value: '11.01', title: 'Материалы по надземным и подземным коммуникациям' },
          { value: '12.01', title: 'Решение об изъятии земельного участка для государственных нужд' },
          { value: '12.02', title: 'Решение о резервировании земель для государственных нужд' },
          { value: '12.03', title: 'Решение об изъятии земельного участка для муниципальных нужд' },
          { value: '12.04', title: 'Решение о резервировании земель для муниципальных нужд' },
          { value: '13.01', title: 'Градостроительный план земельного участка' },
          { value: '13.02', title: 'Заключение государственной историко-культурной экспертизы' },
          { value: '13.03', title: 'Заключение государственной экологической экспертизы' },
          { value: '13.04', title: 'Разрешение на строительство' },
          { value: '13.05', title: 'Решение о прекращении действия разрешения на строительство' },
          { value: '13.06', title: 'Решение о внесении изменений в разрешение на строительство' },
          { value: '13.07', title: 'Сведения об экспертизе проектной документации' },
          {
            value: '13.08 ',
            title:
              'Заключения о соответствии предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объектов капитального строительства'
          },
          {
            value: '13.09',
            title:
              'Схема, отображающая расположение построенного, реконструированного объекта капитального строительства, расположение сетей инженерно-технического обеспечения в границах земельного участка и планировочную организацию земельного участка'
          },
          { value: '13.10', title: 'Результаты инженерных изысканий' },
          {
            value: '13.11',
            title:
              'Решение на отклонение от предельных параметров разрешенного строительства, реконструкции объекта капитального строительства'
          },
          {
            value: '13.12',
            title:
              'Решение органа местного самоуправления о предоставлении разрешения на условно разрешенный вид использования'
          },
          {
            value: '13.13',
            title:
              'Акт, подтверждающий соответствие параметров построенного, реконструированного объекта капитального строительства проектной документации, в том числе требованиям энергетической эффективности и требованиям оснащенности объекта капитального строительства приборами учета используемых энергетических ресурсов'
          },
          { value: '13.14', title: 'Заключение органа государственного строительного надзора' },
          { value: '13.16', title: 'Заключение органа федерального государственного экологического надзора' },
          {
            value: '13.17',
            title:
              'Акт проверки соответствия многоквартирного дома требованиям энергетической эффективности с указанием класса его энергетической эффективности'
          },
          { value: '13.18', title: 'Разрешение на ввод объекта в эксплуатацию' },
          { value: '13.19', title: 'Технический план объекта капитального строительства' },
          {
            value: '13.20',
            title:
              'Уведомление о планируемом строительстве или реконструкции объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.21',
            title:
              'Уведомление об изменении параметров планируемого строительства или реконструкции объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.22',
            title:
              'Уведомление о соответствии указанных в уведомлении о планируемом строительстве параметров объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.23',
            title:
              'Уведомление о несоответствии указанных в уведомлении о планируемом строительстве параметров объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.24',
            title: 'Описание внешнего облика объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.25',
            title:
              'Уведомление о соответствии описания внешнего облика объекта предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объекта капитального строительства'
          },
          {
            value: '13.26',
            title:
              'Уведомление о несоответствии описания внешнего облика объекта предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объекта капитального строительства'
          },
          { value: '13.27', title: 'Уведомление об окончании строительства' },
          {
            value: '13.28',
            title:
              'Уведомление о соответствии построенных или реконструированных объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.29',
            title:
              'Уведомление о несоответствии построенных или реконструированных объекта индивидуального жилищного строительства или садового дома'
          },
          { value: '13.30', title: 'Уведомление о планируемом сносе объекта капитального строительства' },
          {
            value: '13.31',
            title: 'Результаты и материалы обследования объекта капитального строительства, подлежащего сносу'
          },
          { value: '13.32', title: 'Проект организации работ по сносу' },
          { value: '13.33', title: 'Уведомление о завершении сноса' },
          { value: '13.34', title: 'Решение о присвоении, аннулировании изменении адреса' },
          { value: '13.35', title: 'Разрешение на использование земель или земельных участков' },
          { value: '13.36', title: 'Соглашение о сервитуте' },
          { value: '13.37', title: 'Решение об установлении публичного сервитута' },
          { value: '13.38', title: 'Иные документы и материалы' },
          { value: '14.01', title: 'Программа мероприятий по реализации документов территориального планирования' },
          { value: '14.02', title: 'Инвестиционная программа субъекта естественных монополий' },
          { value: '14.03', title: 'Инвестиционная программа организации коммунального комплекса' },
          { value: '14.04', title: 'Программа комплексного развития транспортной инфраструктуры;' },
          { value: '14.05', title: 'Программа комплексного развития социальной инфраструктуры;' },
          { value: '14.06', title: 'Программа комплексного развития систем коммунальной инфраструктуры' },
          { value: '15.01', title: 'Положение об особо охраняемой природной территории' },
          { value: '16.01', title: 'Лесохозяйственный регламент' },
          { value: '16.02', title: 'Проект освоения лесов' },
          { value: '16.03', title: 'Проектная документация лесных участков' },
          { value: '17.01', title: 'Информационная модель объекта капитального строительства' },
          {
            value: '18.01',
            title: 'Сведения, документы, материалы, не размещенные в иных разделах информационной системы'
          }
        ]
      },
      {
        name: 'doc_status',
        title: 'Статус действия',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: '0С.1', title: 'Действующий' },
          { value: '0С.2', title: 'Недействующий' }
        ]
      },
      {
        name: 'doc_name',
        title: 'Наименование данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'doc_num',
        title: 'Номер документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'doc_date',
        title: 'Дата документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'guid_doc_previous_version',
        title: 'Предыдущая версия данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'org_name',
        title: 'Наименование органа, утвердившего документ',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'territory_key',
        title: 'Территория действия',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'file_path',
        title: 'Приложенные файлы',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'inbox_data_key',
        title:
          'Реестр учета сведений, документов, материалов, поступивших на размещение в информационную систему, и результатов их рассмотрения',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'reg_num',
        title: 'Регистрационный номер ГИСОГД',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'reg_date',
        title: 'Дата размещения в информационной системе',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'note',
        title: 'Примечание',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      // @ts-ignore - в реальной схеме нет title
      {
        name: 'shape',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.GEOMETRY,
        minWidth: 0,
        allowedValues: ['Polygon']
      }
    ],
    originName: 'dl_data_section5',
    type: null,
    readOnly: false,
    geometryType: GeometryType.MULTI_POLYGON,
    contentTypes: [
      {
        id: 'doc_v1',
        type: 'DOCUMENT',
        title: 'Карта градостроительного зонирования',
        icon: 'GPZU',
        attributes: [
          {
            name: 'title',
            title: 'Наименование документа',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_status',
            title: 'Статус действия',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.CHOICE,
            description: '',
            enumerations: [
              { title: 'Действующий', value: '0С.1' },
              { title: 'Недействующий', value: '0С.2' }
            ],
            allowedValues: []
          },
          {
            name: 'doc_num',
            title: 'Номер документа',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_date',
            title: 'Дата документа',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          {
            name: 'org_name',
            title: 'Наименование органа, утвердившего документ',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_num',
            title: 'Регистрационный номер ГИСОГД',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_date',
            title: 'Дата размещения в информационной системе',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          { name: 'binary', title: 'Выбор файла', required: true, valueType: ValueType.BINARY }
        ],
        printTemplates: []
      },
      {
        id: 'doc_v2',
        type: 'DOCUMENT',
        title: 'Порядок применения правил землепользования и застройки и внесения в них изменений',
        icon: 'GPZU',
        children: [],
        attributes: [
          {
            name: 'title',
            title: 'Наименование документа',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_status',
            title: 'Статус действия',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.CHOICE,
            description: '',
            enumerations: [
              { title: 'Действующий', value: '0С.1' },
              { title: 'Недействующий', value: '0С.2' }
            ],
            allowedValues: []
          },
          {
            name: 'doc_num',
            title: 'Номер документа',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_date',
            title: 'Дата документа',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          {
            name: 'org_name',
            title: 'Наименование органа, утвердившего документ',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_num',
            title: 'Регистрационный номер ГИСОГД',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_date',
            title: 'Дата размещения в информационной системе',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          { name: 'binary', title: 'Выбор файла', required: true, valueType: ValueType.BINARY }
        ],
        printTemplates: []
      },
      {
        id: 'doc_v3',
        type: 'DOCUMENT',
        title: 'Сведения о границах территориальных зон',
        icon: 'GPZU',
        attributes: [
          {
            name: 'title',
            title: 'Наименование документа',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_status',
            title: 'Статус действия',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.CHOICE,
            description: '',
            enumerations: [
              { title: 'Действующий', value: '0С.1' },
              { title: 'Недействующий', value: '0С.2' }
            ],
            allowedValues: []
          },
          {
            name: 'doc_num',
            title: 'Номер документа',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_date',
            title: 'Дата документа',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          {
            name: 'org_name',
            title: 'Наименование органа, утвердившего документ',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_num',
            title: 'Регистрационный номер ГИСОГД',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_date',
            title: 'Дата размещения в информационной системе',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          { name: 'binary', title: 'Выбор файла', required: true, valueType: ValueType.BINARY }
        ],
        printTemplates: []
      },
      {
        id: 'doc_v3',
        type: 'DOCUMENT',
        title: 'Градостроительные регламенты',
        icon: 'GPZU',
        attributes: [
          {
            name: 'title',
            title: 'Наименование документа',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_status',
            title: 'Статус действия',
            valueType: ValueType.CHOICE,
            enumerations: [
              { title: 'Действующий', value: '0С.1' },
              { title: 'Недействующий', value: '0С.2' }
            ]
          },
          {
            name: 'doc_num',
            title: 'Номер документа',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'doc_date',
            title: 'Дата документа',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          {
            name: 'org_name',
            title: 'Наименование органа, утвердившего документ',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_num',
            title: 'Регистрационный номер ГИСОГД',
            hidden: false,
            required: false,
            maxLength: 254,
            valueType: ValueType.STRING
          },
          {
            name: 'reg_date',
            title: 'Дата размещения в информационной системе',
            choice: null,
            hidden: false,
            required: false,
            valueType: ValueType.DATETIME,
            description: '',
            allowedValues: []
          },
          { name: 'binary', title: 'Выбор файла', required: true, valueType: ValueType.BINARY }
        ],
        printTemplates: []
      },
      {
        id: 'folder_v1',
        type: 'FOLDER',
        children: [],
        attributes: [
          {
            name: 'title',
            title: 'Название раздела',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          }
        ],
        printTemplates: []
      }
    ],
    printTemplates: [],
    relations: []
  },
  {
    name: 'dl_data_section3_schema',
    title: 'Раздел3.Документы территориального планирования муниципальных образований',
    description: 'Раздел3.Документы территориального планирования муниципальных образований',
    tableName: 'dl_data_section3',
    properties: [
      {
        name: 'id',
        title: 'Идентификатор',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.INT,
        minWidth: 0
      },
      {
        name: 'is_public',
        title: 'Публичный документ',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.BOOLEAN,
        minWidth: 0
      },
      {
        name: 'is_folder',
        title: 'Признак раздела',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.BOOLEAN,
        minWidth: 0
      },
      {
        name: 'status_type',
        title: 'Статус документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: 'Проектный', title: 'Проектный' },
          { value: 'Утвержденный', title: 'Утвержденный' },
          { value: 'Архивный', title: 'Архивный' }
        ]
      },
      {
        name: 'path',
        title: 'Полный путь, отражающий иерархию объектов',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        minWidth: 0
      },
      {
        name: 'size',
        title: 'Размер в kb',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.INT,
        minWidth: 0
      },
      {
        name: 'title',
        title: 'Наименование документа',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 500,
        minWidth: 0
      },
      {
        name: 'created_by',
        title: 'Создатель',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'inner_path',
        title: 'Где лежит',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        minWidth: 0
      },
      {
        name: 'type',
        title: 'Тип',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'oktmo',
        title: 'ОКТМО',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 11,
        minWidth: 0
      },
      {
        name: 'details',
        title: 'Описание',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 500,
        minWidth: 0
      },
      {
        name: 'document_type',
        title: 'Тип документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: 'GP', title: 'Генеральный план' },
          { value: 'STPMO', title: 'СТП  муниципальных районов' },
          { value: 'STPRF', title: 'СТП  субъектов Российской Федерации' },
          { value: 'PZZ', title: 'Правила землепользования и застройки' },
          { value: 'PKR', title: 'Программа комплексного развития' },
          { value: 'PPTPMT', title: 'Проект планировки территории; Проект межевания территории' }
        ]
      },
      {
        name: 'native_crs',
        title: 'Система координат',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [{ value: 'EPSG:28406', title: 'Pulkovo 1942 / Gauss-Kruger zone 6' }]
      },
      {
        name: 'scale',
        title: 'Номинальный масштаб',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        foreignKeyType: 'INTEGER',
        minWidth: 0,
        enumerations: [
          { value: '500000', title: '500000' },
          { value: '200000', title: '200000' },
          { value: '100000', title: '100000' },
          { value: '50000', title: '50000' },
          { value: '25000', title: '25000' },
          { value: '10000', title: '10000' },
          { value: '5000', title: '5000' },
          { value: '2000', title: '2000' },
          { value: '1000', title: '1000' },
          { value: '500', title: '500' }
        ]
      },
      {
        name: 'content_type_id',
        title: 'Идентификатор контент типа',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      },
      {
        name: 'created_at',
        title: 'Дата создания',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'last_modified',
        title: 'Дата последней модификации',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'classid',
        title: 'Класс данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: '1.01', title: 'Схема территориального планирования Российской Федерации' },
          { value: '2.01', title: 'Схема территориального планирования двух и более субъектов Российской Федерации' },
          { value: '2.02', title: 'Схемы территориального планирования субъекта Российской Федерации' },
          { value: '3.01', title: 'Схема территориального планирования муниципального района' },
          { value: '3.02', title: 'Генеральный план поселения' },
          { value: '3.03', title: 'Генеральный план городского округа, муниципального округа' },
          { value: '4.01', title: 'Региональные нормативы градостроительного проектирования' },
          { value: '4.02', title: 'Местные нормативы градостроительного проектирования поселения' },
          { value: '4.03', title: 'Местные нормативы градостроительного проектирования муниципального района' },
          {
            value: '4.04',
            title: 'Местные нормативы градостроительного проектирования городского округа, муниципального округа'
          },
          { value: '5.01', title: 'Правила землепользования и застройки' },
          { value: '6.01', title: 'Правила благоустройства территории' },
          { value: '7.01', title: 'Проект планировки территории' },
          { value: '7.02', title: 'Проект межевания территории' },
          { value: '8.01', title: 'Материалы и результаты инженерных изысканий' },
          { value: '9.01', title: 'Разрешение на создание искусственного земельного участка' },
          { value: '9.02', title: 'Разрешение на проведение работ по созданию искусственного земельного участка' },
          { value: '9.03', title: 'Разрешение на ввод искусственно созданного земельного участка в эксплуатацию' },
          { value: '10.01', title: 'Решение об установлении зоны с особыми условиями использования территории' },
          {
            value: '10.02',
            title: 'Решение о прекращении существования зоны с особыми условиями использования территории'
          },
          { value: '11.01', title: 'Материалы по надземным и подземным коммуникациям' },
          { value: '12.01', title: 'Решение об изъятии земельного участка для государственных нужд' },
          { value: '12.02', title: 'Решение о резервировании земель для государственных нужд' },
          { value: '12.03', title: 'Решение об изъятии земельного участка для муниципальных нужд' },
          { value: '12.04', title: 'Решение о резервировании земель для муниципальных нужд' },
          { value: '13.01', title: 'Градостроительный план земельного участка' },
          { value: '13.02', title: 'Заключение государственной историко-культурной экспертизы' },
          { value: '13.03', title: 'Заключение государственной экологической экспертизы' },
          { value: '13.04', title: 'Разрешение на строительство' },
          { value: '13.05', title: 'Решение о прекращении действия разрешения на строительство' },
          { value: '13.06', title: 'Решение о внесении изменений в разрешение на строительство' },
          { value: '13.07', title: 'Сведения об экспертизе проектной документации' },
          {
            value: '13.08 ',
            title:
              'Заключения о соответствии предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объектов капитального строительства'
          },
          {
            value: '13.09',
            title:
              'Схема, отображающая расположение построенного, реконструированного объекта капитального строительства, расположение сетей инженерно-технического обеспечения в границах земельного участка и планировочную организацию земельного участка'
          },
          { value: '13.10', title: 'Результаты инженерных изысканий' },
          {
            value: '13.11',
            title:
              'Решение на отклонение от предельных параметров разрешенного строительства, реконструкции объекта капитального строительства'
          },
          {
            value: '13.12',
            title:
              'Решение органа местного самоуправления о предоставлении разрешения на условно разрешенный вид использования'
          },
          {
            value: '13.13',
            title:
              'Акт, подтверждающий соответствие параметров построенного, реконструированного объекта капитального строительства проектной документации, в том числе требованиям энергетической эффективности и требованиям оснащенности объекта капитального строительства приборами учета используемых энергетических ресурсов'
          },
          { value: '13.14', title: 'Заключение органа государственного строительного надзора' },
          { value: '13.16', title: 'Заключение органа федерального государственного экологического надзора' },
          {
            value: '13.17',
            title:
              'Акт проверки соответствия многоквартирного дома требованиям энергетической эффективности с указанием класса его энергетической эффективности'
          },
          { value: '13.18', title: 'Разрешение на ввод объекта в эксплуатацию' },
          { value: '13.19', title: 'Технический план объекта капитального строительства' },
          {
            value: '13.20',
            title:
              'Уведомление о планируемом строительстве или реконструкции объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.21',
            title:
              'Уведомление об изменении параметров планируемого строительства или реконструкции объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.22',
            title:
              'Уведомление о соответствии указанных в уведомлении о планируемом строительстве параметров объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.23',
            title:
              'Уведомление о несоответствии указанных в уведомлении о планируемом строительстве параметров объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.24',
            title: 'Описание внешнего облика объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.25',
            title:
              'Уведомление о соответствии описания внешнего облика объекта предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объекта капитального строительства'
          },
          {
            value: '13.26',
            title:
              'Уведомление о несоответствии описания внешнего облика объекта предмету охраны исторического поселения и установленным градостроительным регламентом требованиям к архитектурным решениям объекта капитального строительства'
          },
          { value: '13.27', title: 'Уведомление об окончании строительства' },
          {
            value: '13.28',
            title:
              'Уведомление о соответствии построенных или реконструированных объекта индивидуального жилищного строительства или садового дома'
          },
          {
            value: '13.29',
            title:
              'Уведомление о несоответствии построенных или реконструированных объекта индивидуального жилищного строительства или садового дома'
          },
          { value: '13.30', title: 'Уведомление о планируемом сносе объекта капитального строительства' },
          {
            value: '13.31',
            title: 'Результаты и материалы обследования объекта капитального строительства, подлежащего сносу'
          },
          { value: '13.32', title: 'Проект организации работ по сносу' },
          { value: '13.33', title: 'Уведомление о завершении сноса' },
          { value: '13.34', title: 'Решение о присвоении, аннулировании изменении адреса' },
          { value: '13.35', title: 'Разрешение на использование земель или земельных участков' },
          { value: '13.36', title: 'Соглашение о сервитуте' },
          { value: '13.37', title: 'Решение об установлении публичного сервитута' },
          { value: '13.38', title: 'Иные документы и материалы' },
          { value: '14.01', title: 'Программа мероприятий по реализации документов территориального планирования' },
          { value: '14.02', title: 'Инвестиционная программа субъекта естественных монополий' },
          { value: '14.03', title: 'Инвестиционная программа организации коммунального комплекса' },
          { value: '14.04', title: 'Программа комплексного развития транспортной инфраструктуры;' },
          { value: '14.05', title: 'Программа комплексного развития социальной инфраструктуры;' },
          { value: '14.06', title: 'Программа комплексного развития систем коммунальной инфраструктуры' },
          { value: '15.01', title: 'Положение об особо охраняемой природной территории' },
          { value: '16.01', title: 'Лесохозяйственный регламент' },
          { value: '16.02', title: 'Проект освоения лесов' },
          { value: '16.03', title: 'Проектная документация лесных участков' },
          { value: '17.01', title: 'Информационная модель объекта капитального строительства' },
          {
            value: '18.01',
            title: 'Сведения, документы, материалы, не размещенные в иных разделах информационной системы'
          }
        ]
      },
      {
        name: 'doc_status',
        title: 'Статус действия',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.CHOICE,
        minWidth: 0,
        enumerations: [
          { value: '0С.1', title: 'Действующий' },
          { value: '0С.2', title: 'Недействующий' }
        ]
      },
      {
        name: 'doc_name',
        title: 'Наименование данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'doc_num',
        title: 'Номер документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'approve_date',
        title: 'Дата утверждения документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'doc_date',
        title: 'Дата документа',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'guid_doc_previous_version',
        title: 'Предыдущая версия данных',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'org_name',
        title: 'Наименование органа, утвердившего документ',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      {
        name: 'territory_key',
        title: 'Территория действия',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'file_path',
        title: 'Приложенные файлы',
        required: true,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 500,
        minWidth: 0
      },
      {
        name: 'inbox_data_key',
        title:
          'Реестр учета сведений, документов, материалов, поступивших на размещение в информационную систему, и результатов их рассмотрения',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.LOOKUP,
        resourcePath: '/api/data/document-libraries/{documentLibraryId}',
        minWidth: 0
      },
      {
        name: 'reg_date',
        title: 'Дата размещения в информационной системе',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.DATETIME,
        minWidth: 0
      },
      {
        name: 'any_field_name',
        title: 'Выбор файла',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        multiple: true,
        valueType: ValueType.FILE,
        minWidth: 0,
        maxSize: 50000000,
        maxFiles: 10
      },
      {
        name: 'note',
        title: 'Примечание',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 254,
        minWidth: 0
      },
      // @ts-ignore - в реальной схеме нет title
      {
        name: 'shape',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.GEOMETRY,
        minWidth: 0,
        allowedValues: ['Polygon']
      },
      {
        name: 'binary',
        title: 'Выбор файла',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.BINARY,
        minWidth: 0
      },
      {
        name: 'test_value',
        title: 'Документы территориального планирования',
        required: false,
        hidden: false,
        objectIdentityOnUi: false,
        readOnly: false,
        valueType: ValueType.STRING,
        maxLength: 50,
        minWidth: 0
      }
    ],
    originName: 'dl_data_section3',
    type: null,
    readOnly: false,
    geometryType: GeometryType.MULTI_POLYGON,
    contentTypes: [
      {
        id: 'doc_gml',
        type: 'DOCUMENT',
        title: 'Файл GML',
        icon: 'DOCUMENT',
        attributes: [
          { name: 'title', required: true },
          {
            name: 'test_value',
            title: 'Документы территориального планирования',
            hidden: false,
            required: false,
            maxLength: 200,
            valueType: ValueType.STRING,
            defaultValue: 'Территориальное планирование (Цифровая модель GML)'
          },
          { name: 'approve_date', required: true },
          { name: 'document_type', required: true },
          { name: 'oktmo', required: true },
          { name: 'scale', required: true },
          { name: 'is_public' },
          {
            name: 'any_field_name',
            title: 'Выбор файла',
            maxSize: 50000000,
            maxFiles: 10,
            multiple: true,
            valueType: ValueType.FILE
          }
        ],
        printTemplates: []
      },
      {
        id: 'doc_tif',
        type: 'DOCUMENT',
        title: 'Документ генерального плана формата geotif',
        icon: 'GPZU',
        children: [],
        attributes: [
          { name: 'title', required: true },
          { name: 'oktmo', required: false },
          { name: 'document_type', required: false },
          { name: 'approve_date', required: false },
          {
            name: 'test_value',
            title: 'Документы территориального планирования',
            hidden: false,
            required: false,
            maxLength: 200,
            valueType: ValueType.STRING,
            defaultValue: 'Генеральный план городских округов'
          },
          { name: 'scale', required: false },
          { name: 'native_crs', required: false },
          {
            name: 'is_public',
            title: 'Публичный документ',
            hidden: false,
            required: false,
            valueType: ValueType.BOOLEAN
          },
          {
            name: 'is_folder',
            title: 'Признак раздела',
            hidden: false,
            required: false,
            valueType: ValueType.BOOLEAN
          },
          {
            name: 'status_type',
            title: 'Статус документа',
            hidden: false,
            required: false,
            valueType: ValueType.CHOICE,
            enumerations: [
              { title: 'Проектный', value: 'Проектный' },
              { title: 'Утвержденный', value: 'Утвержденный' },
              { title: 'Архивный', value: 'Архивный' }
            ],
            allowedValues: []
          },
          {
            name: 'any_field_name',
            title: 'Выбор файла',
            maxSize: 50000000,
            maxFiles: 10,
            multiple: true,
            valueType: ValueType.FILE
          }
        ],
        printTemplates: []
      },
      {
        id: 'doc_tif',
        type: 'DOCUMENT',
        title: 'Материалы по обоснованию в виде карт',
        icon: 'GPZU',
        attributes: [
          { name: 'title', required: true },
          { name: 'oktmo', required: true },
          { name: 'document_type', required: true },
          { name: 'approve_date', required: true },
          {
            name: 'test_value',
            title: 'Документы территориального планирования',
            hidden: false,
            required: false,
            maxLength: 50,
            valueType: ValueType.STRING,
            defaultValue: 'Материалы по обоснованию в виде карт'
          },
          { name: 'scale', required: true },
          { name: 'native_crs', required: true },
          {
            name: 'status_type',
            title: 'Статус документа',
            hidden: false,
            required: false,
            valueType: ValueType.CHOICE,
            enumerations: [
              { title: 'Проектный', value: 'Проектный' },
              { title: 'Утвержденный', value: 'Утвержденный' },
              { title: 'Архивный', value: 'Архивный' }
            ],
            allowedValues: []
          },
          { name: 'binary', required: true }
        ],
        printTemplates: []
      },
      {
        id: 'doc_test1',
        type: 'DOCUMENT',
        title: 'Материалы по обоснованию в текстовой форме',
        children: [],
        attributes: [
          { name: 'title', required: true },
          { name: 'approve_date', required: true },
          { name: 'binary', required: true }
        ],
        printTemplates: []
      },
      {
        id: 'doc_test',
        type: 'DOCUMENT',
        title: 'Положение о территориальном планировании',
        children: [],
        attributes: [
          { name: 'title', required: true },
          { name: 'approve_date', required: true },
          { name: 'binary', required: true }
        ],
        printTemplates: []
      },
      {
        id: 'folder_v1',
        type: 'FOLDER',
        children: [],
        attributes: [
          {
            name: 'title',
            title: 'Название раздела',
            hidden: false,
            required: true,
            maxLength: 500,
            valueType: ValueType.STRING
          }
        ],
        printTemplates: []
      }
    ],
    printTemplates: [],
    relations: []
  }
];
