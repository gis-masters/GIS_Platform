package ru.mycrg.data_service.service.cqrs.fts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AllPlaceSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(AllPlaceSearchEngine.class);

    private final DocumentSearchEngine documentSearchEngine;
    private final FeatureSearchEngine featureSearchEngine;

    public AllPlaceSearchEngine(DocumentSearchEngine documentSearchEngine,
                                FeatureSearchEngine featureSearchEngine) {
        this.documentSearchEngine = documentSearchEngine;
        this.featureSearchEngine = featureSearchEngine;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest dto) {
        log.info("AllPlaceSearcher: {}", dto);

        Pageable pageable = dto.getPageable();
        Page<FtsResponseDto> documents = documentSearchEngine.search(dto);
        Page<FtsResponseDto> features = featureSearchEngine.search(dto);

        List<FtsResponseDto> combined = new ArrayList<>();
        combined.addAll(documents.getContent());
        combined.addAll(features.getContent());

        // При таком объединении страдает местами постраничность, из-за одинаковых весов, но пока, наверное, не критично
        List<FtsResponseDto> result = combined.stream()
                                              .sorted(ftsBoundComparator)
                                              .limit(pageable.getPageSize())
                                              .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, documents.getTotalElements() + features.getTotalElements());
    }

    @Override
    public FtsType getType() {
        return null;
    }
}
