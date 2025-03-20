package ru.mycrg.data_service.service.smev3.request.accept_gpzu;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.gpzu_1_0_1.RequestType;

import java.util.List;

import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;

@Component
public class GpzuGiveStrategy implements IGpzuRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 1;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {

        GpzuDocumentDataProvider dataProvider = new GpzuDocumentDataProvider(request);

        XWPFDocument document = new XWPFDocument();
        addParagraph(document, "Приложение №1");
        addParagraph(document, "к административному регламенту");
        addParagraph(document, " «Выдача градостроительного плана земельного участка»");
        addTextWithUnderline(document, dataProvider.getCompetentOrganizationName(), ParagraphAlignment.RIGHT,
                             0, 30, 12);

        addText(document, "");
        addText(document, "");
        addText(document, "");

        addCenterText(document, "ЗАЯВЛЕНИЕ", 13, false);
        addCenterText(document, "о выдаче градостроительного плана земельного участка", 13, false);
        addText(document, "");
        addTextWithUnderline(document, dataProvider.getServiceCurrentDate() + " г.", ParagraphAlignment.RIGHT,
                             0, 30, 12);

        addCenterText(document,   dataProvider.getCompetentOrganizationName(), 13, false);
        addText(document, "_____________________________________________________________________________");
        addCenterText(document, "(наименование уполномоченного органа государственной власти, органа местного", 13, false);
        addCenterText(document, "самоуправления)", 13, false);
        addText(document, "");

        addCenterText(document, "1. Сведения о заявителе", 13, false);

        XWPFTable table = document.createTable(8, 3);
        setColumnWidth(table, 0, 1000);
        setColumnWidth(table, 1, 7000);
        setColumnWidth(table, 2, 5000);

        setTableNode(table, 0, "1.1", "Сведения о физическом лице, в случае если заявителем является физическое лицо:",
                     "");
        setTableNode(table, 1, "1.1.1", "Фамилия, имя, отчество (при наличии)",
                     dataProvider.getFullFio());
        setTableNode(table, 2, "1.1.2",
                     "Реквизиты документа, удостоверяющего личность (не указываются в случае, если заявитель является индивидуальным предпринимателем)" +
                             "лицо:",
                     List.of(dataProvider.getTypeDoc(), dataProvider.getNameDoc(), dataProvider.getDocSeries(),
                             dataProvider.getDocNumber(), dataProvider.getIssueDate(), dataProvider.getIssueOrg(),
                             dataProvider.getIssueIdPassportRF()));
        setTableNode(table, 3, "1.1.3", "Основной государственный регистрационный номер индивидуального " +
                             "предпринимателя, в случае если заявитель является индивидуальным предпринимателем",
                     List.of(dataProvider.getOrgFullName(), dataProvider.getOrgOgrn(), dataProvider.getOrgInn()));
        setTableNode(table, 4, "1.2",
                     "Сведения о юридическом лице, в случае если заявителем является юридическое лицо:",
                     "");
        setTableNode(table, 5, "1.2.1", "Полное наименование", dataProvider.getCompanyOrgFullName());
        setTableNode(table, 6, "1.2.2", "Основной государственный регистрационный номер", dataProvider.getCompanyOrgOgrn());
        setTableNode(table, 7, "1.2.3", "Идентификационный номер налогоплательщика - юридического лица",
                     dataProvider.getCompanyOrgInn());
        addText(document, "");
        addCenterText(document, "2. Сведения о земельном участке", 13, false);

        XWPFTable table2 = document.createTable(4, 3);
        setColumnWidth(table2, 0, 1000);
        setColumnWidth(table2, 1, 7000);
        setColumnWidth(table2, 2, 5000);
        setTableNode(table2, 0, "2.1", "Кадастровый номер земельного участка", dataProvider.getCadastralNumber());
        setTableNode(table2, 1, "2.2",
                     "Реквизиты утвержденного проекта межевания территории и (или) схемы расположения образуемого земельного участка на кадастровом плане территории, и проектная площадь образуемого земельного участка (указываются в случае, предусмотренном частью 1.1 статьи 57.3 Градостроительного кодекса Российской Федерации)",
                     "");
        setTableNode(table2, 2, "2.3", "Цель использования земельного участка", dataProvider.getPurposeLandPlot());
        setTableNode(table2, 3, "2.4", "Адрес или описание местоположения земельного участка (указываются в случае, " +
                "предусмотренном частью 1.1 статьи 57.3 Градостроительного кодекса Российской Федерации)",
                     List.of(dataProvider.getFiasFullCode(), dataProvider.getFiasLandPlot()));
        addText(document, "");
        addText(document, "     Прошу выдать градостроительный план земельного участка.");
        addText(document, "Приложение:");
        addTextWithUnderline(document, dataProvider.getDocumentName(), ParagraphAlignment.LEFT, 0, 5, 12);
        addText(document, "Номер телефона и адрес электронной почты для связи: ");
        addTextWithUnderline(document, dataProvider.getPhoneNumber() + " " + dataProvider.getEmail(), ParagraphAlignment.LEFT,
                             0, 5, 12);
        addText(document, "Результат предоставления услуги прошу:");
        XWPFTable table3 = document.createTable(4, 2);
        setColumnWidth(table3, 0, 11500);
        setColumnWidth(table3, 1, 1500);
        setTableNode(table3, 0, "направить в форме электронного документа в личный кабинет в федеральной " +
                "государственной информационной системе \"Единый портал государственных и муниципальных услуг " +
                "(функций)\"/на региональном портале государственных и муниципальных услуг",
                     dataProvider.isIsPaperDocumentRequired() ? "" : "✓");
        setTableNode(table3, 1, "выдать на бумажном носителе при личном обращении в уполномоченный орган " +
                "государственной власти, орган местного самоуправления либо в многофункциональный центр " +
                "предоставления государственных и муниципальных услуг, расположенный по адресу:",
                     getCheckmarkSymbol(dataProvider, 1));
        setTableNode(table3, 2, "направить на бумажном носителе на почтовый адрес: ",
                     getCheckmarkSymbol(dataProvider, 2));
        mergeCellsAndSetValue(table3, 3, "Указывается один из перечисленных способов", false, ParagraphAlignment.CENTER);
        addText(document, "");
        addText(document,"_________________     __________________________", ParagraphAlignment.RIGHT, 0, 0, 12);
        addText(document, "(подпись)                (фамилия, имя, отчество", ParagraphAlignment.LEFT, 4300, 0, 12);
        addText(document, "(при наличии))", ParagraphAlignment.LEFT, 6500, 0, 12);

        return document;
    }

    private static String getCheckmarkSymbol(GpzuDocumentDataProvider dataProvider, int methodGettingResults) {
        if (dataProvider.isIsPaperDocumentRequired()) {
            return dataProvider.getMethodGettingResults() == methodGettingResults ? "✓" : "";
        }

        return "";
    }
}
