package ru.mycrg.data_service.service.storage;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.stats.CacheStats;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.mappers.CacheStatsMapper;
import ru.mycrg.data_service_contract.dto.CacheStatsDto;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import static ru.mycrg.data_service.service.storage.FileStorageUtil.readableFileSize;

@Component
public class StorageOccupiedSpaceService {

    private final Logger log = LoggerFactory.getLogger(StorageOccupiedSpaceService.class);

    private final CacheManager cacheManager;

    public StorageOccupiedSpaceService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Cacheable(value = "storageOccupiedSpace", key = "#path.toString()")
    public long calculateSize(Path path) {
        try {
            return FileUtils.sizeOfDirectory(new File(path.toUri()));
        } catch (Exception e) {
            log.error("Не удалось подсчитать размер каталога: {} => {}", path, e.getMessage());

            return 0;
        }
    }

    @Cacheable(value = "storageTotalFiles", key = "#path.toString()")
    public Object getTotalFiles(Path path) {
        try (Stream<Path> filesStream = Files.walk(Paths.get(path.toUri()))) {
            return filesStream.parallel()
                              .filter(p -> !p.toFile().isDirectory())
                              .count();
        } catch (IOException e) {
            log.error("Не удалось подсчитать кол-во файлов в хранилище: '{}'", path);

            return 0;
        }
    }

    @CacheEvict(value = "storageOccupiedSpace", key = "#path.toString()")
    public void evictCacheOccupiedSpace(Path path) {
        log.info("Evicting OccupiedSpace cache for path: {}", path);
    }

    @CacheEvict(value = "storageTotalFiles", key = "#path.toString()")
    public void evictCacheTotalFiles(Path path) {
        log.info("Evicting totalFiles cache by path: {}", path);
    }

    public Map<String, CacheStatsDto> getInfo() {
        Map<String, CacheStatsDto> result = new HashMap<>();

        Collection<String> cacheNames = cacheManager.getCacheNames();
        for (String cacheName: cacheNames) {
            CaffeineCache caffeineCache = (CaffeineCache) cacheManager.getCache(cacheName);
            if (caffeineCache != null) {
                Cache<Object, Object> nativeCache = caffeineCache.getNativeCache();
                CacheStats stats = nativeCache.stats();

                log.debug("Статистика кеша:");
                log.debug("Количество попаданий: {}", stats.hitCount());
                log.debug("Количество промахов: {}", stats.missCount());
                log.debug("Количество успешных загрузок: {}", stats.loadSuccessCount());
                log.debug("Количество неудачных загрузок: {}", stats.loadFailureCount());
                log.debug("Общее время загрузки: {} наносекунд", stats.totalLoadTime());
                log.debug("Количество вытеснений: {}", stats.evictionCount());
                log.debug("Общий вес вытесненных элементов: {}", stats.evictionWeight());

                result.put(cacheName, CacheStatsMapper.mapToDto(stats));

                log.debug("Текущее значение кеша");
                nativeCache.asMap()
                           .forEach((key, value) -> {
                               log.debug("[{}] = {}", key, readableFileSize(Long.parseLong(String.valueOf(value))));
                           });
            }
        }

        return result;
    }
}
