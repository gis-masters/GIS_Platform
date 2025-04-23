package ru.mycrg.gis_service.service.geoserver;

import com.linuxense.javadbf.DBFDataType;
import com.linuxense.javadbf.DBFField;
import com.linuxense.javadbf.DBFReader;
import com.linuxense.javadbf.DBFWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.ShapeFileProcessingException;

import java.io.*;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@Service
public class DbfDateConverterService {

    private final Logger log = LoggerFactory.getLogger(DbfDateConverterService.class);

    /**
     * Конвертирует DBF данные, заменяя все поля TIMESTAMP_DBASE7 на DATE. Чтение/запись выполняется в указанной
     * кодировке.
     *
     * @param dbfData исходные данные DBF файла
     * @param charset кодировка для чтения/записи
     *
     * @return сконвертированные данные DBF файла
     */
    public byte[] convertTimestampToDateField(byte[] dbfData, String charset) {
        try {
            try (InputStream inStream = new ByteArrayInputStream(dbfData);
                 DBFReader reader = new DBFReader(inStream, Charset.forName(charset))) {

                // 1) Собираем описание полей, меняя TIMESTAMP на DATE
                List<DBFField> newFields = new ArrayList<>();
                for (int i = 0; i < reader.getFieldCount(); i++) {
                    DBFField old = reader.getField(i);
                    if (old.getType() == DBFDataType.TIMESTAMP_DBASE7) {
                        DBFField fld = new DBFField();
                        fld.setName(old.getName());
                        fld.setType(DBFDataType.DATE);
                        fld.setLength(8);   // фиксированная длина для DATE-поля
                        newFields.add(fld);
                        log.debug("Конвертируем поле {} из TIMESTAMP в DATE", old.getName());
                    } else {
                        newFields.add(old);
                    }
                }

                // 2) Создаём DBFWriter и задаём все поля
                ByteArrayOutputStream outStream = new ByteArrayOutputStream();
                DBFWriter writer = new DBFWriter(outStream, Charset.forName(charset));
                writer.setFields(newFields.toArray(new DBFField[0]));

                // 3) Копируем записи — Date остаётся Date
                Object[] row;
                while ((row = reader.nextRecord()) != null) {
                    writer.addRecord(row);
                }

                writer.close();
                return outStream.toByteArray();
            }
        } catch (Exception e) {
            log.error("Ошибка при конвертации DBF файла: ", e);
            throw new ShapeFileProcessingException("Ошибка при конвертации DBF файла: " + e.getMessage());
        }
    }
}
