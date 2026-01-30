package ru.mycrg.report_service.dto;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

/**
 * Вспомогательный класс для хранения информации о найденной картинке
 */
public class PictureWithDescription {

    private final String description;
    private final XWPFParagraph paragraph;
    private final XWPFRun run;

    public PictureWithDescription(String description, XWPFParagraph paragraph, XWPFRun run) {
        this.description = description;
        this.paragraph = paragraph;
        this.run = run;
    }

    public String getDescription() {
        return description;
    }

    public XWPFParagraph getParagraph() {
        return paragraph;
    }

    public XWPFRun getRun() {
        return run;
    }
}
