package ru.mycrg.data_service_contract.dto;

public class CacheStatsDto {

    private final long hitCount;
    private final long missCount;
    private final long loadSuccessCount;
    private final long loadFailureCount;
    private final long totalLoadTime;
    private final long evictionCount;
    private final long evictionWeight;

    public CacheStatsDto(long hitCount, long missCount, long loadSuccessCount, long loadFailureCount,
                         long totalLoadTime, long evictionCount, long evictionWeight) {
        this.hitCount = hitCount;
        this.missCount = missCount;
        this.loadSuccessCount = loadSuccessCount;
        this.loadFailureCount = loadFailureCount;
        this.totalLoadTime = totalLoadTime;
        this.evictionCount = evictionCount;
        this.evictionWeight = evictionWeight;
    }

    public long getHitCount() {
        return hitCount;
    }

    public long getMissCount() {
        return missCount;
    }

    public long getLoadSuccessCount() {
        return loadSuccessCount;
    }

    public long getLoadFailureCount() {
        return loadFailureCount;
    }

    public long getTotalLoadTime() {
        return totalLoadTime;
    }

    public long getEvictionCount() {
        return evictionCount;
    }

    public long getEvictionWeight() {
        return evictionWeight;
    }

    @Override
    public String toString() {
        return "{" +
                "\"hitCount\":\"" + hitCount + "\"" + ", " +
                "\"missCount\":\"" + missCount + "\"" + ", " +
                "\"loadSuccessCount\":\"" + loadSuccessCount + "\"" + ", " +
                "\"loadFailureCount\":\"" + loadFailureCount + "\"" + ", " +
                "\"totalLoadTime\":\"" + totalLoadTime + "\"" + ", " +
                "\"evictionCount\":\"" + evictionCount + "\"" + ", " +
                "\"evictionWeight\":\"" + evictionWeight + "\"" +
                "}";
    }
}
