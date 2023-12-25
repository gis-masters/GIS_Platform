## Заготовка под-проекта для запуска тестов в параллельном режиме.  
#### Основано на cucable-plugin (https://github.com/trivago/cucable-plugin)
#### База по теории тут: https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-junit-platform-engine

### Тесты запускаются: `mvn integration-test post-integration-test` 
###### Не забываем что запуск тестов отключен по-умолчанию, опцией: skipAcceptanceTests
`integration-test` - шаг запуска тестов\
`post-integration-test`   - шаг генерации общего отчета
