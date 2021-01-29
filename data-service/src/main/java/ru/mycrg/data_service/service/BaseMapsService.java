package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.exceptions.CrgValidationException;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

import static ru.mycrg.data_service.mappers.BaseMapMapper.baseMapMapper;

@Service
@RepositoryEventHandler
public class BaseMapsService {

    public static final Logger log = LoggerFactory.getLogger(BaseMapsService.class);

    private final Validator validator;

    public BaseMapsService(Validator validator) {
        this.validator = validator;
    }

    @Transactional
    @HandleBeforeCreate
    public void beforeCreate(BaseMap baseMap) {
        validate(baseMapMapper.toDto(baseMap));
    }

    @Transactional
    @HandleBeforeSave
    public void beforeSave(BaseMap baseMap) {
        validate(baseMapMapper.toDto(baseMap));
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
