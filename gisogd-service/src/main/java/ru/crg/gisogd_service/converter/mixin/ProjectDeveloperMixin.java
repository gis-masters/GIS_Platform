package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ProjectDeveloper;

/**
 * Модель данных Document - ProjectDeveloper.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_project_developer", objectClass = ProjectDeveloper.class)
public class ProjectDeveloperMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("individual")
    private Boolean individual;
    @JsonProperty("organization")
    private String organization;
    @JsonProperty("citizen")
    private String citizen;
}
