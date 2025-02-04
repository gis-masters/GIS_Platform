package ru.mycrg.data_service.dao.utils.query_builder.exceptions;

public class QueryBuilderException extends RuntimeException {

    /**
     * Constructs an <code>QueryBuilderException</code> with no detail message.
     */
    public QueryBuilderException() {
        super();
    }

    /**
     * Constructs an <code>QueryBuilderException</code> with the specified detail message.
     *
     * @param msg the detail message.
     */
    public QueryBuilderException(String msg) {
        super(msg);
    }
}
