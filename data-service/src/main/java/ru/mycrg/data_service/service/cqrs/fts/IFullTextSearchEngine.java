package ru.mycrg.data_service.service.cqrs.fts;

import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.common_contracts.generated.page.PageableResources;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.regex.Pattern;

public interface IFullTextSearchEngine {

    PageableResources<FtsResponseDto> search(FtsRequest dto, Set<String> dictionaryWords);

    PageableResources<FtsResponseDto> searchAsCadastrNumber(FtsRequest dto);

    FtsType getType();

    String CADASTR_NUMBER_PATTERN = "\\d{2}:\\d{2}:\\d{6,7}:\\d+";

    Set<String> stopWords = new HashSet<>() {{
        add("ул");
        add("90");
    }};

    Predicate<String> notInStopWords = o -> !stopWords.contains(o);

    Comparator<FtsResponseDto> ftsBoundComparator = (i1, i2) -> Float.compare(i1.getValue(), i2.getValue());

    default String getSearchedText(FtsRequest request) {
        return request.getFtsRequestDto().getText()
                      .replaceAll("[^A-Za-zА-Яа-я0-9:]", " ").trim();
    }

    default boolean isCadastrNumber(String input) {
        return Pattern.compile(CADASTR_NUMBER_PATTERN)
                      .matcher(input)
                      .matches();
    }
}
