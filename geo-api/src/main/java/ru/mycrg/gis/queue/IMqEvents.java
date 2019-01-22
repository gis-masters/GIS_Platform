package ru.mycrg.gis.queue;

import ru.mycrg.gis.dto.MqOrganizationInit;
import ru.mycrg.gis.service.fgistp.EntityType;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void startValidation(EntityType entityType);

}
