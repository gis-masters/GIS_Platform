package ru.mycrg.data_service.util;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;

public class PagingAndSortingUtil {

    /**
     * Add order DESC for content type field. This sets folders first.
     *
     * @param pageable Pagination information.
     */
    @NotNull
    public static Pageable fetchFoldersFirst(Pageable pageable) {
        try {
            List<Sort.Order> orders = new ArrayList<>();
            orders.add(Sort.Order.desc(CONTENT_TYPE_ID.name()));

            pageable.getSort().forEach(order -> {
                if (order.isAscending()) {
                    orders.add(Sort.Order.asc(order.getProperty()));
                } else {
                    orders.add(Sort.Order.desc(order.getProperty()));
                }
            });

            final Sort modifiedSort = Sort.by(orders);

            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), modifiedSort);
        } catch (Exception e) {
            return pageable;
        }
    }
}
