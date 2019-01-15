package ru.mycrg.gis.queue;

import ru.mycrg.gis.dto.MqOrganizationInit;

public interface MqEvents {

    void initCreation(MqOrganizationInit msg);

}
