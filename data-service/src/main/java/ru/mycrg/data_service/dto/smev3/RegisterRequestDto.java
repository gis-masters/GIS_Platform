package ru.mycrg.data_service.dto.smev3;

import javax.validation.constraints.NotNull;

public class RegisterRequestDto implements ISmevRequestDto {

    @NotNull(message = "Забыли указать идентификатор отправляемой записи")
    private Long recId;
    private String fakeRequest;

    public Long getRecId() {
        return recId;
    }

    public void setRecId(Long recId) {
        this.recId = recId;
    }

    public String getFakeRequest() {
        return fakeRequest;
    }

    public void setFakeRequest(String fakeRequest) {
        this.fakeRequest = fakeRequest;
    }

    @Override
    public String toString() {
        return "{" +
                "\"recId\":" + (recId == null ? "null" : "\"" + recId + "\"") + ", " +
                "\"fakeRequest\":" + (fakeRequest == null ? "null" : "\"" + fakeRequest + "\"") +
                "}";
    }
}
