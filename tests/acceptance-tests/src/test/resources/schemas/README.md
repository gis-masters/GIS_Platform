# JSON Loaders Architecture

## Обзор

Архитектура загрузчиков JSON построена по принципу наследования и специализации:

- **JsonLoader** - универсальный загрузчик JSON файлов
- **SchemaLoader** - специализированный загрузчик для схем данных
- **ConfigLoader** - специализированный загрузчик для конфигураций
- **TestDataLoader** - специализированный загрузчик для тестовых данных

## Структура

```
src/test/java/ru/mycrg/acceptance/data_service/schemas/
├── JsonLoader.java          # Базовый универсальный загрузчик
├── SchemaLoader.java        # Загрузчик схем (наследует от JsonLoader)
├── ConfigLoader.java        # Загрузчик конфигураций (наследует от JsonLoader)
├── TestDataLoader.java      # Загрузчик тестовых данных (наследует от JsonLoader)
├── SchemaTemplates.java     # Шаблоны схем
└── LoaderExamples.java      # Примеры использования

src/test/resources/
├── schemas/                 # JSON файлы схем
│   ├── all-types-schema.json
│   ├── tasks-schema.json
│   ├── simple-schema.json
│   └── ...
├── configs/                 # JSON файлы конфигураций (будущие)
└── test-data/               # JSON файлы тестовых данных (будущие)
```

## Использование

### SchemaLoader
```java
// Загрузка схемы задач
SchemaDto tasksSchema = SchemaLoader.loadSchemaFromResource("tasks-schema.json");

// Загрузка простой схемы
SchemaDto simpleSchema = SchemaLoader.loadSchemaFromResource("simple-schema.json");
```

### JsonLoader (универсальный)
```java
// Загрузка любого JSON объекта
SchemaDto schema = JsonLoader.loadFromResource("schemas/all-types-schema.json", SchemaDto.class);

// Загрузка JSON как строки
String jsonString = JsonLoader.loadAsString("schemas/tasks-schema.json");
```

### ConfigLoader (будущее использование)
```java
// Загрузка конфигурации
TestConfig config = ConfigLoader.loadConfigFromResource("test-config.json", TestConfig.class);

// Загрузка конфигурации как строки
String configString = ConfigLoader.loadConfigAsString("app-config.json");
```

### TestDataLoader (будущее использование)
```java
// Загрузка тестовых данных
UserData userData = TestDataLoader.loadTestDataFromResource("user-data.json", UserData.class);

// Загрузка тестовых данных как строки
String testDataString = TestDataLoader.loadTestDataAsString("sample-data.json");
```

## Преимущества

1. **Переиспользование** - JsonLoader можно использовать для любых JSON файлов
2. **Специализация** - специализированные загрузчики упрощают работу с конкретными типами данных
3. **Консистентность** - единый подход к загрузке JSON во всем проекте
4. **Расширяемость** - легко добавлять новые специализированные загрузчики
5. **Валидация** - IDE может проверять корректность JSON файлов
6. **Читабельность** - код стал намного чище и понятнее

## Доступные схемы

- `all-types-schema.json` - схема со всеми типами данных
- `calculated-formula-schema.json` - схема с калькулируемыми формулами
- `dl-default-schema.json` - схема dl_default с contentTypes
- `fts-hidden-fields-schema.json` - схема для теста FTS с скрытыми полями
- `functional-zone-*-schema.json` - схемы функциональных зон
- `point-attributes-*-schema.json` - схемы точечных слоев
- `simple-schema.json` - простая базовая схема
- `source-schema.json` - схема-поставщик для тестирования копирования
- `tags-schema.json` - схема для тестирования тегов
- `target-schema.json` - схема-потребитель для тестирования копирования
- `tasks-schema.json` - схема задач
