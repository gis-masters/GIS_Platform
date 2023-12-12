package ru.mycrg.data_service.service.cqrs.fts.handlers;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Component
public class FtsHandler implements IRequestHandler<FtsRequest, Page<FtsResponseDto>> {

    private final Map<FtsType, IFullTextSearchEngine> searchEngines;

    public FtsHandler(List<IFullTextSearchEngine> searchers) {
        this.searchEngines = searchers.stream()
                                      .collect(toMap(IFullTextSearchEngine::getType, Function.identity()));
    }

    @Override
    public Page<FtsResponseDto> handle(FtsRequest request) {
        return searchEngines.get(request.getRequestType())
                            .search(request, null);
    }
}
