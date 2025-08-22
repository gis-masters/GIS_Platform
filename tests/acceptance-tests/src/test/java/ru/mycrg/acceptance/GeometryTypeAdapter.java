package ru.mycrg.acceptance;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import ru.mycrg.data_service_contract.enums.GeometryType;

import java.io.IOException;

/*
  При создании SchemaDto для векторных слоёв обязательно указывать geometryType.
  При передаче валидного JSON поле geometryType - Point не сериализуется GSON из строки в ENUM
  Если передавать в SchemaDto GeometryType, API будет говорить POINT != Point и не будет работать
  Чтобы тесты и код нормально работали -> придумался TypeAdapter
  Можно было избрать иной путь, но этот тоже показался валидным
 */

public class GeometryTypeAdapter extends TypeAdapter<GeometryType> {

    @Override
    public void write(JsonWriter out, GeometryType value) throws IOException {
        if (value == null) {
            out.nullValue();
        } else {
            out.value(value.getType());
        }
    }

    @Override
    public GeometryType read(JsonReader in) throws IOException {
        if (in.peek() == JsonToken.NULL) {
            in.nextNull();
            return null;
        }
        String value = in.nextString();
        for (GeometryType type: GeometryType.values()) {
            if (type.getType().equals(value)) {
                return type;
            }
        }
        return null;
    }
}
