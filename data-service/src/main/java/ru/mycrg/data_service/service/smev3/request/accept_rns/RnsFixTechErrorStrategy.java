package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rns_1_0_3.*;

import java.util.Optional;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.service.smev3.request.accept_rns.DocumentCreationUtils.*;

@Component
public class RnsFixTechErrorStrategy implements IRnsRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 3;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        Optional<LegalDataType> oLegalData = ofNullable(request.getLegalData());
        Optional<DelegateLegalDataType> oDelegateLegalData = ofNullable(request.getDelegateLegalData());
        String orgFullName = oLegalData.map(LegalDataType::getOrgFullname)
                                       .orElse(oDelegateLegalData.map(DelegateLegalDataType::getOrgFullname)
                                                                 .orElse(""));
        String orgInn = oLegalData.map(LegalDataType::getOrgInn)
                                  .orElse(oDelegateLegalData.map(DelegateLegalDataType::getOrgInn)
                                                            .orElse(""));
        String orgOgrn = oLegalData.map(LegalDataType::getOrgOgrn)
                                   .orElse(oDelegateLegalData.map(DelegateLegalDataType::getOrgOgrn)
                                                             .orElse(""));
        String orgRegAddress = oLegalData.map(LegalDataType::getRegAddress)
                                         .orElse(oDelegateLegalData.map(DelegateLegalDataType::getRegAddress)
                                                                   .orElse(""));
        String orgPostAddress = oLegalData.map(LegalDataType::getPostAddress)
                                          .orElse(oDelegateLegalData.map(DelegateLegalDataType::getPostAddress)
                                                                    .orElse(""));
        Optional<RepresentativeInfoType> oRepresentativeInfo = Optional.of(request)
                                                                       .map(RequestType::getLegalData)
                                                                       .map(LegalDataType::getRepresentativeInfo);
        String orgPhone = oLegalData.map(LegalDataType::getOrgPhone)
                                    .orElse(oRepresentativeInfo.map(RepresentativeInfoType::getPhone)
                                                               .orElse(""));
        Optional<RecipientPersonalDataType> oRecipientPersonalData = ofNullable(request.getRecipientPersonalData());
        Optional<DelegatePersonalDataType> oDelegatePersonalData = ofNullable(request.getDelegatePersonalData());
        String fullfio = oRecipientPersonalData.map(RecipientPersonalDataType::getFullfio)
                                               .orElse(oDelegatePersonalData
                                                               .map(DelegatePersonalDataType::getFullfio)
                                                               .orElse(""));
        String dateBirth = oRecipientPersonalData.map(RecipientPersonalDataType::getDateBirth)
                                                 .orElse(oDelegatePersonalData
                                                                 .map(DelegatePersonalDataType::getDateBirth)
                                                                 .orElse(""));
        String docSeries = oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                 .map(DocumentPersonalType::getDocseries)
                                                 .orElse(oDelegatePersonalData
                                                                 .map(DelegatePersonalDataType::getDocumentPersonal)
                                                                 .map(DocumentPersonalType::getDocseries)
                                                                 .orElse(""));
        String docNumber = oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                 .map(DocumentPersonalType::getDocnumber)
                                                 .orElse(oDelegatePersonalData
                                                                 .map(DelegatePersonalDataType::getDocumentPersonal)
                                                                 .map(DocumentPersonalType::getDocnumber)
                                                                 .orElse(""));
        String issueDate = oRecipientPersonalData.map(RecipientPersonalDataType::getDocumentPersonal)
                                                 .map(DocumentPersonalType::getIssuedate)
                                                 .orElse(oDelegatePersonalData
                                                                 .map(DelegatePersonalDataType::getDocumentPersonal)
                                                                 .map(DocumentPersonalType::getIssuedate)
                                                                 .orElse(""));
        String phone = oRecipientPersonalData.map(RecipientPersonalDataType::getPhone)
                                             .orElse("");
        String email = oRecipientPersonalData.map(RecipientPersonalDataType::getEmail)
                                             .orElse("");
        Optional<ConstructionPermitsDataType> oConstructionPermData = ofNullable(request.getConstructionPermitsData());
        String permitNumber = oConstructionPermData.map(ConstructionPermitsDataType::getNumber).orElse("");
        String permitDate = oConstructionPermData.map(ConstructionPermitsDataType::getDate).orElse("");
        Optional<CorrectingDataType> oCorrectingData = ofNullable(request.getCorrectingData());
        String currentVersion = oCorrectingData.flatMap(data -> data.getCorrectingDataBlock()
                                                                    .stream().findFirst())
                                               .map(CorrectingDataTextType::getCurrentVersionData).orElse("");
        String newVersion = oCorrectingData.flatMap(data -> data.getCorrectingDataBlock()
                                                                .stream().findFirst())
                                           .map(CorrectingDataTextType::getNewVersionData).orElse("");

        XWPFDocument document = new XWPFDocument();
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
        addTextWithUnderline(document, "от кого: ____" + orgFullName + "____", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, " (для юридического лица - наименование", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридического лица,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + orgInn + "__" + orgOgrn + "__" + orgRegAddress + "/" + orgPostAddress +
                "____", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "ИНН, ОГРН, дата и № регистрации;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "юридический и почтовый адреса;", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + orgPhone + "____", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "ФИО руководителя, контактные телефоны", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + fullfio + "__" + dateBirth + "____", ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "для физического лица - Ф.И.О., год рождения", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "____________________________________________", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "паспортные данные: серия, номер, дата выдачи,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + docSeries + "_" + docNumber + "_" + issueDate + "____",
                             ParagraphAlignment.LEFT, 3875, 5,
                             12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "кем выдан, гражданство, адрес проживания,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "____" + phone + "__" + email + "____", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "_", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "контактный телефон и (или) иные контакты)", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addCenterText(document, "ЗАЯВЛЕНИЕ");
        addCenterText(document, "об исправлении опечаток и (или) ошибок в документе, являющегося результатом ");
        addCenterText(document, "предоставления государственной услуги ");
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "В тексте Разрешения на строительство № " + permitNumber, 5, 13);
        addTextWithSpacing(document, "от " + permitDate, 0, 13);
        addCenterText(document, "(наименование, реквизиты документа)", 10);
        addTextWithSpacing(document, "являющегося    результатом    предоставления    государственной    услуги, по ",
                           5, 13);
        addTextWithSpacing(document, "заявлению от__№__, допущена опечатка и (или) ошибка, а именно:", 5, 13);
        addTextWithSpacingAndUnderline(document, "____" + currentVersion + "____", 5, 13);
        addCenterText(document, "(указать где и какая ошибка (опечатка) допущена)", 10);
        addTextWithSpacing(document, "В   соответствии  с  имеющимися   в  учетном  деле  по  заявлению о ", 5, 13);
        addTextWithSpacing(document, "предоставлении государственной услуги документами (сведениями), прошу ", 5, 13);
        addTextWithSpacing(document, "исправить допущенную опечатку и (или) ошибку без изменения содержания", 5, 13);
        addTextWithSpacing(document, "документа, указав следующее:", 5, 13);
        addTextWithSpacingAndUnderline(document, "____" + newVersion + "____", 5,
                                       13);
        addCenterText(document, "(указать правильный вариант)", 10);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addTextWithSpacing(document, "Приложение:", 5, 13);
        addTextWithSpacing(document, "_______________________________________________________________________", 5, 13);
        addTextWithUnderline(document, "_______________________________________________________________________");
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
