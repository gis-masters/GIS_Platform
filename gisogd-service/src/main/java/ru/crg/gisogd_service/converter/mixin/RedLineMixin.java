package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.RedLine;

/**
 * Модель данных  red_line.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "red_line", objectClass = RedLine.class)
public class RedLineMixin {

    @JsonProperty("guid_red_line")
    @JsonAlias({"guid_red_line", "guid_red_line_line"})
    private String guid;
    @JsonProperty("number")
    private String number;
    @JsonProperty("status")
    private String status;
    @JsonProperty("shape")
    private String location;

}
