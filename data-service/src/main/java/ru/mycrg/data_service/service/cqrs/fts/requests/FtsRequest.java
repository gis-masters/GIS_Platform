package ru.mycrg.data_service.service.cqrs.fts.requests;

import org.springframework.data.domain.Pageable;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.common_contracts.generated.page.PageableResources;
import ru.mycrg.mediator.IRequest;

public class FtsRequest implements IRequest<PageableResources<FtsResponseDto>> {

    private final FtsRequestDto ftsRequestDto;
    private final Pageable pageable;

    public FtsRequest(FtsRequestDto dto, Pageable pageable) {
        this.ftsRequestDto = dto;
        this.pageable = pageable;
    }

    @Override
    public String getType() {
        return FtsRequest.class.getSimpleName();
    }

    public FtsRequestDto getFtsRequestDto() {
        return ftsRequestDto;
    }

    public FtsType getRequestType() {
        return ftsRequestDto.getType();
    }

    public Pageable getPageable() {
        return pageable;
    }

    @Override
    public String toString() {
        return "{" +
                "\"ftsRequestDto\":" + (ftsRequestDto == null ? "null" : ftsRequestDto) + ", " +
                "\"pageable\":" + (pageable == null ? "null" : pageable) +
                "}";
    }
}
