package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblWidth;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTcPr;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;

import java.math.BigInteger;

import static org.apache.poi.xwpf.usermodel.ParagraphAlignment.*;
import static org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge.CONTINUE;
import static org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge.RESTART;

public class ApplicationForBuildingPermitCreator {

    public static XWPFDocument create(RequestType request) {
        XWPFDocument document = new XWPFDocument();
        addParagraph(document, "Приложение N 1");
        addParagraph(document, "к Административному регламенту");
        addParagraph(document, "предоставления Министерством жилищной политики");
        addParagraph(document, "и государственного строительного надзора Республики Крым");
        addParagraph(document, "государственной услуги по выдаче разрешения");
        addParagraph(document, "на строительство на территории Республики Крым");

        // Создаем таблицу с 10 строками и 2 столбцами
        XWPFTable table = document.createTable(114, 2);
        setColumnWidth(table, 0, 3500);
        setColumnWidth(table, 1, 6000);

        // Объединяем ячейки в первой строке (ячейка 0 и ячейка 1)
        mergeCellsHorizontally(table, 0, 0, 1);

        // Заполняем первую строку с объединенными ячейками
        setupFirstRow(table);

        mergeCellsAndSetValue(table, 1, "Раздел 2. Информация о застройщике", false, CENTER);
        mergeCellsAndSetValue(table, 2, "2.1. Сведения о физическом лице или индивидуальном предпринимателе:", false, ParagraphAlignment.LEFT);
        setTableNode(table, 3, "2.1.1. Фамилия:", request.getRecipientPersonalData().getLastname());
        setTableNode(table, 4, "2.1.2. Имя:", request.getRecipientPersonalData().getFirstname());
        setTableNode(table, 5, "2.1.3. Отчество:", request.getRecipientPersonalData().getMiddlename());
        setTableNode(table, 6, "2.1.4. ИНН:", "");
        setTableNode(table, 7, "2.1.5. ОГРНИП:", "");
        setTableNode(table, 8, "2.1.6. Адрес регистрации по месту жительства/адрес для почтовой корреспонденции:", request.getRecipientPersonalData().getRegAddress());
        mergeCellsAndSetValue(table, 9, "2.2. Сведения о юридическом лице:", false, ParagraphAlignment.LEFT);
        setTableNode(table, 10, "2.2.1. Полное наименование:", "");
        setTableNode(table, 11, "2.2.2. ИНН:", "");
        setTableNode(table, 12, "2.2.3. ОГРН:", "");
        setTableNode(table, 13, "2.2.4. Адрес регистрации/адрес для почтовой корреспонденции:", "");
        setTableNode(table, 14, "2.2.5. адрес электронной почты для связи с застройщиком:", "");
        setTableNode(table, 15, "2.2.6. Контактный номер телефона:", "");
        mergeCellsAndSetValue(table, 16, "Прошу выдать разрешение на строительство следующего объекта капитального строительства:", true, ParagraphAlignment.LEFT);
        mergeCellsAndSetValue(table, 17, "Раздел 3. Информация об объекте капитального строительства ", false, CENTER);
        setTableNode(table, 18, "3.1. Наименование объекта капитального строительства (этапа) в соответствии с проектной документацией:", request.getObjectData().getObjectName());
        setTableNode(table, 19, "3.2. Вид выполняемых работ в отношении объекта капитального строительства в соответствии с проектной документацией:", Boolean.TRUE.equals(request.getVariantChoice().getKPOA11().isConstruction()) ? "Строительство" : "Реконструкция");
        mergeCellsAndSetValue(table, 20, "3.3. Адрес (местоположение) объекта капитального строительства ", false, ParagraphAlignment.LEFT);
        setTableNode(table, 21, "3.3.1. Субъект Российской Федерации:", "");
        setTableNode(table, 22, "3.3.2. Муниципальный район, муниципальный округ, городской округ или внутригородская территория (для городов федерального значения) в составе субъекта Российской Федерации, федеральная территория:", "");
        setTableNode(table, 23, "3.3.3. Городское или сельское поселение в составе муниципального района (для муниципального района) или внутригородского района городского округа (за исключением зданий, строений, сооружений, расположенных на федеральных территориях):", "");
        setTableNode(table, 24, "3.3.4. Тип и наименование населенного пункта:", "");
        setTableNode(table, 25, "3.3.5. Наименование элемента планировочной структуры:", "");
        setTableNode(table, 26, "3.3.6. Наименование элемента улично-дорожной сети:", "");
        setTableNode(table, 27, "3.3.7. Тип и номер здания (сооружения):", "");
        mergeCellsAndSetValue(table, 28, "Раздел 4. Информация о земельном участке", false, CENTER);
        setTableNode(table, 29, "4.1. Кадастровый номер земельного участка (земельных участков), в границах которого (которых) расположен или планируется расположение объекта капитального строительства:", request.getObjectData().getObjectCadastralBlock().get(0).getObjectCadastralNumber().get(0));
        setTableNode(table, 30, "4.2. Площадь земельного участка (земельных участков), в границах которого (которых) расположен или планируется расположение объекта капитального строительства:", "");
        mergeCellsAndSetValue(table, 31, "4.3. Сведения о градостроительном плане земельного участка", false, ParagraphAlignment.LEFT);
        setTableNode(table, 32, "4.3.X.1. Дата:", request.getGPZU().getGPZUBlock().get(0).getDate());
        setTableNode(table, 33, "4.3.X.2. Номер:", request.getGPZU().getGPZUBlock().get(0).getNumber());
        setTableNode(table, 34, "4.3.X.3. Наименование органа, выдавшего градостроительный план земельного участка:", request.getGPZU().getGPZUBlock().get(0).getIssuer());
        setTableNode(table, 35, "4.4. Условный номер земельного участка (земельных участков) на утвержденной схеме расположения земельного участка или земельных участков на кадастровом плане территории (при необходимости):", "");
        mergeCellsAndSetValue(table, 36, "4.5. Сведения о схеме расположения земельного участка или земельных участков на кадастровом плане территории", false, ParagraphAlignment.LEFT);
        setTableNode(table, 37, "4.5.1. Дата решения:", "");
        setTableNode(table, 38, "4.5.2. Номер решения:", "");
        setTableNode(table, 39, "4.5.3. Наименование организации, уполномоченного органа или лица, принявшего решение об утверждении схемы расположения земельного участка или земельных участков:", "");
        mergeCellsAndSetValue(table, 40, "4.6. Информация о документации по планировке территории", false, ParagraphAlignment.LEFT);
        mergeCellsAndSetValue(table, 41, "4.6.1. Сведения о проекте планировки территории", false, ParagraphAlignment.LEFT);
        setTableNode(table, 42, "4.6.1.X.1. Дата решения:", request.getPlanProject().getPlanProjectBlock().get(0).getDate());
        setTableNode(table, 43, "4.6.1.X.2. Номер решения:", request.getPlanProject().getPlanProjectBlock().get(0).getNumber());
        setTableNode(table, 44, "4.6.1.X.3. Наименование организации, уполномоченного органа или лица, принявшего решение об утверждении проекта планировки территории:", request.getPlanProject().getPlanProjectBlock().get(0).getIssuer());
        mergeCellsAndSetValue(table, 45, "4.6.2. Сведения о проекте межевания территории", false, ParagraphAlignment.LEFT);
        setTableNode(table, 46, "4.6.2.X.1. Дата решения:", request.getSurveying().getSurveyingBlock().get(0).getDate());
        setTableNode(table, 47, "4.6.2.X.2. Номер решения:", request.getSurveying().getSurveyingBlock().get(0).getNumber());
        setTableNode(table, 48, "4.6.2.X.3. Наименование организации, уполномоченного органа или лица, принявшего решение об утверждении проекта межевания территории:", request.getSurveying().getSurveyingBlock().get(0).getIssuer());
        mergeCellsAndSetValue(table, 49, "Раздел 5. Сведения о проектной документации, типовом архитектурном решении", false, CENTER);
        mergeCellsAndSetValue(table, 50, "5.1. Сведения о разработчике - индивидуальном предпринимателе", false, ParagraphAlignment.LEFT);
        setTableNode(table, 51, "5.1.1. Фамилия:", "");
        setTableNode(table, 52, "5.1.2. Имя:", "");
        setTableNode(table, 53, "5.1.3. Отчество:", "");
        setTableNode(table, 54, "5.1.4. ИНН:", "");
        setTableNode(table, 55, "5.1.5. ОГРНИП:", "");
        mergeCellsAndSetValue(table, 56, "5.2. Сведения о разработчике - юридическом лице ", false, ParagraphAlignment.LEFT);
        setTableNode(table, 57, "5.2.1. Полное наименование:", "");
        setTableNode(table, 58, "5.2.2. ИНН:", "");
        setTableNode(table, 59, "5.2.3. ОГРН:", "");
        setTableNode(table, 60, "5.3. Дата утверждения (при наличии):", "");
        setTableNode(table, 61, "5.4. Номер (при наличии):", "");
        mergeCellsAndSetValue(table, 62, "5.5. Типовое архитектурное решение объекта капитального строительства, утвержденное для исторического поселения (при наличии)", false, ParagraphAlignment.LEFT);
        setTableNode(table, 63, "5.5.1. Дата:", "");
        setTableNode(table, 64, "5.5.2. Номер:", "");
        setTableNode(table, 65, "5.5.3. Наименование документа:", "");
        setTableNode(table, 66, "5.5.4. Наименование уполномоченного органа, принявшего решение об утверждении типового архитектурного решения:", "");
        mergeCellsAndSetValue(table, 67, "Раздел 6. Информация о результатах экспертизы проектной документации и государственной экологической экспертизы", false, CENTER);
        mergeCellsAndSetValue(table, 68, "6.1. Сведения об экспертизе проектной документации", false, ParagraphAlignment.LEFT);
        setTableNode(table, 69, "6.1.X.1. Дата утверждения:", "");
        setTableNode(table, 70, "6.1.X.2. Номер: ", "");
        setTableNode(table, 71, "6.1.X.3. Наименование органа или организации, выдавшей положительное заключение экспертизы проектной документации:", "");
        mergeCellsAndSetValue(table, 72, "6.2. Сведения о государственной экологической экспертизе ", false, ParagraphAlignment.LEFT);
        setTableNode(table, 73, "6.2.X.1. Дата утверждения:", "");
        setTableNode(table, 74, "6.2.X.2. Номер:", "");
        setTableNode(table, 75, "6.2.X.3. Наименование органа, утвердившего положительное заключение государственной экологической экспертизы:", "");
        mergeCellsAndSetValue(table, 76, "6.3. Подтверждение соответствия вносимых в проектную документацию изменений требованиям, указанным в части 3.8 статьи 49 Градостроительного кодекса Российской Федерации", false, ParagraphAlignment.LEFT);
        setTableNode(table, 77, "6.3.1. Дата:", "");
        setTableNode(table, 78, "6.3.2. Номер:", "");
        setTableNode(table, 79, "6.3.3. Сведения о лице, утвердившем указанное подтверждение:", "");
        mergeCellsAndSetValue(table, 80, "6.4. Подтверждение соответствия вносимых в проектную документацию изменений требованиям, указанным в части 3.9 статьи 49 Градостроительного кодекса Российской Федерации", false, ParagraphAlignment.LEFT);
        setTableNode(table, 81, "6.4.1. Дата:", "");
        setTableNode(table, 82, "6.4.2. Номер:", "");
        setTableNode(table, 83, "6.4.3. Наименование органа исполнительной власти или организации, проводившей оценку соответствия:", "");
        mergeCellsAndSetValue(table, 84, "Раздел 7. Проектные характеристики объекта капитального строительства", false, CENTER);
        setTableNode(table, 85, "7.X. Наименование объекта капитального строительства, предусмотренного проектной документацией:", "");
        setTableNode(table, 86, "7.X.1. Вид объекта капитального строительства:", "");
        setTableNode(table, 87, "7.X.2. Назначение объекта:", "");
        setTableNode(table, 88, "7.X.3. Кадастровый номер реконструируемого объекта капитального строительства:", "");
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
        setTableNode(table, 106, "8.X. Наименование линейного объекта, предусмотренного проектной документацией:", "");
        setTableNode(table, 107, "8.X.1. Кадастровый номер реконструируемого линейного объекта:", "");
        setTableNode(table, 108, "8.X.2. Протяженность (м):", "");
        setTableNode(table, 109, "8.X.2.1. Протяженность участка или части линейного объекта (м):", "");
        setTableNode(table, 110, "8.X.3. Категория (класс):", "");
        setTableNode(table, 111, "8.X.4. Мощность (пропускная способность, грузооборот, интенсивность движения):", "");
        setTableNode(table, 112, "8.X.5. Тип (кабельная линия электропередачи, воздушная линия электропередачи, кабельно-воздушная линия электропередачи), уровень напряжения линий электропередачи:", "");
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
        addTextWithSpacing(document, "                                                                        его выдавшей)");
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
        addTextWithSpacing(document, "           (должность)                    (подпись)                                   (Ф.И.О)");
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

    private static void addTextToParagraph(XWPFParagraph paragraph, String text, boolean isBold, int fontSize) {
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setFontFamily("Times New Roman");
        run.setFontSize(fontSize);
        run.setBold(isBold);
    }

    private static void setupFirstRow(XWPFTable table) {
        XWPFTableRow firstRow = table.getRow(0);
        XWPFTableCell mergedCell = firstRow.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(CENTER);
        addTextToParagraph(paragraph, "Раздел 1. Наименование исполнительного органа Республики Крым, куда подается заявление о выдаче разрешения на строительство:", false, 12);
        paragraph.createRun().addBreak();
        addTextToParagraph(paragraph, "Министерство жилищной политики и государственного строительного надзора Республики Крым", true, 12);
    }

    private static void addParagraph(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(RIGHT);
        paragraph.setSpacingAfter(30);

        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setFontFamily("Times New Roman");
        run.setFontSize(12);
    }

    private static void addParagraph(XWPFDocument document, String text, boolean isBold, int spacingAfter) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(BOTH);
        paragraph.setSpacingAfter(spacingAfter);
        addTextToParagraph(paragraph, text, isBold, 12);
    }

