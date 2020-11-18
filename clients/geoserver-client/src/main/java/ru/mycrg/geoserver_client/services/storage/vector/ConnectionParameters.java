package ru.mycrg.geoserver_client.services.storage.vector;

public class ConnectionParameters {

    public final String host;
    public final String port;
    public final String database;
    public final String schema;
    public final String user;
    public final String passwd;
    public final String dbtype;

    public ConnectionParameters(String host, String port, String database, String schema, String user,
                                String passwd, String dbtype) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.schema = schema;
        this.user = user;
        this.passwd = passwd;
        this.dbtype = dbtype;
    }

    public String getHost() {
        return host;
    }

    public String getPort() {
        return port;
    }

    public String getDatabase() {
        return database;
    }

    public String getSchema() {
        return schema;
    }

    public String getUser() {
        return user;
    }

    public String getPasswd() {
        return passwd;
    }

    public String getDbtype() {
        return dbtype;
    }
}
