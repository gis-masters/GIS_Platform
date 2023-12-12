package ru.mycrg.data_service.service.cqrs.fts;

import org.springframework.data.domain.Page;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.Comparator;
import java.util.Set;
import java.util.regex.Pattern;

public interface IFullTextSearchEngine {

    Page<FtsResponseDto> search(FtsRequest dto, Set<String> dictionaryWords);

    FtsType getType();

    float DEFAULT_BOUND = 0.93f;

    String CADASTR_NUMBER_PATTERN = "\\d{2}:\\d{2}:\\d{6,7}:\\d+";

    Comparator<FtsResponseDto> ftsBoundComparator = (i1, i2) -> Float.compare(i1.getValue(), i2.getValue());

    default float getBound(FtsRequestDto dto) {
        return dto.getBound() != null ? dto.getBound() : DEFAULT_BOUND;
    }

    default boolean isCadastrNumber(String input) {
        return Pattern.compile(CADASTR_NUMBER_PATTERN)
                      .matcher(input)
                      .matches();
    }

    Page<FtsResponseDto> searchAsCadastrNumber(FtsRequest dto);
}
