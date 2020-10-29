package ru.mycrg.wrapper.service.util;

import org.jetbrains.annotations.NotNull;

import static java.lang.Character.UnicodeBlock.LATIN_1_SUPPLEMENT;
import static java.nio.charset.StandardCharsets.ISO_8859_1;
import static java.nio.charset.StandardCharsets.UTF_8;

public class StringDecoder {

    private StringDecoder() {
        throw new IllegalStateException("Utility class");
    }

    @NotNull
    public static String decode(@NotNull String text) {
        char[] chars = text.toCharArray();
        if (chars.length <= 0) {
            return text;
        }

        if (isNeedDecode(chars)) {
            return new String(text.getBytes(ISO_8859_1), UTF_8);
        }

        return text;
    }

    private static boolean isNeedDecode(char[] chars) {
        for (char aChar: chars) {
            if (LATIN_1_SUPPLEMENT.equals(Character.UnicodeBlock.of(aChar))) {
                return true;
            }
        }

        return false;
    }
}
