package ru.mycrg.data_service.service.smev3.request.accept_rnv;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rnv_1_0_6.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;
import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.addTextWithSpacing;

@Component
public class RnvDuplicateStrategy implements IRnvRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 4;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        IDocumentDataProvider dataProvider = new RnvDocumentDataProvider();
        XWPFDocument document = new XWPFDocument();
        addText(document, "Министерство жилищной политики и ", ParagraphAlignment.BOTH, 3875, 5
                , 12);
        addText(document, "государственного строительного надзора ", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "Республики Крым", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 3875, 5, 12);
        addTextWithUnderline(document, "от кого:     " + dataProvider.getOrgFullName(request) + "    ",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, " (для юридического лица - наименование", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридического лица,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getOrgInn(request) + "  " + dataProvider.getOrgOgrn(
                                     request) + "  " + dataProvider.getOrgRegAddress(
                                     request) + (dataProvider.getOrgPostAddress(
                                     request).equals("") ? dataProvider.getOrgPostAddress(request) :
                                     " / " + dataProvider.getOrgPostAddress(request)) +
                                     "    ", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "ИНН, ОГРН, дата и № регистрации;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридический и почтовый адреса;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "    " + dataProvider.getOrgPhone(request) + "    ", ParagraphAlignment.LEFT,
                             3875,
                             5, 12);
        addText(document, "ФИО руководителя, контактные телефоны", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getFullfio(request) + "  " + dataProvider.getDateBirth(
                                     request) + "    ",
                             ParagraphAlignment.LEFT,
                             3875, 5,
                             12);
        addText(document, "для физического лица - Ф.И.О., год рождения", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getDocSeries(request) + " " + dataProvider.getDocNumber(
                                     request) + " " + dataProvider.getIssueDate(request) +
                                     "    ",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, "паспортные данные: серия, номер, дата выдачи,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getIssueOrg(request) + "  " + dataProvider.getNameDoc(request) +
                                     "  " + dataProvider.getRegAddress(request) + (dataProvider.getFactAddress(
                                     request).equals("") ? dataProvider.getFactAddress(request) :
                                     " / " + dataProvider.getFactAddress(request)) +
                                     "    ",
                             ParagraphAlignment.LEFT,
                             3875, 5,
                             12);
        addText(document, "кем выдан, гражданство, адрес проживания,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "    " + dataProvider.getPhone(request) + "  " + dataProvider.getEmail(request) +
                                     "    ",
                             ParagraphAlignment.LEFT,
                             3875, 5, 12);
        addText(document, "контактный телефон и (или) иные контакты)", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addCenterText(document, "Заявление о выдаче дубликата разрешения на строительство", 13, false);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacingAndUnderline(document,
                                       "Прошу выдать дубликат разрешение на строительство (реконструкцию) от ",
                                       5, 11, "№ " + dataProvider.getPermitNumber(request));
        addTextWithSpacingAndUnderlineAndTextAfter(document, "выданного ", 5, 11, dataProvider.getPermitDate(request)
                , " Министерством жилищной политики и государственного строительного");
        addTextWithSpacing(document, "            (дата выдачи разрешения)", 0, 9);
        addTextWithSpacing(document, "надзора Республики Крым.", 0, 11);

        return document;
    }
}
