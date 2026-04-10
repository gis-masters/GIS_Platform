package ru.mycrg.performance

import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import ru.mycrg.performance.BaseSimulation.httpProtocol

import scala.concurrent.duration._
import scala.language.postfixOps

/**
 * Нагрузочный тест для Auth Service API
 * Тестирует операции авторизации и работы с пользователями
 */
class AuthServiceSimulation extends Simulation {

  // Сценарий: авторизация пользователя
  val loginScenario: ScenarioBuilder = scenario("User Login")
    .exec(
      http("Login as owner")
        .post("/oauth/token")
        .queryParam("grant_type", "password")
        .queryParam("username", "orgOwner@any.ru")
        .queryParam("password", "testPassword1")
        .check(status.saveAs("oauthResponseCode"))
        .check(bodyString.saveAs("accessToken"))
    )
    .pause(1)
    .exec(
      http("Get user current info")
        .get("/users/current")
        .header("Authorization", "Bearer ${accessToken}")
        .check(status.saveAs("currentUserResponseCode"))
    )

  // Настройка нагрузки для теста авторизации
  setUp(
    loginScenario.inject(
      rampUsers(10).during(2.seconds), // 10 пользователей, в диапазоне 2 секунд, отправят по одному запросу
      constantUsersPerSec(50).during(60.seconds) // Постоянная нагрузка: 50 запросов/сек
    )
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.max.lt(1000), // Максимальное время ответа < 1 секунд
      global.responseTime.mean.lt(500), // Среднее время ответа < 0.5 секунды
      global.successfulRequests.percent.gt(99) // Успешных запросов > 99%
    )
}
