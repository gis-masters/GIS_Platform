package ru.mycrg.data_service.service.gisogd;

import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Map;

public interface IGisogdRfPublisher {

    Map<String, Long> publish(Long taskId, ResourceQualifier qualifier, int srid, Long limit);
}
