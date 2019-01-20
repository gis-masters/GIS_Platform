package ru.mycrg.gis.service.fgistp;

public interface IFgistpRuleHandler {

    /**
     * Загрузка правил из xsd схемы и сохранение их в БД.
     */
    FgistpRules loadRulesFromXsdSchema(String path);

    FgistpRules loadRulesFromXsdSchema();

    /**
     * Обновляем, перечитывая правила, из БД.
     */
    FgistpRules updateRules();

}
