package ru.mycrg.mediator;

class Preconditions {

    private Preconditions() {
        throw new IllegalStateException("Utility class");
    }

    public static <T> T checkArgument(T nonNullable, String errorMessage) {
        if (nonNullable == null) {
            throw new IllegalArgumentException(errorMessage);
        }

        return nonNullable;
    }
}
