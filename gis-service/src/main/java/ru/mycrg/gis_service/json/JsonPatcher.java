package ru.mycrg.gis_service.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.UnprocessableEntityException;
import ru.mycrg.gis_service.exceptions.CrgValidationException;

import javax.json.JsonMergePatch;
import javax.json.JsonValue;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

@Service
public class JsonPatcher {

    private final ObjectMapper objectMapper;
    private final Validator validator;

    public JsonPatcher(ObjectMapper objectMapper,
                       Validator validator) {
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    /**
     * Performs a JSON Merge Patch operation.
     *
     * @param mergePatch JSON Patch document
     * @param targetBean object that will be patched
     * @param beanClass  class of the object the will be patched
     * @return patched object.
     */
    public <T> T mergePatch(JsonMergePatch mergePatch, T targetBean, Class<T> beanClass) {
        try {
            JsonValue target = objectMapper.convertValue(targetBean, JsonValue.class);
            JsonValue patched = applyMergePatch(mergePatch, target);
            return convertAndValidate(patched, beanClass);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private JsonValue applyMergePatch(JsonMergePatch mergePatch, JsonValue target) {
        try {
            return mergePatch.apply(target);
        } catch (Exception e) {
            throw new UnprocessableEntityException(e);
        }
    }

    private <T> T convertAndValidate(JsonValue jsonValue, Class<T> beanClass) {
        T bean = objectMapper.convertValue(jsonValue, beanClass);

        validate(bean);

        return bean;
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
