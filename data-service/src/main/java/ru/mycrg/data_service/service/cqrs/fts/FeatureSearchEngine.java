package ru.mycrg.data_service.service.cqrs.fts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.ArrayList;

import static ru.mycrg.common_contracts.generated.fts.FtsType.FEATURE;

@Component
public class FeatureSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(FeatureSearchEngine.class);

    @Override
    public Page<FtsResponseDto> search(FtsRequest dto) {
        log.info("FeatureSearcher: {}", dto);

        return new PageImpl<>(new ArrayList<>());
    }

    @Override
    public FtsType getType() {
        return FEATURE;
    }
}
