package ru.mycrg.gis_service.service.geoserver;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.wfs.ComplexName;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.wfs.WfsService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.ShapeFileProcessingException;

import java.io.*;
import java.util.*;
import java.util.zip.*;

@Service
public class ExportService {

    private static final String WFS_REQUEST_FILE_NAME = "wfsrequest.txt";

    private final Logger log = LoggerFactory.getLogger(ExportService.class);
    private final IAuthenticationFacade authenticationFacade;
    private final DbfDateConverterService dbfDateConverterService;

    public ExportService(IAuthenticationFacade authenticationFacade, DbfDateConverterService dbfDateConverterService) {
        this.authenticationFacade = authenticationFacade;
        this.dbfDateConverterService = dbfDateConverterService;
    }

    public byte[] getShapeFile(ComplexName complexName, String srsName, String layerTitle, String charset) {
        try {
            WfsService wfsService = new WfsService(authenticationFacade.getAccessToken());

            byte[] originalData = wfsService.downloadShapeFile(complexName, srsName, charset);
            log.debug("Original data size: {} bytes", originalData.length);

            byte[] dataWithCpg = convertCstToCpg(originalData);
            log.debug("Конвертируем DBF файл для корректной кодировки");

            byte[] dataWithFixedDbf = fixDbfInZip(dataWithCpg, charset);
            log.debug("Переименовываем: {} на {}", complexName.getLayerName(), layerTitle);

            return renameFilesInZip(dataWithFixedDbf, layerTitle);
        } catch (GeoserverClientException e) {
            log.error("Ошибка в присланном запросе: ", e);

            throw new BadRequestException("Ошибка в присланном запросе: ", new ErrorInfo("error", e.toString()));
        }
    }

    /**
     * Конвертирует файлы с расширением .cst в .cpg в ZIP-архиве. Метод обрабатывает ZIP-архив, содержащий ShapeFile, и
     * преобразует все файлы с расширением .cst в .cpg, сохраняя их содержимое. Это необходимо для обеспечения
     * корректной кодировки символов в ShapeFile.
     *
     * @param zipData байтовый массив, содержащий ZIP-архив с ShapeFile
     *
     * @return байтовый массив с обработанным ZIP-архивом, где .cst файлы заменены на .cpg
     *
     * @throws ShapeFileProcessingException если: - входные данные пусты или равны null - возникла ошибка при работе с
     *                                      ZIP-архивом - недостаточно памяти для обработки файла - произошла ошибка
     *                                      ввода-вывода при обработке данных
     */
    private byte[] convertCstToCpg(byte[] zipData) {
        if (zipData == null || zipData.length == 0) {
            throw new ShapeFileProcessingException("Получены пустые данные для обработки");
        }

        try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(zipData);
             ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
                ZipEntry entry;
                while ((entry = zipInputStream.getNextEntry()) != null) {
                    ByteArrayOutputStream entryContent = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zipInputStream.read(buffer)) > 0) {
                        entryContent.write(buffer, 0, len);
                    }

                    // Создаем новую запись, возможно с измененным именем
                    String newName = entry.getName().replace(".cst", ".cpg");
                    ZipEntry newEntry = new ZipEntry(newName);
                    zipOutputStream.putNextEntry(newEntry);

