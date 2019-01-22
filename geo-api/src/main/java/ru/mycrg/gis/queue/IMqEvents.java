package ru.mycrg.gis.queue;

import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.gis.dto.MqOrganizationInit;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void startValidation(EntityTypeDto entityType);

}
