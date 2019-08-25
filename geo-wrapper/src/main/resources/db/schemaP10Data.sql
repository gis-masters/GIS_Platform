-- PostgreSQL version 11.1 (Debian 11.1-3.pgdg90+1)
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
INSERT INTO schema_fgistp_10.ab_stype (objectid, code, description) VALUES (1, 1, 'Государственный орган законодательной, исполнительной власти Российской Федерации, его территориальный орган');
INSERT INTO schema_fgistp_10.ab_stype (objectid, code, description) VALUES (2, 2, 'Государственный орган законодательной, исполнительной власти субъекта Российской Федерации');
INSERT INTO schema_fgistp_10.ab_stype (objectid, code, description) VALUES (3, 3, 'Орган местного самоуправления муниципального района, городского округа, поселения, городского округа с внутригородским делением, внутригородского района, внутригородской территории (внутригородского муниципального образования)');
INSERT INTO schema_fgistp_10.ab_stype (objectid, code, description) VALUES (4, 4, 'Суды и прокуратура');
INSERT INTO schema_fgistp_10.ab_stype (objectid, code, description) VALUES (5, 5, 'Полиция');

INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (1, 1, 'Первая подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (2, 2, 'Вторая подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (3, 3, 'Третья подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (4, 4, 'Четвертая подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (5, 5, 'Пятая подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (6, 6, 'Шестая подзона');
INSERT INTO schema_fgistp_10.aeroszone (objectid, code, description) VALUES (7, 7, 'Седьмая подзона');

INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (1, 1, 'Стадион с трибунами на 1500 мест и более');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (2, 2, 'Плоскостное спортивное сооружение (в том числе спортивные (игровые) площадки; спортивные поля, включая футбольные поля)');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (3, 3, 'Спортивный зал, комплекс спортивных залов в составе многофункционального спортивного комплекса, не имеющего плавательных бассейнов и ледовых площадок');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (4, 4, 'Крытый спортивный объект с искусственным льдом, ледовая арена');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (5, 5, 'Манеж (в том числе легкоатлетический, футбольный)');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (6, 6, 'Велотрек, велодром');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (7, 7, 'Плавательный бассейн (крытые и открытые общего пользования)');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (8, 8, 'Лыжная база, лыжный комплекс');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (9, 9, 'Биатлонный комплекс, биатлонно-лыжный комплекс');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (10, 10, 'Сооружение для стрелковых видов спорта (в том числе тир, стрельбище, стенд)');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (11, 11, 'Гребная база, гребной канал, канал для гребного слалома');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (12, 12, 'Автодром');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (13, 13, 'Арена');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (14, 14, 'Дистанция спортивная');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (15, 15, 'Комплекс горнолыжный');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (16, 16, 'Комплекс конноспортивный');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (17, 17, 'Комплекс трамплинов для прыжков');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (18, 18, 'Конькобежный овал');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (19, 19, 'Площадка для экстремальных видов спорта');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (20, 20, 'Сноуборд парк – фристайл центр');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (21, 21, 'Санно-бобслейная трасса');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (22, 22, 'Спортивная трасса');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (23, 23, 'Центр боулинга');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (24, 24, 'Парусный центр (яхт-клуб)');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (25, 25, 'Шахматно-шашечный центр ');
INSERT INTO schema_fgistp_10.af_type (objectid, code, description) VALUES (26, 26, 'Иное спортивное сооружение');

INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (1, 1, 'Центр (комплекс) конного туризма');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (2, 2, 'Лодочная станция');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (3, 3, 'Аквапарк');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (4, 4, 'Дом рыбака и охотника (база, комплекс и другое)');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (5, 5, 'Визит-центр особо охраняемой природной территории');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (6, 6, 'Танцевальные залы');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (7, 7, 'Аттракционы и иные подобные объекты');
INSERT INTO schema_fgistp_10.al_stype (objectid, code, description) VALUES (8, 8, 'Иной объект');

INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (1, 1, 'Медико-санитарная часть');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (2, 2, 'Диспансер');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (3, 3, 'Амбулатория, в том числе врачебная');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (4, 4, 'Поликлиника');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (5, 5, 'Женская консультация');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (6, 6, 'Молочная кухня');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (7, 7, 'Центр (в том числе детский), специализированный центр (кроме отнесенных к медицинским организациям особого типа)');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (8, 8, 'Станция переливания крови');
INSERT INTO schema_fgistp_10.amb_type (objectid, code, description) VALUES (9, 9, 'Центр крови');

INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (1, 1, 'Памятники градостроительства и архитектуры');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (2, 2, 'Памятники истории');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (3, 3, 'Памятники монументального искусства');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (4, 4, 'Объект археологического наследия (памятник археологии)');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (5, 5, 'Памятники градостроительства и архитектуры, истории');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (6, 6, 'Памятники градостроительства и архитектуры, монументального искусства');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (7, 7, 'Памятники градостроительства и архитектуры, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (8, 8, 'Памятники истории, монументального искусства');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (9, 9, 'Памятники истории, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (10, 10, 'Памятники монументального искусства, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (11, 11, 'Памятники градостроительства и архитектуры, истории, монументального искусства');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (12, 12, 'Памятники градостроительства и архитектуры, истории, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (13, 13, 'Памятники градостроительства и архитектуры, монументального искусства, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (14, 14, 'Памятники истории, монументального искусства, археологии');
INSERT INTO schema_fgistp_10.ans_type (objectid, code, description) VALUES (15, 15, 'Памятники градостроительства и архитектуры, истории, монументального искусства, археологии');

INSERT INTO schema_fgistp_10.aq_stype (objectid, code, description) VALUES (1, 1, 'Пляж I категории');
INSERT INTO schema_fgistp_10.aq_stype (objectid, code, description) VALUES (2, 2, 'Пляж II категории');
INSERT INTO schema_fgistp_10.aq_stype (objectid, code, description) VALUES (3, 3, 'Пляж III категории');
INSERT INTO schema_fgistp_10.aq_stype (objectid, code, description) VALUES (4, 4, 'Оборудованное место массовой околоводной рекреации');

INSERT INTO schema_fgistp_10.avia_type (objectid, code, description) VALUES (1, 1, 'Гражданская авиация');
INSERT INTO schema_fgistp_10.avia_type (objectid, code, description) VALUES (2, 2, 'Государственная авиация');
INSERT INTO schema_fgistp_10.avia_type (objectid, code, description) VALUES (3, 3, 'Экспериментальная авиация');
INSERT INTO schema_fgistp_10.avia_type (objectid, code, description) VALUES (4, 4, 'Совместное базирование');

INSERT INTO schema_fgistp_10.bent_type (objectid, code, description) VALUES (1, 1, 'Коммерческое предприятие (организация), не относящееся к субъектам малого и среднего предпринимательства');
INSERT INTO schema_fgistp_10.bent_type (objectid, code, description) VALUES (2, 2, 'Среднее предприятие');
INSERT INTO schema_fgistp_10.bent_type (objectid, code, description) VALUES (3, 3, 'Малое предприятие (кроме микропредприятий)');
INSERT INTO schema_fgistp_10.bent_type (objectid, code, description) VALUES (4, 4, 'Микропредприятие');
INSERT INTO schema_fgistp_10.bent_type (objectid, code, description) VALUES (5, 5, 'Данные о типе предприятия (организации) отсутствуют');

INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (1, 1, 'Мост автодорожный');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (2, 2, 'Мост железнодорожный');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (3, 3, 'Мост пешеходный или велосипедный');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (4, 4, 'Мост для совмещенного движения транспортных средств');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (5, 5, 'Путепровод');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (6, 6, 'Эстакада');
INSERT INTO schema_fgistp_10.bridge_t (objectid, code, description) VALUES (7, 7, 'Виадук');

INSERT INTO schema_fgistp_10.bur_type (objectid, code, description) VALUES (1, 1, 'Скотомогильник с захоронением в яме');
INSERT INTO schema_fgistp_10.bur_type (objectid, code, description) VALUES (2, 2, 'Скотомогильник с биологическими камерами (Яма Беккари)');
INSERT INTO schema_fgistp_10.bur_type (objectid, code, description) VALUES (3, 3, 'Скотомогильник сибиреязвенный');
INSERT INTO schema_fgistp_10.bur_type (objectid, code, description) VALUES (4, 4, 'Объект утилизации биологических отходов');
INSERT INTO schema_fgistp_10.bur_type (objectid, code, description) VALUES (5, 5, 'Объект сжигания биологических отходов');

INSERT INTO schema_fgistp_10.cable_type (objectid, code, description) VALUES (1, 1, 'Медная кабельная линии связи');
INSERT INTO schema_fgistp_10.cable_type (objectid, code, description) VALUES (2, 2, 'Волоконно-оптическая линия связи');

INSERT INTO schema_fgistp_10.cat_distr (objectid, code, description) VALUES (1, 1, 'I-а (Высокое, св. 1,2 МПа)');
INSERT INTO schema_fgistp_10.cat_distr (objectid, code, description) VALUES (2, 2, 'I (Высокое, св. 0,6 до 1,2 МПа включительно (для СУГ до 1,6 МПа включительно))');
INSERT INTO schema_fgistp_10.cat_distr (objectid, code, description) VALUES (3, 3, 'II (Высокое, св. 0,3 до 0,6 МПа включительно)');
INSERT INTO schema_fgistp_10.cat_distr (objectid, code, description) VALUES (4, 4, 'III (Среднее, св. 0,1 до 0,3 МПа включительно)');
INSERT INTO schema_fgistp_10.cat_distr (objectid, code, description) VALUES (5, 5, 'IV (Низкое, до 0,1 МПа включительно)');

INSERT INTO schema_fgistp_10.cat_main (objectid, code, description) VALUES (1, 1, 'I (св. 2,5 до 10,0 МПа включ.)');
INSERT INTO schema_fgistp_10.cat_main (objectid, code, description) VALUES (2, 2, 'II (св. 1,2 до 2,5 МПа включ.)');

INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (1, 1, 'IА (Автомагистраль)');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (2, 2, 'IБ (Скоростная автомобильная дорога)');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (3, 3, 'IВ');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (4, 4, 'II');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (5, 5, 'III');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (6, 6, 'IV');
INSERT INTO schema_fgistp_10.cat_rdtype (objectid, code, description) VALUES (7, 7, 'V');

INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (1, 1, 'Высокоскоростные магистрали');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (2, 2, 'Скоростные магистрали');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (3, 3, 'Магистрали с преимущественно пассажирским движением');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (4, 4, 'Особогрузонапряженные магистрали');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (5, 5, 'I');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (6, 6, 'II');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (7, 7, 'III');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (8, 8, 'IV');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (9, 9, 'V');
INSERT INTO schema_fgistp_10.cat_rr (objectid, code, description) VALUES (10, 10, 'Внутристанционные соединительные и подъездные пути');

INSERT INTO schema_fgistp_10.cemet_stat (objectid, code, description) VALUES (1, 1, 'Действующее');
INSERT INTO schema_fgistp_10.cemet_stat (objectid, code, description) VALUES (2, 2, 'Закрытое');

INSERT INTO schema_fgistp_10.cemet_stype (objectid, code, description) VALUES (1, 1, 'Кладбища смешанного и традиционного захоронения площадью от 20 до 40 га');
INSERT INTO schema_fgistp_10.cemet_stype (objectid, code, description) VALUES (2, 2, 'Кладбища смешанного и традиционного захоронения площадью от 10 до 20 га');
INSERT INTO schema_fgistp_10.cemet_stype (objectid, code, description) VALUES (3, 3, 'Кладбища смешанного и традиционного захоронения площадью 10 и менее га');
INSERT INTO schema_fgistp_10.cemet_stype (objectid, code, description) VALUES (4, 4, 'Сельское кладбище');

INSERT INTO schema_fgistp_10.cemet_type (objectid, code, description) VALUES (1, 1, 'Общественное');
INSERT INTO schema_fgistp_10.cemet_type (objectid, code, description) VALUES (2, 2, 'Вероисповедальное');

INSERT INTO schema_fgistp_10.cemet_wtype (objectid, code, description) VALUES (1, 1, 'Федеральное военное мемориальное кладбище');
INSERT INTO schema_fgistp_10.cemet_wtype (objectid, code, description) VALUES (2, 2, 'Воинское кладбище');
INSERT INTO schema_fgistp_10.cemet_wtype (objectid, code, description) VALUES (3, 3, 'Военное мемориальное кладбище');

INSERT INTO schema_fgistp_10.cep_class (objectid, code, description) VALUES (1, 1, 'I класс защитных сооружений');
INSERT INTO schema_fgistp_10.cep_class (objectid, code, description) VALUES (2, 2, 'II класс защитных сооружений');
INSERT INTO schema_fgistp_10.cep_class (objectid, code, description) VALUES (3, 3, 'III класс защитных сооружений');
INSERT INTO schema_fgistp_10.cep_class (objectid, code, description) VALUES (4, 4, 'IV класс защитных сооружений');

INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (1, 1, 'Загородный оздоровительный лагерь');
INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (2, 2, 'Санаторно-оздоровительный лагерь');
INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (3, 3, 'Оздоровительный лагерь с дневным пребыванием');
INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (4, 4, 'Лагерь труда и отдыха');
INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (5, 5, 'Палаточный лагерь');
INSERT INTO schema_fgistp_10.chi_stype (objectid, code, description) VALUES (6, 6, 'Иной объект');

INSERT INTO schema_fgistp_10.clb_type (objectid, code, description) VALUES (1, 1, 'Дом (дворец, центр) культуры, культуры и досуга, культуры и искусств, его филиал');
INSERT INTO schema_fgistp_10.clb_type (objectid, code, description) VALUES (2, 2, 'Социально-культурный, культурно-досуговый комплекс');
INSERT INTO schema_fgistp_10.clb_type (objectid, code, description) VALUES (3, 3, 'Центр традиционной культуры, дом (центр) народного творчества, дом ремесел и фольклора, национально-культурный центр и их филиалы');
INSERT INTO schema_fgistp_10.clb_type (objectid, code, description) VALUES (4, 4, 'Клуб, в том числе клуб и (или) культурно-досуговый комплекс сельского поселения');
INSERT INTO schema_fgistp_10.clb_type (objectid, code, description) VALUES (5, 5, 'Иной объект культурно-досугового (клубного) типа');

INSERT INTO schema_fgistp_10.comm_type (objectid, code, description) VALUES (1, 1, 'Кабельная линия связи');
INSERT INTO schema_fgistp_10.comm_type (objectid, code, description) VALUES (2, 2, 'Радиорелейная линия связи ');
INSERT INTO schema_fgistp_10.comm_type (objectid, code, description) VALUES (3, 3, 'Спутниковая линия связи');
INSERT INTO schema_fgistp_10.comm_type (objectid, code, description) VALUES (4, 4, 'Комбинированная линия связи');
INSERT INTO schema_fgistp_10.comm_type (objectid, code, description) VALUES (5, 5, 'Тропосферная линия связи');

INSERT INTO schema_fgistp_10.comm_ctype (code, description) VALUES (1, 'Подземный');
INSERT INTO schema_fgistp_10.comm_ctype (code, description) VALUES (2, 'Подводный');
INSERT INTO schema_fgistp_10.comm_ctype (code, description) VALUES (3, 'Подвесной (на опорах)');
INSERT INTO schema_fgistp_10.comm_ctype (code, description) VALUES (4, 'Комбинированный');

INSERT INTO schema_fgistp_10.cr_stype (objectid, code, descroption) VALUES (1, 1, 'Дома и дворцы бракосочетаний, отделы записи актов гражданского состояния');
INSERT INTO schema_fgistp_10.cr_stype (objectid, code, descroption) VALUES (2, 2, 'Бюро похоронного обслуживания, дом траурных обрядов');
INSERT INTO schema_fgistp_10.cr_stype (objectid, code, descroption) VALUES (3, 3, 'Иной объект проведения гражданских обрядов');

INSERT INTO schema_fgistp_10.crossp_t (objectid, code, description) VALUES (1, 1, 'Надземные');
INSERT INTO schema_fgistp_10.crossp_t (objectid, code, description) VALUES (2, 2, 'Подземные');

INSERT INTO schema_fgistp_10.crossr_t (objectid, code, description) VALUES (1, 1, 'Регулируемый');
INSERT INTO schema_fgistp_10.crossr_t (objectid, code, description) VALUES (2, 2, 'Нерегулируемый');

INSERT INTO schema_fgistp_10.ctm_time_t (objectid, code, description) VALUES (1, 1, 'Постоянный');
INSERT INTO schema_fgistp_10.ctm_time_t (objectid, code, description) VALUES (2, 2, 'Временный');
INSERT INTO schema_fgistp_10.ctm_time_t (objectid, code, description) VALUES (3, 3, 'Сезонный');
INSERT INTO schema_fgistp_10.ctm_time_t (objectid, code, description) VALUES (4, 4, 'Работающий на нерегулярной основе');

INSERT INTO schema_fgistp_10.ctm_use_t (objectid, code, description) VALUES (1, 1, 'Многосторонний');
INSERT INTO schema_fgistp_10.ctm_use_t (objectid, code, description) VALUES (2, 2, 'Двусторонний');

INSERT INTO schema_fgistp_10.cu_type (objectid, code, descroption) VALUES (1, 1, 'Библиотека, ее филиал');
INSERT INTO schema_fgistp_10.cu_type (objectid, code, descroption) VALUES (2, 2, 'Музей, музей-филиал, территориально обособленный экспозиционный отдел музея');
INSERT INTO schema_fgistp_10.cu_type (objectid, code, descroption) VALUES (3, 3, 'Лекторий (в том числе планетарий) ');
INSERT INTO schema_fgistp_10.cu_type (objectid, code, descroption) VALUES (4, 4, 'Выставочный зал, галерея');
INSERT INTO schema_fgistp_10.cu_type (objectid, code, descroption) VALUES (5, 5, 'Иной объект культурно-просветительного назначения');

INSERT INTO schema_fgistp_10.current (objectid, code, description) VALUES (1, 1, 'Постоянный');
INSERT INTO schema_fgistp_10.current (objectid, code, description) VALUES (2, 2, 'Переменный');

INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (1, 1, 'Радиационно-опасный объект');
INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (2, 2, 'Химически опасный объект');
INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (3, 3, 'Гидродинамический опасный объект');
INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (4, 4, 'Взрывопожароопасный объект');
INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (5, 5, 'Биологически опасный объект');
INSERT INTO schema_fgistp_10.d_objects (objectid, code, description) VALUES (6, 6, 'Объект жизнеобеспечения');

INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (1, 1, 'Объект использования атомной энергии (в том числе ядерные установки, пункты хранения ядерных материалов и радиоактивных веществ, пункты хранения радиоактивных отходов)');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (2, 2, 'Гидротехнические сооружения первого и второго классов, устанавливаемые в соответствии с законодательством о безопасности гидротехнических сооружений');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (3, 3, 'Сооружения связи, являющиеся особо опасными, технически сложными в соответствии с законодательством Российской Федерации в области связи');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (4, 4, 'Линия электропередачи и иные объекты электросетевого хозяйства напряжением 330 киловольт и более');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (5, 5, 'Объект космической инфраструктуры');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (6, 6, 'Объект авиационной инфраструктуры');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (7, 7, 'Объекты инфраструктуры железнодорожного транспорта общего пользования');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (8, 8, 'Метрополитен');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (9, 9, 'Морской порт, за исключением объектов инфраструктуры морского порта, предназначенных для стоянок и обслуживания маломерных, спортивных парусных и прогулочных судов');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (10, 10, 'Тепловая электростанция мощностью 150 мегаватт и выше');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (11, 11, 'Подвесная канатная дорога');
INSERT INTO schema_fgistp_10.danger_obj (objectid, code, description) VALUES (12, 12, 'Опасный производственный объект, подлежащий регистрации в государственном реестре в соответствии с законодательством Российской Федерации о промышленной безопасности опасных производственных объектов');

INSERT INTO schema_fgistp_10.edu_sdtype (objectid, code, description) VALUES (1, 1, 'Профессиональная образовательная организация ');
INSERT INTO schema_fgistp_10.edu_sdtype (objectid, code, description) VALUES (2, 2, 'Организация дополнительного профессионального образования');
INSERT INTO schema_fgistp_10.edu_sdtype (objectid, code, description) VALUES (3, 3, 'Образовательная организация высшего образования');

INSERT INTO schema_fgistp_10.edu_stype (objectid, code, description) VALUES (1, 1, 'Начального общего образования');
INSERT INTO schema_fgistp_10.edu_stype (objectid, code, description) VALUES (2, 2, 'Начального общего и (или) основного общего образования');
INSERT INTO schema_fgistp_10.edu_stype (objectid, code, description) VALUES (3, 3, 'Начального общего, основного общего и среднего общего образования');
INSERT INTO schema_fgistp_10.edu_stype (objectid, code, description) VALUES (4, 4, 'Основного общего и среднего общего образования');
INSERT INTO schema_fgistp_10.edu_stype (objectid, code, description) VALUES (5, 5, 'Среднего общего образования');

INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (1, 1, 'Филиал, отделение, факультет');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (2, 2, 'Представительство ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (3, 3, 'Институт, центр, кафедра');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (4, 4, 'Подготовительное отделение, курсы ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (5, 5, 'Научно-исследовательское, методическое, учебно-методическое подразделение');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (6, 6, 'Лаборатория');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (7, 7, 'Конструкторское бюро ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (8, 8, 'Учебные, учебно-производственные мастерские ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (9, 9, 'Учебно-опытное хозяйство');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (10, 10, 'Учебный полигон ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (11, 11, 'Учебная база практики ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (12, 12, 'Учебно-демонстрационный центр ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (13, 13, 'Учебный театр, танцевальная, оперная студия, концертный зал ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (14, 14, 'Учебный цирковой манеж ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (15, 15, 'Художественно-творческая мастерская ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (16, 16, 'Библиотека');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (17, 17, 'Музей, выставочный зал ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (18, 18, 'Спортивный клуб');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (19, 19, 'Общежитие, интернат ');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (20, 20, 'Психологическая, социально-педагогическая служба, обеспечивающая социальную адаптацию и реабилитацию нуждающихся в ней обучающихся');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (21, 21, 'Иное структурное подразделение');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (22, 22, 'Учебный корпус');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (23, 23, 'Административный, учебно-административный корпус');
INSERT INTO schema_fgistp_10.edu_tunit (objectid, code, description) VALUES (24, 24, 'Здание или сооружение иного назначения');

INSERT INTO schema_fgistp_10.el_supply (objectid, code, description) VALUES (1, 1, 'Электрифицированная железная дорога');
INSERT INTO schema_fgistp_10.el_supply (objectid, code, description) VALUES (2, 2, 'Не электрифицированная железная дорога');

INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (1, 1, 'Локального характера');
INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (2, 2, 'Муниципального характера');
INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (3, 3, 'Межмуниципального характера');
INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (4, 4, 'Регионального характера');
INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (5, 5, 'Межрегионального характера');
INSERT INTO schema_fgistp_10.eme_class (objectid, code, description) VALUES (6, 6, 'Федерального характера');

INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (1, 1, 'Землетрясение');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (2, 2, 'Вулканическое извержение');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (3, 3, 'Оползень');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (4, 4, 'Обвал');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (5, 5, 'Сель');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (6, 6, 'Карст');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (7, 7, 'Просадка в лессовых грунтах');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (8, 8, 'Эрозия');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (9, 9, 'Переработка берегов');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (10, 10, 'Цунами');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (11, 11, 'Лавина');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (12, 12, 'Наводнение');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (13, 13, 'Половодье');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (14, 14, 'Паводок');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (15, 15, 'Подтопление');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (16, 16, 'Затор');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (17, 17, 'Штормовой нагон воды');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (18, 18, 'Сильный ветер');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (19, 19, 'Смерч');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (20, 20, 'Ураган');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (21, 21, 'Пыльная буря');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (22, 22, 'Суховей');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (23, 23, 'Сильные осадки');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (24, 24, 'Засуха');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (25, 25, 'Заморозки');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (26, 26, 'Туман');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (27, 27, 'Гроза');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (28, 28, 'Продолжительные дожди (ливни)');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (29, 29, 'Снегопад');
INSERT INTO schema_fgistp_10.eme_source (objectid, code, description) VALUES (30, 30, 'Град');

INSERT INTO schema_fgistp_10.ent_type (objectid, code, description) VALUES (1, 1, 'Театр');
INSERT INTO schema_fgistp_10.ent_type (objectid, code, description) VALUES (2, 2, 'Концертный зал, филармония, их филиал');
INSERT INTO schema_fgistp_10.ent_type (objectid, code, description) VALUES (3, 3, 'Цирк, цирковая организация, их филиал');
INSERT INTO schema_fgistp_10.ent_type (objectid, code, description) VALUES (4, 4, 'Кинотеатр (стационарный), объект кино- видеоцентра (иной подобной организации), предназначенный для показа и популяризации фильмов');
INSERT INTO schema_fgistp_10.ent_type (objectid, code, description) VALUES (5, 5, 'Иная зрелищная организация');

INSERT INTO schema_fgistp_10.feature_lep (objectid, code, description) VALUES (1, 1, 'ЛЭП, пересекающие границу Российской Федерации, проектный номинальный класс напряжения которых составляет 110 кВ и выше');
INSERT INTO schema_fgistp_10.feature_lep (objectid, code, description) VALUES (2, 2, 'ЛЭП и подстанции, проектный номинальный класс напряжения которых составляет 110 кВ и выше, обеспечивающие соединение и параллельную работу энергосистем различных субъектов РФ и необходимые для выдачи мощности новых электростанций');
INSERT INTO schema_fgistp_10.feature_lep (objectid, code, description) VALUES (3, 3, 'ЛЭП, проектный номинальный класс напряжения которых составляет 110 кВ и вывод из работы которых приводит к технологическим ограничениям перетока электрической энергии (мощности) по сетям более высокого класса напряжения');

INSERT INTO schema_fgistp_10.ferry_crgt (objectid, code, description) VALUES (1, 1, 'Автомобильный паром');
INSERT INTO schema_fgistp_10.ferry_crgt (objectid, code, description) VALUES (2, 2, 'Железнодорожный паром');

INSERT INTO schema_fgistp_10.ferry_mvt (objectid, code, description) VALUES (1, 1, 'Самоходный паром');
INSERT INTO schema_fgistp_10.ferry_mvt (objectid, code, description) VALUES (2, 2, 'Несамоходный паром');

INSERT INTO schema_fgistp_10.flooding_t (objectid, code, description) VALUES (1, 1, 'Не зарегулированные водотоки и естественные водоемы при половодьях и паводках однопроцентной обеспеченности');
INSERT INTO schema_fgistp_10.flooding_t (objectid, code, description) VALUES (2, 2, 'Устьевые участки водотоков при нагонных явлениях расчетной обеспеченности ');
INSERT INTO schema_fgistp_10.flooding_t (objectid, code, description) VALUES (3, 3, 'Водохранилища при уровнях воды, соответствующих форсированному подпорному уровню воды');
INSERT INTO schema_fgistp_10.flooding_t (objectid, code, description) VALUES (4, 4, 'Зарегулированные водотоки в нижних бьефах гидроузлов, при пропуске гидроузлами паводков расчетной обеспеченности');

INSERT INTO schema_fgistp_10.forest_cat (objectid, code, description) VALUES (1, 1, 'Лес, расположенный на особо охраняемой природной территории');
INSERT INTO schema_fgistp_10.forest_cat (objectid, code, description) VALUES (2, 2, 'Лес, расположенный в водоохранной зоне');
INSERT INTO schema_fgistp_10.forest_cat (objectid, code, description) VALUES (3, 3, 'Лес, выполняющий функции защиты природных и иных объектов');
INSERT INTO schema_fgistp_10.forest_cat (objectid, code, description) VALUES (4, 4, 'Ценный лес');

INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (1, 1, 'Берегозащитные, почвозащитные участки лесов, расположенных вдоль водных объектов, склонов оврагов');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (2, 2, 'Опушки лесов, граничащие с безлесными пространствами');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (3, 3, 'Лесосеменные плантации, постоянные лесосеменные участки и другие объекты лесного семеноводства');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (4, 4, 'Заповедные лесные участки');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (5, 5, 'Участки лесов с наличием реликтовых и эндемичных растений');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (6, 6, 'Места обитания редких и находящихся под угрозой исчезновения диких животных');
INSERT INTO schema_fgistp_10.forest_os (objectid, code, description) VALUES (7, 7, 'Другие особо защитные участки лесов');

INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (1, 1, 'Лес, расположенный в первом и втором поясах зон санитарной охраны источников питьевого и хозяйственно-бытового водоснабжения');
INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (2, 2, 'Лес, расположенный вдоль железнодорожных путей общего пользования, федеральных автомобильных дорог общего пользования, автомобильных дорог общего пользования, находящихся в собственности субъектов РФ');
INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (3, 3, 'Зеленая зона');
INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (4, 4, 'Лесопарковая зона');
INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (5, 5, 'Городской лес');
INSERT INTO schema_fgistp_10.forest_t (objectid, code, description) VALUES (6, 6, 'Лес, расположенный в первой, второй и третьей зонах округов санитарной (горно-санитарной) охраны лечебно-оздоровительных местностей и курортов');

INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (1, 1, 'Государственная защитная лесная полоса');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (2, 2, 'Противоэрозионный лес');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (3, 3, 'Лес, расположенный в пустынных, полупустынных, лесостепных, лесотундровых зонах, степях, горах');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (4, 4, 'Лес, имеющий научное или историческое значение');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (5, 5, 'Орехово-промысловая зона');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (6, 6, 'Лесные плодовые насаждения');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (7, 7, 'Ленточный бор');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (8, 8, 'Запретная полоса леса, расположенная вдоль водного объекта');
INSERT INTO schema_fgistp_10.forest_val (objectid, code, description) VALUES (9, 9, 'Нерестоохранная полоса леса');

INSERT INTO schema_fgistp_10.fp_class (objectid, code, description) VALUES (1, 1, 'I - пожарные депо на 6, 8, 10 и 12 автомобилей для охраны городских поселений');
INSERT INTO schema_fgistp_10.fp_class (objectid, code, description) VALUES (2, 2, 'II - пожарные депо на 2, 4 и 6 автомобилей для охраны городских поселений');
INSERT INTO schema_fgistp_10.fp_class (objectid, code, description) VALUES (3, 3, 'III - пожарные депо на 6, 8, 10 и 12 автомобилей для охраны организаций');
INSERT INTO schema_fgistp_10.fp_class (objectid, code, description) VALUES (4, 4, 'IV - пожарные депо на 2, 4 и 6 автомобилей для охраны организаций');
INSERT INTO schema_fgistp_10.fp_class (objectid, code, description) VALUES (5, 5, 'V - пожарные депо на 1, 2, 3 и 4 автомобиля для охраны сельских поселений');

INSERT INTO schema_fgistp_10.fp_type (objectid, code, description) VALUES (1, 1, 'Государственная противопожарная служба');
INSERT INTO schema_fgistp_10.fp_type (objectid, code, description) VALUES (2, 2, 'Муниципальная пожарная охрана ');
INSERT INTO schema_fgistp_10.fp_type (objectid, code, description) VALUES (3, 3, 'Ведомственная пожарная охрана');
INSERT INTO schema_fgistp_10.fp_type (objectid, code, description) VALUES (4, 4, 'Частная пожарная охрана');
INSERT INTO schema_fgistp_10.fp_type (objectid, code, description) VALUES (5, 5, 'Добровольная пожарная охрана');

INSERT INTO schema_fgistp_10.fs_objects (objectid, code, description) VALUES (1, 1, 'Пожарно-химическая станция (ПХС)');
INSERT INTO schema_fgistp_10.fs_objects (objectid, code, description) VALUES (2, 2, 'Вышка наблюдательная');
INSERT INTO schema_fgistp_10.fs_objects (objectid, code, description) VALUES (3, 3, 'Пост наблюдательный');
INSERT INTO schema_fgistp_10.fs_objects (objectid, code, description) VALUES (4, 4, 'Минерализованная полоса');

INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (1, 1, 'Уголовно-исполнительная инспекция ');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (2, 2, 'Исправительный центр');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (3, 3, 'Арестный дом');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (4, 4, 'Колония-поселение ');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (5, 5, 'Воспитательная колония ');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (6, 6, 'Лечебное исправительное учреждение ');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (7, 7, 'Исправительная колония общего, строгого или особого режима');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (8, 8, 'Тюрьма');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (9, 9, 'Следственный изолятор');
INSERT INTO schema_fgistp_10.fses_stype (objectid, code, description) VALUES (10, 10, 'Исправительная колония особого режима для осужденных, отбывающих пожизненное лишение свободы');

INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (1, 1, 'Природный газ');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (2, 2, 'Попутный нефтяной газ (ПНГ)');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (3, 3, 'Смесь природного газа и попутного нефтяного газа (ПНГ)');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (4, 4, 'Доменный газ');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (5, 5, 'Коксовый газ');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (6, 6, 'Уголь');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (7, 7, 'Мазут');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (8, 8, 'Дизельное топливо');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (9, 9, 'Древесина');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (10, 10, 'Торф');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (11, 11, 'Биотопливо');
INSERT INTO schema_fgistp_10.fuel_type (objectid, code, description) VALUES (12, 12, 'Иной вид топлива');

INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (1, 1, 'Зона объектов водоснабжения');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (2, 2, 'Зона объектов водоотведения');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (3, 3, 'Зона объектов теплоснабжения');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (4, 4, 'Зона объектов газоснабжения');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (5, 5, 'Зона объектов электроснабжения');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (6, 6, 'Зона объектов связи');
INSERT INTO schema_fgistp_10.fz_ingstp (objectid, code, description) VALUES (7, 7, 'Зона инженерной инфраструктуры иных видов');

INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (1, 1, 'Зона общегородского центра');
INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (2, 2, 'Зона делового, общественного и коммерческого назначения');
INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (3, 3, 'Зона объектов торговли');
INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (4, 4, 'Зона объектов общественного питания');
INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (5, 5, 'Зона объектов коммунально-бытового назначения');
INSERT INTO schema_fgistp_10.fz_mfstp (objectid, code, description) VALUES (6, 6, 'Зона обслуживания объектов, необходимых для осуществления производственной и предпринимательской деятельности');

INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (1, 1, 'Зона дошкольных образовательных организаций');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (2, 2, 'Зона общеобразовательных организаций');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (3, 3, 'Зона организаций дополнительного образования');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (4, 4, 'Зона объектов, реализующих программы профессионального и высшего образования');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (5, 5, 'Зона специальных учебно-воспитательных учреждений для обучающихся с девиантным (общественно опасным) поведением');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (6, 6, 'Зона научных организаций');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (7, 7, 'Зона объектов культуры и искусства');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (8, 8, 'Зона объектов здравоохранения');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (9, 9, 'Зона объектов социального назначения');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (10, 10, 'Зона объектов физической культуры и массового спорта');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (11, 11, 'Зона культовых зданий и сооружений');
INSERT INTO schema_fgistp_10.fz_odstp (objectid, code, description) VALUES (12, 12, 'Зона специализированной общественной застройки иных видов');

INSERT INTO schema_fgistp_10.fz_orecstp (objectid, code, description) VALUES (1, 1, 'Зона ботанических садов');
INSERT INTO schema_fgistp_10.fz_orecstp (objectid, code, description) VALUES (2, 2, 'Зона зоопарков');
INSERT INTO schema_fgistp_10.fz_orecstp (objectid, code, description) VALUES (3, 3, 'Зона лугопарков');
INSERT INTO schema_fgistp_10.fz_orecstp (objectid, code, description) VALUES (4, 4, 'Зона гидропарков');
INSERT INTO schema_fgistp_10.fz_orecstp (objectid, code, description) VALUES (5, 5, 'Зона тематических парков иных видов');

INSERT INTO schema_fgistp_10.fz_recstp (objectid, code, description) VALUES (1, 1, 'Зона детских оздоровительных учреждений');
INSERT INTO schema_fgistp_10.fz_recstp (objectid, code, description) VALUES (2, 2, 'Зона оздоровительно-спортивных лагерей');
INSERT INTO schema_fgistp_10.fz_recstp (objectid, code, description) VALUES (3, 3, 'Зона пляжей');
INSERT INTO schema_fgistp_10.fz_recstp (objectid, code, description) VALUES (4, 4, 'Зона иных объектов отдыха и туризма');

INSERT INTO schema_fgistp_10.fz_shstp (objectid, code, description) VALUES (1, 1, 'Зона для ведения личного подсобного хозяйства');
INSERT INTO schema_fgistp_10.fz_shstp (objectid, code, description) VALUES (2, 2, 'Зона для ведения крестьянского фермерского хозяйства');
INSERT INTO schema_fgistp_10.fz_shstp (objectid, code, description) VALUES (3, 3, 'Зона для целей аквакультуры (рыбоводства)');
INSERT INTO schema_fgistp_10.fz_shstp (objectid, code, description) VALUES (4, 4, 'Зона, предназначенная для научно-исследовательских, учебных и иных, связанных с сельскохозяйственным производством, целей');
INSERT INTO schema_fgistp_10.fz_shstp (objectid, code, description) VALUES (5, 5, 'Зона для создания защитных лесных насаждений');

INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (1, 1, 'Зона объектов автомобильного транспорта');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (2, 2, 'Зона объектов железнодорожного транспорта ');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (3, 3, 'Зона объектов воздушного транспорта ');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (4, 4, 'Зона объектов водного транспорта');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (5, 5, 'Зона объектов трубопроводного транспорта');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (6, 6, 'Зона транспортной инфраструктуры иных видов');
INSERT INTO schema_fgistp_10.fz_trstp (objectid, code, description) VALUES (7, 7, 'Зона улично-дорожной сети');

INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (1, 1, 'Автозаправочная станция (традиционная)');
INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (2, 2, 'Автомобильная газозаправочная станция');
INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (3, 3, 'Автомобильная газонаполнительная компрессорная станция');
INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (4, 4, 'Криогенная автозаправочная станция');
INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (5, 5, 'Многотопливная автозаправочная станция');
INSERT INTO schema_fgistp_10.gas_st_type (objectid, code, description) VALUES (6, 6, 'Станция для зарядки электротранспорта');

INSERT INTO schema_fgistp_10.ground_pos (objectid, code, description) VALUES (1, 1, 'Наземное');
INSERT INTO schema_fgistp_10.ground_pos (objectid, code, description) VALUES (2, 2, 'Надземное');
INSERT INTO schema_fgistp_10.ground_pos (objectid, code, description) VALUES (3, 3, 'Подземное ');

INSERT INTO schema_fgistp_10.gts_class (objectid, code, description) VALUES (1, 1, 'I класс');
INSERT INTO schema_fgistp_10.gts_class (objectid, code, description) VALUES (2, 2, 'II класс');
INSERT INTO schema_fgistp_10.gts_class (objectid, code, description) VALUES (3, 3, 'III класс');
INSERT INTO schema_fgistp_10.gts_class (objectid, code, description) VALUES (4, 4, 'IV класс');

INSERT INTO schema_fgistp_10.her_type (objectid, code, description) VALUES (1, 1, 'Памятники градостроительства и архитектуры');
INSERT INTO schema_fgistp_10.her_type (objectid, code, description) VALUES (2, 2, 'Памятники истории');
INSERT INTO schema_fgistp_10.her_type (objectid, code, description) VALUES (3, 3, 'Памятники монументального искусства');
INSERT INTO schema_fgistp_10.her_type (objectid, code, description) VALUES (4, 4, 'Объект археологического наследия (памятник археологии)');
INSERT INTO schema_fgistp_10.her_type (objectid, code, description) VALUES (5, 5, 'Иные виды памятников');

INSERT INTO schema_fgistp_10.hist_cat (objectid, code, description) VALUES (1, 1, 'Федеральное значение');
INSERT INTO schema_fgistp_10.hist_cat (objectid, code, description) VALUES (2, 2, 'Региональное значение');
INSERT INTO schema_fgistp_10.hist_cat (objectid, code, description) VALUES (3, 3, 'Местное значение');
INSERT INTO schema_fgistp_10.hist_cat (objectid, code, description) VALUES (4, 4, 'Без категории - выявленный объект культурного наследия');
INSERT INTO schema_fgistp_10.hist_cat (objectid, code, description) VALUES (5, 5, 'Без категории - объект, обладающий признаками объекта культурного наследия');

INSERT INTO schema_fgistp_10.hist_out (objectid, code, description) VALUES (1, 1, 'Особо ценный объект культурного наследия народов Российской Федерации ');
INSERT INTO schema_fgistp_10.hist_out (objectid, code, description) VALUES (2, 2, 'Объект всемирного наследия ЮНЕСКО ');

INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (1, 1, 'Туристская гостиница');
INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (2, 2, 'Коммунальная гостиница');
INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (3, 3, 'Мотель');
INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (4, 4, 'Пансионат');
INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (5, 5, 'Общежитие для приезжих, хостел');
INSERT INTO schema_fgistp_10.hot_stype (objectid, code, description) VALUES (6, 6, 'Иная организация гостиничного типа');

INSERT INTO schema_fgistp_10.hzrd_cat (objectid, code, description) VALUES (1, 1, 'I категория');
INSERT INTO schema_fgistp_10.hzrd_cat (objectid, code, description) VALUES (2, 2, 'II категория');
INSERT INTO schema_fgistp_10.hzrd_cat (objectid, code, description) VALUES (3, 3, 'III категория');
INSERT INTO schema_fgistp_10.hzrd_cat (objectid, code, description) VALUES (4, 4, 'IV категория');

INSERT INTO schema_fgistp_10.hzrd_class (objectid, code, description) VALUES (1, 1, 'I класс опасности объекта');
INSERT INTO schema_fgistp_10.hzrd_class (objectid, code, description) VALUES (2, 2, 'II класс опасности объекта');
INSERT INTO schema_fgistp_10.hzrd_class (objectid, code, description) VALUES (3, 3, 'III класс опасности объекта');
INSERT INTO schema_fgistp_10.hzrd_class (objectid, code, description) VALUES (4, 4, 'IV класс опасности объекта');
INSERT INTO schema_fgistp_10.hzrd_class (objectid, code, description) VALUES (5, 5, 'V класс опасности объекта');

INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (1, 1, 'Радиационная авария');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (2, 2, 'Химическая авария');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (3, 3, 'Биологическая авария');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (4, 4, 'Гидродинамическая авария');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (5, 5, 'Пожар, взрыв');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (6, 6, 'Авария электроэнергетической системы, системы связи');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (7, 7, 'Авария коммунальной системы жизнеобеспечения');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (8, 8, 'Транспортная авария');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (9, 9, 'Авария на магистральном трубопроводе');
INSERT INTO schema_fgistp_10.ind_type (objectid, code, description) VALUES (10, 10, 'Авария на подземном сооружении');

INSERT INTO schema_fgistp_10.int_trf_t (objectid, code, description) VALUES (1, 1, 'Пассажирский');
INSERT INTO schema_fgistp_10.int_trf_t (objectid, code, description) VALUES (2, 2, 'Грузовой');
INSERT INTO schema_fgistp_10.int_trf_t (objectid, code, description) VALUES (3, 3, 'Грузо-пассажирский');

INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (1, 1, 'Морские');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (2, 2, 'Речные (озерные)');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (3, 3, 'Воздушные');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (4, 4, 'Автомобильные');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (5, 5, 'Железнодорожные');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (6, 6, 'Пешеходные');
INSERT INTO schema_fgistp_10.int_trn_t (objectid, code, description) VALUES (7, 7, 'Смешанные');

INSERT INTO schema_fgistp_10.land_type (objectid, code, description) VALUES (1, 1, 'Для самолетов');
INSERT INTO schema_fgistp_10.land_type (objectid, code, description) VALUES (2, 2, 'Для вертолетов');
INSERT INTO schema_fgistp_10.land_type (objectid, code, description) VALUES (3, 3, 'Совмещенная');

INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (1, 1, 'Теплицы');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (2, 2, 'Парники ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (3, 3, 'Производство по обработке и протравлению семян');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (4, 4, 'Комплекс крупного рогатого скота');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (5, 5, 'Ферма крупного рогатого скота ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (6, 6, 'Свиноводческий комплекс ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (7, 7, 'Свиноферма ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (8, 8, 'Ферма овцеводческая');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (9, 9, 'Овчарня, кошара');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (10, 10, 'Коневодческие фермы');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (11, 11, 'Конюшни');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (12, 12, 'Птицефабрика');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (13, 13, 'Ферма птицеводческая ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (14, 14, 'Сараи с выгульным двором');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (15, 15, 'Корали');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (16, 16, 'Маральники');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (17, 17, 'Ферма звероводческая ');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (18, 18, 'Рыбоводный пруд');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (19, 19, 'Иной объект размещения животных');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (20, 20, 'Стационарная пасека');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (21, 21, 'Лесной питомник');
INSERT INTO schema_fgistp_10.main_type (objectid, code, description) VALUES (22, 22, 'Питомник декоративных и садовых растений');

INSERT INTO schema_fgistp_10.mc_type (objectid, code, description) VALUES (1, 1, 'Станция (подстанция) скорой медицинской помощи');
INSERT INTO schema_fgistp_10.mc_type (objectid, code, description) VALUES (2, 2, 'Выдвижной пункт скорой медицинской помощи');

INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (1, 1, 'Больница (в том числе детская)');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (2, 2, 'Больница скорой медицинской помощи');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (3, 3, 'Участковая больница');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (4, 4, 'Специализированная больница');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (5, 5, 'Родильный дом');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (6, 6, 'Госпиталь');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (7, 7, 'Медико-санитарная часть');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (8, 8, 'Дом (больница) сестринского ухода');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (9, 9, 'Хоспис');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (10, 10, 'Лепрозорий');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (11, 11, 'Диспансер');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (12, 12, 'Дом ребенка');
INSERT INTO schema_fgistp_10.md_stype (objectid, code, description) VALUES (13, 13, 'Центр (в том числе детский), специализированный центр (кроме отнесенных к медицинским организациям особого типа)');

INSERT INTO schema_fgistp_10.min_atype (objectid, code, description) VALUES (1, 1, 'Месторождение полезных ископаемых');
INSERT INTO schema_fgistp_10.min_atype (objectid, code, description) VALUES (2, 2, 'Проявление полезных ископаемых');

INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (1, 1, 'Черные металлы');
INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (2, 2, 'Цветные металлы');
INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (3, 3, 'Редкие металлы, рассеянные и редкоземельные элементы');
INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (4, 4, 'Благородные металлы');
INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (5, 5, 'Радиоактивные металлы');
INSERT INTO schema_fgistp_10.min_mtype (objectid, code, description) VALUES (6, 6, 'Комплексные объекты металлических полезных ископаемых');

INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (1, 1, 'Минеральные удобрения');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (2, 2, 'Оптические материалы');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (3, 3, 'Химическое сырье');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (4, 4, 'Керамическое и огнеупорное сырье');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (5, 5, 'Абразивные материалы');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (6, 6, 'Горнотехническое сырье');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (7, 7, 'Драгоценные камни, поделочное сырье');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (8, 8, 'Строительные материалы');
INSERT INTO schema_fgistp_10.min_ntype (objectid, code, description) VALUES (9, 9, 'Соли');

INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (1, 1, 'Угольная шахта');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (2, 2, 'Иной объект по добыче полезных ископаемых закрытым способом');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (3, 3, 'Угольный разрез');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (4, 4, 'Иной объект по добыче полезных ископаемых открытым способом');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (5, 5, 'Угольная обогатительная фабрика');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (6, 6, 'Иной объект по обогащению и первичной обработке извлеченных полезных ископаемых');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (7, 7, 'Коксовая батарея ');
INSERT INTO schema_fgistp_10.mp_type (objectid, code, description) VALUES (8, 8, 'Иное производственное подразделение');

INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (1, 1, 'Кабинет врача общей практики (семейного врача)');
INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (2, 2, 'Отделение (кабинет) медицинской профилактики');
INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (3, 3, 'Врачебная амбулатория');
INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (4, 4, 'Фельдшерско-акушерский пункт ');
INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (5, 5, 'Фельдшерский здравпункт ');
INSERT INTO schema_fgistp_10.msd_type (objectid, code, description) VALUES (6, 6, 'Центр (Отделение) общей врачебной практики (семейной медицины)');

INSERT INTO schema_fgistp_10.mst_type (objectid, code, description) VALUES (1, 1, 'Центр');
INSERT INTO schema_fgistp_10.mst_type (objectid, code, description) VALUES (2, 2, 'Бюро');
INSERT INTO schema_fgistp_10.mst_type (objectid, code, description) VALUES (3, 3, 'Лаборатория');
INSERT INTO schema_fgistp_10.mst_type (objectid, code, description) VALUES (4, 4, 'Медицинский отряд (в т. ч. специального назначения)');

INSERT INTO schema_fgistp_10.num_tracks (objectid, code, description) VALUES (1, 1, 'Однопутная железная дорога');
INSERT INTO schema_fgistp_10.num_tracks (objectid, code, description) VALUES (2, 2, 'Однопутная железная дорога с двухпутными вставками');
INSERT INTO schema_fgistp_10.num_tracks (objectid, code, description) VALUES (3, 3, 'Двухпутная железная дорога');
INSERT INTO schema_fgistp_10.num_tracks (objectid, code, description) VALUES (4, 4, 'Многопутная железная дорога ');

INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (1, 1, 'Музей, архив, библиотека');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (2, 2, 'Организация науки и образования');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (3, 3, 'Театрально-зрелищная организация');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (4, 4, 'Орган государственной власти или местного самоуправления');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (5, 5, 'Воинская часть');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (6, 6, 'Религиозная организация');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (7, 7, 'Организация здравоохранения');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (8, 8, 'Организация транспорта');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (9, 9, 'Производственная организация');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (10, 10, 'Организация торговли');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (11, 11, 'Организация общественного питания');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (12, 12, 'Гостиница, отель');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (13, 13, 'Офисные помещения');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (14, 14, 'Жилье');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (15, 15, 'Парки, сады');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (16, 16, 'Некрополи, захоронения');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (17, 17, 'Не используется');
INSERT INTO schema_fgistp_10.och_use (objectid, code, description) VALUES (18, 18, 'Иное');

INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (1, 1, 'Полигон захоронения твердых коммунальных отходов');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (2, 2, 'Полигон захоронения промышленных отходов');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (3, 3, 'Выработанная шахта, штольня, используемая для захоронения отходов');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (4, 4, 'Шламохранилище (кроме шламового амбара)');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (5, 5, 'Шламовый амбар');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (6, 6, 'Хвостохранилище');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (7, 7, 'Отвал горных пород, террикон');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (8, 8, 'Отработанный карьер, используемый для захоронения отходов');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (9, 9, 'Шлакозолоотвал ');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (10, 10, 'Навозохранилище');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (11, 11, 'Пометохранилище');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (12, 12, 'Открытая площадка с грунтовым покрытием');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (13, 13, 'Открытая площадка с водонепроницаемым покрытием');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (14, 14, 'Крытая площадка (под навесом) с грунтовым покрытием');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (15, 15, 'Крытая площадка (под навесом) с водонепроницаемым покрытием');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (16, 16, 'Производственное помещение (или его часть)');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (17, 98, 'Другой специально оборудованный объект хранения отходов');
INSERT INTO schema_fgistp_10.oro_stype (objectid, code, description) VALUES (18, 99, 'Другой специально оборудованный объект захоронения отходов');

INSERT INTO schema_fgistp_10.oro_type (objectid, code, description) VALUES (1, 1, 'Хранение отходов');
INSERT INTO schema_fgistp_10.oro_type (objectid, code, description) VALUES (2, 2, 'Захоронение отходов');

INSERT INTO schema_fgistp_10.ozsn_type (objectid, code, description) VALUES (1, 1, 'Питомники садово-паркового хозяйства, цветочно-оранжерейные хозяйства');
INSERT INTO schema_fgistp_10.ozsn_type (objectid, code, description) VALUES (2, 2, 'Озелененные территории санитарно-защитных, водоохранных, защитно-мелиоративных зон');
INSERT INTO schema_fgistp_10.ozsn_type (objectid, code, description) VALUES (3, 3, 'Насаждения вдоль автомобильных и железных дорог');
INSERT INTO schema_fgistp_10.ozsn_type (objectid, code, description) VALUES (4, 4, 'Иные озелененные территории специального назначения');

INSERT INTO schema_fgistp_10.pass_term (objectid, code, description) VALUES (1, 0, 'Отсутствует');
INSERT INTO schema_fgistp_10.pass_term (objectid, code, description) VALUES (2, 1, 'Присутствует');

INSERT INTO schema_fgistp_10.ped_type (objectid, code, description) VALUES (1, 1, 'Улица (проспект, переулок)');
INSERT INTO schema_fgistp_10.ped_type (objectid, code, description) VALUES (2, 2, 'Площадь');
INSERT INTO schema_fgistp_10.ped_type (objectid, code, description) VALUES (3, 3, 'Набережная');
INSERT INTO schema_fgistp_10.ped_type (objectid, code, description) VALUES (4, 4, 'Сеть улиц, площадей, набережных (пешеходный маршрут)');
INSERT INTO schema_fgistp_10.ped_type (objectid, code, description) VALUES (5, 5, 'Квартал (группа кварталов)');

INSERT INTO schema_fgistp_10.pkio_type (objectid, code, description) VALUES (1, 1, 'Городского значения');
INSERT INTO schema_fgistp_10.pkio_type (objectid, code, description) VALUES (2, 2, 'Районного значения');

INSERT INTO schema_fgistp_10.pl_type (objectid, code, descroption) VALUES (1, 1, 'Воздушная линия электропередачи');
INSERT INTO schema_fgistp_10.pl_type (objectid, code, descroption) VALUES (2, 2, 'Кабельная линия электропередачи');
INSERT INTO schema_fgistp_10.pl_type (objectid, code, descroption) VALUES (3, 3, 'Газоизолированная линия электропередачи');
INSERT INTO schema_fgistp_10.pl_type (objectid, code, descroption) VALUES (4, 4, 'Кабельно-воздушная линия электропередачи');

INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (1, 1, 'Надземный ');
INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (2, 2, 'Подземный');
INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (3, 3, 'Подземный в тоннеле, коллекторе');
INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (4, 4, 'Наземный');
INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (5, 5, 'Подводный');
INSERT INTO schema_fgistp_10.pline_type (objectid, code, description) VALUES (6, 6, 'Морской');

INSERT INTO schema_fgistp_10.power_type (objectid, code, descroption) VALUES (1, 1, 'Паросиловая (паротурбинная)');
INSERT INTO schema_fgistp_10.power_type (objectid, code, descroption) VALUES (2, 2, 'Газотурбинная');
INSERT INTO schema_fgistp_10.power_type (objectid, code, descroption) VALUES (3, 3, 'Парогазовая');
INSERT INTO schema_fgistp_10.power_type (objectid, code, descroption) VALUES (4, 4, 'Газопоршневая');

INSERT INTO schema_fgistp_10.prg_type (objectid, code, description) VALUES (1, 1, 'Реализующая программы дошкольного образования');
INSERT INTO schema_fgistp_10.prg_type (objectid, code, description) VALUES (2, 2, 'Реализующая программы профессионального обучения');
INSERT INTO schema_fgistp_10.prg_type (objectid, code, description) VALUES (3, 3, 'Реализующая программы дошкольного образования и программы профессионального обучения');

INSERT INTO schema_fgistp_10.prkng_lvl (objectid, code, description) VALUES (1, 1, 'Наземная');
INSERT INTO schema_fgistp_10.prkng_lvl (objectid, code, description) VALUES (2, 2, 'Заглубленная');
INSERT INTO schema_fgistp_10.prkng_lvl (objectid, code, description) VALUES (3, 3, 'Подземная');

INSERT INTO schema_fgistp_10.prkng_time (objectid, code, description) VALUES (1, 1, 'Постоянного хранения ');
INSERT INTO schema_fgistp_10.prkng_time (objectid, code, description) VALUES (2, 2, 'Временного хранения');

INSERT INTO schema_fgistp_10.prkng_type (objectid, code, description) VALUES (1, 1, 'Гараж / гараж-стоянка');
INSERT INTO schema_fgistp_10.prkng_type (objectid, code, description) VALUES (2, 2, 'Плоскостная стоянка автомобилей открытого хранения');
INSERT INTO schema_fgistp_10.prkng_type (objectid, code, description) VALUES (3, 3, 'Плоскостная стоянка автомобилей закрытого хранения');
INSERT INTO schema_fgistp_10.prkng_type (objectid, code, description) VALUES (4, 4, 'Плавучая стоянка автомобилей (дебаркадерная)');

INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (1, 1, 'Развитие нефтегазодобывающего комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (2, 2, 'Развитие нефтегазоперерабатывающего комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (3, 3, 'Развитие лесопромышленного комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (4, 4, 'Развитие горнорудного комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (5, 5, 'Развитие машиностроительного комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (6, 6, 'Развитие строительного комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (7, 7, 'Развитие транспортно-логистического комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (8, 8, 'Развитие агропромышленного комплекса');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (9, 9, 'Развитие рыбоперерабатывающей промышленности');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (10, 10, 'Развитие научно-инновационной деятельности');
INSERT INTO schema_fgistp_10.prom_direct (objectid, code, description) VALUES (11, 11, 'Развитие прочих направлений экономики');

INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (1, 1, 'до 0,5 километров');
INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (2, 2, 'от 0,5 до 1 километра');
INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (3, 3, 'от 1 до 2 километров');
INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (4, 4, 'от 2 до10 километров');
INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (5, 6, 'от 10 до 50 километров');
INSERT INTO schema_fgistp_10.proximity (objectid, code, description) VALUES (6, 7, 'более 50 километров');

INSERT INTO schema_fgistp_10.pu_stype (objectid, code, description) VALUES (1, 1, 'Объект непосредственного бытового обслуживания ');
INSERT INTO schema_fgistp_10.pu_stype (objectid, code, description) VALUES (2, 2, 'Объект коммунального обслуживания (прачечные, химчистки, бани)');
INSERT INTO schema_fgistp_10.pu_stype (objectid, code, description) VALUES (3, 3, 'Жилищно-эксплуатационная организация');
INSERT INTO schema_fgistp_10.pu_stype (objectid, code, description) VALUES (4, 4, 'Пункт приема вторичного сырья');
INSERT INTO schema_fgistp_10.pu_stype (objectid, code, description) VALUES (5, 5, 'Иной непроизводственный объект коммунально-бытового обслуживания и предоставления персональных услуг');

INSERT INTO schema_fgistp_10.r_affinity (objectid, code, description) VALUES (1, 1, 'Привлекательные ');
INSERT INTO schema_fgistp_10.r_affinity (objectid, code, description) VALUES (2, 2, 'Умеренно привлекательные');
INSERT INTO schema_fgistp_10.r_affinity (objectid, code, description) VALUES (3, 3, 'Со значительными ограничениями для освоения');

INSERT INTO schema_fgistp_10.rad_class (objectid, code, description) VALUES (1, 1, 'Умеренного');
INSERT INTO schema_fgistp_10.rad_class (objectid, code, description) VALUES (2, 2, 'Сильного');
INSERT INTO schema_fgistp_10.rad_class (objectid, code, description) VALUES (3, 3, 'Опасного');
INSERT INTO schema_fgistp_10.rad_class (objectid, code, description) VALUES (4, 4, 'Чрезвычайно-опасного');

INSERT INTO schema_fgistp_10.rdwin_cat (objectid, code, description) VALUES (1, 1, 'I - с перспективной (на 3 - 5 лет) грузонапряженностью свыше 100 тыс. т нетто в год или с расчетной интенсивностью движения, приведенной к автомобилю грузоподъемностью 5 т, свыше 500 авт./сут.');
INSERT INTO schema_fgistp_10.rdwin_cat (objectid, code, description) VALUES (2, 2, 'II - с перспективной грузонапряженностью от 50 до 100 тыс. т. нетто в год или с расчетной интенсивностью движения от 150 до 500 авт./сут.');
INSERT INTO schema_fgistp_10.rdwin_cat (objectid, code, description) VALUES (3, 3, 'III - с перспективной грузонапряженностью до 50 тыс. т. нетто в год или с расчетной интенсивностью движения до 150 авт./сут. ');

INSERT INTO schema_fgistp_10.rdwin_type (objectid, code, description) VALUES (1, 1, 'Сухопутный');
INSERT INTO schema_fgistp_10.rdwin_type (objectid, code, description) VALUES (2, 2, 'Ледовый');
INSERT INTO schema_fgistp_10.rdwin_type (objectid, code, description) VALUES (3, 3, 'Ледяная переправа');

INSERT INTO schema_fgistp_10.recyc_type (objectid, code, description) VALUES (1, 1, 'Объект обработки отходов');
INSERT INTO schema_fgistp_10.recyc_type (objectid, code, description) VALUES (2, 2, 'Объект утилизации отходов');
INSERT INTO schema_fgistp_10.recyc_type (objectid, code, description) VALUES (3, 3, 'Объекты обезвреживания отходов в форме сжигания');
INSERT INTO schema_fgistp_10.recyc_type (objectid, code, description) VALUES (4, 4, 'Объекты обезвреживания отходов (за исключением сжигания)');

INSERT INTO schema_fgistp_10.reg_rdtype (objectid, code, description) VALUES (1, 1, 'Автомобильная дорога регионального значения');
INSERT INTO schema_fgistp_10.reg_rdtype (objectid, code, description) VALUES (2, 2, 'Автомобильная дорога межмуниципального значения');

INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (1, 1, 'Федеральное значение');
INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (2, 2, 'Региональное значение');
INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (3, 3, 'Местное значение муниципального района');
INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (4, 4, 'Местное значение городского округа');
INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (5, 5, 'Местное значение поселения');
INSERT INTO schema_fgistp_10.reg_status (objectid, code, description) VALUES (6, 6, 'Иное значение');

INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (1, 1, 'Бальнеологическая лечебница');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (2, 2, 'Грязелечебница');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (3, 3, 'Курортная поликлиника');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (4, 4, 'Санаторий');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (5, 5, 'Санаторий для детей, в том числе для детей с родителями');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (6, 6, 'Санаторий-профилакторий');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (7, 7, 'Организации, осуществляющие лечение, оздоровление и (или) отдых, и осуществляющие образовательную деятельность');
INSERT INTO schema_fgistp_10.res_stype (objectid, code, description) VALUES (8, 8, 'Иной вид объекта');

INSERT INTO schema_fgistp_10.rfo_type (objectid, code, description) VALUES (1, 1, 'Путевой пост');
INSERT INTO schema_fgistp_10.rfo_type (objectid, code, description) VALUES (2, 2, 'Диспетчерский пункт ');
INSERT INTO schema_fgistp_10.rfo_type (objectid, code, description) VALUES (3, 3, 'Железнодорожный разъезд');
INSERT INTO schema_fgistp_10.rfo_type (objectid, code, description) VALUES (4, 4, 'Обгонный железнодорожный пункт');
INSERT INTO schema_fgistp_10.rfo_type (objectid, code, description) VALUES (5, 5, 'Железнодорожный блок-пост');

INSERT INTO schema_fgistp_10.risk_cat (objectid, code, description) VALUES (1, 1, 'Чрезвычайно опасный (катастрофический)');
INSERT INTO schema_fgistp_10.risk_cat (objectid, code, description) VALUES (2, 2, 'Весьма опасный');
INSERT INTO schema_fgistp_10.risk_cat (objectid, code, description) VALUES (3, 3, 'Опасный');
INSERT INTO schema_fgistp_10.risk_cat (objectid, code, description) VALUES (4, 4, 'Умеренно опасный');

INSERT INTO schema_fgistp_10.rs_stype (objectid, code, description) VALUES (1, 1, 'Многофункциональный центр предоставления государственных и муниципальных услуг');
INSERT INTO schema_fgistp_10.rs_stype (objectid, code, description) VALUES (2, 2, 'Отделение, филиал банка, кредитно-финансовой организации, страховой компании');
INSERT INTO schema_fgistp_10.rs_stype (objectid, code, description) VALUES (3, 3, 'Юридическая консультация, нотариальная контора');
INSERT INTO schema_fgistp_10.rs_stype (objectid, code, description) VALUES (4, 4, 'Центр занятости населения, биржа труда, бюро по трудоустройству');
INSERT INTO schema_fgistp_10.rs_stype (objectid, code, description) VALUES (5, 5, 'Иной непроизводственный объект по предоставлению населению правовых, финансовых, консультационных и иных подобных услуг');

INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (1, 1, 'Внеклассная');
INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (2, 2, 'I');
INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (3, 3, 'II');
INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (4, 4, 'III');
INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (5, 5, 'IV');
INSERT INTO schema_fgistp_10.rst_class (objectid, code, description) VALUES (6, 6, 'V');

INSERT INTO schema_fgistp_10.rst_type (objectid, code, description) VALUES (1, 1, 'Пассажирская');
INSERT INTO schema_fgistp_10.rst_type (objectid, code, description) VALUES (2, 2, 'Грузовая');
INSERT INTO schema_fgistp_10.rst_type (objectid, code, description) VALUES (3, 3, 'Техническая (сортировочная, участковая, предпортовая)');
INSERT INTO schema_fgistp_10.rst_type (objectid, code, description) VALUES (4, 4, 'Промежуточная');
INSERT INTO schema_fgistp_10.rst_type (objectid, code, description) VALUES (5, 5, 'Межгосударственная передаточная');

INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (1, 1, 'А');
INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (2, 2, 'Б');
INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (3, 3, 'В');
INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (4, 4, 'Г');
INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (5, 5, 'Д');
INSERT INTO schema_fgistp_10.rwy_class (objectid, code, description) VALUES (6, 6, 'Е');

INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (1, 1, 'Региональные автоматизированные системы централизованного оповещения ');
INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (2, 2, 'Муниципальные системы оповещения');
INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (3, 3, 'Комплексная система экстренного оповещения населения (КСЭОН)');
INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (4, 4, 'Общероссийская комплексная система информирования и оповещения населения (ОКСИОН)');
INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (5, 5, 'Система информирования и оповещения населения на транспорте (СИЗОНТ)');
INSERT INTO schema_fgistp_10.s_alert (objectid, code, description) VALUES (6, 6, 'Локальная система оповещения (ЛСО)');

INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (1, 1, 'Дом отдыха');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (2, 2, 'База отдыха');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (3, 3, 'Кемпинг');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (4, 4, 'Другая организация отдыха (кроме турбаз)');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (5, 5, 'Туристская база');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (6, 6, 'Наземный и водный транспорт, переоборудованный под средства размещения для ночлега, включая дебаркадеры');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (7, 7, 'Пансионат с лечением');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (8, 8, 'Курортный отель');
INSERT INTO schema_fgistp_10.saf_stype (objectid, code, description) VALUES (9, 9, 'Иной объект');

INSERT INTO schema_fgistp_10.sci_type (objectid, code, descroption) VALUES (1, 1, 'Государственный научный центр');
INSERT INTO schema_fgistp_10.sci_type (objectid, code, descroption) VALUES (2, 2, 'Научная организация, не являющаяся государственным научным центром и не осуществляющая образовательную деятельность');
INSERT INTO schema_fgistp_10.sci_type (objectid, code, descroption) VALUES (3, 3, 'Научная организация, осуществляющая образовательную деятельность по программам магистратуры, программам подготовки научно-педагогических кадров, программам ординатуры, программам профессионального обучения, дополнительным профессиональным программам');
INSERT INTO schema_fgistp_10.sci_type (objectid, code, descroption) VALUES (4, 4, 'Структурные подразделения (базы) научных организаций: опытное, опытно-экспериментальное, опытно-учебное, опытно-фармацевтическое производство, лаборатория');
INSERT INTO schema_fgistp_10.sci_type (objectid, code, descroption) VALUES (5, 5, 'Центры коллективного пользования научным оборудованием');

INSERT INTO schema_fgistp_10.season (objectid, code, description) VALUES (1, 1, 'Круглогодичный');
INSERT INTO schema_fgistp_10.season (objectid, code, description) VALUES (2, 2, 'более 6 месяцев');
INSERT INTO schema_fgistp_10.season (objectid, code, description) VALUES (3, 3, '4-6 месяцев');
INSERT INTO schema_fgistp_10.season (objectid, code, description) VALUES (4, 4, 'до 3 месяцев');

INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (1, 1, 'Технопарк');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (2, 2, 'Бизнес-инкубатор');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (3, 3, 'Логистический центр');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (4, 4, 'Индустриальный (промышленный) парк');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (5, 5, 'Склад замороженных или охлажденных грузов');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (6, 6, 'Склад зерна');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (7, 7, 'Иной объект, обеспечивающий хранение и складирование');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (8, 8, 'Проектные и конструкторские организации');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (9, 9, 'Административные здания различных предприятий, в том числе промышленных ');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (10, 10, 'Организация (лаборатория), осуществляющая различные технические испытания, исследования, анализ и сертификацию');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (11, 11, 'Объект, обеспечивающий удаление отходов, ликвидацию последствий загрязнений');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (12, 12, 'Объект вспомогательной деятельности в сфере сельского хозяйства');
INSERT INTO schema_fgistp_10.serv_stype (objectid, code, description) VALUES (13, 13, 'Иной объект, связанный с производственной деятельностью');

INSERT INTO schema_fgistp_10.settl_cat (objectid, code, description) VALUES (1, 1, 'Федеральное значение');
INSERT INTO schema_fgistp_10.settl_cat (objectid, code, description) VALUES (2, 2, 'Региональное значение');

INSERT INTO schema_fgistp_10.settl_level (objectid, code, description) VALUES (1, 1, 'Административный центр субъекта Российской Федерации');
INSERT INTO schema_fgistp_10.settl_level (objectid, code, description) VALUES (2, 2, 'Административный центр муниципального района ');
INSERT INTO schema_fgistp_10.settl_level (objectid, code, description) VALUES (3, 3, 'Административный центр городского округа');
INSERT INTO schema_fgistp_10.settl_level (objectid, code, description) VALUES (4, 4, 'Административный центр сельского поселения');
INSERT INTO schema_fgistp_10.settl_level (objectid, code, description) VALUES (5, 5, 'Населенный пункт, не имеющий статуса административного центра');

INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (1, 1, 'Город');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (2, 2, 'Поселок городского типа');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (3, 3, 'Рабочий поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (4, 4, 'Дачный поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (5, 5, 'Курортный поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (6, 6, 'Городской поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (7, 7, 'Лесной поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (8, 8, 'Населенный пункт');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (9, 9, 'Поселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (10, 10, 'Село');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (11, 11, 'Деревня');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (12, 12, 'Хутор');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (13, 13, 'Станция');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (14, 14, 'Железнодорожная станция');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (15, 15, 'Поселок при станции (поселок станции)');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (16, 16, 'Поселок при железнодорожной станции');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (17, 17, 'Железнодорожный разъезд');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (18, 18, 'Железнодорожная казарма');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (19, 19, 'Железнодорожная будка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (20, 20, 'Железнодорожный остановочный пункт');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (21, 21, 'Остановочная платформа');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (22, 22, 'Железнодорожный блокпост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (23, 23, 'Блокпост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (24, 24, 'Железнодорожная платформа');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (25, 25, 'Железнодорожный путевой пост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (26, 26, 'Дорожный разъезд');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (27, 27, 'Железнодорожная площадка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (28, 28, 'Остановочный пункт');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (29, 29, 'Железнодорожная водокачка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (30, 30, 'Разъезд');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (31, 31, 'Железнодорожный комбинат');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (32, 32, 'Железнодорожный пост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (33, 33, 'Монтёрский пункт');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (34, 34, 'Станица');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (35, 35, 'Слобода');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (36, 36, 'Местечко');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (37, 37, 'Починок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (38, 38, 'Участок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (39, 39, 'Выселок');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (40, 40, 'Дома');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (41, 41, 'Кордон');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (42, 42, 'Казарма');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (43, 43, 'Заимка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (44, 44, 'Лесничество');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (45, 45, 'Лесоучасток');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (46, 46, 'Маяк');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (47, 47, 'Остров');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (48, 48, 'Мыс');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (49, 49, 'Гидрологический пост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (50, 50, 'Метеостанция');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (51, 51, 'Аал');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (52, 52, 'Аул');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (53, 53, 'Улус');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (54, 54, 'Арбан');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (55, 55, 'Зимовка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (56, 56, 'Дом отдыха');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (57, 57, 'Турбаза');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (58, 58, 'База отдыха');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (59, 59, 'Санаторий');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (60, 60, 'Усадьба');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (61, 61, 'Центральная усадьба');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (62, 62, 'Отдельный дом');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (63, 63, 'Площадка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (64, 64, 'Погост');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (65, 65, 'Подстанция');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (66, 66, 'Карьер');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (67, 67, 'Аэропорт');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (68, 68, 'Будка');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (69, 69, 'Контрольный пункт связи');
INSERT INTO schema_fgistp_10.settl_type (objectid, code, descroption) VALUES (70, 70, 'Данных о типе населенного пункта нет');

INSERT INTO schema_fgistp_10.snow_type (objectid, code, description) VALUES (1, 1, 'Снегоплавильный пункт');
INSERT INTO schema_fgistp_10.snow_type (objectid, code, description) VALUES (2, 2, 'Снегоприемный пункт');

INSERT INTO schema_fgistp_10.soc_direct (objectid, code, description) VALUES (1, 1, 'Развитие отдыха и туризма ');
INSERT INTO schema_fgistp_10.soc_direct (objectid, code, description) VALUES (2, 2, 'Развитие физической культуры и спорта');
INSERT INTO schema_fgistp_10.soc_direct (objectid, code, description) VALUES (3, 3, 'Развитие здравоохранения');
INSERT INTO schema_fgistp_10.soc_direct (objectid, code, description) VALUES (4, 4, 'Развитие санаторно-курортного комплекса');

INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (1, 1, 'Комплексный центр по оказанию помощи лицам без определенного места жительства и занятий');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (2, 2, 'Комплексный центр социального обслуживания населения');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (3, 3, 'Кризисный центр помощи женщинам');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (4, 4, 'Реабилитационный (Социально-реабилитационный) центр для детей и подростков с ограниченными (умственными и физическими) возможностями ');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (5, 5, 'Социально-оздоровительный центр');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (6, 6, 'Социально-реабилитационный центр для несовершеннолетних');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (7, 7, 'Территориальный центр социальной помощи семье и детям');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (8, 8, 'Организация, оказывающая социальную помощь лицам без определенного места жительства и занятий');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (9, 9, 'Центр социального обслуживания граждан пожилого возраста и инвалидов');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (10, 10, 'Центр социальной адаптации несовершеннолетних и молодежи');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (11, 11, 'Центр психолого-педагогической помощи');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (12, 12, 'Центр дневного пребывания граждан пожилого возраста и инвалидов');
INSERT INTO schema_fgistp_10.sp_stype (objectid, code, description) VALUES (13, 13, 'Центр социальной помощи семье и детям');

INSERT INTO schema_fgistp_10.specific (objectid, code, description) VALUES (1, 1, 'Памятник ');
INSERT INTO schema_fgistp_10.specific (objectid, code, description) VALUES (2, 2, 'Ансамбль ');
INSERT INTO schema_fgistp_10.specific (objectid, code, description) VALUES (3, 3, 'Достопримечательное место');

INSERT INTO schema_fgistp_10.spz_event (objectid, code, description) VALUES (1, 1, 'Сохраняемая');
INSERT INTO schema_fgistp_10.spz_event (objectid, code, description) VALUES (2, 2, 'Ликвидируемая (при выносе объекта)');
INSERT INTO schema_fgistp_10.spz_event (objectid, code, description) VALUES (3, 3, 'Требующая изменения границы');

INSERT INTO schema_fgistp_10.ssah_stype (objectid, code, description) VALUES (1, 1, 'Центр социального обслуживания на дому граждан пожилого возраста и инвалидов');
INSERT INTO schema_fgistp_10.ssah_stype (objectid, code, description) VALUES (2, 2, 'Специализированный центр социально-медицинского обслуживания на дому граждан пожилого возраста и инвалидов');

INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (1, 1, 'Геронтологический центр');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (2, 2, 'Геронтопсихиатрический центр');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (3, 3, 'Детский дом-интернат для детей с физическими недостатками');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (4, 4, 'Детский дом-интернат для умственно отсталых детей');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (5, 5, 'Дом-интернат для ветеранов войны и труда');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (6, 6, 'Дом-интернат для престарелых и инвалидов');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (7, 7, 'Дом-интернат милосердия для престарелых и инвалидов');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (8, 8, 'Психоневрологический интернат');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (9, 9, 'Социальная гостиница');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (10, 10, 'Социальный приют для детей');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (11, 11, 'Специальный дом-интернат');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (12, 12, 'Специальный дом для одиноких престарелых');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (13, 13, 'Центр временного проживания граждан пожилого возраста и инвалидов');
INSERT INTO schema_fgistp_10.st_stype (objectid, code, description) VALUES (14, 14, 'Центр помощи детям, оставшимся без попечения родителей');

INSERT INTO schema_fgistp_10.status (objectid, code, description) VALUES (1, 1, 'Существующий, реконструируемый, строящийся');
INSERT INTO schema_fgistp_10.status (objectid, code, description) VALUES (2, 2, 'Планируемый к размещению');
INSERT INTO schema_fgistp_10.status (objectid, code, description) VALUES (3, 3, 'Планируемый к реконструкции');
INSERT INTO schema_fgistp_10.status (objectid, code, description) VALUES (4, 4, 'Планируемый к ликвидации');

INSERT INTO schema_fgistp_10.status_adm (objectid, code, description) VALUES (1, 1, 'Существующий');
INSERT INTO schema_fgistp_10.status_adm (objectid, code, description) VALUES (2, 2, 'Планируемый');

INSERT INTO schema_fgistp_10.status_och (objectid, code, description) VALUES (1, 1, 'Сохранившийся');
INSERT INTO schema_fgistp_10.status_och (objectid, code, description) VALUES (2, 2, 'Утраченный');
INSERT INTO schema_fgistp_10.status_och (objectid, code, description) VALUES (3, 3, 'Частично сохранившийся');

INSERT INTO schema_fgistp_10.status_pr (objectid, code, description) VALUES (1, 1, 'Существующий');
INSERT INTO schema_fgistp_10.status_pr (objectid, code, description) VALUES (2, 2, 'Планируемый ');

INSERT INTO schema_fgistp_10.stop_type (objectid, code, description) VALUES (1, 1, 'Трамвая');
INSERT INTO schema_fgistp_10.stop_type (objectid, code, description) VALUES (2, 2, 'Скоростного трамвая');
INSERT INTO schema_fgistp_10.stop_type (objectid, code, description) VALUES (3, 3, 'Троллейбуса');
INSERT INTO schema_fgistp_10.stop_type (objectid, code, description) VALUES (4, 4, 'Автобуса');
INSERT INTO schema_fgistp_10.stop_type (objectid, code, description) VALUES (5, 5, 'Совмещенный');

INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (1, 1, 'Здания и сооружения по хранению и переработке зерна');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (2, 2, 'Объекты хранения, товарной обработки и переработки фруктов, овощей, картофеля');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (3, 3, 'Иные объекты хранения, товарной обработки и переработки продукции');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (4, 4, 'Цех по приготовлению кормов');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (5, 5, 'Убойный пункт (цех)');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (6, 6, 'Гараж, парк по ремонту, обслуживанию и хранению грузовых автомобилей и иной техники');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (7, 7, 'Материальный склад');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (8, 8, 'Склад горюче-смазочных материалов');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (9, 9, 'Склад для хранения ядохимикатов и минеральных удобрений');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (10, 10, 'Склад сжиженного аммиака');
INSERT INTO schema_fgistp_10.store_type (objectid, code, description) VALUES (11, 11, 'Склад сухих минеральных удобрений и химических средств защиты растений ');

INSERT INTO schema_fgistp_10.str_l_type (objectid, code, description) VALUES (1, 1, 'Улицы в жилой застройке');
INSERT INTO schema_fgistp_10.str_l_type (objectid, code, description) VALUES (2, 2, 'Улицы и дороги научно-производственных, промышленных и коммунально-складских районов');
INSERT INTO schema_fgistp_10.str_l_type (objectid, code, description) VALUES (3, 3, 'Пешеходные улицы и дороги');
INSERT INTO schema_fgistp_10.str_l_type (objectid, code, description) VALUES (4, 4, 'Парковые дороги');
INSERT INTO schema_fgistp_10.str_l_type (objectid, code, description) VALUES (5, 5, 'Проезды');

INSERT INTO schema_fgistp_10.str_r_type (objectid, code, description) VALUES (1, 1, 'Транспортно-пешеходные');
INSERT INTO schema_fgistp_10.str_r_type (objectid, code, description) VALUES (2, 2, 'Пешеходно-транспортные');

INSERT INTO schema_fgistp_10.str_type (objectid, code, descroption) VALUES (1, 1, 'Основная');
INSERT INTO schema_fgistp_10.str_type (objectid, code, descroption) VALUES (2, 2, 'Второстепенная (переулок)');
INSERT INTO schema_fgistp_10.str_type (objectid, code, descroption) VALUES (3, 3, 'Проезд');

INSERT INTO schema_fgistp_10.su_type (objectid, code, description) VALUES (1, 1, 'Центр гигиены и эпидемиологии');
INSERT INTO schema_fgistp_10.su_type (objectid, code, description) VALUES (2, 2, 'Противочумный центр (станция)');
INSERT INTO schema_fgistp_10.su_type (objectid, code, description) VALUES (3, 3, 'Дезинфекционный центр (станция)');
INSERT INTO schema_fgistp_10.su_type (objectid, code, description) VALUES (4, 4, 'Центр гигиенического образования населения');
INSERT INTO schema_fgistp_10.su_type (objectid, code, description) VALUES (5, 5, 'Центр государственного санитарно-эпидемиологического надзора');

INSERT INTO schema_fgistp_10.suburban_tr (objectid, code, description) VALUES (1, 0, 'Пригородное сообщение отсутствует');
INSERT INTO schema_fgistp_10.suburban_tr (objectid, code, description) VALUES (2, 1, 'Пригородное сообщение присутствует');

INSERT INTO schema_fgistp_10.surface_type (objectid, code, description) VALUES (1, 1, 'Усовершенствованный');
INSERT INTO schema_fgistp_10.surface_type (objectid, code, description) VALUES (2, 2, 'Переходный');
INSERT INTO schema_fgistp_10.surface_type (objectid, code, description) VALUES (3, 3, 'Низший');
INSERT INTO schema_fgistp_10.surface_type (objectid, code, description) VALUES (4, 4, 'Без покрытия');

INSERT INTO schema_fgistp_10.szz_type (objectid, code, description) VALUES (1, 1, 'Ориентировочная (нормативная) зона');
INSERT INTO schema_fgistp_10.szz_type (objectid, code, description) VALUES (2, 2, 'Расчетная (предварительная) зона');
INSERT INTO schema_fgistp_10.szz_type (objectid, code, description) VALUES (3, 3, 'Установленная (окончательная) зона');

INSERT INTO schema_fgistp_10.time_ltype (objectid, code, description) VALUES (1, 1, 'Круглогодичное функционирование (вне зависимости от сезонно-климатических условий)');
INSERT INTO schema_fgistp_10.time_ltype (objectid, code, description) VALUES (2, 2, 'Временное функционирование (в зависимости от сезонно-климатических условий)');
INSERT INTO schema_fgistp_10.time_ltype (objectid, code, description) VALUES (3, 3, 'Зимняя автомобильная дорога (автозимник)');

INSERT INTO schema_fgistp_10.tm_source (objectid, code, description) VALUES (1, 1, 'Промышленная авария (катастрофа)');
INSERT INTO schema_fgistp_10.tm_source (objectid, code, description) VALUES (2, 2, 'Опасное происшествие на транспорте');
INSERT INTO schema_fgistp_10.tm_source (objectid, code, description) VALUES (3, 3, 'Пожар (взрыв)');

INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (1, 1, 'Зоопарк, зоологический сад');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (2, 2, 'Ботанический сад');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (3, 3, 'Зооботанический парк (сад)');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (4, 4, 'Этнографический парк');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (5, 5, 'Экологический парк');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (6, 6, 'Археологический парк');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (7, 7, 'Военно-исторический, военно-патриотический парк');
INSERT INTO schema_fgistp_10.tpark_type (objectid, code, description) VALUES (8, 8, 'Иной вид открытых территорий со специализированным набором услуг в области культуры и отдыха');

INSERT INTO schema_fgistp_10.track_type (objectid, code, description) VALUES (1, 1, 'Железная дорога колеи 1520 мм');
INSERT INTO schema_fgistp_10.track_type (objectid, code, description) VALUES (2, 2, 'Железная дорога колеи 1435 мм');
INSERT INTO schema_fgistp_10.track_type (objectid, code, description) VALUES (3, 3, 'Железная дорога колеи 1067-1435 мм');
INSERT INTO schema_fgistp_10.track_type (objectid, code, description) VALUES (4, 4, 'Железная дорога колеи менее 1067 мм');

INSERT INTO schema_fgistp_10.trd_stype (objectid, code, description) VALUES (1, 1, 'Магазин, торгово-развлекательный комплекс, магазин кулинарии');
INSERT INTO schema_fgistp_10.trd_stype (objectid, code, description) VALUES (2, 2, 'Рыночный комплекс');
INSERT INTO schema_fgistp_10.trd_stype (objectid, code, description) VALUES (3, 3, 'Объект общественного питания');
INSERT INTO schema_fgistp_10.trd_stype (objectid, code, description) VALUES (4, 4, 'Розничный рынок, ярмарка');
INSERT INTO schema_fgistp_10.trd_stype (objectid, code, description) VALUES (5, 5, 'Иной объект торговли, общественного питания');

INSERT INTO schema_fgistp_10.tunnel_t (objectid, code, description) VALUES (1, 1, 'Автодорожный');
INSERT INTO schema_fgistp_10.tunnel_t (objectid, code, description) VALUES (2, 2, 'Железнодорожный');
INSERT INTO schema_fgistp_10.tunnel_t (objectid, code, description) VALUES (3, 3, 'Иной тоннель');

INSERT INTO schema_fgistp_10.type_law (objectid, code, description) VALUES (1, 1, 'Собственность');
INSERT INTO schema_fgistp_10.type_law (objectid, code, description) VALUES (2, 2, 'Аренда');

INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (1, 1, 'Республика');
INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (2, 2, 'Край');
INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (3, 3, 'Область');
INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (4, 4, 'Город федерального значения ');
INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (5, 5, 'Автономная область');
INSERT INTO schema_fgistp_10.type_subj (objectid, code, description) VALUES (6, 6, 'Автономный округ');

INSERT INTO schema_fgistp_10.uderfl_t (objectid, code, description) VALUES (1, 1, 'сильное подтопление (глубина залегания грунтовых вод менее 0,3 м)');
INSERT INTO schema_fgistp_10.uderfl_t (objectid, code, description) VALUES (2, 2, 'умеренное подтопление (глубина залегания грунтовых вод от 0,3-0,7 до 1,2-2 м)');
INSERT INTO schema_fgistp_10.uderfl_t (objectid, code, description) VALUES (3, 3, 'слабое подтопление (глубина залегания грунтовых вод от 2 до 3 м)');

INSERT INTO schema_fgistp_10.usa_stype (objectid, code, description) VALUES (1, 1, 'Центр срочного социального обслуживания');
INSERT INTO schema_fgistp_10.usa_stype (objectid, code, description) VALUES (2, 2, 'Консультативный центр');
INSERT INTO schema_fgistp_10.usa_stype (objectid, code, description) VALUES (3, 3, 'Центр экстренной психологической помощи по телефону');

INSERT INTO schema_fgistp_10.using_type (objectid, code, description) VALUES (1, 1, 'Общего пользования');
INSERT INTO schema_fgistp_10.using_type (objectid, code, description) VALUES (2, 2, 'Необщего пользования');

INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (1, 1150, '1150 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (2, 800, '800 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (3, 750, '750 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (4, 600, '600 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (5, 500, '500 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (6, 400, '400 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (7, 330, '330 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (8, 300, '300 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (9, 220, '220 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (10, 150, '150 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (11, 110, '110 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (12, 60, '60 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (13, 35, '35 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (14, 20, '20 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (15, 10, '10 кВ');
INSERT INTO schema_fgistp_10.voltage (objectid, code, description) VALUES (16, 6, '6 кВ');

INSERT INTO schema_fgistp_10.w_source (objectid, code, description) VALUES (1, 1, 'Искусственный водоем');
INSERT INTO schema_fgistp_10.w_source (objectid, code, description) VALUES (2, 2, 'Естественный водоем');

INSERT INTO schema_fgistp_10.water_stype (objectid, code, description) VALUES (1, 1, 'Подземный водозабор');
INSERT INTO schema_fgistp_10.water_stype (objectid, code, description) VALUES (2, 2, 'Поверхностный водозабор');

INSERT INTO schema_fgistp_10.yatch_cls (objectid, code, description) VALUES (1, 1, 'Класс "A" (яхтенный порт (марина) с полным набором услуг)');
INSERT INTO schema_fgistp_10.yatch_cls (objectid, code, description) VALUES (2, 2, 'Класс "B" (яхтенный порт (марина) с ограниченным набором услуг)');
INSERT INTO schema_fgistp_10.yatch_cls (objectid, code, description) VALUES (3, 3, 'Класс "C" (яхтенная стоянка)');
INSERT INTO schema_fgistp_10.yatch_cls (objectid, code, description) VALUES (4, 4, 'Класс "D" (база технического обслуживания и хранения маломерных судов)');
INSERT INTO schema_fgistp_10.yatch_cls (objectid, code, description) VALUES (5, 5, 'Класс "E" (гребная база)');

INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (1, 1, 'Охранная зона государственного природного заповедника, в том числе биосферного');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (2, 2, 'Охранная зона национального парка');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (3, 3, 'Охранная зона природного парка');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (4, 4, 'Охранная зона государственного природного заказника');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (5, 5, 'Охранная зона памятника природы');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (6, 6, 'Охранная зона дендрологического парка либо ботанического сада');
INSERT INTO schema_fgistp_10.zone_oopt (objectid, code, description) VALUES (7, 7, 'Охранная зона иных особо охраняемых природных территорий');

--
SELECT pg_catalog.setval('schema_fgistp_10.ab_stype_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.af_type_objectid_seq', 26, true);
SELECT pg_catalog.setval('schema_fgistp_10.al_stype_objectid_seq', 8, true);
SELECT pg_catalog.setval('schema_fgistp_10.amb_type_objectid_seq', 9, true);
SELECT pg_catalog.setval('schema_fgistp_10.ans_type_objectid_seq', 15, true);
SELECT pg_catalog.setval('schema_fgistp_10.aq_stype_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.avia_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.bent_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.bridge_t_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.bur_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.cable_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.cat_distr_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.cat_main_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.cat_rdtype_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.cat_rr_objectid_seq', 10, true);
SELECT pg_catalog.setval('schema_fgistp_10.cemet_stat_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.cemet_stype_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.cemet_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.cemet_wtype_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.cep_class_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.chi_stype_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.clb_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.comm_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.cr_stype_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.crossp_t_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.crossr_t_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.ctm_time_t_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.ctm_use_t_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.cu_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.current_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.d_objects_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.danger_obj_objectid_seq', 12, true);
SELECT pg_catalog.setval('schema_fgistp_10.edu_sdtype_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.edu_stype_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.edu_tunit_objectid_seq', 24, true);
SELECT pg_catalog.setval('schema_fgistp_10.el_supply_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.eme_class_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.eme_source_objectid_seq', 30, true);
SELECT pg_catalog.setval('schema_fgistp_10.ent_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.feature_lep_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.ferry_crgt_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.ferry_mvt_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.flooding_t_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.forest_cat_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.forest_os_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.forest_t_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.forest_val_objectid_seq', 9, true);
SELECT pg_catalog.setval('schema_fgistp_10.fp_class_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.fp_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.fs_objects_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.fses_stype_objectid_seq', 10, true);
SELECT pg_catalog.setval('schema_fgistp_10.fuel_type_objectid_seq', 12, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_ingstp_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_mfstp_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_odstp_objectid_seq', 12, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_orecstp_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_recstp_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_shstp_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.fz_trstp_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.gas_st_type_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.ground_pos_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.gts_class_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.her_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.hist_cat_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.hist_out_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.hot_stype_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.hzrd_cat_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.hzrd_class_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.ind_type_objectid_seq', 10, true);
SELECT pg_catalog.setval('schema_fgistp_10.int_trf_t_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.int_trn_t_objectid_seq', 7, true);
SELECT pg_catalog.setval('schema_fgistp_10.land_type_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.main_type_objectid_seq', 22, true);
SELECT pg_catalog.setval('schema_fgistp_10.mc_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.md_stype_objectid_seq', 13, true);
SELECT pg_catalog.setval('schema_fgistp_10.min_atype_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.min_mtype_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.min_ntype_objectid_seq', 9, true);
SELECT pg_catalog.setval('schema_fgistp_10.mp_type_objectid_seq', 8, true);
SELECT pg_catalog.setval('schema_fgistp_10.msd_type_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.mst_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.num_tracks_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.och_use_objectid_seq', 18, true);
SELECT pg_catalog.setval('schema_fgistp_10.oro_stype_objectid_seq', 18, true);
SELECT pg_catalog.setval('schema_fgistp_10.oro_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.ozsn_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.pass_term_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.ped_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.pkio_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.pl_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.pline_type_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.power_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.prg_type_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.prkng_lvl_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.prkng_time_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.prkng_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.prom_direct_objectid_seq', 11, true);
SELECT pg_catalog.setval('schema_fgistp_10.proximity_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.pu_stype_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.r_affinity_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.rad_class_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.rdwin_cat_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.rdwin_type_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.recyc_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.reg_rdtype_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.reg_status_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.res_stype_objectid_seq', 8, true);
SELECT pg_catalog.setval('schema_fgistp_10.rfo_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.risk_cat_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.rs_stype_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.rst_class_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.rst_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.rwy_class_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.s_alert_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.saf_stype_objectid_seq', 9, true);
SELECT pg_catalog.setval('schema_fgistp_10.sci_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.season_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.serv_stype_objectid_seq', 13, true);
SELECT pg_catalog.setval('schema_fgistp_10.settl_cat_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.settl_level_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.settl_type_objectid_seq', 70, true);
SELECT pg_catalog.setval('schema_fgistp_10.snow_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.soc_direct_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.sp_stype_objectid_seq', 13, true);
SELECT pg_catalog.setval('schema_fgistp_10.specific_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.spz_event_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.ssah_stype_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.st_stype_objectid_seq', 14, true);
SELECT pg_catalog.setval('schema_fgistp_10.status_adm_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.status_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.status_och_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.status_pr_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.stop_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.store_type_objectid_seq', 11, true);
SELECT pg_catalog.setval('schema_fgistp_10.str_l_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.str_r_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.str_type_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.su_type_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.suburban_tr_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.surface_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.szz_type_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.time_ltype_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.tm_source_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.tpark_type_objectid_seq', 8, true);
SELECT pg_catalog.setval('schema_fgistp_10.track_type_objectid_seq', 4, true);
SELECT pg_catalog.setval('schema_fgistp_10.trd_stype_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.tunnel_t_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.type_law_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.type_subj_objectid_seq', 6, true);
SELECT pg_catalog.setval('schema_fgistp_10.uderfl_t_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.usa_stype_objectid_seq', 3, true);
SELECT pg_catalog.setval('schema_fgistp_10.using_type_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.voltage_objectid_seq', 16, true);
SELECT pg_catalog.setval('schema_fgistp_10.w_source_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.water_stype_objectid_seq', 2, true);
SELECT pg_catalog.setval('schema_fgistp_10.yatch_cls_objectid_seq', 5, true);
SELECT pg_catalog.setval('schema_fgistp_10.zone_oopt_objectid_seq', 7, true);
