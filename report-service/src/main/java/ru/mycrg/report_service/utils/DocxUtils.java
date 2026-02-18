package ru.mycrg.report_service.utils;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.xmlbeans.XmlCursor;
import org.apache.xmlbeans.XmlObject;
import org.openxmlformats.schemas.drawingml.x2006.main.CTBlip;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTR;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.report_service.dto.PictureWithDescription;

import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DocxUtils {

    private final Logger log = LoggerFactory.getLogger(DocxUtils.class);

    /**
     * Извлекает все описания картинок из параграфа (без фильтрации)
     *
     * @param paragraph параграф для сканирования
     *
     * @return список пар [описание картинки, XWPFRun с этой картинкой]
     */
    public List<PictureWithDescription> extractPicturesFromParagraph(XWPFParagraph paragraph) {
        List<PictureWithDescription> result = new ArrayList<>();

        for (XWPFRun run: paragraph.getRuns()) {
            CTR ctR = run.getCTR();

            // 1. Проверяем прямые drawing элементы
            try (XmlCursor cursor = ctR.newCursor()) {
                boolean hasChild = cursor.toFirstChild();
                log.debug("Run имеет дочерние элементы: {}", hasChild);

                if (hasChild) {
                    do {
                        String localPart = cursor.getName().getLocalPart();
                        log.debug("Найден элемент: {}", localPart);
                        
                        if ("drawing".equals(localPart)) {
                            log.debug("Найден drawing элемент, извлекаем описание...");
                            Optional<String> description = extractDescription(cursor);

                            if (description.isPresent()) {
                                log.debug("Найдено описание: {}", description.get());
                                result.add(new PictureWithDescription(description.get(), paragraph, run));
                            } else {
                                log.debug("Описание не найдено в drawing элементе");
                            }
                        }
                    } while (cursor.toNextSibling());
                }
            }

            // 2. Проверяем AlternateContent (для картинок в совместимом формате)
            XmlObject[] alternateContentArray = ctR.selectPath(
                    "declare namespace mc='http://schemas.openxmlformats.org/markup-compatibility/2006' " +
                            ".//mc:AlternateContent"
            );

            if (alternateContentArray.length > 0) {
                log.debug("Найдено AlternateContent элементов: {}", alternateContentArray.length);

                for (XmlObject altContentObj: alternateContentArray) {
                    XmlObject[] docPrArray = altContentObj.selectPath(
                            "declare namespace mc='http://schemas.openxmlformats.org/markup-compatibility/2006' " +
                                    "declare namespace w='http://schemas.openxmlformats.org/wordprocessingml/2006/main' " +
                                    "declare namespace wp='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing' " +
                                    ".//mc:Choice//w:drawing//wp:docPr"
                    );

                    log.debug("Найдено docPr элементов в AlternateContent: {}", docPrArray.length);

                    for (XmlObject docPrObj: docPrArray) {
                        try (XmlCursor cursor = docPrObj.newCursor()) {
                            String descr = cursor.getAttributeText(new QName("descr"));

                            log.debug("AlternateContent docPr - Descr: [{}]", descr);

                            if (descr != null) {
                                result.add(new PictureWithDescription(descr, paragraph, run));
                            }
                        }
                    }
                }
            }
        }

        log.debug("Извлечено картинок из параграфа: {}", result.size());

        return result;
    }

    /**
     * Заменяет все ссылки на изображения в Run на новый relationship ID и опционально меняет описание. Обрабатывает как
     * DrawingML (a:blip), так и VML fallback (v:imagedata) элементы.
     *
     * @param run               Run, содержащий изображение
     * @param newRelationshipId новый ID связи с изображением
     * @param newDescription    новое описание картинки (или null, если не нужно менять)
     *
     * @throws IllegalStateException если не найдено ни одного blip или imageData элемента
     */
    public void replaceAllImageReferencesInRun(XWPFRun run, String newRelationshipId, String newDescription) {
        CTR ctR = run.getCTR();

        int replacedBlipCount = replaceDrawingMLBlips(ctR, newRelationshipId);
        int replaceVMLImageData = replaceVMLImagedata(ctR, newRelationshipId);

        if (replacedBlipCount == 0 && replaceVMLImageData == 0) {
            throw new IllegalStateException("Не найдено ни одного blip или imageData элемента в drawing");
        } else {
            log.debug("Картинка заменена успешно! Обновлено DrawingML blip: {}, VML imageData: {}",
                      replacedBlipCount, replaceVMLImageData);
        }

        updateDescription(ctR, newDescription);
    }

    /**
     * Извлекает описание (атрибут descr) из XML элемента drawing. descr это поле "Описание" картинки.
     *
     * @param cursor курсор на элементе drawing
     *
     * @return описание картинки или null
     */
    private Optional<String> extractDescription(XmlCursor cursor) {
        log.debug("extractDescription: начало извлечения описания");
        
        // Попытка 1: проверяем inline
        try (XmlCursor innerCursor = cursor.newCursor()) {
            boolean hasInline = innerCursor.toChild(
                    new QName("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing", "inline"));
            log.debug("extractDescription: есть inline элемент: {}", hasInline);
            
            if (hasInline) {
                boolean hasDocPr = innerCursor.toChild(
                        new QName("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing", "docPr"));
                log.debug("extractDescription: inline имеет docPr: {}", hasDocPr);
                
                if (hasDocPr) {
                    String descr = innerCursor.getAttributeText(new QName("descr"));
                    log.debug("extractDescription: inline descr атрибут: {}", descr);
                    
                    if (descr != null) {
                        log.debug("Извлечено описание из inline: {}", descr);
                        return Optional.of(descr);
                    }
                }
            }
        }
        
        // Попытка 2: проверяем anchor (создаём новый курсор от исходной позиции)
        try (XmlCursor innerCursor = cursor.newCursor()) {
            boolean hasAnchor = innerCursor.toChild(
                    new QName("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing", "anchor"));
            log.debug("extractDescription: есть anchor элемент: {}", hasAnchor);
            
            if (hasAnchor) {
                boolean hasDocPr = innerCursor.toChild(
                        new QName("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing", "docPr"));
                log.debug("extractDescription: anchor имеет docPr: {}", hasDocPr);
                
                if (hasDocPr) {
                    String descr = innerCursor.getAttributeText(new QName("descr"));
                    log.debug("extractDescription: anchor descr атрибут: {}", descr);
                    
                    if (descr != null) {
                        log.debug("Извлечено описание из anchor: {}", descr);
                        return Optional.of(descr);
                    }
                }
            }
        }

        log.debug("extractDescription: описание не найдено, возврат empty");
        return Optional.empty();
    }

    /**
     * Обновляет описание (атрибут descr) в элементе wp:docPr для картинки.
     *
     * @param ctR            CTR элемент, содержащий картинку
     * @param newDescription новое описание
     */
    private void updateDescription(CTR ctR, String newDescription) {
        if (newDescription == null) {
            log.warn("Для замены описания картинки был передан null.");

            return;
        }

        XmlObject[] docPrArray = ctR.selectPath(
                "declare namespace wp='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing' " +
                        ".//wp:docPr"
        );

        log.debug("Найдено wp:docPr элементов для обновления описания: {}", docPrArray.length);

        int updatedCount = 0;
        for (XmlObject docPrObj: docPrArray) {
            try (XmlCursor cursor = docPrObj.newCursor()) {
                cursor.setAttributeText(new QName("descr"), newDescription);
                updatedCount++;
                log.debug("Обновлено описание #{} на: {}", updatedCount, newDescription);
            }
        }

        if (updatedCount == 0) {
            log.warn("Не найдено wp:docPr элементов для обновления описания");
        }
    }

    /**
     * Заменяет все DrawingML a:blip элементы в CTR на новый relationship ID.
     *
     * @param ctR               CTR элемент для обработки
     * @param newRelationshipId новый ID связи с изображением
     *
     * @return количество замененных blip элементов
     */
    private int replaceDrawingMLBlips(CTR ctR, String newRelationshipId) {
        XmlObject[] blipArray = ctR.selectPath(
                "declare namespace a='http://schemas.openxmlformats.org/drawingml/2006/main' " +
                        ".//a:blip"
        );

        log.debug("Найдено a:blip элементов: {}", blipArray.length);

        int replacedCount = 0;
        for (XmlObject blipObj: blipArray) {
            log.debug("Тип blipObj: {}", blipObj.getClass().getName());

            if (blipObj instanceof CTBlip ctBlip) {
                ctBlip.setEmbed(newRelationshipId);
                replacedCount++;
                log.debug("Заменён DrawingML blip #{}, relationship ID: {}", replacedCount, newRelationshipId);
            } else {
                try (XmlCursor cursor = blipObj.newCursor()) {
                    cursor.setAttributeText(
                            new QName("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed"),
                            newRelationshipId
                    );
                }
                replacedCount++;
                log.debug("Заменён DrawingML blip #{} через XmlCursor, relationship ID: {}",
                          replacedCount,
                          newRelationshipId);
            }
        }

        return replacedCount;
    }

    /**
     * Заменяет все VML v:imagedata элементы в CTR на новый relationship ID.
     *
     * @param ctR               CTR элемент для обработки
     * @param newRelationshipId новый ID связи с изображением
     *
     * @return количество замененных imagedata элементов
     */
    private int replaceVMLImagedata(CTR ctR, String newRelationshipId) {
        XmlObject[] imagedataArray = ctR.selectPath(
                "declare namespace v='urn:schemas-microsoft-com:vml' " +
                        "declare namespace r='http://schemas.openxmlformats.org/officeDocument/2006/relationships' " +
                        ".//v:imagedata"
        );

        log.debug("Найдено v:imagedata элементов: {}", imagedataArray.length);

        int replacedCount = 0;
        for (XmlObject imagedataObj: imagedataArray) {
            try (XmlCursor cursor = imagedataObj.newCursor()) {
                cursor.setAttributeText(
                        new QName("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id"),
                        newRelationshipId
                );
            }
            replacedCount++;
            log.debug("Заменён VML fallback imagedata #{}, relationship ID: {}", replacedCount,
                      newRelationshipId);
        }

        return replacedCount;
    }
}
