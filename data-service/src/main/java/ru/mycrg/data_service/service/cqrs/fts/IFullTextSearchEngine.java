package ru.mycrg.data_service.service.cqrs.fts;

import org.springframework.data.domain.Page;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

public interface IFullTextSearchEngine {

    Page<FtsResponseDto> search(FtsRequest dto);

    FtsType getType();

    float DEFAULT_BOUND = 0.9f;
}
