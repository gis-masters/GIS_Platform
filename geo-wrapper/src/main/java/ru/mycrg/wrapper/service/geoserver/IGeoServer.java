package ru.mycrg.wrapper.service.geoserver;

import ru.mycrg.common.MqOrganizationInit;

import java.io.IOException;

public interface IGeoServer {

    /**
     * Создание организации на геосервере.
     * <p>
     * Подразумевает под собой:
     *   <p> - Создание рабочей области, роли, супер-пользователя с необходимыми ролями.<p>
     *         Добавление правил доступа к:<br>
     *             * рабочей области или слоям рабочей области.<br>
     *             * REST геосервера<br><br>
     *   <p> - Создание БД в postGis<br>
     *   <p> - Создание хранилища (postgis) на геосервере.
     *
     */
    void createOrganization(MqOrganizationInit creationDto) throws IOException;

}
