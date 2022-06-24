package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_FOLDER;

public class PagingAndSortingUtil {

    private PagingAndSortingUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Add order DESC for content type field. This sets folders first.
     *
     * @param pageable Pagination information.
     */
    @NotNull
    public static Pageable fetchFoldersFirst(Pageable pageable) {
        try {
            List<Sort.Order> orders = new ArrayList<>();
            orders.add(Sort.Order.desc(IS_FOLDER.name()));

            pageable.getSort().forEach(orders::add);

            final Sort modifiedSort = Sort.by(orders);

            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), modifiedSort);
        } catch (Exception e) {
            return pageable;
        }
    }
}
