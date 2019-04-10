package ru.mycrg.gis.util;

public class Translit {

    private static final char[][] charTable = new char[65536][];

    static {
        charTable['А'] = "A".toCharArray();
        charTable['Б'] = "B".toCharArray();
        charTable['В'] = "V".toCharArray();
        charTable['Г'] = "G".toCharArray();
        charTable['Д'] = "D".toCharArray();
        charTable['Е'] = "E".toCharArray();
        charTable['Ё'] = "E".toCharArray();
        charTable['Ж'] = "ZH".toCharArray();
        charTable['З'] = "Z".toCharArray();
        charTable['И'] = "I".toCharArray();
        charTable['Й'] = "I".toCharArray();
        charTable['К'] = "K".toCharArray();
        charTable['Л'] = "L".toCharArray();
        charTable['М'] = "M".toCharArray();
        charTable['Н'] = "N".toCharArray();
        charTable['О'] = "O".toCharArray();
        charTable['П'] = "P".toCharArray();
        charTable['Р'] = "R".toCharArray();
        charTable['С'] = "S".toCharArray();
        charTable['Т'] = "T".toCharArray();
        charTable['У'] = "U".toCharArray();
        charTable['Ф'] = "F".toCharArray();
        charTable['Х'] = "H".toCharArray();
        charTable['Ц'] = "C".toCharArray();
        charTable['Ч'] = "CH".toCharArray();
        charTable['Ш'] = "SH".toCharArray();
        charTable['Щ'] = "SH".toCharArray();
        charTable['Ъ'] = "".toCharArray();
        charTable['Ы'] = "Y".toCharArray();
        charTable['Ь'] = "".toCharArray();
        charTable['Э'] = "E".toCharArray();
        charTable['Ю'] = "U".toCharArray();
        charTable['Я'] = "YA".toCharArray();
        charTable[' '] = " ".toCharArray();

        for (int i = 0; i < charTable.length; i++) {
            char idx = (char) i;
            char lower = Character.toLowerCase(idx);
            if (charTable[i] != null) {
                charTable[lower] = toLowerCase(charTable[i]);
            }
        }
    }

    /**
     * Только буквы англ. алфавита и цифры, без пробелов.
     * @param text Исходный текст
     */
    public static String doIt(String text) {
        StringBuilder sb = new StringBuilder(text.length());
        for (int i = 0; i < text.length(); i++) {
            char[] replace = charTable[text.charAt(i)];
            if (replace != null) {
                sb.append(replace);
            } else {
                // Do nothing. Only symbols from pool
                // sb.append(text.charAt(i));
            }
        }

        return sb.toString().trim().replace(" ", "_");
    }

    private static char[] toLowerCase(char[] chars) {
        char[] r = new char[chars.length];
        for (int i = 0; i < chars.length; i++) {
            r[i] = Character.toLowerCase(chars[i]);

        }

        return r;
    }
}
