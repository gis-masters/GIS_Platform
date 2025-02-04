package ru.crg.gisogd_service.service.aggregator;

import com.fasterxml.jackson.core.JsonProcessingException;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Crimea object aggregator
 * @author Vladimir Nomokonov
 */
public interface CrimeaAggregator<T> {

    /**
     * @param crimeaObject - объект целевой
     * @param event - данные из очереди
     * @return crimeaObject
     */
    T aggregate(T crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException;

}
