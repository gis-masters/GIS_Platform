package ru.mycrg.report_service.services;

import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.report_service.dto.PictureWithDescription;
import ru.mycrg.report_service.utils.DocxUtils;
import ru.mycrg.report_service.utils.ImagesUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReplacePictureService {

    private final Logger log = LoggerFactory.getLogger(ReplacePictureService.class);

    private final String PICTURE_PLACEHOLDER_START = "{%";
    private final String PICTURE_PLACEHOLDER_END = "%}";
    private final String DEFAULT_DESCRIPTION_AFTER_REPLACE = "";

    private final DocxUtils docxUtils;
    private final ImagesUtils imagesUtils;

    public ReplacePictureService(DocxUtils docxUtils, ImagesUtils imagesUtils) {
        this.docxUtils = docxUtils;
        this.imagesUtils = imagesUtils;
    }

    public File createNewFile(File file, Map<String, String> media) {
        if (media == null || media.isEmpty()) {
            return file;
        }

        log.debug("Ключи в media: {}", media.keySet());

        try (FileInputStream fis = new FileInputStream(file);
             XWPFDocument document = new XWPFDocument(fis)) {

            Map<String, List<PictureWithDescription>> imagesInDock = findAllImages(document);
            log.debug("Ключи найденные в шаблоне печати: {}", imagesInDock.keySet());

            for (Map.Entry<String, String> entry: media.entrySet()) {
                String placeholder = entry.getKey();
                log.debug("Работаем с картинкой по ключу: {}", placeholder);

                try {
                    swapPicture(entry.getValue(), imagesInDock.get(placeholder));
                } catch (Exception e) {
                    log.warn("Не удалось заменить картинку для плейсхолдера '{}'. Причина => {}",
                             placeholder, e.getMessage());
                }
            }

            try (FileOutputStream fos = new FileOutputStream(file)) {
                document.write(fos);
            }
        } catch (Exception e) {
            log.warn("Не удалось подставить картинки в шаблон. Причина => {}", e.getMessage());

            return file;
        }

        return file;
    }

    private void swapPicture(String base64Picture, List<PictureWithDescription> locations) {
        byte[] imageBytes = imagesUtils.decodePicture(base64Picture);

        for (PictureWithDescription picture: locations) {
            try {
                changeFoundImage(picture.getParagraph(), picture.getRun(), imageBytes);
            } catch (Exception e) {
                log.warn("Не удалось заменить картинку в одной из локаций. Причина => {}", e.getMessage());
            }
        }
    }

    private void changeFoundImage(XWPFParagraph paragraph, XWPFRun run, byte[] imageBytes) throws Exception {
        int pictureType = imagesUtils.detectImageType(imageBytes);
        if (pictureType == -1) {
            throw new IllegalArgumentException("Неподдерживаемый формат изображения");
        }

        XWPFDocument document = paragraph.getDocument();
        String relationshipId = document.addPictureData(imageBytes, pictureType);

        docxUtils.replaceAllImageReferencesInRun(run, relationshipId, DEFAULT_DESCRIPTION_AFTER_REPLACE);
    }

    private Map<String, List<PictureWithDescription>> findAllImages(XWPFDocument document) {
        Map<String, List<PictureWithDescription>> imagesMap = new HashMap<>();

        log.debug("Поиск картинок в параграфах верхнего уровня");
        for (XWPFParagraph paragraph: document.getParagraphs()) {
            List<PictureWithDescription> found = findPicturesInParagraph(paragraph);
            for (PictureWithDescription location: found) {
                addToImagesMap(imagesMap, location);
            }
        }

        log.debug("Поиск картинок в таблицах (с поддержкой вложенных таблиц)");
        for (XWPFTable table: document.getTables()) {
            findPicturesInTable(table, imagesMap);
        }

        int totalPictures = imagesMap.values().stream().mapToInt(List::size).sum();
        log.info("Найдено картинок с плейсхолдерами: {} (уникальных плейсхолдеров: {})", totalPictures,
                 imagesMap.size());

        return imagesMap;
    }

    /**
     * Рекурсивно ищет картинки с плейсхолдерами в таблице документа.
     * Поддерживает вложенные таблицы.
     *
     * @param table таблица для обработки
     * @param imagesMap мапа для сохранения найденных картинок (ключ - плейсхолдер, значение - список картинок)
     */
    private void findPicturesInTable(XWPFTable table, Map<String, List<PictureWithDescription>> imagesMap) {
        for (XWPFTableRow row: table.getRows()) {
            for (XWPFTableCell cell: row.getTableCells()) {
                for (XWPFParagraph paragraph: cell.getParagraphs()) {
                    List<PictureWithDescription> found = findPicturesInParagraph(paragraph);
                    for (PictureWithDescription location: found) {
                        addToImagesMap(imagesMap, location);
                    }
                }

                for (XWPFTable nestedTable: cell.getTables()) {
                    findPicturesInTable(nestedTable, imagesMap);
                }
            }
        }
    }

    private List<PictureWithDescription> findPicturesInParagraph(XWPFParagraph paragraph) {
        List<PictureWithDescription> result = new ArrayList<>();

        List<PictureWithDescription> allPictures = docxUtils.extractPicturesFromParagraph(paragraph);

        for (PictureWithDescription picture: allPictures) {
            String description = picture.getDescription();

            if (isPlaceholder(description)) {
                result.add(picture);
                log.debug("Найден плейсхолдер: {} в параграфе", description);
            }
        }

        return result;
    }

    /**
     * Проверяет, является ли текст плейсхолдером (формат {%...%})
     *
     * @param text текст для проверки
     *
     * @return true если текст является плейсхолдером
     */
    private boolean isPlaceholder(String text) {
        return text != null &&
                text.startsWith(PICTURE_PLACEHOLDER_START) &&
                text.endsWith(PICTURE_PLACEHOLDER_END);
    }

    /**
     * Добавляет картинку в мапу. Если плейсхолдер уже существует, добавляет в список. Если нет - создает новый список.
     *
     * @param imagesMap мапа для добавления
     * @param location  информация о картинке
     */
    private void addToImagesMap(Map<String, List<PictureWithDescription>> imagesMap, PictureWithDescription location) {
        imagesMap.computeIfAbsent(location.getDescription(), ignored -> new ArrayList<>()).add(location);
    }
}