                    // Записываем содержимое
                    zipOutputStream.write(entryContent.toByteArray());
                    zipOutputStream.closeEntry();
                }

                // Явно закрываем ZipOutputStream для корректного завершения записи
                zipOutputStream.finish();
            }

            return byteArrayOutputStream.toByteArray();
        } catch (ZipException e) {
            log.error("Ошибка при работе с ZIP архивом: ", e);

            throw new ShapeFileProcessingException("ZIP архив поврежден или имеет неверный формат: " + e.getMessage());
        } catch (OutOfMemoryError e) {
            log.error("Недостаточно памяти для обработки файла: ", e);

            throw new ShapeFileProcessingException("Недостаточно памяти для обработки файла: " + e.getMessage());
        } catch (IOException e) {
            log.error("Ошибка при обработке файла: ", e);

            throw new ShapeFileProcessingException("Ошибка при обработке потока данных: " + e.getMessage());
        }
    }

    /**
     * Переименовывает файлы в ZIP-архиве, сохраняя их расширения. Все файлы в архиве, кроме 'wfsrequest.txt',
     * переименовываются с использованием нового базового имени с сохранением оригинальных расширений. Например, если
     * newBaseName="export", то файл "data.shp" будет переименован в "export.shp".
     *
     * @param zipData     байтовый массив, содержащий ZIP-архив с файлами для переименования
     * @param newBaseName новое базовое имя для файлов (без расширения)
     *
     * @return байтовый массив с обработанным ZIP-архивом, содержащим переименованные файлы
     *
     * @throws ShapeFileProcessingException если: - входные данные пусты или равны null - возникла ошибка при работе с
     *                                      ZIP-архивом - недостаточно памяти для обработки файла - произошла ошибка
     *                                      ввода-вывода при обработке данных
     */
    private byte[] renameFilesInZip(byte[] zipData, String newBaseName) {
        if (zipData == null || zipData.length == 0) {
            throw new ShapeFileProcessingException("Получены пустые данные для обработки");
        }

        try {
            // Первый проход - подсчет файлов с каждым расширением
            Map<String, Integer> extensionCount = new HashMap<>();
            try (ByteArrayInputStream countInputStream = new ByteArrayInputStream(zipData);
                 ZipInputStream countZipStream = new ZipInputStream(countInputStream)) {

                ZipEntry countEntry;
                while ((countEntry = countZipStream.getNextEntry()) != null) {
                    String name = countEntry.getName();
                    if (!WFS_REQUEST_FILE_NAME.equals(name)) {
                        String ext = name.substring(name.lastIndexOf('.'));
                        extensionCount.merge(ext, 1, Integer::sum);
                    }
                }
            }

            // Проверяем, есть ли дублирующиеся расширения
            boolean hasDuplicateExtensions = extensionCount.values().stream().anyMatch(count -> count > 1);

            // Второй проход - переименование файлов
            try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(zipData);
                 ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
                    ZipEntry entry;
                    while ((entry = zipInputStream.getNextEntry()) != null) {
                        ByteArrayOutputStream entryContent = new ByteArrayOutputStream();
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zipInputStream.read(buffer)) > 0) {
                            entryContent.write(buffer, 0, len);
                        }

                        ZipEntry newEntry = getZipEntry(newBaseName, entry, hasDuplicateExtensions);
                        zipOutputStream.putNextEntry(newEntry);
                        zipOutputStream.write(entryContent.toByteArray());
                        zipOutputStream.closeEntry();
                    }
                    zipOutputStream.finish();
                }

                return byteArrayOutputStream.toByteArray();
            }
        } catch (ZipException e) {
            log.error("Ошибка при работе с ZIP архивом: ", e);
            throw new ShapeFileProcessingException("ZIP архив поврежден или имеет неверный формат: " + e.getMessage());
        } catch (OutOfMemoryError e) {
            log.error("Недостаточно памяти для обработки файла: ", e);
            throw new ShapeFileProcessingException("Недостаточно памяти для обработки файла: " + e.getMessage());
        } catch (IOException e) {
            log.error("Ошибка при обработке файла: ", e);
            throw new ShapeFileProcessingException("Ошибка при обработке потока данных: " + e.getMessage());
        }
    }

    private static @NotNull ZipEntry getZipEntry(String newBaseName, ZipEntry entry, boolean hasDuplicateExtensions) {
        String currentName = entry.getName();
        String newName;

        if (WFS_REQUEST_FILE_NAME.equals(currentName)) {
            newName = currentName;
        } else if (hasDuplicateExtensions) {
            String extension = currentName.substring(currentName.lastIndexOf('.'));
            String suffix = getString(currentName);

            newName = newBaseName + suffix + extension;
        } else {
            String extension = currentName.substring(currentName.lastIndexOf('.'));
            newName = newBaseName + extension;
        }

        return new ZipEntry(newName);
    }

    private static @NotNull String getString(String currentName) {
        String originalNameWithoutExt = currentName.substring(0, currentName.lastIndexOf('.'));
        String suffix = "";

        // Извлекаем суффикс после последнего подчеркивания
        int lastUnderscoreIndex = originalNameWithoutExt.lastIndexOf('_');
        if (lastUnderscoreIndex != -1) {
            suffix = "_" + originalNameWithoutExt.substring(lastUnderscoreIndex + 1);
        }

        return suffix;
    }

    /**
     * Исправляет кодировку DBF файла в ZIP архиве, конвертируя поля TIMESTAMP_DBASE7 в DATE.
     *
     * @param zipData байтовый массив, содержащий ZIP архив с файлами ShapeFile
     * @param charset кодировка для чтения/записи DBF файла
     *
     * @return байтовый массив с обработанным ZIP архивом
     */
    private byte[] fixDbfInZip(byte[] zipData, String charset) {
        if (zipData == null || zipData.length == 0) {
            throw new ShapeFileProcessingException("Получены пустые данные для обработки");
        }

        try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(zipData);
             ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
                ZipEntry entry;
                while ((entry = zipInputStream.getNextEntry()) != null) {
                    // Читаем содержимое текущего файла
                    ByteArrayOutputStream entryContent = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zipInputStream.read(buffer)) > 0) {
                        entryContent.write(buffer, 0, len);
                    }

                    byte[] fileData = entryContent.toByteArray();

                    // Если это DBF файл, конвертируем его
                    if (entry.getName().toLowerCase().endsWith(".dbf")) {
                        log.debug("Обрабатываем DBF файл: {}", entry.getName());
                        fileData = dbfDateConverterService.convertTimestampToDateField(fileData, charset);
                    }

                    // Создаем новую запись с тем же именем
                    ZipEntry newEntry = new ZipEntry(entry.getName());
                    zipOutputStream.putNextEntry(newEntry);
                    zipOutputStream.write(fileData);
                    zipOutputStream.closeEntry();
                }
                zipOutputStream.finish();
            }

            return byteArrayOutputStream.toByteArray();
        } catch (ZipException e) {
            log.error("Ошибка при работе с ZIP архивом: ", e);
            throw new ShapeFileProcessingException("ZIP архив поврежден или имеет неверный формат: " + e.getMessage());
        } catch (OutOfMemoryError e) {
            log.error("Недостаточно памяти для обработки файла: ", e);
            throw new ShapeFileProcessingException("Недостаточно памяти для обработки файла: " + e.getMessage());
        } catch (IOException e) {
            log.error("Ошибка при обработке файла: ", e);
            throw new ShapeFileProcessingException("Ошибка при обработке потока данных: " + e.getMessage());
        }
    }
}
