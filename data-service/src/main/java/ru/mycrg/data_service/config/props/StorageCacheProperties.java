package ru.mycrg.data_service.config.props;

public class StorageCacheProperties {

    /**
     * В минутах.
     */
    private int expireAfterWrite;
    private boolean recordStats;
    private long maximumSize;

    public StorageCacheProperties() {
        // Required
    }

    public boolean isRecordStats() {
        return recordStats;
    }

    public void setRecordStats(boolean recordStats) {
        this.recordStats = recordStats;
    }

    public long getMaximumSize() {
        return maximumSize;
    }

    public void setMaximumSize(long maximumSize) {
        this.maximumSize = maximumSize;
    }

    public int getExpireAfterWrite() {
        return expireAfterWrite;
    }

    public void setExpireAfterWrite(int expireAfterWrite) {
        this.expireAfterWrite = expireAfterWrite;
    }

    @Override
    public String toString() {
        return "{" +
                "\"recordStats\":\"" + recordStats + "\"" + ", " +
                "\"maximumSize\":\"" + maximumSize + "\"" + ", " +
                "\"expireAfterWrite\":\"" + expireAfterWrite + "\"" +
                "}";
    }
}
