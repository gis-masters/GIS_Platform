Feature: Поле url: внешний вид

  Scenario: Внешний вид поля url в режиме редактирования
    Given   я на странице "form-field-url--editable-url" библиотеки блоков
    Then    блок FormContent вариант "editable-url" выглядит как положено

  Scenario: Внешний вид поля url в режиме чтения
    Given   я на странице "form-field-url--readonly-url" библиотеки блоков
    Then    блок FormContent вариант "readonly-url" выглядит как положено

  Scenario: Внешний вид поля url c пустыми данными только для чтения
    Given   я на странице "form-field-url--read-only-empty-url" библиотеки блоков
    Then    блок FormContent вариант "read-only-empty-url" выглядит как положено

  Scenario: Внешний вид поля url с пустыми данными
    Given   я на странице "form-field-url--empty-url" библиотеки блоков
    Then    блок FormContent вариант "empty-url" выглядит как положено

  Scenario: Внешний вид поля url с пустыми данными после валидации
    Given   я на странице "form-field-url--empty-url" библиотеки блоков
    When    на странице формы в библиотеке блоков я нажимаю кнопку валидации
    Then    блок FormContent вариант "validate-empty-url" выглядит как положено

  Scenario: Внешний вид поля url c ошибками
    Given   я на странице "form-field-url--errors-url" библиотеки блоков
    When    на странице формы в библиотеке блоков я нажимаю кнопку валидации
    Then    блок FormContent вариант "errors-url" выглядит как положено

  Scenario: Внешний вид поля url c формой добавления новой ссылки
    Given   я на странице "form-field-url--empty-url" библиотеки блоков
    When    в форме в поле "Обязательные пустое поле multiple: true*" типа url я нажимаю на кнопку добавления нового url
    Then    блок UrlListDialog вариант "url-add-new-link" выглядит как положено

  Scenario: Внешний вид попапа после отрытия ссылки в поле url
    Given   я на странице "form-field-url--editable-url" библиотеки блоков
    When    в форме в поле "Одна ссылка, попап" типа url я нажимаю на первую заполненную ссылку
    Then    блок UrlListDialog вариант "url-popup" выглядит как положено
