package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class GisImportColumnException extends RuntimeException {
	private static final long serialVersionUID = -1153144292187335379L;

	public GisImportColumnException(String table, String columnName) {
		super("For table: " + table + ". Not found required column: " + columnName);
	}
}
