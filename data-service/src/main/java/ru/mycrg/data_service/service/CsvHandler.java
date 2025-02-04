package ru.mycrg.data_service.service;

import com.opencsv.CSVWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;

import static java.util.Objects.isNull;

public class CsvHandler implements AutoCloseable {

    public static final Logger log = LoggerFactory.getLogger(CsvHandler.class);

    private final CSVWriter writer;

    public CsvHandler(String filePath, String[] header) throws IOException {
        this(filePath, header, Charset.forName("windows-1251"));
    }

    public CsvHandler(String filePath, String[] header, Charset charset) throws IOException {
        this.writer = new CSVWriter(new FileWriter(filePath, charset),
                                    ';',
                                    '"',
                                    '\t',
                                    "\n");
        append(header);
    }

    public void append(String[] data) {
        writer.writeNext(data);
    }

    public void close() {
        try {
            if (isNull(writer)) {
                return;
            }
            writer.close();
        } catch (IOException e) {
            log.error("Не удалось закрыть подключение, {} ", e.getMessage());
        }
    }
}
