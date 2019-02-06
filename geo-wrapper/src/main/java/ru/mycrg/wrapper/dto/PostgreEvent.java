package ru.mycrg.wrapper.dto;

public class PostgreEvent {

    private String objectid;
    private String dbName;
    private String schema;
    private String table;
    private String inetClientAddr;
    private String inetServerAddr;

    public PostgreEvent() {}

    public String getObjectid() {
        return objectid;
    }

    public void setObjectid(String objectid) {
        this.objectid = objectid;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getInetClientAddr() {
        return inetClientAddr;
    }

    public void setInetClientAddr(String inetClientAddr) {
        this.inetClientAddr = inetClientAddr;
    }

    public String getInetServerAddr() {
        return inetServerAddr;
    }

    public void setInetServerAddr(String inetServerAddr) {
        this.inetServerAddr = inetServerAddr;
    }
}
