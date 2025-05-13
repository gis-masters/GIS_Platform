package ru.mycrg.data_service.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.data_service.config.props.StorageCacheProperties;
import ru.mycrg.data_service.config.props.StorageProperties;

import java.util.concurrent.TimeUnit;

@EnableCaching
@Configuration
public class CacheConfig {

    private final StorageProperties storageProperties;

    public CacheConfig(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("storageOccupiedSpace", "storageTotalFiles");
        cacheManager.setCaffeine(caffeineCacheBuilder());

        return cacheManager;
    }

    Caffeine<Object, Object> caffeineCacheBuilder() {
        StorageCacheProperties cache = storageProperties.getCache();
        Caffeine<Object, Object> builder = Caffeine
                .newBuilder()
                .maximumSize(cache.getMaximumSize())
                .expireAfterWrite(cache.getExpireAfterWrite(), TimeUnit.MINUTES);

        if (cache.isRecordStats()) {
            builder.recordStats();
        }

        return builder;
    }
}
