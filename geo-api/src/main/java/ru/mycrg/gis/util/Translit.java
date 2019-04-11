package ru.mycrg.gis.util;

public class Translit {

    private static final char[][] charTable = new char[65536][];

    static {
        charTable['0'] = "0".toCharArray();
        charTable['1'] = "1".toCharArray();
        charTable['2'] = "2".toCharArray();
        charTable['3'] = "3".toCharArray();
        charTable['4'] = "4".toCharArray();
        charTable['5'] = "5".toCharArray();
        charTable['6'] = "6".toCharArray();
        charTable['7'] = "7".toCharArray();
        charTable['8'] = "8".toCharArray();
        charTable['9'] = "9".toCharArray();

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

        charTable['A'] = "A".toCharArray();
        charTable['B'] = "B".toCharArray();
        charTable['C'] = "C".toCharArray();
        charTable['D'] = "D".toCharArray();
        charTable['E'] = "E".toCharArray();
        charTable['F'] = "F".toCharArray();
        charTable['G'] = "G".toCharArray();
        charTable['H'] = "H".toCharArray();
        charTable['I'] = "I".toCharArray();
        charTable['J'] = "J".toCharArray();
        charTable['K'] = "K".toCharArray();
        charTable['L'] = "L".toCharArray();
        charTable['M'] = "M".toCharArray();
        charTable['N'] = "N".toCharArray();
        charTable['O'] = "O".toCharArray();
        charTable['P'] = "P".toCharArray();
        charTable['Q'] = "Q".toCharArray();
        charTable['R'] = "R".toCharArray();
        charTable['S'] = "S".toCharArray();
        charTable['T'] = "T".toCharArray();
        charTable['U'] = "U".toCharArray();
        charTable['V'] = "V".toCharArray();
        charTable['W'] = "W".toCharArray();
        charTable['X'] = "X".toCharArray();
        charTable['Y'] = "Y".toCharArray();
        charTable['Z'] = "Z".toCharArray();

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
