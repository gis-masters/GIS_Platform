package ru.mycrg.data_service.service.smev3.request.accept_rnv;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rnv_1_0_6.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;
import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.addTextWithSpacing;

@Component
public class RnvFixTechErrorStrategy implements IRnvRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 3;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        XWPFDocument document = new XWPFDocument();
        IDocumentDataProvider dataProvider = new RnvDocumentDataProvider();
        addText(document, "Приложение № 4", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "к Административному регламенту", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "предоставления                Министерством", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "жилищной политики и государственного", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "строительного      надзора      Республики", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Крым  ", ParagraphAlignment.BOTH, 5000, 5, 13);
        addText(document, "государственной услуги по выдаче", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "разрешения      на      ввод      объекта     в", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "эксплуатацию            на          территории", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Республики Крым  ", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Министерство государственного строительного", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "надзора ", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "Республики Крым", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithUnderline(document, "от кого:     " + dataProvider.getOrgFullName(request) + "    ",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, " (для юридического лица - наименование", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридического лица,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getOrgInn(request) + "  " + dataProvider.getOrgOgrn(
                                     request) + "  " + dataProvider.getOrgRegAddress(
                                     request) +  (dataProvider.getOrgPostAddress(
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
        addText(document, "____________________________________________", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "паспортные данные: серия, номер, дата выдачи,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document,
                             "    " + dataProvider.getDocSeries(request) + " " + dataProvider.getDocNumber(
                                     request) + " " + dataProvider.getIssueDate(request) +
                                     "    ",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, "кем выдан, гражданство, адрес проживания,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "    " + dataProvider.getPhone(request) + "  " + dataProvider.getEmail(request) +
                                     "    ",
                             ParagraphAlignment.LEFT, 3875,
                             5, 12);
        addText(document, "контактный телефон и (или) иные контакты)", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addCenterText(document, "ЗАЯВЛЕНИЕ", 13, false);
        addCenterText(document, "об исправлении опечаток и (или) ошибок в документе, являющегося результатом ", 13, false);
        addCenterText(document, "предоставления государственной услуги ", 13, false);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "В тексте документа № " + dataProvider.getPermitNumber(request), 5, 13);
        addTextWithSpacing(document,
                           "от " + dataProvider.getPermitDate(request) + " " + dataProvider.getPermitIssuer(request), 0,
                           13);
        addCenterText(document, "(наименование, реквизиты документа)", 10, false);
        addTextWithSpacing(document, "являющегося    результатом    предоставления    государственной    услуги, по ",
                           5, 13);
        addTextWithSpacing(document, "заявлению от__№__, допущена опечатка и (или) ошибка, а именно:", 5, 13);
        addTextWithSpacingAndUnderline(document, "    " + dataProvider.getCurrentVersion(request) + "    ", 5, 13, false);
        addCenterText(document, "(указать где и какая ошибка (опечатка) допущена)", 10, false);
        addTextWithSpacing(document, "В   соответствии  с  имеющимися   в  учетном  деле  по  заявлению о ", 5, 13);
        addTextWithSpacing(document, "предоставлении государственной услуги документами (сведениями), прошу ", 5, 13);
        addTextWithSpacing(document, "исправить допущенную опечатку и (или) ошибку без изменения содержания", 5, 13);
        addTextWithSpacing(document, "документа, указав следующее:", 5, 13);
        addTextWithSpacingAndUnderline(document, "    " + dataProvider.getNewVersion(request) + "    ", 5,
                                       13, false);
        addCenterText(document, "(указать правильный вариант)", 10, false);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "Приложение:", 5, 13);
        addTextWithSpacing(document, "_______________________________________________________________________", 5, 13);
        addTextWithSpacingAndUnderline(document,
                                       "_______________________________________________________________________", 5,
                                       13, true);
        addTextWithSpacing(document, "_______________________________________________________________________", 5, 13);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "            Застройщик:", 5, 11);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "            _____________            __________________          " +
                "_____________________            М.П.", 5, 11);
        addTextWithSpacing(document, "              (должность)                       (подпись)                    " +
                "  (расшифровка подписи)", 5, 11);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, " _____ ________________20___г.", 5, 13);

        return document;
    }
}
