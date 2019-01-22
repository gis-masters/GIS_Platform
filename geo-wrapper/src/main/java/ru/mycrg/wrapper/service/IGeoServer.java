package ru.mycrg.wrapper.service;

import java.io.IOException;

public interface IGeoServer {

    /**
     * Создание организации на геосервере.
     * <p>
     * Подразумевает под собой:
     *   <p> - Создание рабочей области, роли, супер-пользователя с необходимыми ролями.
     *         И создание правила описывающего доступ роли к рабочей области или слоям рабочей области.
     *   <p> - Создание БД в postGis
     *   <p> - Создание хранилища (postgis) на геосервере.
     *
     * @param id Идентификатор организации.
     * @param rawPassword Пароль пользователя.
     */
    void createOrganization(Long id, String rawPassword) throws IOException;

}
