package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Component
public class GisogdRfPublisherFactory {

    private static final Logger log = LoggerFactory.getLogger(GisogdRfPublisherFactory.class);

    private final IGisogdRfPublisher docLibraryPublisher;
    private final IGisogdRfPublisher featurePublisher;

    public GisogdRfPublisherFactory(DocLibraryPublisher docLibraryPublisher,
                                    FeaturePublisher featurePublisher) {
        this.docLibraryPublisher = docLibraryPublisher;
        this.featurePublisher = featurePublisher;
    }

    public Optional<IGisogdRfPublisher> getPublisher(ResourceQualifier qualifier) {
        ResourceType type = qualifier.getType();
        if (type.equals(LIBRARY)) {
            return Optional.of(docLibraryPublisher);
        } else if (type.equals(TABLE)) {
            return Optional.of(featurePublisher);
        } else {
            log.error("Публикация '{}' не поддерживается", type);

            return Optional.empty();
        }
    }
}
