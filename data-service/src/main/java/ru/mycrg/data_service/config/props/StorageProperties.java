package ru.mycrg.data_service.config.props;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "crg-options.storage")
public class StorageProperties {

    private StorageCacheProperties cache;

    public StorageProperties() {
        // Required
    }

    public StorageProperties(StorageCacheProperties cache) {
        this.cache = cache;
    }

    public StorageCacheProperties getCache() {
        return cache;
    }

    public void setCache(StorageCacheProperties cache) {
        this.cache = cache;
    }

    @Override
    public String toString() {
        return "{" +
                "\"cache\":" + (cache == null ? "null" : cache) +
                "}";
    }
}
