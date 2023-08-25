package ru.crg.gisogd_service.service;

import java.util.List;

import org.apache.camel.Body;
import org.apache.camel.Handler;
import org.apache.camel.Header;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.exception.AggregateObjectException;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.crg.gisogd_service.service.aggregator.CrimeaAggregator;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Service enrich crimea objects.
 * @author Vladimir Nomokonov
 */
@Service
@AllArgsConstructor
public class AggregateService {

    private final List<CrimeaAggregator<? extends RfGuid>> aggregators;

    @Handler
    public <T extends RfGuid> T aggregate(@Body T rfObject, @Header("event") PublishToGisogdRfEvent event) {
        ResolvableType type = ResolvableType.forClassWithGenerics(CrimeaAggregator.class, rfObject.getClass());

        return aggregators.stream()
                          .filter(type::isInstance)
                          .findFirst()
                          .map(a -> (CrimeaAggregator<T>) a)
                          .map(aggregator -> {
                              try {
                                  return aggregator.aggregate(rfObject, event);
                              } catch (JsonProcessingException e) {
                                  throw new AggregateObjectException(rfObject.getGuid(), e);
                              }
                          })
                          .orElse(rfObject);
    }
}
