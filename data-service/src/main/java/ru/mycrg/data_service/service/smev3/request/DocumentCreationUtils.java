package ru.mycrg.data_service.service.smev3.request;

import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblWidth;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTcPr;
import ru.mycrg.data_service.accept_rns_1_0_3.ConstructionPermitsDataType;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

import static java.util.Optional.ofNullable;
import static org.apache.poi.xwpf.usermodel.ParagraphAlignment.*;
import static org.apache.poi.xwpf.usermodel.ParagraphAlignment.BOTH;
import static org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge.CONTINUE;
import static org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge.RESTART;

public class DocumentCreationUtils {

    public static void addParagraph(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(RIGHT);
        paragraph.setSpacingAfter(30);

        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setFontFamily("Times New Roman");
        run.setFontSize(12);
    }

    public static void setColumnWidth(XWPFTable table, int columnIndex, int width) {
        for (XWPFTableRow row: table.getRows()) {
            XWPFTableCell cell = row.getCell(columnIndex);
            CTTcPr tcPr = cell.getCTTc().addNewTcPr();
            CTTblWidth tblWidth = tcPr.addNewTcW();
            tblWidth.setW(BigInteger.valueOf(width));
        }
    }

    public static void mergeCellsHorizontally(XWPFTable table, int row, int fromCell, int toCell) {
        XWPFTableRow tableRow = table.getRow(row);
        for (int cellIndex = toCell; cellIndex > fromCell; cellIndex--) {
            XWPFTableCell mergedCell = tableRow.getCell(fromCell);
            XWPFTableCell removedCell = tableRow.getCell(cellIndex);
            mergedCell.getCTTc().addNewTcPr().addNewHMerge().setVal(RESTART);
            removedCell.getCTTc().addNewTcPr().addNewHMerge().setVal(CONTINUE);
        }
    }

    public static void setupFirstRow(XWPFTable table) {
        XWPFTableRow firstRow = table.getRow(0);
        XWPFTableCell mergedCell = firstRow.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(CENTER);
        addTextToParagraph(paragraph,
                           "Раздел 1. Наименование исполнительного органа Республики Крым, куда подается заявление о выдаче разрешения на строительство:",
                           false, 12, false);
        paragraph.createRun().addBreak();
        addTextToParagraph(paragraph,
                           "Министерство жилищной политики и государственного строительного надзора Республики Крым",
                           true, 12, false);
    }

    public static void setupSpecialRow(XWPFTable table) {
        XWPFTableRow firstRow = table.getRow(32);
        XWPFTableCell mergedCell = firstRow.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        addTextToParagraph(paragraph,
                           "Раздел 5.1. Сведения о ранее выданных разрешениях на ввод объекта в эксплуатацию в отношении этапа строительства, реконструкции объекта капитального строительства ",
                           false, 12, false);
        paragraph.createRun().addBreak();
        addTextToParagraph(paragraph, "(при наличии)", false, 12, true);
        paragraph.createRun().addBreak();
        addTextToParagraph(paragraph,
                           "(указывается в случае, предусмотренном частью 3.5 статьи 55 Градостроительного кодекса Российской Федерации)",
                           false, 12, true);
    }

    public static void setupRowTable2(XWPFTable table, int rowNumber, String text, String text2, String text3) {
        mergeCellsHorizontally(table, rowNumber, 2, 4);
        XWPFTableRow row = table.getRow(rowNumber);
        XWPFTableCell mergedCell = row.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph, text, false, 12, false);

