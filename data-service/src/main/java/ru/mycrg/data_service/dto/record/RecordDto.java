package ru.mycrg.data_service.dto.record;

import org.springframework.hateoas.core.Relation;

import java.util.Map;

/**
 * Dto нужна, чтобы обозначить relation как records при возврате сущностей.
 * <p>
 * Чтобы в будущем избавиться от "content" в каждом объекте, необходимо, исходя из схемы, генерить на лету класс.
 */
@Relation(collectionRelation = "records")
public class RecordDto {

    private final Map<String, Object> content;

    public RecordDto(IRecord record) {
        this.content = record.getContent();
    }

    public Map<String, Object> getContent() {
        return content;
    }
}
