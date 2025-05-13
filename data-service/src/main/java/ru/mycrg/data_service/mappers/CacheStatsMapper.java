package ru.mycrg.data_service.mappers;

import com.github.benmanes.caffeine.cache.stats.CacheStats;
import ru.mycrg.data_service_contract.dto.CacheStatsDto;

public class CacheStatsMapper {

    public static CacheStatsDto mapToDto(CacheStats cacheStats) {
        return new CacheStatsDto(cacheStats.hitCount(), cacheStats.missCount(), cacheStats.loadSuccessCount(),
                                 cacheStats.loadFailureCount(), cacheStats.totalLoadTime(),
                                 cacheStats.evictionCount(), cacheStats.evictionWeight());
    }
}
