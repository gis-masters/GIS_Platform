package ru.mycrg.performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

/**
 * Базовая конфигурация для всех нагрузочных тестов содержит общие настройки URL для разных сервисов
 */
object BaseSimulation {

  // Настройки URL для разных окружений через переменные окружения
  val baseUrl: String = sys.env.getOrElse("GATLING_BASE_URL", "http://localhost:8100")

  // Базовый HTTP протокол
  val httpProtocol: HttpProtocolBuilder = http
    .baseUrls(baseUrl)
    .header("Accept", "application/json")
    .header("Content-Type", "application/json")
    .header("User-Agent", "Gatling Performance Test")
}
