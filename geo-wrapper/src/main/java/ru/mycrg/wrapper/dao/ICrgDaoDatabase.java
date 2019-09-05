package ru.mycrg.wrapper.dao;

import ru.mycrg.wrapper.exceptions.CrgDaoException;

public interface ICrgDaoDatabase {

    void createDb(final String dbName) throws CrgDaoException;
}
