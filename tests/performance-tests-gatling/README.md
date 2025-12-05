# Gatling Performance Tests

Нагрузочные тесты для GIS Platform с использованием Gatling.

## Структура

```
performance-tests-gatling/
├── pom.xml                          # Maven конфигурация с Gatling плагином
├── README.md                        # Этот файл
└── src/test/scala/
    └── ru/mycrg/performance/
        ├── BaseSimulation.scala     # Базовая конфигурация
        └── AuthServiceSimulation.scala   # Тесты для Auth Service
```

## Установка и запуск

### 1. Установка зависимостей

```bash
cd tests/performance-tests-gatling
mvn clean install
```

### 2. Запуск всех тестов

```bash
mvn gatling:test
```

### 3. Запуск конкретного теста

```bash
# Запуск теста Auth Service
mvn gatling:test -Dgatling.simulationClass=ru.mycrg.performance.AuthServiceSimulation
```

**Важно:** Перед запуском убедитесь, что сервисы запущены и доступны по указанным в конфигурации адресам!

### 4. Настройка окружения через переменные

```bash
export GATLING_BASE_URL=http://10.10.10.58:8084
export GATLING_AUTH_URL=http://10.10.10.58:9000
mvn gatling:test
```

## Результаты тестов

После выполнения тестов результаты сохраняются в:
```
target/gatling/results/[simulation-name]-[timestamp]/
```

Там вы найдете:
- `index.html` - интерактивный отчет с графиками
- `simulation.log` - детальный лог выполнения
- Статистику по времени ответа, пропускной способности и ошибкам

## Типы нагрузок в Gatling

### Ramp Users (плавное увеличение)
```scala
rampUsers(100) during (60 seconds) // 100 пользователей за 60 секунд
```

### Constant Users Per Second (постоянная нагрузка)
```scala
constantUsersPerSec(10) during (120 seconds) // 10 пользователей/сек в течение 2 минут
```

### At Once Users (все сразу)
```scala
atOnceUsers(50) // 50 пользователей одновременно
```

### Ramp Users Per Second (увеличение RPS)
```scala
rampUsersPerSec(1) to 20 during (60 seconds) // От 1 до 20 запросов/сек за минуту
```

## Примеры сценариев

### Простой GET запрос
```scala
exec(
  http("Get Files")
    .get("/api/data/files")
    .header("Authorization", "Bearer ${accessToken}")
    .check(status.is(200))
)
```

### POST запрос с телом
```scala
exec(
  http("Create Resource")
    .post("/api/data/datasets")
    .header("Authorization", "Bearer ${accessToken}")
    .body(StringBody("""{"name": "Test Dataset"}"""))
    .check(status.is(201))
    .check(jsonPath("$.id").saveAs("datasetId"))
)
```

### Использование сохраненных значений
```scala
exec(
  http("Get Created Resource")
    .get("/api/data/datasets/${datasetId}")
    .header("Authorization", "Bearer ${accessToken}")
    .check(status.is(200))
)
```

## Ассерты (проверки производительности)

```scala
assertions(
  global.responseTime.max.lt(5000),        // Макс время ответа < 5 сек
  global.responseTime.mean.lt(2000),       // Среднее время < 2 сек
  global.successfulRequests.percent.gt(95) // Успешных запросов > 95%
)
```

## Полезные команды

```bash
# Запуск с кастомными параметрами
mvn gatling:test -Dgatling.simulationClass=ru.mycrg.performance.DataServiceSimulation \
                 -Dgatling.reportsOnly=last

# Генерация только HTML отчета (без запуска теста)
mvn gatling:test -Dgatling.reportsOnly=last

# Запуск с логированием
mvn gatling:test -Dgatling.logLevel=DEBUG
```

## Интеграция с CI/CD

Можно добавить в pipeline:
```yaml
- name: Run Performance Tests
  run: |
    cd tests/performance-tests-gatling
    mvn gatling:test
    # Публикация отчетов как артефакт
```

## Дополнительные ресурсы

- [Gatling Documentation](https://gatling.io/docs/gatling/)
- [Gatling Maven Plugin](https://gatling.io/docs/gatling/reference/current/extensions/maven_plugin/)
- [Gatling DSL Reference](https://gatling.io/docs/gatling/reference/current/core/scenario/)
