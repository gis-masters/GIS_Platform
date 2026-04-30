package ru.mycrg.notification.domain.strategy;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class StrategyDto {

    private Long id;

    @NotBlank(message = "Название стратегии не может быть пустым")
    private String name;

    private String description;

    @NotNull(message = "Максимальное количество попыток должно быть указано")
    @Min(value = 1, message = "Минимальное количество попыток - 1")
    private Integer maxRetries;

    @NotNull(message = "Интервал между попытками должен быть указан")
    @Min(value = 1, message = "Минимальный интервал - 1 секунда")
    private Long retryIntervalSeconds;

    @NotNull(message = "Статус активности должен быть указан")
    private Boolean active;

    public StrategyDto() {
        // Required
    }

    public StrategyDto(Long id, String name, String description, Integer maxRetries,
                       Long retryIntervalSeconds, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxRetries = maxRetries;
        this.retryIntervalSeconds = retryIntervalSeconds;
        this.active = active;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public Long getRetryIntervalSeconds() {
        return retryIntervalSeconds;
    }

    public void setRetryIntervalSeconds(Long retryIntervalSeconds) {
        this.retryIntervalSeconds = retryIntervalSeconds;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        StrategyDto that = (StrategyDto) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"maxRetries\":" + (maxRetries == null ? "null" : "\"" + maxRetries + "\"") + ", " +
                "\"retryIntervalSeconds\":" + (retryIntervalSeconds == null ? "null" : "\"" + retryIntervalSeconds + "\"") + ", " +
                "\"active\":" + (active == null ? "null" : "\"" + active + "\"") +
                "}";
    }

    /**
     * Паттерн Builder для создания объектов StrategyDto
     */
    public static class Builder {

        private Long id;
        private String name;
        private String description;
        private Integer maxRetries;
        private Long retryIntervalSeconds;
        private Boolean active;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder maxRetries(Integer maxRetries) {
            this.maxRetries = maxRetries;
            return this;
        }

        public Builder retryIntervalSeconds(Long retryIntervalSeconds) {
            this.retryIntervalSeconds = retryIntervalSeconds;
            return this;
        }

        public Builder active(Boolean active) {
            this.active = active;
            return this;
        }

        public StrategyDto build() {
            return new StrategyDto(id, name, description, maxRetries, retryIntervalSeconds, active);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
