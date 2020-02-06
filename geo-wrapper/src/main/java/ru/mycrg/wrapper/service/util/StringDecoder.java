package ru.mycrg.wrapper.service.util;

import org.jetbrains.annotations.NotNull;

import static java.nio.charset.StandardCharsets.ISO_8859_1;
import static java.nio.charset.StandardCharsets.UTF_8;

public class StringDecoder {

    @NotNull
    public static String decode(@NotNull String text) {
        char[] chars = text.toCharArray();
        if (chars.length <= 0) {
            return text;
        }

        return Character.UnicodeBlock.of(chars[0]).toString().contains("LATIN_1")
                ? new String(text.getBytes(ISO_8859_1), UTF_8)
                : text;
    }

}
