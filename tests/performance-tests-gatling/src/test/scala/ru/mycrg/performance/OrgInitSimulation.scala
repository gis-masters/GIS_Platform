package ru.mycrg.performance

import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import ru.mycrg.performance.BaseSimulation.httpProtocol

import scala.concurrent.duration._
import scala.language.postfixOps

class OrgInitSimulation extends Simulation {

  // Сценарий: создание организации
  val initOrgScenario: ScenarioBuilder = scenario("Create Organization")
    .exec(session => {
      val email = TestDataGenerator.randomEmail("orgOwner", "any")
      session.set("ownerEmail", email)
    })
    .exec(
      http("Create organization")
        .post("/organizations/init")
        .body(StringBody(session => {
          val email = session("ownerEmail").as[String]

          s"""{
            |  "name": "АО Геоинформационные системы",
            |  "phone": "79780562493",
            |  "specializationId": 1,
            |  "owner": {
            |    "name": "Денис",
            |    "surname": "Денисович",
            |    "email": "$email",
            |    "password": "testPassword1"
            |  }
            |}""".stripMargin
        }))
        .check(status.is(202))
        .check(bodyString.saveAs("organizationId"))
    )
//    .pause(1)
//    .exec(
//      http("Login as owner")
//        .post("/oauth/token")
//        .queryParam("grant_type", "password")
//        .queryParam("username", "${ownerEmail}")
//        .queryParam("password", "testPassword1")
//        .check(status.saveAs("oauthResponseCode"))
//        .check(bodyString.saveAs("accessToken"))
//    )

  // Настройка нагрузки для теста создания организации
  setUp(
    initOrgScenario.inject(
      rampUsers(5).during(5.seconds)
//      constantUsersPerSec(100).during(30.seconds)
    )
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.max.lt(1000), // Максимальное время ответа < 5 секунд
      global.responseTime.mean.lt(500), // Среднее время ответа < 2 секунды
      global.successfulRequests.percent.gt(99) // Успешных запросов > 99%
    )
}
