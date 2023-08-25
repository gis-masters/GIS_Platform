package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Customer;

/**
 * Модель данных Document - Customer.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_customer", objectClass = Customer.class)
public class CustomerMixin {
    @JsonProperty("guid")
    private String guid;
    @JsonProperty("individual")
    private Boolean individual;
    @JsonProperty("organization")
    private String organization;
    @JsonProperty("citizen")
    private String citizen;
}
