package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import static org.apache.poi.xwpf.usermodel.ParagraphAlignment.*;
import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;

@Component
public class RnsChangeStrategy implements IRnsRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 2;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        int trueCount = 0;
        int falseCount = 0;

        KPVI25Type kpvi25 = request.getVariantChoice().getKPVI25();
        Boolean[] checks = {
                kpvi25.isDesignDocumentationAmended(),
                kpvi25.isFormLandCombiningDividingRedistributingAllocating(),
                kpvi25.isRenewalConstructionPermit(),
                kpvi25.isChangeOwnerLand()
        };

        for (Boolean check: checks) {
            if (Boolean.FALSE.equals(check)) {
                falseCount++;
            } else if (Boolean.TRUE.equals(check)) {
                trueCount++;
            }
        }

        if (trueCount != 1 || falseCount > 0) {
            return null;
        }

        if (Boolean.TRUE.equals(kpvi25.isRenewalConstructionPermit())) {
            return createTemplate(request);
        }

        return createTemplate2(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        IDocumentDataProvider dataProvider = new RnsDocumentDataProvider();
        XWPFDocument document = new XWPFDocument();
        addText(document, "Приложение № 3", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "к Административному регламенту", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "предоставления                Министерством", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "жилищной политики и государственного", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "строительного    надзора    Республики Крым", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "государственной услуги по выдаче", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "разрешения на строительство на", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "территории", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Республики Крым  ", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Министерство жилищной политики и ", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "государственного строительного надзора ", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "Республики Крым", ParagraphAlignment.BOTH, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 3875, 5, 12);
        addTextWithUnderline(document, "от кого:    " + dataProvider.getOrgFullName(request) + "    ",
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
                                     "   ", ParagraphAlignment.LEFT, 3875, 5, 12);
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
        addText(document, "кем выдан, гражданство, адрес проживания,", ParagraphAlignment.LEFT, 3875, 5, 12);
        addTextWithUnderline(document, "    " + dataProvider.getPhone(request) + "  " + dataProvider.getEmail(request) +
                                     "    ",
                             ParagraphAlignment.LEFT,
                             3875, 5, 12);
        addText(document, "контактный телефон и (или) иные контакты)", ParagraphAlignment.LEFT, 3875, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 12);
        addText(document, "Заявление о продлении срока действия разрешения на строительство", ParagraphAlignment.CENTER,
                0, 5, 12);
        addTextWithSpacingAndUnderline(document,
                                       "Прошу продлить срок действия разрешение на строительство (реконструкцию) от ",
                                       0, 11, "№ " + dataProvider.getPermitNumber(request),
                                       " выданного ", "       " + dataProvider.getPermitDate(request) + "     ",
                                       " Министерством жилищной политики и государственного");
        addTextWithSpacing(document, "                                               (дата выдачи разрешения)", 20, 7);
        addTextWithSpacing(document, "строительного надзора Республики Крым.", 0, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           5, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           0, 11);
        addText(document, "(наименование объекта капитального строительства)", ParagraphAlignment.CENTER, 0, 10, 11);
        addTextWithSpacing(document, "на земельном участке, расположенном по адресу",
                           5, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           0, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           0, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           10, 11);
        addTextWithSpacing(document, "__________________________________________________________________________",
                           0, 11);
        addText(document, "               (городской округ, поселение, улица, номер дома и кадастровый номер участка)",
                ParagraphAlignment.LEFT, 0, 5, 11);
        addTextWithUnderlineAndTab(document, "сроком на ", 5, 11, dataProvider.getPermitTerm(request));
        addText(document, "     (в соответствии с ПОС)", ParagraphAlignment.CENTER, 0, 5, 11);
        addTextWithSpacing(document, "в связи с ", 0, 11);
        addTextWithSpacing(document, "_____________________________________________________________________________",
                           0, 11);
        addText(document, "(указать причину (основание) продления разрешения)", ParagraphAlignment.CENTER, 0, 5, 11);
        addTextWithSpacing(document, "Состояние объекта: ", 10, 11);

        XWPFTable table = document.createTable(7, 3);
        setColumnWidth(table, 0, 3000);
        setColumnWidth(table, 1, 3000);
        setColumnWidth(table, 2, 3000);
        setCenterTableNode(table, 0, "Виды работ", "Процент выполнения", "Примечание");
        setTableNode(table, 1, "Земляные работы", "", "");
        setTableNode(table, 2, "Фундамент", "", "");
        setTableNode(table, 3, "Каркас", "", "");
        setTableNode(table, 4, "Специальные внутренние работы", "", "");
        setTableNode(table, 5, "Инженерные сети", "", "");
        setTableNode(table, 6, "Благоустройство территории", "", "");
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 11);
        addText(document, "Приложения:", ParagraphAlignment.BOTH, 0, 5, 11);
        addText(document, "1. Календарный план строительства;", ParagraphAlignment.BOTH, 0, 5, 11);
        addText(document, "2. Оригинал разрешения на строительство (до начала предоставления государственной услуги в" +
                " ", ParagraphAlignment.BOTH, 0, 5, 11);
        addText(document, "электронном виде). ", ParagraphAlignment.BOTH, 0, 5, 11);

        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 11);
        addTextWithSpacing(document, "            Застройщик:", 5, 11);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 11);
        addTextWithSpacing(document, "            _____________            __________________          " +
                "_____________________            М.П.", 5, 11);
        addTextWithSpacing(document, "              (должность)                       (подпись)                    " +
                "  (расшифровка подписи)", 5, 11);
        addText(document, "", ParagraphAlignment.BOTH, 5000, 5, 11);
        addTextWithSpacing(document, " _____ ________________20___г.", 5, 11);

        return document;
    }

    private static XWPFDocument createTemplate2(RequestType request) {
        XWPFDocument document = new XWPFDocument();
        IDocumentDataProvider dataProvider = new RnsDocumentDataProvider();
        addParagraph(document, "Приложение № 5");
        addParagraph(document, "к Административному регламенту");
        addParagraph(document, "предоставления Министерством жилищной политики");
        addParagraph(document, "и государственного строительного надзора Республики Крым");
        addParagraph(document, "государственной услуги по выдаче разрешения");
        addParagraph(document, "на строительство на территории Республики Крым");
        XWPFTable table = document.createTable(114, 2);
        setColumnWidth(table, 0, 3500);
        setColumnWidth(table, 1, 6000);

        mergeCellsHorizontally(table, 0, 0, 1);

        setupFirstRow(table);

        mergeCellsAndSetValue(table, 1, "Раздел 2. Информация о застройщике", false, CENTER);
        mergeCellsAndSetValue(table, 2, "2.1. Сведения о физическом лице или индивидуальном предпринимателе:", false,
                              LEFT);
        setTableNode(table, 3, "2.1.1. Фамилия:", dataProvider.getLastName(request));
        setTableNode(table, 4, "2.1.2. Имя:", dataProvider.getFirstName(request));
        setTableNode(table, 5, "2.1.3. Отчество:", dataProvider.getMiddleName(request));
        setTableNode(table, 6, "2.1.4. ИНН:", dataProvider.getInn(request));
        setTableNode(table, 7, "2.1.5. ОГРНИП:", dataProvider.getOgrnip(request));
        setTableNode(table, 8, "2.1.6. Адрес регистрации по месту жительства/адрес для почтовой корреспонденции:",
                     dataProvider.getRegAddress(request) + (dataProvider.getFactAddress(
                             request).equals("") ? dataProvider.getFactAddress(request) :
                             " / " + dataProvider.getFactAddress(request)));
        mergeCellsAndSetValue(table, 9, "2.2. Сведения о юридическом лице:", false, LEFT);
        setTableNode(table, 10, "2.2.1. Полное наименование:", dataProvider.getOrgFullName(request));
        setTableNode(table, 11, "2.2.2. ИНН:", dataProvider.getOrgInn(request));
        setTableNode(table, 12, "2.2.3. ОГРН:", dataProvider.getOrgOgrn(request));
        setTableNode(table, 13, "2.2.4. Адрес регистрации/адрес для почтовой корреспонденции:",
                     dataProvider.getOrgRegAddress(request) + (dataProvider.getOrgPostAddress(
                             request).equals("") ? dataProvider.getOrgPostAddress(request) :
                             " / " + dataProvider.getOrgPostAddress(request)));
        setTableNode(table, 14, "2.2.5. адрес электронной почты для связи с застройщиком:",
                     dataProvider.getOrgEmail(request));
        setTableNode(table, 15, "2.2.6. Контактный номер телефона:", dataProvider.getOrgPhone(request));
        mergeCellsAndSetValue(table, request);
        mergeCellsAndSetValue(table, 17, "Раздел 3. Информация об объекте капитального строительства ", false, CENTER);
        setTableNode(table, 18,
                     "3.1. Наименование объекта капитального строительства (этапа) в соответствии с проектной документацией:",
                     dataProvider.getObjectName(request));
        setTableNode(table, 19,
                     "3.2. Вид выполняемых работ в отношении объекта капитального строительства в соответствии с проектной документацией:",
                     dataProvider.getConstruction(request));
        mergeCellsAndSetValue(table, 20, "3.3. Адрес (местоположение) объекта капитального строительства ", false,
                              LEFT);
        setTableNode(table, 21, "3.3.1. Субъект Российской Федерации:", "");
        setTableNode(table, 22,
                     "3.3.2. Муниципальный район, муниципальный округ, городской округ или внутригородская территория (для городов федерального значения) в составе субъекта Российской Федерации, федеральная территория:",
                     "");
        setTableNode(table, 23,
                     "3.3.3. Городское или сельское поселение в составе муниципального района (для муниципального района) или внутригородского района городского округа (за исключением зданий, строений, сооружений, расположенных на федеральных территориях):",
                     "");
        setTableNode(table, 24, "3.3.4. Тип и наименование населенного пункта:", "");
        setTableNode(table, 25, "3.3.5. Наименование элемента планировочной структуры:", "");
        setTableNode(table, 26, "3.3.6. Наименование элемента улично-дорожной сети:", "");
        setTableNode(table, 27, "3.3.7. Тип и номер здания (сооружения):", "");
        mergeCellsAndSetValue(table, 28, "Раздел 4. Информация о земельном участке", false, CENTER);
        setTableNode(table, 29, "4.1. Кадастровый номер земельного участка (земельных участков), в границах которого " +
                             "(которых) расположен или планируется расположение объекта капитального строительства:",
                     dataProvider.getLandPlotCadastralNumber(request));
        setTableNode(table, 30,
                     "4.2. Площадь земельного участка (земельных участков), в границах которого (которых) расположен или планируется расположение объекта капитального строительства:",
                     "");
        mergeCellsAndSetValue(table, 31, "4.3. Сведения о градостроительном плане земельного участка", false, LEFT);
        setTableNode(table, 32, "4.3.X.1. Дата:", dataProvider.getGPZUDate(request));
        setTableNode(table, 33, "4.3.X.2. Номер:", dataProvider.getGPZUNumber(request));
        setTableNode(table, 34, "4.3.X.3. Наименование органа, выдавшего градостроительный план земельного участка:",
                     dataProvider.getGPZUIssuer(request));
        setTableNode(table, 35,
                     "4.4. Условный номер земельного участка (земельных участков) на утвержденной схеме расположения земельного участка или земельных участков на кадастровом плане территории (при необходимости):",
                     "");
        mergeCellsAndSetValue(table, 36,
                              "4.5. Сведения о схеме расположения земельного участка или земельных участков на кадастровом плане территории",
                              false, LEFT);
        setTableNode(table, 37, "4.5.1. Дата решения:", dataProvider.getDecisionDate(request));
        setTableNode(table, 38, "4.5.2. Номер решения:", dataProvider.getDecisionNumber(request));
        setTableNode(table, 39, "4.5.3. Наименование организации, уполномоченного органа или лица, принявшего решение" +
                             " об утверждении схемы расположения земельного участка или земельных участков:",
                     dataProvider.getDecisionIssuer(request));
        mergeCellsAndSetValue(table, 40, "4.6. Информация о документации по планировке территории", false, LEFT);
        mergeCellsAndSetValue(table, 41, "4.6.1. Сведения о проекте планировки территории", false, LEFT);
        setTableNode(table, 42, "4.6.1.X.1. Дата решения:", dataProvider.getPlanProjectDate(request));
        setTableNode(table, 43, "4.6.1.X.2. Номер решения:", dataProvider.getPlanProjectNumber(request));
        setTableNode(table, 44,
                     "4.6.1.X.3. Наименование организации, уполномоченного органа или лица, принявшего решение об утверждении проекта планировки территории:",
                     dataProvider.getPlanProjectIssuer(request));
        mergeCellsAndSetValue(table, 45, "4.6.2. Сведения о проекте межевания территории", false, LEFT);
        setTableNode(table, 46, "4.6.2.X.1. Дата решения:", dataProvider.getSurveyingDate(request));
        setTableNode(table, 47, "4.6.2.X.2. Номер решения:", dataProvider.getSurveyingNumber(request));
        setTableNode(table, 48,
                     "4.6.2.X.3. Наименование организации, уполномоченного органа или лица, принявшего решение об утверждении проекта межевания территории:",
                     dataProvider.getSurveyingIssuer(request));
        mergeCellsAndSetValue(table, 49, "Раздел 5. Сведения о проектной документации, типовом архитектурном решении",
                              false, CENTER);
        mergeCellsAndSetValue(table, 50, "5.1. Сведения о разработчике - индивидуальном предпринимателе", false, LEFT);
        setTableNode(table, 51, "5.1.1. Фамилия:", "");
        setTableNode(table, 52, "5.1.2. Имя:", "");
        setTableNode(table, 53, "5.1.3. Отчество:", "");
        setTableNode(table, 54, "5.1.4. ИНН:", "");
        setTableNode(table, 55, "5.1.5. ОГРНИП:", "");
        mergeCellsAndSetValue(table, 56, "5.2. Сведения о разработчике - юридическом лице ", false, LEFT);
        setTableNode(table, 57, "5.2.1. Полное наименование:", "");
        setTableNode(table, 58, "5.2.2. ИНН:", "");
        setTableNode(table, 59, "5.2.3. ОГРН:", "");
        setTableNode(table, 60, "5.3. Дата утверждения (при наличии):", "");
        setTableNode(table, 61, "5.4. Номер (при наличии):", "");
        mergeCellsAndSetValue(table, 62,
                              "5.5. Типовое архитектурное решение объекта капитального строительства, утвержденное для исторического поселения (при наличии)",
                              false, LEFT);
        setTableNode(table, 63, "5.5.1. Дата:", dataProvider.getArchitectSolutionDate(request));
        setTableNode(table, 64, "5.5.2. Номер:", dataProvider.getArchitectSolutionNumber(request));
        setTableNode(table, 65, "5.5.3. Наименование документа:", dataProvider.getArchitectSolutionDocName(request));
        setTableNode(table, 66, "5.5.4. Наименование уполномоченного органа, принявшего решение об утверждении " +
                "типового архитектурного решения:", dataProvider.getArchitectSolutionIssuer(request));
        mergeCellsAndSetValue(table, 67,
                              "Раздел 6. Информация о результатах экспертизы проектной документации и государственной экологической экспертизы",
                              false, CENTER);
        mergeCellsAndSetValue(table, 68, "6.1. Сведения об экспертизе проектной документации", false, LEFT);
        setTableNode(table, 69, "6.1.X.1. Дата утверждения:", dataProvider.getDocumentationExpertiseDate(request));
        setTableNode(table, 70, "6.1.X.2. Номер: ", dataProvider.getDocExpertiseNumber(request));
        setTableNode(table, 71, "6.1.X.3. Наименование органа или организации, выдавшей положительное заключение " +
                "экспертизы проектной документации:", dataProvider.getDocExpIssuer(request).trim().equals("null") ?
                "" : dataProvider.getDocExpIssuer(request));
        mergeCellsAndSetValue(table, 72, "6.2. Сведения о государственной экологической экспертизе ", false, LEFT);
        setTableNode(table, 73, "6.2.X.1. Дата утверждения:", dataProvider.getEcoExpertiseDate(request));
        setTableNode(table, 74, "6.2.X.2. Номер:", dataProvider.getEcoExpertiseNumber(request));
        setTableNode(table, 75, "6.2.X.3. Наименование органа, утвердившего положительное заключение государственной " +
                "экологической экспертизы:", dataProvider.getEcoExpertiseIssuer(request));
        mergeCellsAndSetValue(table, 76,
                              "6.3. Подтверждение соответствия вносимых в проектную документацию изменений требованиям, указанным в части 3.8 статьи 49 Градостроительного кодекса Российской Федерации",
                              false, LEFT);
        setTableNode(table, 77, "6.3.1. Дата:", "");
        setTableNode(table, 78, "6.3.2. Номер:", "");
        setTableNode(table, 79, "6.3.3. Сведения о лице, утвердившем указанное подтверждение:", "");
        mergeCellsAndSetValue(table, 80,
                              "6.4. Подтверждение соответствия вносимых в проектную документацию изменений требованиям, указанным в части 3.9 статьи 49 Градостроительного кодекса Российской Федерации",
                              false, LEFT);
        setTableNode(table, 81, "6.4.1. Дата:", "");
        setTableNode(table, 82, "6.4.2. Номер:", "");
        setTableNode(table, 83,
                     "6.4.3. Наименование органа исполнительной власти или организации, проводившей оценку соответствия:",
                     "");
        mergeCellsAndSetValue(table, 84, "Раздел 7. Проектные характеристики объекта капитального строительства", false,
                              CENTER);
        setTableNode(table, 85, "7.X. Наименование объекта капитального строительства, предусмотренного проектной " +
                "документацией:", dataProvider.getCapObjectName(request));
        setTableNode(table, 86, "7.X.1. Вид объекта капитального строительства:", "");
        setTableNode(table, 87, "7.X.2. Назначение объекта:", dataProvider.getObjectAppointment(request));
        setTableNode(table, 88, "7.X.3. Кадастровый номер реконструируемого объекта капитального строительства:",
                     dataProvider.getCapObjectCadastralNumber(request));
        setTableNode(table, 89, "7.X.4. Площадь застройки (кв. м):", "");
        setTableNode(table, 90, "7.X.4.1. Площадь застройки части объекта капитального строительства (кв. м):", "");
        setTableNode(table, 91, "7.X.5. Площадь (кв. м):", "");
        setTableNode(table, 92, "7.X.5.1. Площадь части объекта капитального строительства (кв. м):", "");
        setTableNode(table, 93, "7.X.6. Площадь нежилых помещений (кв. м):", "");
        setTableNode(table, 94, "7.X.7. Площадь жилых помещений (кв. м):", "");
        setTableNode(table, 95, "7.X.8. Количество помещений (штук):", "");
        setTableNode(table, 96, "7.X.9. Количество нежилых помещений (штук):", "");
        setTableNode(table, 97, "7.X.10. Количество жилых помещений (штук):", "");
        setTableNode(table, 98, "7.X.11. в том числе квартир (штук):", "");
        setTableNode(table, 99, "7.X.12. Количество машино-мест (штук):", "");
        setTableNode(table, 100, "7.X.13. Количество этажей:", "");
        setTableNode(table, 101, "7.X.14. в том числе, количество подземных этажей:", "");
        setTableNode(table, 102, "7.X.15. Вместимость (человек):", "");
        setTableNode(table, 103, "7.X.16. Высота (м):", "");
        setTableNode(table, 104, "7.X.17. Иные показатели:", "");
        mergeCellsAndSetValue(table, 105, "Раздел 8. Проектные характеристики линейного объекта", false, CENTER);
        setTableNode(table, 106, "8.X. Наименование линейного объекта, предусмотренного проектной документацией:",
                     dataProvider.getLineObjectName(request));
        setTableNode(table, 107, "8.X.1. Кадастровый номер реконструируемого линейного объекта:",
                     dataProvider.getLineObjectCadastralNumber(request));
        setTableNode(table, 108, "8.X.2. Протяженность (м):", "");
        setTableNode(table, 109, "8.X.2.1. Протяженность участка или части линейного объекта (м):", "");
        setTableNode(table, 110, "8.X.3. Категория (класс):", "");
        setTableNode(table, 111, "8.X.4. Мощность (пропускная способность, грузооборот, интенсивность движения):", "");
        setTableNode(table, 112,
                     "8.X.5. Тип (кабельная линия электропередачи, воздушная линия электропередачи, кабельно-воздушная линия электропередачи), уровень напряжения линий электропередачи:",
                     "");
        setTableNode(table, 113, "8.X.6. Иные показатели:", "");
        addBoldText(document, "При заполнении заявления рекомендуем руководствоваться Приказом Минстроя");
        addBoldText(document, "России от 03.06.2022 N 446/пр \"Об утверждении формы разрешения на строительство");
        addBoldText(document, "и формы разрешения на ввод объекта в эксплуатацию\".");
        addText(document, "При этом сообщаю:");
        addText(document, "Правоустанавливающие документы на земельный участок:");
        addText(document, "- реквизиты документа (решения), устанавливающего право собственности на");
        addText(document, "земельный участок, дата и номер государственной регистрации права собственности");
        addText(document, "__________________________________________________________________________");
        addText(document, "- Договор аренды, субаренды (ненужное зачеркнуть) земельного участка,");
        addText(document, "заключенный с ____________________________________________ \"__\" _______ 20__ ");
        addText(document, "г. N _____,");
        addText(document, "                                    (указывается арендодатель)");
        addText(document, "срок аренды (субаренды) по договору: до \"___\" ___________ 20___ г.");
        addText(document, "- иное ____________________________________________________________________;");
        addText(document, "Градостроительный план земельного участка N _____ выдан \"__\" ______ 20__ г.");
        addText(document, "Проектная документация на строительство разработана __________________________");
        addText(document, "__________________________________________________________________________,");
        addText(document, "                        (название и адрес местонахождения проектной организации)");
        addText(document, "имеющей право на выполнение проектных работ, закрепленное <*> _______________");
        addText(document, "__________________________________________________________________________");
        addText(document, "      (наименование, N и дата выдачи документа, название уполномоченной организации, ");
        addTextWithSpacing(document,
                           "                                                                        его выдавшей)");
        addText(document, "<*> Заключение Министерства культуры Республики Крым (в случае, если");
        addText(document, "строительство или реконструкция объекта капитального строительства планируется в");
        addText(document, "границах территории исторического поселения федерального или регионального");
        addText(document, "значения)");
        addText(document, "__________________________________________________________________________");
        addTextWithSpacing(document, "                                    (дата и регистрационный номер)");
        addText(document, "Строительство (реконструкцию) объекта планируется осуществить по типовому ");
        addText(document, "архитектурному решению ___________________________________________________");
        addText(document, "                              (номер типового проекта, наименование разработчика,");
        addTextWithSpacing(document, "                                    реквизиты решения об утверждении)");
        addText(document, "Обязуюсь обо всех изменениях, связанных с приведенными в настоящем заявлении ");
        addText(document, "сведениями, сообщать в Министерство жилищной политики и государственного");
        addText(document, "строительного надзора Республики Крым в срок не более 14 дней со дня вступления в");
        addTextWithSpacing(document, "силу таких изменений.");
        addText(document, "<***> Результат предоставления государственной услуги прошу предоставить:");
        addText(document, "- через структурное подразделение МФЦ (в случае подачи заявления через МФЦ) __");
        addText(document, "- в ЛК ИС Министерства (в случае подачи заявления в электронном виде) ___");
        addTextWithSpacing(document, "- нарочно (в случае подачи заявления нарочно) ___");
        addText(document, "К настоящему заявлению прилагаю <*>:");
        addText(document, "1) правоустанавливающие документы на земельный участок, в том числе соглашение ");
        addText(document, "об установлении сервитута, решение об установлении публичного сервитута ________");
        addText(document, "_________________________________________________________________ на __ л.;");
        addText(document, "(указывается наименование, N и дата выдачи документа)");
        addText(document, "2) соглашение о передаче в случаях, установленных бюджетным законодательством");
        addText(document, "Российской Федерации, органом государственной власти (государственным органом),");
        addText(document, "Государственной корпорацией по атомной энергии \"Росатом\", Государственной ");
        addText(document, "корпорацией по космической деятельности \"Роскосмос\", органом управления");
        addText(document, "государственным внебюджетным фондом или органом местного самоуправления ");
        addText(document, "полномочий государственного (муниципального) заказчика ");
        addText(document, "_______________________________________________,");
        addText(document, "(указывается N и дата заключения соглашения)");
        addText(document, "3) градостроительный план земельного участка N _____________________");
        addText(document, "выдан \"_____\" ________________ 20____ или в случае строительства, реконструкции ");
        addText(document, "линейного объекта - реквизиты проекта планировки территории и проекта межевания ");
        addText(document, "территории________________________________________________________________;");
        addText(document, "(наименование проекта, название и N документа об утверждении проекта, дата его");
        addText(document, "принятия)");
        addText(document, "4) результаты инженерных изысканий и следующие материалы, содержащиеся в");
        addText(document, "утвержденной в соответствии с частью 15 статьи 48 настоящего Кодекса проектной ");
        addText(document, "документации:");
        addText(document, "а) пояснительная записка;");
        addText(document, "б) схема планировочной организации земельного участка, выполненная в ");
        addText(document, "соответствии с информацией, указанной в градостроительном плане земельного");
        addText(document, "участка, а в случае подготовки проектной документации применительно к линейным");
        addText(document, "объектам - проект полосы отвода, выполненный в соответствии с проектом ");
        addText(document, "планировки территории (за исключением случаев, при которых для строительства,");
        addText(document, "реконструкции линейного объекта не требуется подготовка документации по ");
        addText(document, "планировке территории);");
        addText(document, "в) разделы, содержащие архитектурные и конструктивные решения, а также решения");
        addText(document, "и мероприятия, направленные на обеспечение доступа инвалидов к объекту ");
        addText(document, "капитального строительства (в случае подготовки проектной документации");
        addText(document, "применительно к объектам здравоохранения, образования, культуры, отдыха, спорта и ");
        addText(document, "иным объектам социально-культурного и коммунально-бытового назначения, ");
        addText(document, "объектам транспорта, торговли, общественного питания, объектам делового,");
        addText(document, "административного, финансового, религиозного назначения, объектам жилищного");
        addText(document, "фонда);");
        addText(document, "г) проект организации строительства объекта капитального строительства (включая ");
        addText(document, "проект организации работ по сносу объектов капитального строительства, их частей в ");
        addText(document, "случае необходимости сноса объектов капитального строительства, их частей для ");
        addText(document, "строительства, реконструкции других объектов капитального строительства);");
        addText(document, "5) заключение экспертизы проектной документации, выданной ___________________");
        addText(document, "___________________________________________ \"___\" _______ _______ г. N ");
        addText(document, "_______;");
        addText(document, "(наименование экспертной организации)");
        addText(document, "6) заключение государственной экологической экспертизы проектной документации ");
        addText(document, "от \"___\" _______ г. N _____________________ (в случаях, установленных пунктом 6");
        addText(document, "статьи 49 Градостроительного кодекса РФ);");
        addText(document, "7) подтверждение соответствия вносимых в проектную документацию изменений ");
        addText(document, "требованиям, указанным в части 3.8 статьи 49 Градостроительного кодекса РФ;");
        addText(document, "8) подтверждение соответствия вносимых в проектную документацию изменений ");
        addText(document, "требованиям, указанным в части 3.9 статьи 49 Градостроительного кодекса РФ;");
        addText(document, "9) разрешение на отклонение от предельных параметров разрешенного строительства, ");
        addText(document, "реконструкции (в случае, если застройщику было предоставлено такое разрешение) ");
        addText(document, "__________________________________________________ (по желанию застройщика);");
        addText(document, "9.1) согласование архитектурно-градостроительного облика объекта капитального ");
        addText(document, "строительства в случае, если такое согласование предусмотрено статьей 40.1 ГрК РФ;");
        addText(document, "<**> 10) согласие всех правообладателей объекта капитального строительства на ");
        addText(document, "реконструкцию такого объекта, за исключением случаев реконструкции ");
        addText(document, "многоквартирного дома, согласие правообладателей всех домов блокированной ");
        addText(document, "застройки в одном ряду в случае реконструкции одного из домов блокированной ");
        addText(document, "застройки;");
        addText(document, "11) соглашение о проведении реконструкции государственным (муниципальным) ");
        addText(document, "заказчиком на объекте капитального строительства государственной (муниципальной) ");
        addText(document, "собственности, правообладателем которого является государственное ");
        addText(document, "(муниципальное) унитарное предприятие, государственное (муниципальное)");
        addText(document, "бюджетное или автономное учреждение, от \"___\" _______ _______ г. N ________;");
        addText(document, "12) решение общего собрания собственников помещений и машино-мест в ");
        addText(document, "многоквартирном доме, принятое в соответствии с жилищным законодательством в ");
        addText(document, "случае реконструкции многоквартирного дома, или, если в результате такой ");
        addText(document, "реконструкции произойдет уменьшение размера общего имущества в ");
        addText(document, "многоквартирном доме, согласие всех собственников помещений и машино-мест в ");
        addText(document, "многоквартирном доме от \"___\" _______ _____ г. N ________;");
        addText(document, "13) копия решения об установлении или изменении зоны с особыми условиями ");
        addText(document, "использования территории в случае строительства объекта капитального ");
        addText(document, "строительства, в связи с размещением которого в соответствии с законодательством");
        addText(document, "Российской Федерации подлежит установлению зона с особыми условиями");
        addText(document, "использования территории, или в случае реконструкции объекта капитального ");
        addText(document, "строительства, в результате которой в отношении реконструированного объекта ");
        addText(document, "подлежит установлению зона с особыми условиями использования территории или ");
        addText(document, "ранее установленная зона с особыми условиями использования территории подлежит ");
        addText(document, "изменению;");
        addText(document, "14) копия договора о развитии территории в случае, если строительство, ");
        addText(document, "реконструкцию объектов капитального строительства планируется осуществлять в ");
        addText(document, "границах территории, в отношении которой органом местного самоуправления ");
        addText(document, "принято решение о комплексном развитии территории (за исключением случаев ");
        addText(document, "самостоятельной реализации Российской Федерацией, субъектом Российской");
        addText(document, "Федерации или муниципальным образованием решения о комплексном развитии ");
        addText(document, "территории или реализации такого решения юридическим лицом, определенным в ");
        addText(document, "соответствии с настоящим Кодексом Российской Федерацией или субъектом");
        addText(document, "Российской Федерации);");
        addText(document, "15) заключение Министерства культуры Республики Крым о соответствии раздела ");
        addText(document, "проектной документации объекта капитального строительства \"Архитектурные ");
        addText(document, "решения\" предмету охраны исторического поселения и требованиям к архитектурным ");
        addText(document, "решениям объектов капитального строительства, установленным градостроительным ");
        addText(document, "регламентом применительно к территориальной зоне, расположенной в границах ");
        addText(document, "территории исторического поселения федерального или регионального значения (в ");
        addText(document, "случае, если строительство или реконструкция объекта капитального строительства ");
        addText(document, "планируется в границах территории исторического поселения федерального или ");
        addText(document, "регионального значения), от \"_____\"_________ 20____ г. N ______________ (по ");
        addTextWithSpacing(document, "желанию застройщика).");
        addText(document, "_____________________    ________________     _______________________________");
        addTextWithSpacing(document,
                           "           (должность)                    (подпись)                                   (Ф.И.О)");
        addText(document, "\"___\" _____________ 20___ г.");
        addText(document, "М.П.");
        addText(document, "");
        addTextWithSpacing(document, "         --------------------------------");
        addText(document, "<*> В случае, если для заявленного случая строительства (реконструкции) объекта ");
        addText(document, "по действующему законодательству предоставление документа не требуется либо ");
        addText(document, "застройщик не предоставляет какой-либо документ по иным основаниям, в ");
        addText(document, "соответствующем пункте заявления следует вписать слова \"не требуется\" или поставить ");
        addTextWithSpacing(document, "прочерк.");
        addText(document, "<**> Указываются все представленные застройщиком нотариально заверенные ");
        addTextWithSpacing(document, "собственноручно написанные заявления о согласии на реконструкцию.");
        addText(document, "<***> Следует указать один из способов получения результата предоставления ");
        addText(document, "государственной услуги.");

        return document;
    }
}
