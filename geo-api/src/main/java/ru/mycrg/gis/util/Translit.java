package ru.mycrg.gis.util;

public class Translit {

    private static final char[][] charTable = new char[65536][];

    static {
        charTable['А'] = "A".toCharArray();
        charTable['Б'] = "B".toCharArray();
        charTable['В'] = "V".toCharArray();
        // ...
        charTable['Э'] = "E".toCharArray();
        charTable['Ю'] = "U".toCharArray();
        charTable['Я'] = "YA".toCharArray();

        for (int i = 0; i < charTable.length; i++) {
            char idx = (char) i;
            char lower = Character.toLowerCase(idx);
            if (charTable[i] != null) {
                charTable[lower] = toLowerCase(charTable[i]);
            }
        }
    }

    public static String doIt(String text) {
        StringBuilder sb = new StringBuilder(text.length());
        for (int i = 0; i < text.length(); i++) {
            char[] replace = charTable[text.charAt(i)];
            if (replace == null) {
                sb.append(text.charAt(i));
            } else {
                sb.append(replace);
            }
        }

        return sb.toString();
    }

    private static char[] toLowerCase(char[] chars) {
        char[] r = new char[chars.length];
        for (int i = 0; i < chars.length; i++) {
            r[i] = Character.toLowerCase(chars[i]);

        }

        return r;
    }
}
