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

@Component
public class AllPlaceSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(AllPlaceSearchEngine.class);

    @Override
    public Page<FtsResponseDto> search(FtsRequest dto) {
        log.info("AllPlaceSearcher: {}", dto);

        return new PageImpl<>(new ArrayList<>());
    }

    @Override
    public FtsType getType() {
        return null;
    }
}
