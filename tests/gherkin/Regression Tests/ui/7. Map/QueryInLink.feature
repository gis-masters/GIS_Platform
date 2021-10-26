Feature CQL pапросы в через ссылки.

В адресе страницы можно разместить два query параметра: queryLayers и queryFeatures.

В queryFeatures пишется CQL фильтр (https://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html).
Например queryFilter=cad_num%3D%2790:23:010108:394%27 (это запись cad_num='90:23:010108:394', пропущенная через urlencode для кодирования служебных символов)

Полный пример

В queryLayers написаны слои, в которых искать (complexName через запятую). Например queryLayers=scratch_database_1:oks_constructions_polyline_789_de3a,scratch_database_1:oks_constructions_789_c1b6
Важно: в поле queryLayers должны быть перечислены только те слои, для которых валиден написанный фильтр. В примере указан атрибут cad_num, соответственно если в объектах указанных слоёв не будет поля cad_num, то запрос упадёт с ошибкой.

  Background:
    Given Пользователь авторизован
    Given Существует проект с id 7 (на 10.10.10.58 сейчас такой есть)
    Given Существуют слои с complexName scratch_database_1:oks_constructions_polyline_789_de3a,scratch_database_1:oks_constructions_789_c1b6,scratch_database_1:oks_unfinished_789_1c5b,scratch_database_1:oks_constructions_points_789_af08 (на 10.10.10.58 сейчас такие есть) и в объектах этих слоёв есть поле cad_num
    Given В одном из этих слоёв имеется объект с кадастровым номером 90:23:010108:394

  Scenario: Успешный запрос
    When Пользователь переходит по ссылке /projects/7/map?queryLayers=scratch_database_1:oks_constructions_polyline_789_de3a,scratch_database_1:oks_constructions_789_c1b6,scratch_database_1:oks_unfinished_789_1c5b,scratch_database_1:oks_constructions_points_789_af08&queryFilter=cad_num%3D%2790:23:010108:394%27
    Then Открывается карта с выделенным искомым объектом

  Scenario: Не найдено
    Given Ни одном из этих слоёв нет объекта с кадастровым номером 90:23:010108:395
    When Пользователь переходит по ссылке /projects/7/map?queryLayers=scratch_database_1:oks_constructions_polyline_789_de3a,scratch_database_1:oks_constructions_789_c1b6,scratch_database_1:oks_unfinished_789_1c5b,scratch_database_1:oks_constructions_points_789_af08&queryFilter=cad_num%3D%2790:23:010108:395%27
    Then Открывается карта, объект не выделен
    And Появляется уведомление о том, что объекты не найдены

  Scenario: Ошибка запроса
    Given Не существует слой scratch_database_1:zzz
    When Пользователь переходит по ссылке /projects/7/map?queryLayers=scratch_database_1:zzz&queryFilter=cad_num%3D%2790:23:010108:394%27
    Then Открывается карта, объект не выделен
    And Появляется уведомление об ошибке
