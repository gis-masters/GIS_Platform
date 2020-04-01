package ru.mycrg.data_service.controller;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RepositoryRestController
public class BaseMapsController {

    @ResponseBody
    @PutMapping("/basemaps/{id}")
    public ResponseEntity<Object> updateBaseMap(@PathVariable String id) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

}
