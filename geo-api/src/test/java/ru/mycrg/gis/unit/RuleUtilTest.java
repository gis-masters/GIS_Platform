package ru.mycrg.gis.unit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.gis.dto.fgistp.FgistpClassType;
import ru.mycrg.gis.entity.XsdRule;
import ru.mycrg.gis.service.fgistp.RuleUtil;

import static org.junit.Assert.assertEquals;

public class RuleUtilTest {

    @Test
    @Ignore
    public void mapperTest() throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        String data = "{\"name\":\"NaturalRiskZone_Type\",\"alias\":\"Класс объектов «Территории, подверженные риску возникновения чрезвычайных ситуаций природного характера»\",\"group\":{\"name\":null,\"alias\":null},\"properties\":[{\"name\":\"GLOBALID\",\"alias\":\"Идентификатор объекта\",\"baseType\":{\"minLength\":-1,\"maxLength\":-1,\"pattern\":\"(urn:uuid:)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\\\}\",\"pattern_description\":\"\"},\"minOccurs\":1,\"maxOccurs\":1},{\"name\":\"CLASSID\",\"alias\":\"Код объекта\",\"baseType\":{\"enumerations\":[{\"value\":\"606010101\",\"alias\":\"Территории, подверженные риску возникновения чрезвычайных ситуаций природного характера\"},{\"value\":\"606010102\",\"alias\":\"Территории, подверженные опасным геологическим процессам\"},{\"value\":\"606010103\",\"alias\":\"Территории, подверженные опасным гидрологическим процессам\"},{\"value\":\"606010104\",\"alias\":\"Территории, подверженные опасным метеорологическим процессам\"}]},\"minOccurs\":1,\"maxOccurs\":1},{\"name\":\"EME_SOURCE\",\"alias\":\"Источник природной чрезвычайной ситуации\",\"baseType\":{\"enumerations\":[{\"value\":\"1\",\"alias\":\"Землетрясение\"},{\"value\":\"2\",\"alias\":\"Вулканическое извержение\"},{\"value\":\"3\",\"alias\":\"Оползень\"},{\"value\":\"4\",\"alias\":\"Обвал\"},{\"value\":\"5\",\"alias\":\"Сель\"},{\"value\":\"6\",\"alias\":\"Карст\"},{\"value\":\"7\",\"alias\":\"Просадка в лессовых грунтах\"},{\"value\":\"8\",\"alias\":\"Эрозия\"},{\"value\":\"9\",\"alias\":\"Переработка берегов\"},{\"value\":\"10\",\"alias\":\"Цунами\"},{\"value\":\"11\",\"alias\":\"Лавина\"},{\"value\":\"12\",\"alias\":\"Наводнение\"},{\"value\":\"13\",\"alias\":\"Половодье\"},{\"value\":\"14\",\"alias\":\"Паводок\"},{\"value\":\"15\",\"alias\":\"Подтопление\"},{\"value\":\"16\",\"alias\":\"Затор\"},{\"value\":\"17\",\"alias\":\"Штормовой нагон воды\"},{\"value\":\"18\",\"alias\":\"Сильный ветер\"},{\"value\":\"19\",\"alias\":\"Смерч\"},{\"value\":\"20\",\"alias\":\"Ураган\"},{\"value\":\"21\",\"alias\":\"Пыльная буря\"},{\"value\":\"22\",\"alias\":\"Суховей\"},{\"value\":\"23\",\"alias\":\"Сильные осадки\"},{\"value\":\"24\",\"alias\":\"Засуха\"},{\"value\":\"25\",\"alias\":\"Заморозки\"},{\"value\":\"26\",\"alias\":\"Туман\"},{\"value\":\"27\",\"alias\":\"Гроза\"},{\"value\":\"28\",\"alias\":\"Продолжительные дожди (ливни)\"},{\"value\":\"29\",\"alias\":\"Снегопад\"},{\"value\":\"30\",\"alias\":\"Град\"},{\"value\":\"31\",\"alias\":\"Гололед\"},{\"value\":\"32\",\"alias\":\"Мерзлотные процессы\"},{\"value\":\"33\",\"alias\":\"Природный пожар\"}]},\"minOccurs\":1,\"maxOccurs\":1},{\"name\":\"RISK_CAT\",\"alias\":\"Категория опасности процесса\",\"baseType\":{\"enumerations\":[{\"value\":\"1\",\"alias\":\"Чрезвычайно опасный (катастрофический)\"},{\"value\":\"2\",\"alias\":\"Весьма опасный\"},{\"value\":\"3\",\"alias\":\"Опасный\"},{\"value\":\"4\",\"alias\":\"Умеренно опасный\"}]},\"minOccurs\":0,\"maxOccurs\":1},{\"name\":\"EME_CLASS\",\"alias\":\"Классификация чрезвычайной ситуации\",\"baseType\":{\"enumerations\":[{\"value\":\"1\",\"alias\":\"Локального характера\"},{\"value\":\"2\",\"alias\":\"Муниципального характера\"},{\"value\":\"3\",\"alias\":\"Межмуниципального характера\"},{\"value\":\"4\",\"alias\":\"Регионального характера\"},{\"value\":\"5\",\"alias\":\"Межрегионального характера\"},{\"value\":\"6\",\"alias\":\"Федерального характера\"}]},\"minOccurs\":1,\"maxOccurs\":1},{\"name\":\"OTHER\",\"alias\":\"Иной параметр и его единицы измерения\",\"baseType\":{\"minLength\":-1,\"maxLength\":-1,\"pattern\":null,\"pattern_description\":\"\"},\"minOccurs\":0,\"maxOccurs\":1},{\"name\":\"NOTE\",\"alias\":\"Примечание\",\"baseType\":{\"minLength\":-1,\"maxLength\":-1,\"pattern\":null,\"pattern_description\":\"\"},\"minOccurs\":0,\"maxOccurs\":1}],\"geometryTypes\":[\"Polygon\",\"Point\"]}";

        XsdRule xsdRule = new XsdRule();
        xsdRule.setClassRule(mapper.readTree(data));

        RuleUtil ruleUtil = new RuleUtil();
        FgistpClassType result = ruleUtil.mapEntityToClass(xsdRule);

        assertEquals("NaturalRiskZone_Type", result.getName());
        assertEquals("Класс объектов «Территории, подверженные риску возникновения чрезвычайных ситуаций природного характера»", result.getAlias());
    }

}
