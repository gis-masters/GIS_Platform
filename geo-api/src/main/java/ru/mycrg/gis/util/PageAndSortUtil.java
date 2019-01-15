package ru.mycrg.gis.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;

public class PageAndSortUtil {

    private static final String SORT_FIELD = "id";
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;

    public static Pageable getPageableRequest(String page, String size, String sort) {

        int pageNumber;
        int sizeNumber;

        try {
            pageNumber = Math.abs(Integer.valueOf(page));
        } catch (NumberFormatException e) {
            pageNumber = DEFAULT_PAGE;
        }

        try {
            sizeNumber = Math.abs(Integer.valueOf(size));
        } catch (NumberFormatException e) {
            sizeNumber = DEFAULT_SIZE;
        }

        return PageRequest.of(pageNumber, sizeNumber, defineSortType(sort), SORT_FIELD);
    }

    private static Direction defineSortType(String sort) {
        return "desc".equals(sort) ? Direction.DESC : Direction.ASC;
    }

}