        XWPFTableCell mergedCell1 = row.getCell(1);
        XWPFParagraph paragraph1 = mergedCell1.getParagraphs().get(0);
        paragraph1.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph1, text2, false, 12, false);

        XWPFTableCell mergedCell2 = row.getCell(2);
        XWPFParagraph paragraph2 = mergedCell2.getParagraphs().get(0);
        paragraph2.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph2, text3, false, 12, false);
    }

    public static void setupRowTable2(XWPFTable table, int row, String text, int toCell) {
        mergeCellsHorizontally(table, row, 0, toCell);
        XWPFTableRow firstRow = table.getRow(row);
        XWPFTableCell mergedCell = firstRow.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph, text, false, 12, false);
    }

    public static void setupSpecialRowTable2(XWPFTable table) {
        mergeCellsHorizontally(table, 3, 0, 1);
        XWPFTableRow row = table.getRow(3);
        XWPFTableCell mergedCell = row.getCell(2);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph,
                           "Фамилия, имя, отчество (при наличии) – для физического лица, осуществлявшего финансирование; Полное наименование – для юридического лица, осуществлявшего финансирование:",
                           false, 12, false);

        XWPFTableCell mergedCell2 = row.getCell(3);
        XWPFParagraph paragraph2 = mergedCell2.getParagraphs().get(0);
        paragraph2.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph2, "Реквизиты документа, удостоверяющего личность – для физического лица, " +
                                   "осуществлявшего финансирование; Основной государственный регистрационный номер – для юридического лица, осуществлявшего финансирование:",
                           false, 12, false);

        XWPFTableCell mergedCell3 = row.getCell(4);
        XWPFParagraph paragraph3 = mergedCell3.getParagraphs().get(0);
        paragraph3.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph3, "Адрес (адреса) электронной почты лица, осуществлявшего финансирование:",
                           false, 12, false);
    }

    public static void setupSpecialRowTable2(XWPFTable table, int rowNumber, String text) {
        mergeCellsHorizontally(table, rowNumber, 1, 4);
        XWPFTableRow row = table.getRow(rowNumber);
        XWPFTableCell mergedCell = row.getCell(1);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph, text, false, 12, false);
    }

    public static void addTextToParagraph(XWPFParagraph paragraph, String text, boolean isBold, int fontSize,
                                          boolean isItalic) {
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setFontFamily("Times New Roman");
        run.setFontSize(fontSize);
        run.setBold(isBold);
        run.setItalic(isItalic);
    }

    public static void addTextToParagraph(XWPFParagraph paragraph, List<String> text, boolean isBold, int fontSize) {
        for (int i = 0; i < text.size(); i++) {
            String value = text.get(i);
            XWPFRun run = addRunToParagraph(paragraph, value, fontSize, false, isBold);

            if (i < text.size() - 1) {
                run.addBreak();
            }
        }
    }

    public static void mergeCellsAndSetValue(XWPFTable table, int rowNumber, String value, boolean isBold,
                                             ParagraphAlignment alignment) {
        mergeCellsHorizontally(table, rowNumber, 0, 1);
        XWPFTableRow row = table.getRow(rowNumber);
        XWPFTableCell mergedCell = row.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(alignment);
        addTextToParagraph(paragraph, value, isBold, 12, false);
    }

    public static void setTableNode(XWPFTable table, int rowNumber, String rowName, String... rowValues) {
        XWPFTableRow row = table.getRow(rowNumber);
        setCellText(row.getCell(0), rowName);
        for (int i = 0; i < rowValues.length; i++) {
            setCellText(row.getCell(i + 1), rowValues[i]);
        }
    }

    public static void setCenterTableNode(XWPFTable table, int rowNumber, String rowName, String... rowValues) {
        XWPFTableRow row = table.getRow(rowNumber);
        setCenterCellText(row.getCell(0), rowName);
        for (int i = 0; i < rowValues.length; i++) {
            setCenterCellText(row.getCell(i + 1), rowValues[i]);
        }
    }

    public static void setTableNode(XWPFTable table, int rowNumber, String rowName, String rowValue1,
                                    List<String> rowValues) {
        XWPFTableRow row = table.getRow(rowNumber);
        setCellText(row.getCell(0), rowName);
        setCellText(row.getCell(1), rowValue1);
        setCellText(row.getCell(2), rowValues);
    }

    private static void setCellText(XWPFTableCell cell, List<String> text) {
        XWPFParagraph paragraph = cell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph, text, false, 12);
    }

    public static void setCellText(XWPFTableCell cell, String text) {
        XWPFParagraph paragraph = cell.getParagraphs().get(0);
        paragraph.setAlignment(LEFT);
        addTextToParagraph(paragraph, text, false, 12, false);
    }

    public static void addBoldText(XWPFDocument document, String text) {
        addParagraph(document, text, true, 30);
    }

    public static void addParagraph(XWPFDocument document, String text, boolean isBold, int spacingAfter) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(BOTH);
        paragraph.setSpacingAfter(spacingAfter);
        addTextToParagraph(paragraph, text, isBold, 12, false);
    }

    public static void addText(XWPFDocument document, String text) {
        addParagraph(document, text, false, 30);
    }

    public static void addTextWithSpacing(XWPFDocument document, String text) {
        addParagraph(document, text, false, 250);
    }

    public static void addText(XWPFDocument doc, String text, ParagraphAlignment align, int indentationLeft,
                               int spacing, int fontSize) {
        XWPFParagraph paragraph = doc.createParagraph();
        paragraph.setAlignment(align);
        paragraph.setSpacingAfter(spacing);
        paragraph.setIndentationLeft(indentationLeft);
        paragraph.setIndentationRight(125);

        addRunToParagraph(paragraph, text, fontSize, false, false);
    }

    public static void addTextWithUnderline(XWPFDocument doc, String text, ParagraphAlignment align,
                                            int indentationLeft,
                                            int spacing, int fontSize) {
        XWPFParagraph paragraph = doc.createParagraph();
        paragraph.setAlignment(align);
        paragraph.setSpacingAfter(spacing);
        paragraph.setIndentationLeft(indentationLeft);
        paragraph.setIndentationRight(125);

        addRunToParagraph(paragraph, text, fontSize, true, false);
    }

    public static void addTextWithUnderlineText(XWPFDocument doc, String text, String underlineText,
                                                ParagraphAlignment align, int indentationLeft,
                                                int spacing, int fontSize) {
        XWPFParagraph paragraph = doc.createParagraph();
        paragraph.setAlignment(align);
        paragraph.setSpacingAfter(spacing);
        paragraph.setIndentationLeft(indentationLeft);
        paragraph.setIndentationRight(125);

        addRunToParagraph(paragraph, text, fontSize, false, false);
        addRunToParagraph(paragraph, underlineText, fontSize, true, false);
    }

    public static void addTextWithSpacingAndUnderline(XWPFDocument document, String text, int spacing, int fontSize,
                                                      String underLineText) {
        XWPFParagraph paragraph = createParagraph(document, text, spacing, fontSize);
        addRunToParagraph(paragraph, underLineText, fontSize, true, false);
    }

    public static void addTextWithUnderlineAndTab(XWPFDocument document, String text, int spacing, int fontSize,
                                                  String underLineText) {
        XWPFParagraph paragraph = createParagraph(document, text, spacing, fontSize);
        addRunToParagraph(paragraph, "                                                                     ", fontSize,
                          true, false);
        addRunToParagraph(paragraph, underLineText, fontSize, true, false);
        XWPFRun runSpacesAfter = paragraph.createRun();
        runSpacesAfter.addTab();
        runSpacesAfter.addTab();
        runSpacesAfter.addTab();
        runSpacesAfter.addTab();
        runSpacesAfter.addTab();
        runSpacesAfter.setUnderline(UnderlinePatterns.SINGLE);
        runSpacesAfter.setFontFamily("Times New Roman");
        runSpacesAfter.setFontSize(fontSize);
    }

    public static void addTextWithSpacingAndUnderline(XWPFDocument document, String text, int spacing, int fontSize,
                                                      String underLineText, String text2, String underLineText2,
                                                      String text3) {
        XWPFParagraph paragraph = createParagraph(document, text, spacing, fontSize);
        addRunToParagraph(paragraph, underLineText, fontSize, true, false);
        addRunToParagraph(paragraph, text2, fontSize, false, false);
        addRunToParagraph(paragraph, underLineText2, fontSize, true, false);
        addRunToParagraph(paragraph, text3, fontSize, false, false);
    }

    public static void addTextWithSpacingAndUnderlineAndTextAfter(XWPFDocument document, String text, int spacing,
                                                                  int fontSize,
                                                                  String underLineText, String text2) {
        XWPFParagraph paragraph = createParagraph(document, text, spacing, fontSize);
        addRunToParagraph(paragraph, underLineText, fontSize, true, false);
        addRunToParagraph(paragraph, text2, fontSize, false, false);
    }

    public static void addTextWithSpacing(XWPFDocument document, String text, int spacing, int fontSize) {
        createParagraph(document, text, spacing, fontSize);
    }

    public static void addTextWithSuperscript(XWPFDocument document) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        paragraph.setSpacingAfter(5);
        addTextToParagraph(paragraph, "машино-места (не заполняется в случаях, указанных в пунктах 1-2 части ", false,
                           12, false);
        addTextToParagraph(paragraph, "3", false, 12, false);
        XWPFRun superscriptRun = paragraph.createRun();
        superscriptRun.setText("9");
        superscriptRun.setFontSize(12);
        superscriptRun.setSubscript(VerticalAlign.SUPERSCRIPT);
        addTextToParagraph(paragraph, "статьи 55", false, 12, false);
    }

    private static void setCenterCellText(XWPFTableCell cell, String text) {
        XWPFParagraph paragraph = cell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        addTextToParagraph(paragraph, text, false, 11, false);
    }

    public static void mergeCellsAndSetValue(XWPFTable table, RequestType request) {

        mergeCellsHorizontally(table, 16, 0, 1);
        XWPFTableRow firstRow = table.getRow(16);
        XWPFTableCell mergedCell = firstRow.getCell(0);

        XWPFParagraph paragraph1 = mergedCell.getParagraphs().get(0);
        paragraph1.setAlignment(ParagraphAlignment.CENTER);
        if (Boolean.TRUE.equals(request.getVariantChoice().getKPVI25().isDesignDocumentationAmended())) {
            addTextToParagraph(paragraph1, "<*> Заявление", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "о необходимости внесения изменений в разрешение", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "на строительство в связи с возникновением необходимости", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "внесения иных изменений, предусмотренных Градостроительным", true, 12,
                               false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "кодексом Российской Федерации", true, 12, false);
        } else {
            addTextToParagraph(paragraph1, "<*> Уведомление ", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "о необходимости внесения изменений в разрешение", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "на строительство в связи с переходом прав на земельный(-ые)", true, 12,
                               false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "участок(-и), образованием земельного участка путем", true, 12, false);
            paragraph1.createRun().addBreak();
            addTextToParagraph(paragraph1, "объединения, раздела, перераспределения земельных участков ", true, 12,
                               false);
        }
        paragraph1.createRun().addBreak();
        addTextToParagraph(paragraph1, "или выдела из земельных участков ", true, 12, false);

        paragraph1.createRun().addBreak();

        XWPFParagraph paragraph2 = mergedCell.addParagraph();
        paragraph2.setAlignment(ParagraphAlignment.BOTH);
        addTextToParagraph(paragraph2, "Сообщаю о необходимости внесения изменений в разрешение на строительство",
                           false, 12, false);
        paragraph2.createRun().addBreak();
        addTextToParagraph(paragraph2, "(реконструкцию) от ", false, 12, false);
        Optional<ConstructionPermitsDataType> oConstructionPermitsData = ofNullable(
                request.getConstructionPermitsData());
        String permitNumber = oConstructionPermitsData.map(ConstructionPermitsDataType::getNumber).orElse("");
        String permitDate = oConstructionPermitsData.map(ConstructionPermitsDataType::getDate).orElse("");
        addUnderlineTextToParagraph(paragraph2, permitDate + " № " + permitNumber, false, 12);
        addTextToParagraph(paragraph2, " выданное Министерством жилищной политики и государственного ", false, 12,
                           false);
        paragraph2.createRun().addBreak();
        addTextToParagraph(paragraph2, "строительного надзора Республики Крым,", false, 12, false);
        paragraph2.createRun().addBreak();
        addTextToParagraph(paragraph2, "в связи с ", false, 12, false);
        if (Boolean.TRUE.equals(
                request.getVariantChoice().getKPVI25().isFormLandCombiningDividingRedistributingAllocating())) {
            addUnderlineTextToParagraph(paragraph2, "образованием земельного участка путем объединения, раздела,",
                                        false,
                                        12);
            paragraph2.createRun().addBreak();
            addUnderlineTextToParagraph(paragraph2,
                                        "перераспределения земельных участков или выдела из земельных участков", false,
                                        12);
            paragraph2.createRun().addBreak();
        }
        if (Boolean.TRUE.equals(request.getVariantChoice().getKPVI25().isChangeOwnerLand())) {
            addUnderlineTextToParagraph(paragraph2, "переходом прав на земельный(-ые) участок(-и)", false, 12);
            paragraph2.createRun().addBreak();
        }
        if (Boolean.TRUE.equals(request.getVariantChoice().getKPVI25().isDesignDocumentationAmended())) {
            String permitReason = oConstructionPermitsData.map(ConstructionPermitsDataType::getReason).orElse("");
            addUnderlineTextToParagraph(paragraph2, permitReason, false, 12);
            paragraph2.createRun().addBreak();
        }

        XWPFParagraph paragraph3 = mergedCell.addParagraph();
        paragraph3.setAlignment(ParagraphAlignment.CENTER);
        addTextToParagraph(paragraph3, "(указать одно из обстоятельств, предусмотренных частями 21.5 - 21.7, 21.9",
                           false, 12, false);
        paragraph3.createRun().addBreak();
        addTextToParagraph(paragraph3, "Градостроительного кодекса Российской Федерации, иные случаи)",
                           false, 12, false);
        paragraph3.createRun().addBreak();
        paragraph3.createRun().addBreak();
        addTextToParagraph(paragraph3, "Данные об объекте капитального строительства с учетом изменений:",
                           false, 12, false);
    }

    private static void addUnderlineTextToParagraph(XWPFParagraph paragraph, String text, boolean isBold,
                                                    int fontSize) {
        addRunToParagraph(paragraph, text, fontSize, true, isBold);
    }

    public static void addCenterText(XWPFDocument document, String text, int fontSize, boolean isBold) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        paragraph.setSpacingAfter(5);
        addRunToParagraph(paragraph, text, fontSize, false, isBold);
    }

    public static void addTextWithSpacingAndUnderline(XWPFDocument document, String text, int spacing, int fontSize,
                                                      boolean isBold) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        paragraph.setSpacingAfter(spacing);
        addRunToParagraph(paragraph, text, fontSize, true, isBold);
    }

    public static XWPFParagraph createParagraph(XWPFDocument document, String text, int spacing, int fontSize) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        paragraph.setSpacingAfter(spacing);
        addRunToParagraph(paragraph, text, fontSize, false, false);
        return paragraph;
    }

    public static XWPFRun addRunToParagraph(XWPFParagraph paragraph, String text, int fontSize, boolean isUnderline,
                                            boolean isBold) {
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setFontFamily("Times New Roman");
        if (isUnderline) {
            run.setUnderline(UnderlinePatterns.SINGLE);
        }
        if (isBold) {
            run.setBold(true);
        }
        run.setFontSize(fontSize);
        return run;
    }
}