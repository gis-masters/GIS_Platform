package ru.mycrg.gis_service.json;

import jakarta.json.JsonMergePatch;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.CrgValidationException;
import ru.mycrg.gis_service.exceptions.UnprocessableEntityException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Set;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;
import static ru.mycrg.http_client.JsonConverter.toJsonValue;

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
     *
     * @return patched object.
     */
    public <T> T mergePatch(JsonMergePatch mergePatch, T targetBean, Class<T> beanClass) {
        try {
            JsonNode target = objectMapper.valueToTree(targetBean);
            JsonNode patched = applyMergePatch(mergePatch, target);
            return convertAndValidate(patched, beanClass);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private JsonNode applyMergePatch(JsonMergePatch mergePatch, JsonNode target) {
        try {
            return toJsonNode(mergePatch.apply(toJsonValue(target)));
        } catch (Exception e) {
            throw new UnprocessableEntityException(e);
        }
    }

    private <T> T convertAndValidate(JsonNode jsonValue, Class<T> beanClass) {
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
