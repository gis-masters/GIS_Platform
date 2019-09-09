package ru.mycrg.wrapper.dao;

import ru.mycrg.wrapper.exceptions.CrgDaoException;

public interface ICrgDaoSchema {

    void create(String dbName, String schemaName) throws CrgDaoException;

    void delete(String dbName, String schemaName) throws CrgDaoException;
}
