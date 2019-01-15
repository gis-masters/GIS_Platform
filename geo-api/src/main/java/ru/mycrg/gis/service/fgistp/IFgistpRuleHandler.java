package ru.mycrg.gis.service.fgistp;

import ru.mycrg.gis.dto.fgistp.FgistpRules;

public interface IFgistpRuleHandler {

    /**
     * Обновляем, перечитывая правила, из БД.
     */
    FgistpRules updateRules();

}
