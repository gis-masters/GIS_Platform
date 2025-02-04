package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.SupplierEmployee;

/**
 * Модель данных Document - SupplierEmployee.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "users_after_trigger", objectClass = SupplierEmployee.class)
public class SupplierEmployeeMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title_fio")
    private String title;
    @JsonProperty("supplier_data_connection")
    private String supplier;
    @JsonProperty("email")
    private String user;
    @JsonProperty("position1")
    private String position;
}
