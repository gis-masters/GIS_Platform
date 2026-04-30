package ru.mycrg.notification.domain.strategy;

import jakarta.persistence.*;

import java.time.Duration;
import java.util.Objects;

@Entity
@Table(name = "strategies")
public class StrategyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer maxRetries;

    @Column(nullable = false)
    private Long retryIntervalSeconds;

    @Column(nullable = false)
    private Boolean active;

    public StrategyEntity() {
        // Required
    }

    public StrategyEntity(Long id, String name, String description, Integer maxRetries,
                          Long retryIntervalSeconds, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxRetries = maxRetries;
        this.retryIntervalSeconds = retryIntervalSeconds;
        this.active = active;
    }

    /**
     * Получить интервал между попытками как Duration
     */
    @Transient
    public Duration getRetryInterval() {
        return Duration.ofSeconds(retryIntervalSeconds);
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
        StrategyEntity strategyEntity = (StrategyEntity) o;
        return Objects.equals(id, strategyEntity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
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
     * Паттерн Builder для создания объектов Strategy
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

        public StrategyEntity build() {
            return new StrategyEntity(id, name, description, maxRetries, retryIntervalSeconds, active);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
