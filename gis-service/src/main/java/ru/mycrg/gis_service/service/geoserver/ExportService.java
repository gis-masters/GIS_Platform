package ru.mycrg.gis_service.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.wfs.ComplexName;
import ru.mycrg.geoserver_client.services.wfs.WfsExceptions;
import ru.mycrg.geoserver_client.services.wfs.WfsService;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ShapeFileProcessingException;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.*;
import java.util.zip.*;

@Service
public class ExportService {

    private final Logger log = LoggerFactory.getLogger(ExportService.class);
    private final IAuthenticationFacade authenticationFacade;

    public ExportService(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public byte[] getShapeFile(ComplexName complexName, String srsName, String charset) {
        try {
            WfsService wfsService = new WfsService(authenticationFacade.getAccessToken());
            byte[] originalData = wfsService.downloadShapeFile(complexName, srsName, charset);

            log.debug("Original data size: {} bytes", originalData.length);

            return convertCstToCpg(originalData);
        } catch (WfsExceptions e) {
            log.error("Ошибка в присланном запросе: ", e);
            throw new BadRequestException("Ошибка в присланном запросе: ");
        } catch (HttpClientException e) {
            log.error("Ошибка при запросе к GeoServer: ", e);
            throw new BadRequestException("Ошибка при запросе к GeoServer: " + e.getMessage());
        } catch (IOException e) {
            log.error("Ошибка при чтении данных с GeoServer: ", e);
            throw new BadRequestException("Не удалось получить данные с GeoServer");
        }
    }

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
                    // Копируем все содержимое файла во временный массив
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
}
