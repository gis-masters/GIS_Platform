Feature: Регистрация намерений о создании организации

  Scenario: Сервер проверяет переданный идентификатор специализации
    When я отправляю идентификатор не существующей специализации
    Then сервер отвечает со статус-кодом 400
    And  сообщение об ошибке соответствует ожидаемому: "Запрашиваемая специализация не найдена"


# Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.mail.MailSendException: Failed messages: javax.mail.SendFailedException: Invalid Addresses;
#  nested exception is:
#	com.sun.mail.smtp.SMTPAddressFailedException: 501 5.1.3 Bad recipient address syntax 1744786831-U0CqT4DLj0U0-4ZyKfudY
#; message exceptions (1) are:
#Failed message 1: javax.mail.SendFailedException: Invalid Addresses;

#  @OnlyThis -- починим в задаче 3307
#  Scenario: Сервер проверяет заявки на дублирование по email
#  Проверка дублирования email непосредственно среди заявок (intents)
#
#    Given существует заявка на создание новой организации от "fiz@fiz"
#    When  я отправляю заявку на создание новой организации: "fiz@fiz"
#    Then  сервер отвечает со статус-кодом 409
#    And   сообщение об ошибке соответствует ожидаемому: "Почта: 'fiz@fiz' уже занята"

  Scenario: Сервер проверяет переданный email на дублирование в системе
  Проверка дублирования email среди всех пользователей системы

    Given Существует любая организация
    When  я отправляю заявку на создание новой организации используя email уже существующего в системе пользователя
    Then  сервер отвечает со статус-кодом 409
