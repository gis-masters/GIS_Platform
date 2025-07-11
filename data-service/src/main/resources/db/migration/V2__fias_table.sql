drop schema if exists fiaz CASCADE;
CREATE SCHEMA IF NOT EXISTS fiaz;

CREATE TABLE IF NOT EXISTS fiaz.full_address
(
    id          SERIAL PRIMARY KEY,
    objectid    bigint,
    fulladdress character varying(1000),
    oktmo       character varying(20)
    );

alter table fiaz.full_address
    OWNER to ${db_owner};

CREATE INDEX IF NOT EXISTS  full_address_index ON fiaz.full_address (fulladdress);

CREATE TABLE IF NOT EXISTS fiaz.locality_oktmo
(
    id          SERIAL PRIMARY KEY,
    objectid    bigint,
    locality    character varying(1000),
    oktmo       character varying(20)
    );

alter table fiaz.locality_oktmo
    OWNER to ${db_owner};

CREATE INDEX IF NOT EXISTS  locality_oktmo_index ON fiaz.locality_oktmo (locality);

CREATE TABLE IF NOT EXISTS fiaz.address_objects
(
    id         bigserial NOT NULL,
    objectid   bigint    NOT NULL,
    objectguid character varying(36),
    changeid   bigint,
    name       character varying(250) COLLATE pg_catalog."default",
    typename   character varying(50) COLLATE pg_catalog."default",
    level      character varying(10) COLLATE pg_catalog."default",
    opertypeid bigint,
    previd     bigint,
    nextid     bigint,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT "address_objects_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.address_objects
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.address_objects_division
(
    id       bigserial NOT NULL,
    parentid bigint    not null,
    childid  bigint    not null,
    changeid bigint    not null,
    CONSTRAINT "address_objects_division_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.address_objects_division
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.address_objects_types
(
    id         bigserial    NOT NULL,
    level      integer      not null,
    shortname  varchar(50)  not null,
    name       varchar(250) not null,
    "desc"     varchar(250),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT "fiaz.address_objects_types_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.address_objects_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.adm_hierarchy
(
    id          bigserial NOT NULL,
    objectid    bigint,
    parentobjid bigint,
    changeid    bigint,
    regioncode  character varying(4),
    areacode    character varying(4),
    citycode    character varying(4),
    placecode   character varying(4),
    plancode    character varying(4),
    streetcode  character varying(4),
    previd      bigint,
    nextid      bigint,
    updatedate  date,
    startdate   date,
    enddate     date,
    isactive    boolean,
    CONSTRAINT "adm_hierarchy_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.adm_hierarchy
    OWNER to ${db_owner};


CREATE TABLE IF NOT EXISTS fiaz.apartments
(
    id         bigserial             NOT NULL,
    objectid   bigint                NOT NULL,
    objectguid character varying(36) NOT NULL,
    changeid   bigint                not null,
    number     varchar(50)           NOT NULL,
    aparttype  integer               NOT NULL,
    opertypeid bigint                NOT NULL,
    previd     bigint,
    nextid     bigint,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT "apartments_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.apartments
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.apartment_types
(
    id         bigserial   NOT NULL,
    name       varchar(50) NOT NULL,
    shortname  varchar(50),
    "desc"     varchar(250),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT "apartment_types_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.apartment_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.car_places
(
    id         bigserial             NOT NULL,
    objectid   bigint                NOT NULL,
    objectguid character varying(36) NOT NULL,
    changeid   bigint                not null,
    number     varchar(50)           NOT NULL,
    opertypeid integer               NOT NULL,
    previd     bigint,
    nextid     bigint,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT "car_places_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.car_places
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.change_history
(
    changeid    bigint      not null,
    objectid    bigint      NOT NULL,
    adrobjectid varchar(36) NOT NULL,
    opertypeid  integer     NOT NULL,
    ndocid      bigint,
    changedate  date        NOT NULL,
    CONSTRAINT "change_history_pkey" PRIMARY KEY (changeid)
);

ALTER TABLE fiaz.change_history
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.houses
(
    id         bigserial NOT NULL,
    objectid   bigint,
    objectguid character varying(36),
    changeid   bigint,
    housenum   character varying(50),
    addnum1    character varying(50),
    addnum2    character varying(50),
    housetype  integer,
    addtype1   integer,
    addtype2   integer,
    opertypeid integer,
    previd     bigint,
    nextid     bigint,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT houses_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.houses
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.house_types
(
    id         bigserial   NOT NULL,
    name       varchar(50) NOT NULL,
    shortname  varchar(50),
    "desc"     varchar(250),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT "house_types_pkey" PRIMARY KEY (id)
);

ALTER TABLE fiaz.house_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.mun_hierarchy
(
    id          bigserial NOT NULL,
    objectid    bigint,
    parentobjid bigint,
    changeid    bigint,
    oktmo       character varying(11),
    previd      bigint,
    nextid      bigint,
    updatedate  date,
    startdate   date,
    enddate     date,
    isactive    boolean,
    CONSTRAINT mun_hierarchy_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.mun_hierarchy
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.normative_docs
(
    id         bigserial     NOT NULL,
    name       varchar(8000) NOT NULL,
    date       date          NOT NULL,
    number     varchar(150)  NOT NULL,
    type       integer       NOT NULL,
    kind       integer       NOT NULL,
    updatedate date,
    orgname    varchar(900),
    regnum     varchar(100),
    regdate    date,
    accdate    date,
    comment    varchar(8000),
    CONSTRAINT normative_docs_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.normative_docs
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.normative_docs_kinds
(
    id        bigserial    NOT NULL,
    name      varchar(500) NOT NULL,
    startdate date,
    enddate   date,
    CONSTRAINT normative_docs_kinds_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.normative_docs_kinds
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.normative_docs_types
(
    id   bigserial    NOT NULL,
    name varchar(500) NOT NULL,
    startdate date,
    enddate   date,
    CONSTRAINT normative_docs_types_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.normative_docs_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.object_levels
(
    level      integer      NOT NULL,
    name       varchar(250) NOT NULL,
    shortname  varchar(50),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT object_levels_pkey PRIMARY KEY (level)
);

ALTER TABLE fiaz.object_levels
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.operation_types
(
    id         bigserial    NOT NULL,
    name       varchar(700) NOT NULL,
    shortname  varchar(100),
    "desc"     varchar(250),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT operation_types_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.operation_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.param
(
    id          bigserial NOT NULL,
    objectid    bigint    NOT NULL,
    changeid    bigint    NOT NULL,
    changeidend bigint    NOT NULL,
    typeid      integer   NOT NULL,
    value       varchar(8000),
    updatedate  date,
    startdate   date,
    enddate     date,
    CONSTRAINT param_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.param
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.param_types
(
    id         bigserial   NOT NULL,
    name       varchar(50) NOT NULL,
    code       varchar(50) NOT NULL,
    "desc"     varchar(120),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT param_types_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.param_types
    OWNER to ${db_owner};



CREATE TABLE IF NOT EXISTS fiaz.reestr_objects
(
    objectid   bigint NOT NULL,
    createdate date,
    changeid   bigint,
    levelid    integer,
    updatedate date,
    objectguid character varying(36) COLLATE pg_catalog."default",
    isactive   boolean,
    CONSTRAINT reestr_objects_pkey PRIMARY KEY (objectid)
);

ALTER TABLE fiaz.reestr_objects
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.rooms
(
    id         bigserial   NOT NULL,
    objectid   bigint,
    objectguid character varying(36),
    changeid   bigint,
    number     varchar(50) NOT NULL,
    roomtype   integer     NOT NULL,
    opertypeid integer,
    previd     bigint,
    nextid     bigint,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT rooms_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.rooms
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.room_types
(
    id         bigserial    NOT NULL,
    name       varchar(100) NOT NULL,
    shortname  varchar(50),
    "desc"     varchar(250),
    updatedate date,
    startdate  date,
    enddate    date,
    isactive   boolean,
    CONSTRAINT room_types_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.room_types
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS fiaz.steads
(
    id         bigserial NOT NULL,
    objectid   integer,
    objectguid character varying(36),
    changeid   bigint,
    "number"   character varying(250),
    opertypeid character varying(2),
    previd     integer,
    nextid     integer,
    updatedate date,
    startdate  date,
    enddate    date,
    isactual   boolean,
    isactive   boolean,
    CONSTRAINT steads_pkey PRIMARY KEY (id)
);

ALTER TABLE fiaz.steads
    OWNER to ${db_owner};
