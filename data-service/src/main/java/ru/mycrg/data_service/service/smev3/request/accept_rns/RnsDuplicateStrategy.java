package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;

@Component
public class RnsDuplicateStrategy implements IRnsRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 4;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        IDocumentDataProvider dataProvider = new RnsDocumentDataProvider();
        XWPFDocument document = new XWPFDocument();
        addText(document, "Министерство жилищной политики и ", ParagraphAlignment.BOTH, 3875, 5
                , 12);
        addText(document, "государственного строительного надзора ", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "Республики Крым", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 3875, 5, 12);
        addTextWithUnderline(document, "от кого: ____" + dataProvider.getOrgFullName(request) + "____",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, " (для юридического лица - наименование", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридического лица,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "____" + dataProvider.getOrgInn(request) + "__" + dataProvider.getOrgOgrn(
                                     request) + "__" + dataProvider.getOrgRegAddress(
                                     request) + "/" + dataProvider.getOrgPostAddress(request) +
                                     "____", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "ИНН, ОГРН, дата и № регистрации;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридический и почтовый адреса;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + dataProvider.getOrgPhone(request) + "____", ParagraphAlignment.LEFT,
                             3875,
                             5, 12);
        addText(document, "ФИО руководителя, контактные телефоны", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "____" + dataProvider.getFullfio(request) + "__" + dataProvider.getDateBirth(
                                     request) + "____",
                             ParagraphAlignment.LEFT,
                             3875, 5,
                             12);
        addText(document, "для физического лица - Ф.И.О., год рождения", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "____" + dataProvider.getDocSeries(request) + "_" + dataProvider.getDocNumber(
                                     request) + "_" + dataProvider.getIssueDate(request) +
                                     "____",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, "паспортные данные: серия, номер, дата выдачи,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "____" + dataProvider.getIssueOrg(request) + "__" + dataProvider.getNameDoc(request) +
                                     "__" + dataProvider.getRegAddress(request) + "/" + dataProvider.getFactAddress(
                                     request) +
                                     "____",
                             ParagraphAlignment.LEFT,
                             3875, 5,
                             12);
        addText(document, "кем выдан, гражданство, адрес проживания,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + dataProvider.getPhone(request) + "__" + dataProvider.getEmail(request) +
                                     "____",
                             ParagraphAlignment.LEFT,
                             3875,
                             5, 12);
        addText(document, "контактный телефон и (или) иные контакты)", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addCenterText(document, "Заявление о выдаче дубликата разрешения на строительство");
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacingAndUnderline(document,
                                       "Прошу выдать дубликат разрешение на строительство (реконструкцию) от ",
                                       5, 11, "№ " + dataProvider.getPermitNumber(request));
        addTextWithSpacingAndUnderline(document, "выданного ", 5, 11, dataProvider.getPermitDate(request));
        addTextWithSpacing(document, "                    (дата выдачи разрешения)", 0, 11);
        addTextWithSpacing(document,
                           "Министерством жилищной политики и государственного строительного надзора Республики Крым.",
                           0, 11);

        return document;
    }
}
