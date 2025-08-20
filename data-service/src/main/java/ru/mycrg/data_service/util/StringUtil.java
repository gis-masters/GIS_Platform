package ru.mycrg.data_service.util;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class StringUtil {

    private StringUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static final String DEFAULT_QUOTE_MARK = "'";
    public static final String DEFAULT_DELIMITER = ",";

    public static String hashCodeAsString(int hashCode) {
        return hashCodeAsString((long) hashCode);
    }

    public static String hashCodeAsString(long hashCode) {
        return String.valueOf(hashCode).replace("-", "1");
    }

    public static String extractHash(String input) {
        if (input == null) {
            return "";
        }

        Matcher matcher = Pattern.compile("__(\\d+)").matcher(input);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return "";
    }

    public static String join(List<Long> ids) {
        return String.join(DEFAULT_DELIMITER, asStrings(ids));
    }

    public static String join(List<Long> ids, String delimiter) {
        return String.join(delimiter, asStrings(ids));
    }

    public static String joinAndQuoteMark(Collection<String> ids) {
        return joinAndQuoteMark(ids, DEFAULT_QUOTE_MARK, DEFAULT_DELIMITER);
    }

    public static String camelCaseToSnakeCase(String str) {
        String converted = str.replaceAll("([A-Z]+)([A-Z][a-z])", "$1_$2")
                              .replaceAll("([a-z])([A-Z])", "$1_$2")
                              .toLowerCase();

        return converted.length() == str.length() ? str : converted;
    }

    public static String camelCaseToSnakeCaseForEcqlFilter(String ecqlFilter) {
        String[] words = ecqlFilter.split(" ");

        StringBuilder result = new StringBuilder();
        for (String word: words) {
            result.append(camelCaseToSnakeCase(word)).append(" ");
        }

        return result.toString().trim();
    }

    public static String removeSpecificChars(String input) {
        return input.replaceAll("[.(\"'\\[\\]{}),]", " ");
    }

    public static String buildQueryWithParams(String query, Map<String, Object> values) {
        String result = query;
        for (Map.Entry<String, Object> entry: values.entrySet()) {
            result = result.replace(":" + entry.getKey(), "'" + entry.getValue() + "'");
        }

        return result;
    }

    public static String removePunctuation(String input) {
        return input.replaceAll("\\p{Punct}", "");
    }

    public static Set<String> setToLowerCase(Set<String> input) {
        return input.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
    }

    private static String joinAndQuoteMark(Collection<String> ids,
                                           String quoteMark,
                                           String delimiter) {
        return String.join(delimiter, addQuoteMark(ids, quoteMark));
    }

    private static List<String> addQuoteMark(Collection<String> ids, String quoteMark) {
        return ids.stream()
                  .map(s -> quoteMark + s + quoteMark)
                  .collect(Collectors.toList());
    }

    private static List<String> asStrings(List<Long> ids) {
        return ids.stream()
                  .map(String::valueOf)
                  .collect(Collectors.toList());
    }
}
