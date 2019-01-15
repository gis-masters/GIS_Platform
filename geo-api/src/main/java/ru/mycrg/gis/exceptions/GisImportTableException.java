package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class GisImportTableException extends RuntimeException {
	private static final long serialVersionUID = -1153144292187335379L;

	public GisImportTableException(String table) {
		super("Not found target table: " + table);
	}
}
