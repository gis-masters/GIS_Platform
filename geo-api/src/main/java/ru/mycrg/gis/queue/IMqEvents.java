package ru.mycrg.gis.queue;

import ru.mycrg.common.EntityType;
import ru.mycrg.gis.dto.MqOrganizationInit;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void startValidation(EntityType entityType);

}
