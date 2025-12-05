package ru.mycrg.performance

import scala.util.Random

/**
 * Утилитный класс для генерации случайных тестовых данных
 */
object TestDataGenerator {

  private val random = new Random()

  /**
   * Генерирует случайный email адрес
   * @param prefix префикс для email (по умолчанию "test")
   * @param domainPrefix префикс домена (по умолчанию "test")
   * @param domainSuffix суффикс домена (по умолчанию ".ru")
   * @return случайный email вида test@test{случайное_число}.ru
   */
  def randomEmail(prefix: String = "test", domainPrefix: String = "test", domainSuffix: String = ".ru"): String = {
    val randomId = random.nextInt(1_000_000)
    s"${prefix}@${domainPrefix}${randomId}${domainSuffix}"
  }

  /**
   * Генерирует случайное целое число в заданном диапазоне
   * @param min минимальное значение (включительно)
   * @param max максимальное значение (включительно)
   * @return случайное число
   */
  def randomInt(min: Int = 0, max: Int = Int.MaxValue): Int = {
    if (min >= max) min
    else random.nextInt(max - min + 1) + min
  }

  /**
   * Генерирует случайную строку заданной длины
   * @param length длина строки
   * @param chars набор символов для генерации (по умолчанию буквы и цифры)
   * @return случайная строка
   */
  def randomString(length: Int, chars: String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"): String = {
    (1 to length).map(_ => chars(random.nextInt(chars.length))).mkString
  }

  /**
   * Генерирует случайный телефонный номер
   * @return телефонный номер вида 7XXXXXXXXXX
   */
  def randomPhone: String = {
    val randomDigits = (1 to 10).map(_ => random.nextInt(10)).mkString
    s"7$randomDigits"
  }
}

