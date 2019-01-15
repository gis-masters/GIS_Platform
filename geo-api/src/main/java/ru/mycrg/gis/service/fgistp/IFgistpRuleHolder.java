package ru.mycrg.gis.service.fgistp;

import ru.mycrg.gis.dto.fgistp.FgistpClassType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;

public interface IFgistpRuleHolder {

    FgistpRules getRules();

    FgistpClassType getRuleByClassName(String name);

}
