package ru.mycrg.wrapper.dao;

import ru.mycrg.wrapper.exceptions.DaoException;

public interface ICrgDaoDatabase {

    void createDb(final String dbName) throws DaoException;
}
