package ru.mycrg.data_service.dao.utils;

import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.data.postgis.PostGISDialect;
import org.geotools.data.postgis.PostgisFilterToSQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.util.Optional;

public class EcqlHandler {

    private static final Logger log = LoggerFactory.getLogger(EcqlHandler.class);

    private static final PostGISDialect dialect = new PostGISDialect(null);

    private EcqlHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static String buildWhereSection(String ecqlFilter) {
        try {
            if (ecqlFilter == null || ecqlFilter.isBlank()) {
                return "";
            }

            // ECQL.toFilter некорректно преобразует строку '1' в число 1
            // Как костыль: помечаем такие числа в фильтре каким-то маркером '1' => '_fiz_1', а после преобразования фильтра в SQL запрос, удаляем маркер.
            String marker = "_fiz_";

            Filter filter = ECQL.toFilter(markSingleQuotesIn(ecqlFilter, marker));

            return new PostgisFilterToSQL(dialect).encodeToString(filter)
                                                  .replace(marker, "");
        } catch (CQLException | FilterToSQLException e) {
            String msg = String.format("Задан некорректный ECQL фильтр: [%s]", ecqlFilter);
            log.error("{} Reason: [{}]", msg, e.getMessage());

            throw new BadRequestException(msg);
        }
    }

    /**
     * Если внутри IN() находится символ "'" то заменим его на неким маркером, например: "_marker_", чтобы наебать
     * ECQL.toFilter, который не корректно переводит строку '1' в число 1.
     * <p>
     * Например: IN ('1') => IN ('_marker_1'); IN('text') => IN('_marker_text')
     */
    public static String markSingleQuotesIn(String target, String marker) {
        try {
            StringBuilder result = new StringBuilder();

            boolean waitOpenBrace = false;
            boolean isFirstSingleQuoter = true;
            boolean startReplacing = false;
            for (int i = 0; i < target.length(); i++) {
                char currentChar = target.charAt(i);
                if (!startReplacing) {
                    if (!waitOpenBrace) { // Пока флаг "найдена открывающая скобка" не активна
                        if (isInFound(target, i)) { // Ожидаем найти 'IN'
                            waitOpenBrace = true;
                        }
                    }

                    // Дождались начала блока 'IN (' - теперь можно заменять все встречаемые символы `'` => `__'`
                    if (waitOpenBrace && currentChar == '(') {
                        startReplacing = true;
                    }

                    result.append(currentChar);
                } else {
                    if (currentChar == ')') { // Когда встретили закрывающую скобку ')' заканчиваем подменять символы
                        startReplacing = false;
                        waitOpenBrace = false;
                        isFirstSingleQuoter = true;
                    }

                    if (currentChar == '\'') {
                        if (isFirstSingleQuoter) { // Заменяем только встретив первую одиночную кавычку
                            result.append(currentChar);
                            for (int m = 0; m < marker.length(); m++) {
                                result.append(marker.charAt(m));
                            }

                            isFirstSingleQuoter = false;
                        } else {
                            isFirstSingleQuoter = true;
                            result.append(currentChar);
                        }
                    } else {
                        result.append(currentChar);
                    }
                }
            }

            return result.toString();
        } catch (Exception e) {
            log.error("Не удалось проставить маркеры для фильтра: [{}] => {}", target, e.getMessage(), e);

            return target;
        }
    }

    private static boolean isInFound(String target, int i) {
        return getItem(target, i + 1)
                .filter(ch -> target.charAt(i) == 'I' && ch == 'N' || target.charAt(i) == 'i' && ch == 'n')
                .isPresent();
    }

    private static Optional<Character> getItem(String target, int i) {
        try {
            return Optional.of(target.charAt(i));
        } catch (IndexOutOfBoundsException e) {
            return Optional.empty();
        }
    }
}
