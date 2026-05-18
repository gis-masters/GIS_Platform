Feature: Тесты шаблонов печати в нескольких организациях

  Background:
    *     Существует любая организация
    *     я авторизован как "Владелец организации"

  Scenario: Администратор организации не может ВИДЕТЬ шаблоны чужой организации
    Given существует пользовательский шаблон печати с именем "u_not_see_me"
    *     Существует организация
      | name             | phone      | ownerSurname | ownerName    | ownerEmail           | ownerPassword | specializationId |
      | ООО secondReport | 1234567890 | secondReport | secondReport | secondReport@rep.com | testPassword1 | 1                |
    *     Существует пользователь
      | secondReport | secondReport | secondReport@rep.com | testPassword1 |
    *     Ждем окончания процесса создания организации
    *     я авторизован как "secondReport"
    When  я запрашиваю список всех шаблонов печати
    Then  среди шаблонов печати нет шаблона с именем "u_not_see_me"
