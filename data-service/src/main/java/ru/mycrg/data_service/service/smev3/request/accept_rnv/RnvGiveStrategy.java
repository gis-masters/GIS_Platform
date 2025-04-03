package ru.mycrg.data_service.service.smev3.request.accept_rnv;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.accept_rnv_1_0_6.*;
import ru.mycrg.data_service.service.smev3.request.IDocumentDataProvider;

import java.util.Optional;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.service.smev3.request.DocumentCreationUtils.*;

@Component
public class RnvGiveStrategy implements IRnvRequestDocumentCreator {

    @Override
    public int getGoal() {
        return 1;
    }

    @Override
    public XWPFDocument create(RequestType request) {
        return createTemplate(request);
    }

    private static XWPFDocument createTemplate(RequestType request) {
        XWPFDocument document = new XWPFDocument();
        IDocumentDataProvider dataProvider = new RnvDocumentDataProvider();
        addParagraph(document, "Приложение N 1");
        addParagraph(document, "к Административному регламенту");
        addParagraph(document, "предоставления Министерством жилищной политики");
        addParagraph(document, "и государственного строительного надзора Республики Крым");
        addParagraph(document, "государственной услуги по выдаче разрешения на ввод объекта");
        addParagraph(document, "в эксплуатацию на территории Республики Крым");

        addCenterText(document, "", 14, true);
        addCenterText(document, "", 14, true);
        addCenterText(document, "", 14, true);
        addCenterText(document, "", 14, true);
        addCenterText(document, "З А Я В Л Е Н И Е", 14, true);
        addCenterText(document, "о выдаче разрешения на ввод объекта в эксплуатацию", 14, true);

        XWPFTable table = document.createTable(72, 2);
        setColumnWidth(table, 0, 3500);
        setColumnWidth(table, 1, 6000);

        mergeCellsHorizontally(table, 0, 0, 1);

        setupFirstRow(table);

        mergeCellsAndSetValue(table, 1, "Раздел 2. Информация о застройщике", false, ParagraphAlignment.CENTER);
        mergeCellsAndSetValue(table, 2, "2.1. Сведения о физическом лице или индивидуальном предпринимателе:", false,
                              ParagraphAlignment.LEFT);
        setTableNode(table, 3, "2.1.1. Фамилия:", dataProvider.getLastName(request));
        setTableNode(table, 4, "2.1.2. Имя:", dataProvider.getFirstName(request));
        setTableNode(table, 5, "2.1.3. Отчество:", dataProvider.getMiddleName(request));
        setTableNode(table, 6, "2.1.4. ИНН:", dataProvider.getInn(request));
        setTableNode(table, 7, "2.1.5. ОГРНИП:", dataProvider.getOgrnip(request));
        mergeCellsAndSetValue(table, 8, "2.2. Сведения о юридическом лице:", false, ParagraphAlignment.LEFT);
        setTableNode(table, 9, "2.2.1. Полное наименование:", dataProvider.getOrgFullName(request));
        setTableNode(table, 10, "2.2.2. ИНН:", dataProvider.getOrgInn(request));
        setTableNode(table, 11, "2.2.3. ОГРН:", dataProvider.getOrgOgrn(request));
        setTableNode(table, 12, "2.2.4. адрес (адреса) электронной почты для связи с застройщиком, иным лицом (иными " +
                             "лицами) в случае, если строительство или реконструкция здания, сооружения осуществлялись с привлечением средств иных лиц:",
                     dataProvider.getOrgEmail(request));
        setTableNode(table, 13, "2.2.6. Контактный номер телефона:", dataProvider.getOrgPhone(request));
        mergeCellsAndSetValue(table, 14, "Прошу выдать разрешение на ввод в эксплуатацию следующего объекта " +
                "капитального строительства:", true, ParagraphAlignment.LEFT);
        mergeCellsAndSetValue(table, 15, "Раздел 3. Информация об объекте капитального строительства ", false,
                              ParagraphAlignment.CENTER);
        setTableNode(table, 16, "3.1. Наименование объекта капитального строительства (этапа) в соответствии с " +
                "проектной документацией:", dataProvider.getObjectName(request));
        setTableNode(table, 17, "3.2. Вид выполненных работ в отношении объекта капитального строительства:", "");
        mergeCellsAndSetValue(table, 18, "3.3. Адрес (местоположение) объекта капитального строительства ", false,
                              ParagraphAlignment.LEFT);
        setTableNode(table, 19, "3.3.1. Субъект Российской Федерации:", "");
        setTableNode(table, 20, "3.3.2. Муниципальный район, муниципальный округ, городской округ или внутригородская" +
                             " территория (для городов федерального значения) в составе субъекта Российской Федерации, федеральная территория:",
                     "");
        setTableNode(table, 21, "3.3.3. Городское или сельское поселение в составе муниципального района (для " +
                             "муниципального района) или внутригородского района городского округа (за исключением зданий, строений, сооружений, расположенных на федеральных территориях):",
                     "");
        setTableNode(table, 22, "3.3.4. Тип и наименование населенного пункта:", "");
        setTableNode(table, 23, "3.3.5. Наименование элемента планировочной структуры:", "");
        setTableNode(table, 24, "3.3.6. Наименование элемента улично-дорожной сети:", "");
        setTableNode(table, 25, "3.3.7. Тип и номер здания (сооружения):", "");
        mergeCellsAndSetValue(table, 26, "Раздел 4. Информация о земельном участке", false, ParagraphAlignment.CENTER);
        setTableNode(table, 27, "4.1. Кадастровый номер земельного участка (земельных участков), в границах которого " +
                             "(которых) расположен объект капитального строительства:",
                     dataProvider.getLandPlotCadastralNumber(request));
        mergeCellsAndSetValue(table, 28, "Раздел 5. Сведения о разрешении на строительство, на основании которого " +
                                      "осуществлялось строительство, реконструкция объекта капитального строительства",
                              false, ParagraphAlignment.CENTER);
        setTableNode(table, 29, "5.1. Дата разрешения на строительство:", dataProvider.getBuildingPermitDate(request));
        setTableNode(table, 30, "5.2. Номер разрешения на строительство:",
                     dataProvider.getBuildingPermitNumber(request));
        setTableNode(table, 31, "5.3. Наименование органа (организации), выдавшего разрешение на строительство:",
                     dataProvider.getBuildingPermitIssuer(request));
        mergeCellsHorizontally(table, 32, 0, 1);
        setupSpecialRow(table);
        setTableNode(table, 33, "5.1.1. Дата разрешения на ввод объекта в эксплуатацию:",
                     dataProvider.getPermitDate(request));
        setTableNode(table, 34, "5.1.2. Номер разрешения на ввод объекта в эксплуатацию:",
                     dataProvider.getPermitNumber(request));
        setTableNode(table, 35, "5.1.3. Наименование органа (организации), выдавшего разрешение на ввод объекта в " +
                "эксплуатацию:", dataProvider.getPermitIssuer(request));
        mergeCellsAndSetValue(table, 36, "Раздел 6. Фактические показатели объекта капитального строительства и " +
                                      "сведения о техническом плане",
                              false, ParagraphAlignment.CENTER);
        setTableNode(table, 37, "6.X. Наименование объекта капитального строительства, предусмотренного проектной " +
                "документацией:", dataProvider.getObjectName(request));
        setTableNode(table, 38, "6.X.1. Вид объекта капитального строительства:", "");
        setTableNode(table, 39, "6.X.2. Назначение объекта:", "");
        setTableNode(table, 40, "6.X.3. Кадастровый номер реконструированного объекта капитального строительства:",
                     dataProvider.getLandPlotCadastralNumber(request));
        setTableNode(table, 41, "6.X.4. Площадь застройки (кв. м):", "");
        setTableNode(table, 42, "6.X.4.1. Площадь застройки части объекта капитального строительства (кв. м):", "");
        setTableNode(table, 43, "6.X.5. Площадь (кв. м):", "");
        setTableNode(table, 44, "6.X.5.1. Площадь части объекта капитального строительства (кв. м):", "");
        setTableNode(table, 45, "6.X.6. Площадь нежилых помещений (кв. м):", "");
        setTableNode(table, 46, "6.X.7. Общая площадь жилых помещений (с учетом балконов, лоджий, веранд и террас) " +
                "(кв. м):", "");
        setTableNode(table, 47, "6.X.7.1. Общая площадь жилых помещений (за исключением балконов, лоджий, веранд и " +
                "террас) (кв. м):", "");
        setTableNode(table, 48, "6.X.8. Количество помещений (штук):", "");
        setTableNode(table, 49, "6.X.9. Количество нежилых помещений (штук):", "");
        setTableNode(table, 50, "6.X.10. Количество жилых помещений (штук):", "");
        setTableNode(table, 51, "6.X.11. в том числе квартир (штук):", "");
        setTableNode(table, 52, "6.X.12. Количество машино-мест (штук):", "");
        setTableNode(table, 53, "6.X.13. Количество этажей:", "");
        setTableNode(table, 54, "6.X.14. в том числе, количество подземных этажей:", "");
        setTableNode(table, 55, "6.X.15. Вместимость (человек):", "");
        setTableNode(table, 56, "6.X.16. Высота (м):", "");
        setTableNode(table, 57, "6.X.17. Класс энергетической эффективности (при наличии):", "");
        setTableNode(table, 58, "6.X.18. Иные показатели:", "");
        setTableNode(table, 59, "6.X.19. Дата подготовки технического плана:", "");
        setTableNode(table, 60, "6.X.20. Страховой номер индивидуального лицевого счета кадастрового инженера, " +
                "подготовившего технический план:", "");
        mergeCellsAndSetValue(table, 61, "Раздел 7. Фактические показатели линейного объекта и сведения о техническом" +
                                      " плане",
                              false, ParagraphAlignment.CENTER);
        setTableNode(table, 62, "7.X. Наименование линейного объекта, предусмотренного проектной документацией:",
                     dataProvider.getObjectName(request));
        setTableNode(table, 63, "7.X.1. Кадастровый номер реконструированного линейного объекта:",
                     dataProvider.getLandPlotCadastralNumber(request));
        setTableNode(table, 64, "7.X.2. Протяженность (м):", "");
        setTableNode(table, 65, "7.X.2.1. Протяженность участка или части линейного объекта (м):", "");
        setTableNode(table, 66, "7.X.3. Категория (класс):", "");
        setTableNode(table, 67, "7.X.4. Мощность (пропускная способность, грузооборот, интенсивность движения):", "");
        setTableNode(table, 68, "7.X.5. Тип (кабельная линия электропередачи, воздушная линия электропередачи, " +
                "кабельно-воздушная линия электропередачи), уровень напряжения линий электропередачи:", "");
        setTableNode(table, 69, "7.X.6. Иные показатели:", "");
        setTableNode(table, 70, "7.X.7. Дата подготовки технического плана:", "");
        setTableNode(table, 71, "7.X.8. Страховой номер индивидуального лицевого счета кадастрового инженера, " +
                "подготовившего технический план:", "");
        addCenterText(document, "", 13, false);
        addBoldText(document, "При заполнении заявления рекомендуем руководствоваться Приказом Минстроя");
        addBoldText(document, "России от 03.06.2022 N 446/пр \"Об утверждении формы разрешения на строительство");
        addBoldText(document, "и формы разрешения на ввод объекта в эксплуатацию\".");
        addText(document, "__________________________________________________________________________");
        addCenterText(document, "Информация о согласии застройщика и иного лица (иных лиц) на осуществление", 13, false);
        addCenterText(document, "государственной регистрации права собственности на построенные, реконструированные", 13, false);
        addCenterText(document,
                      "здание, сооружение и (или) на все расположенные в таких здании, сооружении помещения,", 13, false);
        addTextWithSuperscript(document);
        addCenterText(document, "Градостроительного кодекса Российской Федерации)", 13, false);
        addCenterText(document, "", 13, false);

        Optional<ConfirmationConsentType> oConfirmationConsent = ofNullable(request.getConfirmationConsent());
        boolean isConfirmConstructionWithoutInvolvement = oConfirmationConsent
                .map(ConfirmationConsentType::isIsConfirmConsent)
                .orElse(false);
        boolean isConfirmConsent = oConfirmationConsent.map(ConfirmationConsentType::isIsConfirmConsent)
                                                       .orElse(false);
        String confirmWithoutInvolvement = isConfirmConstructionWithoutInvolvement ? "подтверждаю" : "не подтверждаю";
        String confirm = isConfirmConsent ? "подтверждаю" : "не подтверждаю";
        XWPFTable table2 = document.createTable(17, 5);
        setColumnWidth(table2, 0, 1000);
        setColumnWidth(table2, 1, 500);
        setColumnWidth(table2, 2, 2600);
        setColumnWidth(table2, 3, 2600);
        setColumnWidth(table2, 4, 2600);

        setupRowTable2(table2, 0, "1 Подтверждаю, что строительство, реконструкция здания, сооружения " +
                "осуществлялись:", 4);
        setupRowTable2(table2, 1, "1.1", confirmWithoutInvolvement, "застройщиком без привлечения средств иных лиц");
        setupRowTable2(table2, 2, "1.2", "",
                       "исключительно с привлечением средств застройщика и указанного ниже лица " +
                               "(лиц), осуществлявшего финансирование строительства, реконструкции здания, сооружения (далее – лицо (лица), осуществлявшее финансирование):");
        setupSpecialRowTable2(table2);
        setupRowTable2(table2, 4,  "1.2.1", 1);
        setupRowTable2(table2, 5, "2. Подтверждаю наличие:", 4);
        setupRowTable2(table2, 6, "2.1", confirm, "согласия застройщика");
        setupRowTable2(table2, 7, "2.2", "", "согласия застройщика и лица (лиц), осуществлявшего финансирование");
        setupSpecialRowTable2(table2, 8, "На осуществление государственной регистрации права собственности:");
        setupRowTable2(table2, 9, "3.1", confirm, "застройщика");
        setupRowTable2(table2, 10, "3.2", "", "лица (лиц), осуществлявшего финансирование ");
        setupRowTable2(table2, 11, "3.3", "", "застройщика и лица (лиц), осуществлявшего финансирование");
        setupSpecialRowTable2(table2, 12, "В отношении:");
        setupRowTable2(table2, 13, "4.1", confirm, "построенного, реконструированного здания, сооружения");
        setupRowTable2(table2, 14, "4.2", confirm,
                       "всех расположенных в построенном, реконструированном здании, сооружении " +
                               "помещений, машино-мест");
        setupRowTable2(table2, 15, "4.3", confirm,
                       "построенного, реконструированного здания, сооружения и всех расположенных" +
                               " " +
                               "в построенном, реконструированном здании, сооружении помещений, машино-мест");
        setupRowTable2(table2, 16,
                       "5. Сведения об уплате государственной пошлины за осуществление государственной регистрации " +
                               "прав: _____________________________________", 4);

        addCenterText(document, "", 13, false);
        addCenterText(document, "", 13, false);
        addCenterText(document, "", 13, false);
        addText(document, "К настоящему заявлению прилагаю <*>:");
        addText(document, "1) правоустанавливающие документы на земельный участок, в том числе соглашение");
        addText(document, "об установлении сервитута, решение об установлении публичного сервитута");
        addText(document, "_________________________________________________________________ на __ л.; ");
        addText(document, "(указывается наименование, N и дата выдачи документа)");
        addText(document, "2) разрешение на строительство, выданное _____________________________________ ");
        addText(document, "                                                                         (указывается " +
                "наименование органа)");
        addText(document, "\"_____\" ________________ 20____ N ______; ");
        addText(document, "3) акт о подключении (технологическом присоединении) построенного,");
        addText(document, "реконструированного объекта капитального строительства к сетям инженерно-");
        addText(document, "технического обеспечения (в случае, если такое подключение (технологическое");
        addText(document, "присоединение) этого объекта предусмотрено проектной документацией) (при");
        addText(document, "наличии); ");
        addText(document, "4) схема, отображающая расположение построенного, реконструированного объекта ");
        addText(document, "капитального строительства, расположение сетей инженерно-технического ");
        addText(document, "обеспечения в границах земельного участка и планировочную организацию земельного ");
        addText(document, "участка и подписанная лицом, осуществляющим строительство (лицом, ");
        addText(document, "осуществляющим строительство, и застройщиком или техническим заказчиком в ");
        addText(document, "случае осуществления строительства, реконструкции на основании договора");
        addText(document, "строительного подряда), за исключением случаев строительства, реконструкции");
        addText(document, "линейного объекта;");
        addText(document, "5) заключение органа государственного строительного надзора (в случае, если");
        addText(document, "предусмотрено осуществление государственного строительного надзора в соответствии ");
        addText(document, "с частью 1 статьи 54 ГрК РФ) о соответствии построенного, реконструированного ");
        addText(document, "объекта капитального строительства указанным в пункте 1 части 5 статьи 49 ГрК РФ ");
        addText(document, "требованиям проектной документации (в том числе с учетом изменений, внесенных в");
        addText(document, "рабочую документацию и являющихся в соответствии с частью 1.3 статьи 52 ГрК РФ ");
        addText(document, "частью такой проектной документации), заключение уполномоченного на");

        addText(document, "осуществление федерального государственного экологического надзора федерального ");
        addText(document, "органа исполнительной власти (далее - орган федерального государственного ");
        addText(document, "экологического надзора), выдаваемое в случаях, предусмотренных частью 5 статьи 54 ГрК РФ;");
        addText(document, "6) технический план объекта капитального строительства, подготовленный в ");
        addText(document, "соответствии с Федеральным законом от 13 июля 2015 года N 218-ФЗ \"О ");
        addText(document, "государственной регистрации недвижимости\";");
        addText(document, "7) договор или договоры, заключенные между застройщиком и иным лицом (иными");
        addText(document, "лицами), в случае, если обязанность по финансированию строительства или ");

        addText(document, "реконструкции здания, сооружения возложена на иное лицо (иных лиц), и ");
        addText(document, "предусматривающие возникновение права собственности застройщика и (или) иного ");
        addText(document, "лица (иных лиц) на построенные, реконструированные здание, сооружение или на все ");
        addText(document, "расположенные в таких здании, сооружении помещения, машино-места;");
        addText(document, "8) документы, подтверждающие исполнение застройщиком и иным лицом (иными ");
        addText(document, "лицами) обязательств по договорам, заключенным между застройщиком и иным лицом ");
        addText(document, "(иными лицами), в случае, если обязанность по финансированию строительства или ");
        addText(document, "реконструкции здания, сооружения возложена на иное лицо (иных лиц), и ");

        addText(document, "предусматривающим возникновение права собственности застройщика и (или) иного ");
        addText(document, "лица (иных лиц) на построенные, реконструированные здание, сооружение или на все ");
        addText(document, "расположенные в таких здании, сооружении помещения, машино-места, и содержащие");
        addText(document, "согласие указанного лица (указанных лиц) на осуществление государственной ");
        addText(document, "регистрации права собственности указанного лица (указанных лиц) на перечисленные объекты.");
        addText(document, "В этом случае в заявлении о выдаче разрешения на ввод объекта капитального ");
        addText(document, "строительства в эксплуатацию подтверждается, что строительство, реконструкция ");
        addText(document, "здания, сооружения осуществлялись исключительно с привлечением средств ");
        addText(document, "застройщика и иного лица (иных лиц), указанных в данных документах.");
        addText(document, "");
        addText(document, "");

        addText(document, "<2> Результат предоставления государственной услуги прошу предоставить:");
        addText(document, "- через структурное подразделение МФЦ (в случае подачи заявления через МФЦ) ____ ");
        addText(document, "- в ЛК ИС Министерства (в случае подачи заявления в электронном виде) ____");
        addText(document, "- нарочно (в случае подачи заявления нарочно) ____");
        addText(document, "");
        addText(document, "--------------------------------");
        addText(document, "<1> В случае, если для заявленного случая строительства (реконструкции) объекта по");
        addText(document, "действующему законодательству предоставление документа не требуется либо застройщик не");
        addText(document, "предоставляет какой-либо документ по иным основаниям, в соответствующем пункте заявления");
        addText(document, "следует вписать слова \"не требуется\" или поставить прочерк.");
        addText(document, "<2> Следует указать один из способов получения результата предоставления");
        addText(document, "государственной услуги.");

        addText(document, "");
        addText(document, "");
        addText(document, "_____________________    ________________     _______________________________");
        addTextWithSpacing(document,
                           "           (должность)                    (подпись)                                   (Ф.И.О)");
        addText(document, "\"___\" _____________ 20___ г.");
        addText(document, "М.П.");

        return document;
    }
}
