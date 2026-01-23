package ru.mycrg.report_service.services;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.xmlbeans.XmlCursor;
import org.apache.xmlbeans.XmlObject;
import org.openxmlformats.schemas.drawingml.x2006.main.CTBlip;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTR;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.xml.namespace.QName;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Base64;
import java.util.Map;

@Service
public class SwapPictureService {

    private final Logger log = LoggerFactory.getLogger(SwapPictureService.class);

    private final String PICTURE_PLACEHOLDER_START = "{r.";
    private final String PICTURE_PLACEHOLDER_END = "}";

    private final FileService fileService;

    public SwapPictureService(FileService fileService) {
        this.fileService = fileService;
    }

    public File createNewTemplateWithNewPictures(File file, Map<String, String> media) throws Exception {
        File tempFile = fileService.createFileCopy(file);

        if (media == null || media.isEmpty()) {
            return tempFile;
        }

        for (Map.Entry<String, String> entry: media.entrySet()) {
            swapPicture(tempFile, entry.getKey(), entry.getValue());
        }

        return tempFile;
    }

    private void swapPicture(File tempFile, String placeHolder, String base64Picture) {
        String picture_placeholder = PICTURE_PLACEHOLDER_START + placeHolder + PICTURE_PLACEHOLDER_END;

        try (FileInputStream fis = new FileInputStream(tempFile);
             XWPFDocument document = new XWPFDocument(fis)) {

            //TODO: Сделать под base64 от фронта или взять другой декодер. фронт оправляет "data:image/jpeg;base64, ..."
            String s = base64Picture;
            int comma = s.indexOf(',');
            if (comma >= 0) {
                s = s.substring(comma + 1);
            }
            byte[] imageBytes = Base64.getDecoder().decode(s);
            boolean placeholderFound = false;

            // Проходим по всем параграфам
            for (XWPFParagraph paragraph: document.getParagraphs()) {
                for (XWPFRun run: paragraph.getRuns()) {

                    CTR ctR = run.getCTR();

                    // 1. Проверяем AlternateContent (там может быть w:drawing)
                    // Используем XmlObject для доступа к AlternateContent
                    XmlObject[] alternateContentArray = ctR.selectPath(
                            "declare namespace mc='http://schemas.openxmlformats.org/markup-compatibility/2006' .//mc:AlternateContent"
                    );

                    log.debug("Найдено AlternateContent элементов: {}", alternateContentArray.length);

                    for (XmlObject altContentObj: alternateContentArray) {
                        // Ищем Choice внутри AlternateContent
                        XmlObject[] choiceArray = altContentObj.selectPath(
                                "declare namespace mc='http://schemas.openxmlformats.org/markup-compatibility/2006' " +
                                        "declare namespace w='http://schemas.openxmlformats.org/wordprocessingml/2006/main' " +
                                        "declare namespace wp='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing' " +
                                        ".//mc:Choice//w:drawing//wp:docPr"
                        );

                        log.debug("Найдено docPr элементов в AlternateContent: {}", choiceArray.length);

                        for (XmlObject docPrObj: choiceArray) {
                            // Получаем атрибуты напрямую через XmlObject
                            XmlCursor cursor = docPrObj.newCursor();

                            String desc = cursor.getAttributeText(new QName("desc"));
                            String title = cursor.getAttributeText(new QName("title"));
                            String name = cursor.getAttributeText(new QName("name"));

                            cursor.dispose();

                            log.debug("AlternateContent docPr - Name: [{}], Descr: [{}], Title: [{}]",
                                      name,
                                      desc,
                                      title);

                            if ((desc != null && desc.contains(picture_placeholder)) ||
                                    (title != null && title.contains(picture_placeholder)) ||
                                    (name != null && name.contains(picture_placeholder))) {

                                log.debug("плейсхолдер найден в AlternateContent!");
                                placeholderFound = true;

                                changeFoundImage(paragraph, run, imageBytes);

                                break;
                            }
                        }

                        if (placeholderFound) {
                            break;
                        }
                    }

                    if (placeholderFound) {
                        break;
                    }

                    // 2. Проверяем обычные drawing objects (не в AlternateContent)
                    var drawingList = ctR.getDrawingList();
                    for (var drawing: drawingList) {

                        // Проверяем inline drawings
                        if (drawing.getInlineList() != null) {
                            for (var inline: drawing.getInlineList()) {
                                var docPr = inline.getDocPr();
                                if (docPr != null) {
                                    String descr = docPr.getDescr();
                                    String title = docPr.getTitle();
                                    String name = docPr.getName();

                                    log.debug("Обычный Inline - Name: [{}], Descr: [{}], Title: [{}]",
                                              name,
                                              descr,
                                              title);

                                    if ((descr != null && descr.contains(picture_placeholder)) ||
                                            (title != null && title.contains(picture_placeholder)) ||
                                            (name != null && name.contains(picture_placeholder))) {

                                        log.debug("плейсхолдер найден в обычном inline drawing!");
                                        placeholderFound = true;

                                        changeFoundImage(paragraph, run, imageBytes);

                                        break;
                                    }
                                }
                            }
                        }

                        if (placeholderFound) {
                            break;
                        }
                    }

                    if (placeholderFound) {
                        break;
                    }
                }

                if (placeholderFound) {
                    break;
                }
            }

            if (!placeholderFound) {
                log.warn("ВНИМАНИЕ! Плейсхолдер '{}' НЕ НАЙДЕН в документе!", picture_placeholder);
            }

            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                document.write(fos);
            }
        } catch (Exception e) {
            //пользователь должен получить отчёт, пусть даже без картинки
            log.warn("Ну удалось подставить картинку в шаблон. Причина => {}", e.getMessage());

            throw new RuntimeException("Ошибка подстановки картинки в шаблон", e);
        }
    }

    private void changeFoundImage(XWPFParagraph paragraph, XWPFRun run, byte[] imageBytes) throws Exception {
        // Определяем тип картинки по magic bytes
        int pictureType = detectImageType(imageBytes);
        if (pictureType == -1) {
            throw new IllegalArgumentException("Неподдерживаемый формат изображения");
        }

        // Получаем документ
        XWPFDocument document = paragraph.getDocument();

        // Добавляем новую картинку в документ и получаем relationship ID
        String relationshipId = document.addPictureData(imageBytes, pictureType);

        CTR ctR = run.getCTR();
        int replacedBlipCount = 0;
        int replacedImagedataCount = 0;

        // Заменяем ВСЕ a:blip (DrawingML - для современных версий Word)
        XmlObject[] blipArray = ctR.selectPath(
                "declare namespace a='http://schemas.openxmlformats.org/drawingml/2006/main' " +
                        ".//a:blip"
        );

        log.debug("Найдено a:blip элементов: {}", blipArray.length);

        for (XmlObject blipObj: blipArray) {
            log.debug("Тип blipObj: {}", blipObj.getClass().getName());

            // Используем типизированный подход через CTBlip для правильной записи namespace
            if (blipObj instanceof CTBlip ctBlip) {
                ctBlip.setEmbed(relationshipId);
                replacedBlipCount++;
                log.debug("Заменён DrawingML blip #{}, relationship ID: {}", replacedBlipCount, relationshipId);
            } else {
                // Если instanceof не сработал, попробуем через XmlCursor как fallback
                log.debug("blipObj не является CTBlip, используем XmlCursor");
                XmlCursor cursor = blipObj.newCursor();
                cursor.setAttributeText(
                        new QName("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed"),
                        relationshipId
                );
                cursor.dispose();
                replacedBlipCount++;
                log.debug("Заменён DrawingML blip #{} через XmlCursor, relationship ID: {}",
                          replacedBlipCount,
                          relationshipId);
            }
        }

        // Заменяем VML fallback (v:imagedata - для старых версий Word и OnlyOffice)
        XmlObject[] imagedataArray = ctR.selectPath(
                "declare namespace v='urn:schemas-microsoft-com:vml' " +
                        "declare namespace r='http://schemas.openxmlformats.org/officeDocument/2006/relationships' " +
                        ".//v:imagedata"
        );

        for (XmlObject imagedataObj: imagedataArray) {
            XmlCursor cursor = imagedataObj.newCursor();
            cursor.setAttributeText(
                    new QName("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id"),
                    relationshipId
            );
            cursor.dispose();
            replacedImagedataCount++;
            log.debug("Заменён VML fallback imagedata #{}, relationship ID: {}", replacedImagedataCount,
                      relationshipId);
        }

        if (replacedBlipCount == 0 && replacedImagedataCount == 0) {
            log.warn("Не найдено ни одного blip или imagedata элемента в drawing");
        } else {
            log.debug("Картинка заменена успешно! Обновлено DrawingML blip: {}, VML imagedata: {}",
                      replacedBlipCount, replacedImagedataCount);
        }
    }

    private int detectImageType(byte[] imageBytes) {
        if (imageBytes == null || imageBytes.length == 0) {
            log.error("Пустой массив байтов изображения");

            return -1;
        }

        // PNG: полная сигнатура 89 50 4E 47 0D 0A 1A 0A (8 байт)
        if (imageBytes.length >= 8 &&
                (imageBytes[0] & 0xFF) == 0x89 &&
                (imageBytes[1] & 0xFF) == 0x50 &&
                (imageBytes[2] & 0xFF) == 0x4E &&
                (imageBytes[3] & 0xFF) == 0x47 &&
                (imageBytes[4] & 0xFF) == 0x0D &&
                (imageBytes[5] & 0xFF) == 0x0A &&
                (imageBytes[6] & 0xFF) == 0x1A &&
                (imageBytes[7] & 0xFF) == 0x0A) {
            log.debug("Обнаружен формат изображения: PNG");

            return XWPFDocument.PICTURE_TYPE_PNG;
        }

        // JPEG: начинается с FF D8 FF
        if (imageBytes.length >= 3 &&
                (imageBytes[0] & 0xFF) == 0xFF &&
                (imageBytes[1] & 0xFF) == 0xD8 &&
                (imageBytes[2] & 0xFF) == 0xFF) {
            log.debug("Обнаружен формат изображения: JPEG");

            return XWPFDocument.PICTURE_TYPE_JPEG;
        }

        // Неподдерживаемый формат
        log.error("Неподдерживаемый формат изображения. Первые байты: {} {} {} {}",
                  String.format("%02X", imageBytes[0] & 0xFF),
                  imageBytes.length > 1 ? String.format("%02X", imageBytes[1] & 0xFF) : "N/A",
                  imageBytes.length > 2 ? String.format("%02X", imageBytes[2] & 0xFF) : "N/A",
                  imageBytes.length > 3 ? String.format("%02X", imageBytes[3] & 0xFF) : "N/A");
        return -1;
    }
}
