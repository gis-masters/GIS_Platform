package ru.mycrg.geoserver_client.services.feature_types;

import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

public interface IFeatureTypes {

    /**
     * Создание featureType <p> При создании типа создастся и слой. <p> Feature types соответствуют таблицам в БД.
     * Соответственно можно создать слой если в БД уже будет таблица, которая будет названа так же как featureName.
     * Иначе тело запроса должно включать всю атрибутивную информацию.
     *
     * @param workspaceName Название рабочей области
     * @param dataStoreName Название хранилища
     * @param featureType   The body of the feature type https://docs.geoserver.org/latest/en/api/#1.0.0/featuretypes
     *
     * @throws HttpClientException If response not successful
     * @see <a href="https://docs.geoserver.org/latest/en/api/#1.0.0/featuretypes.yaml">FeatureType</a>
     */
    ResponseModel<Object> create(String workspaceName, String dataStoreName, FeatureTypeModel featureType)
            throws HttpClientException;

    /**
     * Удаление featureType. <p>
     * <p>
     * Внимание это не удаление слоя! <p> Удалить featureType можно только при удалении всех слоёв созданных на основе
     * данного типа, приэтом замечен неадекватный ответ геосервера с кодом 403, якобы нет доступа. <p> Возможно
     * рекурсивное удаление слоёв зависимых от данного featureType(Не реализовано).
     *
     * @param workspaceName Название рабочей области
     * @param dataStoreName Название хранилища
     * @param featureName   Название типа
     *
     * @throws HttpClientException If response not successful
     * @see <a href="https://docs.geoserver.org/latest/en/api/#1.0.0/featuretypes.yaml">FeatureType</a>
     */
    void delete(String workspaceName, String dataStoreName, String featureName) throws HttpClientException;
}
