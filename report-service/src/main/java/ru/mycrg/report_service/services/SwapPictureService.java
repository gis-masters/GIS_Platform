package ru.mycrg.report_service.services;

import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.xmlbeans.XmlCursor;
import org.apache.xmlbeans.XmlObject;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTR;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.xml.namespace.QName;
import java.io.ByteArrayInputStream;
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

        for (Map.Entry<String, String> entry: media.entrySet()) {
            swapPicture(tempFile, entry.getKey(), entry.getValue());
        }

        return tempFile;
    }

    private void swapPicture(File tempFile, String placeHolder, String base64Picture) {
        String picture_placeholder = PICTURE_PLACEHOLDER_START + placeHolder + PICTURE_PLACEHOLDER_END;

        try (FileInputStream fis = new FileInputStream(tempFile);
             XWPFDocument document = new XWPFDocument(fis)) {

            byte[] imageBytes = Base64.getDecoder().decode(base64Picture);
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
        // Удаляем старый run и создаём новый с картинкой
        int runPosition = paragraph.getRuns().indexOf(run);
        paragraph.removeRun(runPosition);
        XWPFRun newRun = paragraph.insertNewRun(runPosition);

        newRun.addPicture(
                new ByteArrayInputStream(imageBytes),
                XWPFDocument.PICTURE_TYPE_PNG,
                "replaced-image.png",
                Units.toEMU(400),
                Units.toEMU(300)
        );

        log.debug("Картинка заменена успешно!");
    }
}
