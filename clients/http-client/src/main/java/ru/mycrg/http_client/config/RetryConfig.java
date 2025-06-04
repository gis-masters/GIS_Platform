package ru.mycrg.http_client.config;

import org.jetbrains.annotations.NotNull;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class RetryConfig {

    private final int maxAttempts;
    private final long waitDuration;
    private final Set<Integer> retryCodes;

    RetryConfig(int maxAttempts, long waitDuration, Set<Integer> retryCodes) {
        this.maxAttempts = maxAttempts != 0 ? maxAttempts : 3;
        this.waitDuration = waitDuration != 0 ? waitDuration : 5000;

        final HashSet<Integer> defaultRetryableCodes = new HashSet<>();
        defaultRetryableCodes.add(408);
        defaultRetryableCodes.add(429);
        defaultRetryableCodes.add(502);
        defaultRetryableCodes.add(503);
        defaultRetryableCodes.add(504);

        this.retryCodes = Collections.unmodifiableSet(retryCodes != null ? retryCodes : defaultRetryableCodes);
    }

    public static RHttpClientConfigBuilder builder() {
        return new RHttpClientConfigBuilder();
    }

    public int getMaxAttempts() {
        return this.maxAttempts;
    }

    public long getWaitDuration() {
        return this.waitDuration;
    }

    public Set<Integer> getRetryCodes() {
        return this.retryCodes;
    }

    public String toString() {
        return "RHttpClientConfig(" +
                "maxAttempts=" + this.getMaxAttempts() + ", " +
                "waitDuration=" + this.getWaitDuration() + ", " +
                "retryCodes=" + this.getRetryCodes() + ")";
    }

    public static class RHttpClientConfigBuilder {

        private int maxAttempts;
        private long waitDuration;
        private Set<Integer> retryCodes = new HashSet<>();

        RHttpClientConfigBuilder() {
        }

        public RetryConfig.RHttpClientConfigBuilder maxAttempts(int maxAttempts) {
            if (maxAttempts < 1) {
                throw new IllegalArgumentException("maxAttempts must be greater than or equal to 1");
            } else {
                this.maxAttempts = maxAttempts;

                return this;
            }
        }

        public RetryConfig.RHttpClientConfigBuilder waitDuration(long waitDuration) {
            if (waitDuration < 1) {
                throw new IllegalArgumentException("waitDurationInOpenState must be a positive value");
            } else {
                this.waitDuration = waitDuration;

                return this;
            }
        }

        /**
         * Задает новый набор кодов.
         *
         * @param retryCodes Список http кодов
         */
        public RetryConfig.RHttpClientConfigBuilder defineRetryCodes(@NotNull Set<Integer> retryCodes) {
            this.retryCodes = retryCodes;

            return this;
        }

        /**
         * Добавляет коды к существующему набору.
         *
         * @param retryCodes Список http кодов
         */
        public RetryConfig.RHttpClientConfigBuilder addRetryCodes(@NotNull Set<Integer> retryCodes) {
            this.retryCodes.addAll(retryCodes);

            return this;
        }

        public RetryConfig build() {
            return new RetryConfig(maxAttempts, waitDuration, retryCodes);
        }
    }
}
