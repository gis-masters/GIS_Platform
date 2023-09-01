package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.WorkType;

/**
 * Модель данных Document - dl_data_work_type.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_work_type", objectClass = WorkType.class)
public class WorkTypeMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
}
