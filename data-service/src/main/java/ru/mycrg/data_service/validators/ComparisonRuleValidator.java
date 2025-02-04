package ru.mycrg.data_service.validators;

import ru.mycrg.data_service.dto.styles.ComparisonRuleFilter;
import ru.mycrg.data_service.dto.styles.ComparisonRuleOperator;

public class ComparisonRuleValidator {

    private ComparisonRuleValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static boolean validate(ComparisonRuleFilter filter, Object actualValue) {
        if (actualValue == null) {
            return false;
        }

        final String expected = filter.getLiteral();
        final ComparisonRuleOperator operator = filter.getOperator();

        switch (operator) {
            case IS_EQUAL_TO:
                return expected.equalsIgnoreCase(actualValue.toString());
            case IS_NOT_EQUAL_TO:
                return !expected.equalsIgnoreCase(actualValue.toString());
            case IS_LESS_THEN:
                try {
                    final double _expected = Double.parseDouble(expected);
                    final double _actual = Double.parseDouble(actualValue.toString());

                    return _actual < _expected;
                } catch (NumberFormatException e) {
                    return false;
                }
            case IS_LESS_THEN_OR_EQUAL_TO:
                try {
                    final double _expected = Double.parseDouble(expected);
                    final double _actual = Double.parseDouble(actualValue.toString());

                    return _actual <= _expected;
                } catch (NumberFormatException e) {
                    return false;
                }
            case IS_GREATER_THEN:
                try {
                    final double _expected = Double.parseDouble(expected);
                    final double _actual = Double.parseDouble(actualValue.toString());

                    return _actual > _expected;
                } catch (NumberFormatException e) {
                    return false;
                }
            case IS_GREATER_THEN_OR_EQUAL_TO:
                try {
                    final double _expected = Double.parseDouble(expected);
                    final double _actual = Double.parseDouble(actualValue.toString());

                    return _actual >= _expected;
                } catch (NumberFormatException e) {
                    return false;
                }
            case IS_NULL:
                return actualValue == null;
            default:
                return false;
        }
    }
}
