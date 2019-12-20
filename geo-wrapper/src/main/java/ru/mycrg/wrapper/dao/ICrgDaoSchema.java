package ru.mycrg.wrapper.dao;

import ru.mycrg.wrapper.exceptions.DaoException;

public interface ICrgDaoSchema {

    void create(String dbName, String schemaName) throws DaoException;

    void delete(String dbName, String schemaName) throws DaoException;
}
