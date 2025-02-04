package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.IndentLine;

/**
 * Модель данных из tasks indent_line.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "indent_line", objectClass = IndentLine.class)
public class IdentLineMixin {

    @JsonProperty("guid_indent_line")
    private String guid;
    @JsonProperty("number")
    private String number;
    @JsonProperty("shape")
    private String location;

}
