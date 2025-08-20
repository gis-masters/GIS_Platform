package ru.mycrg.common_utils.page;

import org.springframework.data.domain.Pageable;
import ru.mycrg.common_contracts.generated.page.Page;
import ru.mycrg.common_contracts.generated.page.PageableResources;

import java.util.ArrayList;

public class PageHandler {

    private PageHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static <T> PageableResources<T> pageFromList(org.springframework.data.domain.Page<T> page,
                                                        Pageable pageable) {
        if (page == null || pageable == null) {
            return new PageableResources<>(new ArrayList<>(), new Page());
        }

        return new PageableResources<>(
                page.getContent(),
                new Page(pageable.getPageSize(),
                         page.getTotalElements(),
                         page.getTotalPages(),
                         pageable.getPageNumber()));
    }
}