    private static void addBoldText(XWPFDocument document, String text) {
        addParagraph(document, text, true, 30);
    }

    private static void addText(XWPFDocument document, String text) {
        addParagraph(document, text, false, 30);
    }

    private static void addTextWithSpacing(XWPFDocument document, String text) {
        addParagraph(document, text, false, 250);
    }

    private static void setCellText(XWPFTableCell cell, String text) {
        XWPFParagraph paragraph = cell.getParagraphs().get(0);
        paragraph.setAlignment(ParagraphAlignment.LEFT);
        addTextToParagraph(paragraph, text, false, 12);
    }

    private static void setTableNode(XWPFTable table, int rowNumber, String rowName, String rowValue) {
        XWPFTableRow row = table.getRow(rowNumber);
        setCellText(row.getCell(0), rowName);
        setCellText(row.getCell(1), rowValue);
    }

    private static void mergeCellsAndSetValue(XWPFTable table, int rowNumber, String value, boolean isBold, ParagraphAlignment alignment) {
        mergeCellsHorizontally(table, rowNumber, 0, 1);
        XWPFTableRow row = table.getRow(rowNumber);
        XWPFTableCell mergedCell = row.getCell(0);
        XWPFParagraph paragraph = mergedCell.getParagraphs().get(0);
        paragraph.setAlignment(alignment);
        addTextToParagraph(paragraph, value, isBold, 12);
    }

    private static void mergeCellsHorizontally(XWPFTable table, int row, int fromCell, int toCell) {
        XWPFTableRow tableRow = table.getRow(row);
        for (int cellIndex = toCell; cellIndex > fromCell; cellIndex--) {
            XWPFTableCell mergedCell = tableRow.getCell(fromCell);
            XWPFTableCell removedCell = tableRow.getCell(cellIndex);
            mergedCell.getCTTc().addNewTcPr().addNewHMerge().setVal(RESTART);
            removedCell.getCTTc().addNewTcPr().addNewHMerge().setVal(CONTINUE);
        }
    }

    private static void setColumnWidth(XWPFTable table, int columnIndex, int width) {
        for (XWPFTableRow row : table.getRows()) {
            XWPFTableCell cell = row.getCell(columnIndex);
            CTTcPr tcPr = cell.getCTTc().addNewTcPr();
            CTTblWidth tblWidth = tcPr.addNewTcW();
            tblWidth.setW(BigInteger.valueOf(width));
        }
    }
}
