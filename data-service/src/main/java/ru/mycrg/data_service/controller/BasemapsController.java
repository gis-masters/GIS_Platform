package ru.mycrg.data_service.controller;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED;

@RepositoryRestController
public class BasemapsController {

    @ResponseBody
    @PutMapping("/basemaps/{id}")
    public ResponseEntity<Object> updateBasemap(@PathVariable String id) {
        return new ResponseEntity<>(METHOD_NOT_ALLOWED);
    }
}
