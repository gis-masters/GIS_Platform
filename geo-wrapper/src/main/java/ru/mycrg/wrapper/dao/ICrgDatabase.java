package ru.mycrg.wrapper.dao;

import java.sql.SQLException;

public interface ICrgDatabase {

    void createDb(final String dbName) throws RuntimeException, SQLException;
}
