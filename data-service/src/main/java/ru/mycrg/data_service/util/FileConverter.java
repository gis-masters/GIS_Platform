package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.charset.Charset.defaultCharset;
import static java.nio.charset.Charset.forName;

public class FileConverter {

    private static final char[] BUFFER = new char[4096];
    private static final Charset DEFAULT_CHARSET_FROM = defaultCharset();
    private static final Charset DEFAULT_CHARSET_TO = forName("windows-1251");

    private FileConverter() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Перекодируем DXF файл.
     * <p>
     * Пока хардкодим указание кодировки(в 13 строке) с ANSI_1252 в ANSI_1251
     *
     * @param infile      Путь к файлу
     * @param outfile     Путь к выходному файлу
     * @param charsetFrom Кодировка входящего файла
     * @param charsetTo   Кодировка исходящего файла
     */
    public static void convert(@NotNull String infile,
                               @NotNull String outfile,
                               Charset charsetFrom,
                               Charset charsetTo) throws IOException {
        try (InputStream in = Files.newInputStream(Path.of(infile));
             OutputStream out = new FileOutputStream(outfile)) {
            try (Reader reader = new BufferedReader(new InputStreamReader(in, charsetFrom));
                 Writer writer = new BufferedWriter(new OutputStreamWriter(out, charsetTo))) {
                int len;
                boolean encodingReplaced = false;
                while ((len = reader.read(BUFFER)) != -1) {
                    if (!encodingReplaced) {
                        char[] newBuffer = new String(BUFFER).replace("ANSI_1252", "ANSI_1251")
                                                             .toCharArray();
                        writer.write(newBuffer, 0, len);

                        encodingReplaced = true;
                    } else {
                        writer.write(BUFFER, 0, len);
                    }
                }
            }
        }
    }

    /**
     * Перекодируем DXF файл.
     * <p>
     * По-умолчанию перекодируется из defaultCharset() в "windows-1251".
     *
     * @param infile  Путь к файлу
     * @param outfile Путь к выходному файлу
     */
    public static void convert(@NotNull String infile, @NotNull String outfile) throws IOException {
        convert(infile, outfile, DEFAULT_CHARSET_FROM, DEFAULT_CHARSET_TO);
    }
}
