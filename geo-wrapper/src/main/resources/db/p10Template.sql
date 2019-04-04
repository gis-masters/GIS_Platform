-- PostgreSQL database dump
-- Dumped from database version 11.1 (Debian 11.1-3.pgdg90+1)
-- Dumped by pg_dump version 11.2 (Ubuntu 11.2-1.pgdg18.10+1)
-- Started on 2019-04-03 15:59:38 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA fiz;
ALTER SCHEMA fiz OWNER TO fiz;
SET default_tablespace = '';
SET default_with_oids = false;

--
CREATE TABLE fiz.ab_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE fiz.ab_stype OWNER TO fiz;

CREATE SEQUENCE fiz.ab_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.ab_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.ab_stype_objectid_seq OWNED BY fiz.ab_stype.objectid;


CREATE TABLE fiz.admborder_line (
    objectid integer NOT NULL,
    classid integer,
    source character varying(255),
    status_adm smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.admborder_line OWNER TO fiz;

--
CREATE TABLE fiz.admborder_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);
ALTER TABLE fiz.admborder_line_extension OWNER TO fiz;

CREATE SEQUENCE fiz.admborder_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.admborder_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.admborder_objectid_seq OWNED BY fiz.admborder_line.objectid;

--
CREATE TABLE fiz.admemo (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    oktmo character varying(50),
    population numeric(38,8),
    source character varying(255),
    status_adm smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.admemo OWNER TO fiz;

CREATE TABLE fiz.admemo_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);
ALTER TABLE fiz.admemo_extension OWNER TO fiz;

--

-- Name: admemo_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.admemo_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.admemo_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.admemo_objectid_seq OWNED BY fiz.admemo.objectid;


CREATE TABLE fiz.admenp (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    oktmo character varying(50),
    settl_lvl smallint,
    settl_type smallint,
    population numeric(38,8),
    source character varying(255),
    status_adm smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.admenp OWNER TO fiz;

--

-- Name: admenp_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.admenp_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.admenp_extension OWNER TO fiz;

--

-- Name: admenp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.admenp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.admenp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8818 (class 0 OID 0)
-- Dependencies: 232
-- Name: admenp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.admenp_objectid_seq OWNED BY fiz.admenp.objectid;


--

-- Name: admerf; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.admerf (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    population numeric(38,8),
    source character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.admerf OWNER TO fiz;

--

-- Name: admerf_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.admerf_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.admerf_extension OWNER TO fiz;

--

-- Name: admerf_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.admerf_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.admerf_objectid_seq OWNER TO fiz;

--
-- TOC entry 8819 (class 0 OID 0)
-- Dependencies: 235
-- Name: admerf_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.admerf_objectid_seq OWNED BY fiz.admerf.objectid;


--

-- Name: admesrf; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.admesrf (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    type_subj smallint,
    population numeric(38,8),
    source character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.admesrf OWNER TO fiz;

--

-- Name: admesrf_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.admesrf_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.admesrf_extension OWNER TO fiz;

--

-- Name: admesrf_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.admesrf_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.admesrf_objectid_seq OWNER TO fiz;

--
-- TOC entry 8820 (class 0 OID 0)
-- Dependencies: 238
-- Name: admesrf_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.admesrf_objectid_seq OWNED BY fiz.admesrf.objectid;


--

-- Name: aeroszone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.aeroszone (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.aeroszone OWNER TO fiz;

--

-- Name: aeroszone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.aeroszone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.aeroszone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8821 (class 0 OID 0)
-- Dependencies: 240
-- Name: aeroszone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.aeroszone_objectid_seq OWNED BY fiz.aeroszone.objectid;


--

-- Name: af_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.af_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.af_type OWNER TO fiz;

--

-- Name: af_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.af_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.af_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8822 (class 0 OID 0)
-- Dependencies: 242
-- Name: af_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.af_type_objectid_seq OWNED BY fiz.af_type.objectid;


--

-- Name: agriculture; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.agriculture (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    main_activ character varying(255),
    add_activ character varying(255),
    main_type smallint,
    store_type smallint,
    oth_pobj character varying(255),
    capacity integer,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.agriculture OWNER TO fiz;

--

-- Name: agriculture_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.agriculture_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.agriculture_extension OWNER TO fiz;

--

-- Name: agriculture_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.agriculture_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.agriculture_objectid_seq OWNER TO fiz;

--
-- TOC entry 8823 (class 0 OID 0)
-- Dependencies: 245
-- Name: agriculture_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.agriculture_objectid_seq OWNED BY fiz.agriculture.objectid;


--

-- Name: agriculture_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.agriculture_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    main_activ character varying(255),
    add_activ character varying(255),
    main_type smallint,
    store_type smallint,
    oth_pobj character varying(255),
    capacity integer,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.agriculture_point OWNER TO fiz;

--

-- Name: agriculture_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.agriculture_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.agriculture_point_extension OWNER TO fiz;

--

-- Name: agriculture_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.agriculture_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.agriculture_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8824 (class 0 OID 0)
-- Dependencies: 248
-- Name: agriculture_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.agriculture_point_objectid_seq OWNED BY fiz.agriculture_point.objectid;


--

-- Name: airtransportobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.airtransportobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    avia_type smallint,
    capacity integer,
    freight numeric(38,8),
    land_type smallint,
    rwy_class smallint,
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.airtransportobj OWNER TO fiz;

--

-- Name: airtransportobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.airtransportobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.airtransportobj_extension OWNER TO fiz;

--

-- Name: airtransportobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.airtransportobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.airtransportobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 8825 (class 0 OID 0)
-- Dependencies: 251
-- Name: airtransportobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.airtransportobj_objectid_seq OWNED BY fiz.airtransportobj.objectid;


--

-- Name: airtransportobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.airtransportobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    avia_type smallint,
    capacity integer,
    freight numeric(38,8),
    land_type smallint,
    rwy_class smallint,
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.airtransportobj_point OWNER TO fiz;

--

-- Name: airtransportobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.airtransportobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.airtransportobj_point_extension OWNER TO fiz;

--

-- Name: airtransportobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.airtransportobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.airtransportobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8826 (class 0 OID 0)
-- Dependencies: 254
-- Name: airtransportobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.airtransportobj_point_objectid_seq OWNED BY fiz.airtransportobj_point.objectid;


--

-- Name: al_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.al_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.al_stype OWNER TO fiz;

--

-- Name: al_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.al_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.al_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8827 (class 0 OID 0)
-- Dependencies: 256
-- Name: al_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.al_stype_objectid_seq OWNED BY fiz.al_stype.objectid;


--

-- Name: amb_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.amb_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.amb_type OWNER TO fiz;

--

-- Name: amb_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.amb_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.amb_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8828 (class 0 OID 0)
-- Dependencies: 258
-- Name: amb_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.amb_type_objectid_seq OWNED BY fiz.amb_type.objectid;


--

-- Name: ans_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ans_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ans_type OWNER TO fiz;

--

-- Name: ans_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ans_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ans_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8829 (class 0 OID 0)
-- Dependencies: 260
-- Name: ans_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ans_type_objectid_seq OWNED BY fiz.ans_type.objectid;


--

-- Name: aq_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.aq_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.aq_stype OWNER TO fiz;

--

-- Name: aq_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.aq_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.aq_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8830 (class 0 OID 0)
-- Dependencies: 262
-- Name: aq_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.aq_stype_objectid_seq OWNED BY fiz.aq_stype.objectid;


--

-- Name: areabasedevelopment; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.areabasedevelopment (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    area numeric(38,8),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.areabasedevelopment OWNER TO fiz;

--

-- Name: areabasedevelopment_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.areabasedevelopment_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.areabasedevelopment_extension OWNER TO fiz;

--

-- Name: areabasedevelopment_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.areabasedevelopment_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.areabasedevelopment_objectid_seq OWNER TO fiz;

--
-- TOC entry 8831 (class 0 OID 0)
-- Dependencies: 265
-- Name: areabasedevelopment_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.areabasedevelopment_objectid_seq OWNED BY fiz.areabasedevelopment.objectid;


--

-- Name: authorityservice; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.authorityservice (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ab_stype smallint,
    cr_stype smallint,
    trd_stype smallint,
    rs_stype smallint,
    pu_stype smallint,
    bld_area numeric(38,8),
    trd_area numeric(38,8),
    trd_count numeric(38,8),
    capacity integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.authorityservice OWNER TO fiz;

--

-- Name: authorityservice_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.authorityservice_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.authorityservice_extension OWNER TO fiz;

--

-- Name: authorityservice_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.authorityservice_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.authorityservice_objectid_seq OWNER TO fiz;

--
-- TOC entry 8832 (class 0 OID 0)
-- Dependencies: 268
-- Name: authorityservice_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.authorityservice_objectid_seq OWNED BY fiz.authorityservice.objectid;


--

-- Name: authorityservice_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.authorityservice_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ab_stype smallint,
    cr_stype smallint,
    trd_stype smallint,
    rs_stype smallint,
    pu_stype smallint,
    bld_area numeric(38,8),
    trd_area numeric(38,8),
    trd_count numeric(38,8),
    capacity integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.authorityservice_point OWNER TO fiz;

--

-- Name: authorityservice_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.authorityservice_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.authorityservice_point_extension OWNER TO fiz;

--

-- Name: authorityservice_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.authorityservice_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.authorityservice_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8833 (class 0 OID 0)
-- Dependencies: 271
-- Name: authorityservice_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.authorityservice_point_objectid_seq OWNED BY fiz.authorityservice_point.objectid;


--

-- Name: autoservice; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.autoservice (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    gas_st_type smallint,
    fuel_count integer,
    post_count integer,
    prkng_type smallint,
    prkng_lvl smallint,
    prkng_time smallint,
    prkng_fls integer,
    capacity integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.autoservice OWNER TO fiz;

--

-- Name: autoservice_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.autoservice_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.autoservice_extension OWNER TO fiz;

--

-- Name: autoservice_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.autoservice_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.autoservice_objectid_seq OWNER TO fiz;

--
-- TOC entry 8834 (class 0 OID 0)
-- Dependencies: 274
-- Name: autoservice_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.autoservice_objectid_seq OWNED BY fiz.autoservice.objectid;


--

-- Name: autoservice_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.autoservice_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    gas_st_type smallint,
    fuel_count integer,
    post_count integer,
    prkng_type smallint,
    prkng_lvl smallint,
    prkng_time smallint,
    prkng_fls integer,
    capacity integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.autoservice_point OWNER TO fiz;

--

-- Name: autoservice_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.autoservice_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.autoservice_point_extension OWNER TO fiz;

--

-- Name: autoservice_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.autoservice_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.autoservice_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8835 (class 0 OID 0)
-- Dependencies: 277
-- Name: autoservice_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.autoservice_point_objectid_seq OWNED BY fiz.autoservice_point.objectid;


--

-- Name: avia_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.avia_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.avia_type OWNER TO fiz;

--

-- Name: avia_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.avia_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.avia_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8836 (class 0 OID 0)
-- Dependencies: 279
-- Name: avia_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.avia_type_objectid_seq OWNED BY fiz.avia_type.objectid;


--

-- Name: bent_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.bent_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.bent_type OWNER TO fiz;

--

-- Name: bent_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.bent_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.bent_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8837 (class 0 OID 0)
-- Dependencies: 281
-- Name: bent_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.bent_type_objectid_seq OWNED BY fiz.bent_type.objectid;


--

-- Name: bridge_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.bridge_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.bridge_t OWNER TO fiz;

--

-- Name: bridge_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.bridge_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.bridge_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8838 (class 0 OID 0)
-- Dependencies: 283
-- Name: bridge_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.bridge_t_objectid_seq OWNED BY fiz.bridge_t.objectid;


--

-- Name: bur_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.bur_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.bur_type OWNER TO fiz;

--

-- Name: bur_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.bur_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.bur_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8839 (class 0 OID 0)
-- Dependencies: 285
-- Name: bur_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.bur_type_objectid_seq OWNED BY fiz.bur_type.objectid;


--

-- Name: cable_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cable_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cable_type OWNER TO fiz;

--

-- Name: cable_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cable_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cable_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8840 (class 0 OID 0)
-- Dependencies: 287
-- Name: cable_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cable_type_objectid_seq OWNED BY fiz.cable_type.objectid;


--

-- Name: cat_distr; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cat_distr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cat_distr OWNER TO fiz;

--

-- Name: cat_distr_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cat_distr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cat_distr_objectid_seq OWNER TO fiz;

--
-- TOC entry 8841 (class 0 OID 0)
-- Dependencies: 289
-- Name: cat_distr_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cat_distr_objectid_seq OWNED BY fiz.cat_distr.objectid;


--

-- Name: cat_main; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cat_main (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cat_main OWNER TO fiz;

--

-- Name: cat_main_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cat_main_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cat_main_objectid_seq OWNER TO fiz;

--
-- TOC entry 8842 (class 0 OID 0)
-- Dependencies: 291
-- Name: cat_main_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cat_main_objectid_seq OWNED BY fiz.cat_main.objectid;


--

-- Name: cat_rdtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cat_rdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cat_rdtype OWNER TO fiz;

--

-- Name: cat_rdtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cat_rdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cat_rdtype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8843 (class 0 OID 0)
-- Dependencies: 293
-- Name: cat_rdtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cat_rdtype_objectid_seq OWNED BY fiz.cat_rdtype.objectid;


--

-- Name: cat_rr; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cat_rr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cat_rr OWNER TO fiz;

--

-- Name: cat_rr_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cat_rr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cat_rr_objectid_seq OWNER TO fiz;

--
-- TOC entry 8844 (class 0 OID 0)
-- Dependencies: 295
-- Name: cat_rr_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cat_rr_objectid_seq OWNED BY fiz.cat_rr.objectid;


--

-- Name: cemet_stat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemet_stat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cemet_stat OWNER TO fiz;

--

-- Name: cemet_stat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemet_stat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemet_stat_objectid_seq OWNER TO fiz;

--
-- TOC entry 8845 (class 0 OID 0)
-- Dependencies: 297
-- Name: cemet_stat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemet_stat_objectid_seq OWNED BY fiz.cemet_stat.objectid;


--

-- Name: cemet_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemet_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cemet_stype OWNER TO fiz;

--

-- Name: cemet_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemet_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemet_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8846 (class 0 OID 0)
-- Dependencies: 299
-- Name: cemet_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemet_stype_objectid_seq OWNED BY fiz.cemet_stype.objectid;


--

-- Name: cemet_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemet_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cemet_type OWNER TO fiz;

--

-- Name: cemet_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemet_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemet_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8847 (class 0 OID 0)
-- Dependencies: 301
-- Name: cemet_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemet_type_objectid_seq OWNED BY fiz.cemet_type.objectid;


--

-- Name: cemet_wtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemet_wtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cemet_wtype OWNER TO fiz;

--

-- Name: cemet_wtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemet_wtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemet_wtype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8848 (class 0 OID 0)
-- Dependencies: 303
-- Name: cemet_wtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemet_wtype_objectid_seq OWNED BY fiz.cemet_wtype.objectid;


--

-- Name: cemetery; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemetery (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    cemet_type smallint,
    cemet_stype smallint,
    cemet_wtype smallint,
    cemet_stat smallint,
    hzrd_class smallint,
    area numeric(38,8),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.cemetery OWNER TO fiz;

CREATE TABLE fiz.cemetery_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.cemetery_extension OWNER TO fiz;

--

-- Name: cemetery_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemetery_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemetery_objectid_seq OWNER TO fiz;

--
-- TOC entry 8849 (class 0 OID 0)
-- Dependencies: 306
-- Name: cemetery_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemetery_objectid_seq OWNED BY fiz.cemetery.objectid;


--

-- Name: cemetery_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemetery_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    cemet_type smallint,
    cemet_stype smallint,
    cemet_wtype smallint,
    cemet_stat smallint,
    hzrd_class smallint,
    area numeric(38,8),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.cemetery_point OWNER TO fiz;

--

-- Name: cemetery_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cemetery_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.cemetery_point_extension OWNER TO fiz;

--

-- Name: cemetery_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cemetery_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cemetery_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8850 (class 0 OID 0)
-- Dependencies: 309
-- Name: cemetery_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cemetery_point_objectid_seq OWNED BY fiz.cemetery_point.objectid;


--

-- Name: cep_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cep_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.cep_class OWNER TO fiz;

--

-- Name: cep_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cep_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cep_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 8851 (class 0 OID 0)
-- Dependencies: 311
-- Name: cep_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cep_class_objectid_seq OWNED BY fiz.cep_class.objectid;


--

-- Name: chi_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.chi_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.chi_stype OWNER TO fiz;

--

-- Name: chi_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.chi_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.chi_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8852 (class 0 OID 0)
-- Dependencies: 313
-- Name: chi_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.chi_stype_objectid_seq OWNED BY fiz.chi_stype.objectid;


--

-- Name: clb_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.clb_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.clb_type OWNER TO fiz;

--

-- Name: clb_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.clb_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.clb_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8853 (class 0 OID 0)
-- Dependencies: 315
-- Name: clb_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.clb_type_objectid_seq OWNED BY fiz.clb_type.objectid;


--

-- Name: coastalprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.coastalprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.coastalprotectionzone OWNER TO fiz;

--

-- Name: coastalprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.coastalprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.coastalprotectionzone_extension OWNER TO fiz;

--

-- Name: coastalprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.coastalprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.coastalprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8854 (class 0 OID 0)
-- Dependencies: 318
-- Name: coastalprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.coastalprotectionzone_objectid_seq OWNED BY fiz.coastalprotectionzone.objectid;


--

-- Name: comm_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.comm_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.comm_type OWNER TO fiz;

--

-- Name: comm_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.comm_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.comm_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8855 (class 0 OID 0)
-- Dependencies: 320
-- Name: comm_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.comm_type_objectid_seq OWNED BY fiz.comm_type.objectid;


--

-- Name: comm_сtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz."comm_сtype" (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz."comm_сtype" OWNER TO fiz;

--

-- Name: comm_сtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz."comm_сtype_objectid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz."comm_сtype_objectid_seq" OWNER TO fiz;

--
-- TOC entry 8856 (class 0 OID 0)
-- Dependencies: 322
-- Name: comm_сtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz."comm_сtype_objectid_seq" OWNED BY fiz."comm_сtype".objectid;


--

-- Name: cr_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cr_stype (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.cr_stype OWNER TO fiz;

--

-- Name: cr_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cr_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cr_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8857 (class 0 OID 0)
-- Dependencies: 324
-- Name: cr_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cr_stype_objectid_seq OWNED BY fiz.cr_stype.objectid;


--

-- Name: crossp_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.crossp_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.crossp_t OWNER TO fiz;

--

-- Name: crossp_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.crossp_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.crossp_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8858 (class 0 OID 0)
-- Dependencies: 326
-- Name: crossp_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.crossp_t_objectid_seq OWNED BY fiz.crossp_t.objectid;


--

-- Name: crossr_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.crossr_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.crossr_t OWNER TO fiz;

--

-- Name: crossr_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.crossr_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.crossr_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8859 (class 0 OID 0)
-- Dependencies: 328
-- Name: crossr_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.crossr_t_objectid_seq OWNED BY fiz.crossr_t.objectid;


--

-- Name: ctm_time_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ctm_time_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ctm_time_t OWNER TO fiz;

--

-- Name: ctm_time_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ctm_time_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ctm_time_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8860 (class 0 OID 0)
-- Dependencies: 330
-- Name: ctm_time_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ctm_time_t_objectid_seq OWNED BY fiz.ctm_time_t.objectid;


--

-- Name: ctm_use_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ctm_use_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ctm_use_t OWNER TO fiz;

--

-- Name: ctm_use_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ctm_use_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ctm_use_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8861 (class 0 OID 0)
-- Dependencies: 332
-- Name: ctm_use_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ctm_use_t_objectid_seq OWNED BY fiz.ctm_use_t.objectid;


--

-- Name: cu_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.cu_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.cu_type OWNER TO fiz;

--

-- Name: cu_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.cu_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.cu_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8862 (class 0 OID 0)
-- Dependencies: 334
-- Name: cu_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.cu_type_objectid_seq OWNED BY fiz.cu_type.objectid;


--

-- Name: culture; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.culture (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    cu_type smallint,
    clb_type smallint,
    ent_type smallint,
    lb_stock numeric(38,8),
    capacity integer,
    bld_area numeric(38,8),
    exb_area integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.culture OWNER TO fiz;

--

-- Name: culture_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.culture_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.culture_extension OWNER TO fiz;

--

-- Name: culture_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.culture_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.culture_objectid_seq OWNER TO fiz;

--
-- TOC entry 8863 (class 0 OID 0)
-- Dependencies: 337
-- Name: culture_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.culture_objectid_seq OWNED BY fiz.culture.objectid;


--

-- Name: culture_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.culture_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    cu_type smallint,
    clb_type smallint,
    ent_type smallint,
    lb_stock numeric(38,8),
    capacity integer,
    bld_area numeric(38,8),
    exb_area integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.culture_point OWNER TO fiz;

--

-- Name: culture_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.culture_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.culture_point_extension OWNER TO fiz;

--

-- Name: culture_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.culture_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.culture_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8864 (class 0 OID 0)
-- Dependencies: 340
-- Name: culture_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.culture_point_objectid_seq OWNED BY fiz.culture_point.objectid;


--

-- Name: current; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.current (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.current OWNER TO fiz;

--

-- Name: current_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.current_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.current_objectid_seq OWNER TO fiz;

--
-- TOC entry 8865 (class 0 OID 0)
-- Dependencies: 342
-- Name: current_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.current_objectid_seq OWNED BY fiz.current.objectid;


--

-- Name: customcontrol; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.customcontrol (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    int_trn_t smallint,
    int_trf_t smallint,
    ctm_time_t smallint,
    ctm_use_t smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.customcontrol OWNER TO fiz;

--

-- Name: customcontrol_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.customcontrol_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.customcontrol_extension OWNER TO fiz;

--

-- Name: customcontrol_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.customcontrol_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.customcontrol_objectid_seq OWNER TO fiz;

--
-- TOC entry 8866 (class 0 OID 0)
-- Dependencies: 345
-- Name: customcontrol_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.customcontrol_objectid_seq OWNED BY fiz.customcontrol.objectid;


--

-- Name: customcontrol_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.customcontrol_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    int_trn_t smallint,
    int_trf_t smallint,
    ctm_time_t smallint,
    ctm_use_t smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.customcontrol_point OWNER TO fiz;

--

-- Name: customcontrol_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.customcontrol_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.customcontrol_point_extension OWNER TO fiz;

--

-- Name: customcontrol_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.customcontrol_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.customcontrol_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8867 (class 0 OID 0)
-- Dependencies: 348
-- Name: customcontrol_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.customcontrol_point_objectid_seq OWNED BY fiz.customcontrol_point.objectid;


--

-- Name: d_objects; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.d_objects (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.d_objects OWNER TO fiz;

--

-- Name: d_objects_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.d_objects_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.d_objects_objectid_seq OWNER TO fiz;

--
-- TOC entry 8868 (class 0 OID 0)
-- Dependencies: 350
-- Name: d_objects_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.d_objects_objectid_seq OWNED BY fiz.d_objects.objectid;


--

-- Name: danger_obj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.danger_obj (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.danger_obj OWNER TO fiz;

--

-- Name: danger_obj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.danger_obj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.danger_obj_objectid_seq OWNER TO fiz;

--
-- TOC entry 8869 (class 0 OID 0)
-- Dependencies: 352
-- Name: danger_obj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.danger_obj_objectid_seq OWNED BY fiz.danger_obj.objectid;


--

-- Name: drinkwaterprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.drinkwaterprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.drinkwaterprotectionzone OWNER TO fiz;

--

-- Name: drinkwaterprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.drinkwaterprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.drinkwaterprotectionzone_extension OWNER TO fiz;

--

-- Name: drinkwaterprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.drinkwaterprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.drinkwaterprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8870 (class 0 OID 0)
-- Dependencies: 355
-- Name: drinkwaterprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.drinkwaterprotectionzone_objectid_seq OWNED BY fiz.drinkwaterprotectionzone.objectid;


--

-- Name: edu_sdtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.edu_sdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.edu_sdtype OWNER TO fiz;

--

-- Name: edu_sdtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.edu_sdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.edu_sdtype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8871 (class 0 OID 0)
-- Dependencies: 357
-- Name: edu_sdtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.edu_sdtype_objectid_seq OWNED BY fiz.edu_sdtype.objectid;


--

-- Name: edu_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.edu_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.edu_stype OWNER TO fiz;

--

-- Name: edu_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.edu_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.edu_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8872 (class 0 OID 0)
-- Dependencies: 359
-- Name: edu_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.edu_stype_objectid_seq OWNED BY fiz.edu_stype.objectid;


--

-- Name: edu_tunit; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.edu_tunit (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.edu_tunit OWNER TO fiz;

--

-- Name: edu_tunit_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.edu_tunit_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.edu_tunit_objectid_seq OWNER TO fiz;

--
-- TOC entry 8873 (class 0 OID 0)
-- Dependencies: 361
-- Name: edu_tunit_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.edu_tunit_objectid_seq OWNED BY fiz.edu_tunit.objectid;


--

-- Name: education; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.education (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    name_unit character varying(255),
    edu_stype smallint,
    edu_sdtype smallint,
    sci_type smallint,
    prg_type smallint,
    edu_tunit smallint,
    capacity integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.education OWNER TO fiz;

--

-- Name: education_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.education_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.education_extension OWNER TO fiz;

--

-- Name: education_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.education_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.education_objectid_seq OWNER TO fiz;

--
-- TOC entry 8874 (class 0 OID 0)
-- Dependencies: 364
-- Name: education_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.education_objectid_seq OWNED BY fiz.education.objectid;


--

-- Name: education_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.education_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    name_unit character varying(255),
    edu_stype smallint,
    edu_sdtype smallint,
    sci_type smallint,
    prg_type smallint,
    edu_tunit smallint,
    capacity integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.education_point OWNER TO fiz;

--

-- Name: education_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.education_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.education_point_extension OWNER TO fiz;

--

-- Name: education_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.education_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.education_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8875 (class 0 OID 0)
-- Dependencies: 367
-- Name: education_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.education_point_objectid_seq OWNED BY fiz.education_point.objectid;


--

-- Name: el_supply; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.el_supply (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.el_supply OWNER TO fiz;

--

-- Name: el_supply_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.el_supply_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.el_supply_objectid_seq OWNER TO fiz;

--
-- TOC entry 8876 (class 0 OID 0)
-- Dependencies: 369
-- Name: el_supply_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.el_supply_objectid_seq OWNED BY fiz.el_supply.objectid;


--

-- Name: electricline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    voltage smallint,
    current smallint,
    pl_type smallint,
    danger_obj smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    feature_lep smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    feature_le integer,
    shape_leng numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.electricline_line OWNER TO fiz;

--

-- Name: electricline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.electricline_line_extension OWNER TO fiz;

--

-- Name: electricline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.electricline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.electricline_objectid_seq OWNER TO fiz;

--
-- TOC entry 8877 (class 0 OID 0)
-- Dependencies: 372
-- Name: electricline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.electricline_objectid_seq OWNED BY fiz.electricline_line.objectid;


--

-- Name: electricpowerstation; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricpowerstation (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fuel_type smallint,
    power_type smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    elect_power numeric(38,8),
    heat_power numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.electricpowerstation OWNER TO fiz;

--

-- Name: electricpowerstation_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricpowerstation_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.electricpowerstation_extension OWNER TO fiz;

--

-- Name: electricpowerstation_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.electricpowerstation_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.electricpowerstation_objectid_seq OWNER TO fiz;

--
-- TOC entry 8878 (class 0 OID 0)
-- Dependencies: 375
-- Name: electricpowerstation_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.electricpowerstation_objectid_seq OWNED BY fiz.electricpowerstation.objectid;


--

-- Name: electricpowerstation_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricpowerstation_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fuel_type smallint,
    power_type smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    elect_power numeric(38,8),
    heat_power numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.electricpowerstation_point OWNER TO fiz;

--

-- Name: electricpowerstation_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electricpowerstation_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.electricpowerstation_point_extension OWNER TO fiz;

--

-- Name: electricpowerstation_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.electricpowerstation_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.electricpowerstation_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8879 (class 0 OID 0)
-- Dependencies: 378
-- Name: electricpowerstation_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.electricpowerstation_point_objectid_seq OWNED BY fiz.electricpowerstation_point.objectid;


--

-- Name: electrictransformer; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electrictransformer (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    disp_num character varying(255),
    oktmo character varying(50),
    address character varying(255),
    voltage character varying(50),
    current smallint,
    ground_pos smallint,
    danger_obj smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    power numeric(38,8),
    amount integer,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.electrictransformer OWNER TO fiz;

--

-- Name: electrictransformer_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electrictransformer_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.electrictransformer_extension OWNER TO fiz;

--

-- Name: electrictransformer_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.electrictransformer_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.electrictransformer_objectid_seq OWNER TO fiz;

--
-- TOC entry 8880 (class 0 OID 0)
-- Dependencies: 381
-- Name: electrictransformer_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.electrictransformer_objectid_seq OWNED BY fiz.electrictransformer.objectid;


--

-- Name: electrictransformer_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electrictransformer_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    disp_num character varying(255),
    oktmo character varying(50),
    address character varying(255),
    voltage character varying(50),
    current smallint,
    ground_pos smallint,
    danger_obj smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    power numeric(38,8),
    amount integer,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.electrictransformer_point OWNER TO fiz;

--

-- Name: electrictransformer_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.electrictransformer_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.electrictransformer_point_extension OWNER TO fiz;

--

-- Name: electrictransformer_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.electrictransformer_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.electrictransformer_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8881 (class 0 OID 0)
-- Dependencies: 384
-- Name: electrictransformer_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.electrictransformer_point_objectid_seq OWNED BY fiz.electrictransformer_point.objectid;


--

-- Name: eme_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.eme_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.eme_class OWNER TO fiz;

--

-- Name: eme_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.eme_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.eme_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 8882 (class 0 OID 0)
-- Dependencies: 386
-- Name: eme_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.eme_class_objectid_seq OWNED BY fiz.eme_class.objectid;


--

-- Name: eme_source; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.eme_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.eme_source OWNER TO fiz;

--

-- Name: eme_source_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.eme_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.eme_source_objectid_seq OWNER TO fiz;

--
-- TOC entry 8883 (class 0 OID 0)
-- Dependencies: 388
-- Name: eme_source_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.eme_source_objectid_seq OWNED BY fiz.eme_source.objectid;


--

-- Name: emergencyprotectionobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.emergencyprotectionobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fp_type smallint,
    fp_class smallint,
    fe_count integer,
    w_source smallint,
    fs_objects smallint,
    d_objects smallint,
    s_alert smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.emergencyprotectionobj OWNER TO fiz;

--

-- Name: emergencyprotectionobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.emergencyprotectionobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.emergencyprotectionobj_extension OWNER TO fiz;

--

-- Name: emergencyprotectionobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.emergencyprotectionobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.emergencyprotectionobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 8884 (class 0 OID 0)
-- Dependencies: 391
-- Name: emergencyprotectionobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.emergencyprotectionobj_objectid_seq OWNED BY fiz.emergencyprotectionobj.objectid;


--

-- Name: emergencyprotectionobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.emergencyprotectionobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fp_type smallint,
    fp_class smallint,
    fe_count integer,
    w_source smallint,
    fs_objects smallint,
    d_objects smallint,
    s_alert smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.emergencyprotectionobj_point OWNER TO fiz;

--

-- Name: emergencyprotectionobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.emergencyprotectionobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.emergencyprotectionobj_point_extension OWNER TO fiz;

--

-- Name: emergencyprotectionobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.emergencyprotectionobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.emergencyprotectionobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8885 (class 0 OID 0)
-- Dependencies: 394
-- Name: emergencyprotectionobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.emergencyprotectionobj_point_objectid_seq OWNED BY fiz.emergencyprotectionobj_point.objectid;


--

-- Name: engprotectionobj_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionobj_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(255),
    address character varying(255),
    cep_class smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.engprotectionobj_line OWNER TO fiz;

--

-- Name: engprotectionobj_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionobj_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.engprotectionobj_line_extension OWNER TO fiz;

--

-- Name: engprotectionobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.engprotectionobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.engprotectionobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 8886 (class 0 OID 0)
-- Dependencies: 397
-- Name: engprotectionobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.engprotectionobj_objectid_seq OWNED BY fiz.engprotectionobj_line.objectid;


--

-- Name: engprotectionobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(255),
    address character varying(255),
    cep_class smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.engprotectionobj_point OWNER TO fiz;

--

-- Name: engprotectionobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.engprotectionobj_point_extension OWNER TO fiz;

--

-- Name: engprotectionobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.engprotectionobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.engprotectionobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8887 (class 0 OID 0)
-- Dependencies: 400
-- Name: engprotectionobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.engprotectionobj_point_objectid_seq OWNED BY fiz.engprotectionobj_point.objectid;


--

-- Name: engprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.engprotectionzone OWNER TO fiz;

--

-- Name: engprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.engprotectionzone_extension OWNER TO fiz;

--

-- Name: engprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.engprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.engprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8888 (class 0 OID 0)
-- Dependencies: 403
-- Name: engprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.engprotectionzone_objectid_seq OWNED BY fiz.engprotectionzone.objectid;


--

-- Name: engsanitarygapzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engsanitarygapzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.engsanitarygapzone OWNER TO fiz;

--

-- Name: engsanitarygapzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.engsanitarygapzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.engsanitarygapzone_extension OWNER TO fiz;

--

-- Name: engsanitarygapzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.engsanitarygapzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.engsanitarygapzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8889 (class 0 OID 0)
-- Dependencies: 406
-- Name: engsanitarygapzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.engsanitarygapzone_objectid_seq OWNED BY fiz.engsanitarygapzone.objectid;


--

-- Name: ent_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ent_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ent_type OWNER TO fiz;

--

-- Name: ent_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ent_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ent_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8890 (class 0 OID 0)
-- Dependencies: 408
-- Name: ent_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ent_type_objectid_seq OWNED BY fiz.ent_type.objectid;


--

-- Name: envdanger; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envdanger (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    obj_desc character varying(255),
    area numeric(38,8),
    source character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.envdanger OWNER TO fiz;

--

-- Name: envdanger_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envdanger_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.envdanger_extension OWNER TO fiz;

--

-- Name: envdanger_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.envdanger_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.envdanger_objectid_seq OWNER TO fiz;

--
-- TOC entry 8891 (class 0 OID 0)
-- Dependencies: 411
-- Name: envdanger_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.envdanger_objectid_seq OWNED BY fiz.envdanger.objectid;


--

-- Name: envdanger_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envdanger_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    obj_desc character varying(255),
    area numeric(38,8),
    source character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.envdanger_point OWNER TO fiz;

--

-- Name: envdanger_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envdanger_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.envdanger_point_extension OWNER TO fiz;

--

-- Name: envdanger_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.envdanger_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.envdanger_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8892 (class 0 OID 0)
-- Dependencies: 414
-- Name: envdanger_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.envdanger_point_objectid_seq OWNED BY fiz.envdanger_point.objectid;


--

-- Name: envmonitoring; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envmonitoring (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    zone_size numeric(38,8),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.envmonitoring OWNER TO fiz;

--

-- Name: envmonitoring_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envmonitoring_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.envmonitoring_extension OWNER TO fiz;

--

-- Name: envmonitoring_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.envmonitoring_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.envmonitoring_objectid_seq OWNER TO fiz;

--
-- TOC entry 8893 (class 0 OID 0)
-- Dependencies: 417
-- Name: envmonitoring_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.envmonitoring_objectid_seq OWNED BY fiz.envmonitoring.objectid;


--

-- Name: envmonitoring_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envmonitoring_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    zone_size numeric(38,8),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.envmonitoring_point OWNER TO fiz;

--

-- Name: envmonitoring_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.envmonitoring_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.envmonitoring_point_extension OWNER TO fiz;

--

-- Name: envmonitoring_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.envmonitoring_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.envmonitoring_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8894 (class 0 OID 0)
-- Dependencies: 420
-- Name: envmonitoring_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.envmonitoring_point_objectid_seq OWNED BY fiz.envmonitoring_point.objectid;


--

-- Name: feature_lep; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.feature_lep (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.feature_lep OWNER TO fiz;

--

-- Name: feature_lep_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.feature_lep_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.feature_lep_objectid_seq OWNER TO fiz;

--
-- TOC entry 8895 (class 0 OID 0)
-- Dependencies: 422
-- Name: feature_lep_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.feature_lep_objectid_seq OWNED BY fiz.feature_lep.objectid;


--

-- Name: ferry_crgt; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ferry_crgt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ferry_crgt OWNER TO fiz;

--

-- Name: ferry_crgt_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ferry_crgt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ferry_crgt_objectid_seq OWNER TO fiz;

--
-- TOC entry 8896 (class 0 OID 0)
-- Dependencies: 424
-- Name: ferry_crgt_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ferry_crgt_objectid_seq OWNED BY fiz.ferry_crgt.objectid;


--

-- Name: ferry_mvt; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ferry_mvt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ferry_mvt OWNER TO fiz;

--

-- Name: ferry_mvt_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ferry_mvt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ferry_mvt_objectid_seq OWNER TO fiz;

--
-- TOC entry 8897 (class 0 OID 0)
-- Dependencies: 426
-- Name: ferry_mvt_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ferry_mvt_objectid_seq OWNED BY fiz.ferry_mvt.objectid;


--

-- Name: fishprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fishprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.fishprotectionzone OWNER TO fiz;

--

-- Name: fishprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fishprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.fishprotectionzone_extension OWNER TO fiz;

--

-- Name: fishprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fishprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fishprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8898 (class 0 OID 0)
-- Dependencies: 429
-- Name: fishprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fishprotectionzone_objectid_seq OWNED BY fiz.fishprotectionzone.objectid;


--

-- Name: floodarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.floodarea (
    objectid integer NOT NULL,
    classid integer,
    flooding_t smallint,
    uderfl_t smallint,
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.floodarea OWNER TO fiz;

--

-- Name: floodarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.floodarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.floodarea_extension OWNER TO fiz;

--

-- Name: floodarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.floodarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.floodarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 8899 (class 0 OID 0)
-- Dependencies: 432
-- Name: floodarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.floodarea_objectid_seq OWNED BY fiz.floodarea.objectid;


--

-- Name: flooding_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.flooding_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.flooding_t OWNER TO fiz;

--

-- Name: flooding_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.flooding_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.flooding_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8900 (class 0 OID 0)
-- Dependencies: 434
-- Name: flooding_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.flooding_t_objectid_seq OWNED BY fiz.flooding_t.objectid;


--

-- Name: foreshore; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.foreshore (
    objectid integer NOT NULL,
    classid integer,
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.foreshore OWNER TO fiz;

--

-- Name: foreshore_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.foreshore_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.foreshore_extension OWNER TO fiz;

--

-- Name: foreshore_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.foreshore_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.foreshore_objectid_seq OWNER TO fiz;

--
-- TOC entry 8901 (class 0 OID 0)
-- Dependencies: 437
-- Name: foreshore_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.foreshore_objectid_seq OWNED BY fiz.foreshore.objectid;


--

-- Name: forest; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest (
    objectid integer NOT NULL,
    classid integer,
    forest_cat smallint,
    forest_t smallint,
    forest_val smallint,
    forest_os smallint,
    area numeric(38,8),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.forest OWNER TO fiz;

--

-- Name: forest_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.forest_cat OWNER TO fiz;

--

-- Name: forest_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forest_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forest_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 8902 (class 0 OID 0)
-- Dependencies: 440
-- Name: forest_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forest_cat_objectid_seq OWNED BY fiz.forest_cat.objectid;


--

-- Name: forest_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.forest_extension OWNER TO fiz;

--

-- Name: forest_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forest_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forest_objectid_seq OWNER TO fiz;

--
-- TOC entry 8903 (class 0 OID 0)
-- Dependencies: 442
-- Name: forest_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forest_objectid_seq OWNED BY fiz.forest.objectid;


--

-- Name: forest_os; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest_os (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.forest_os OWNER TO fiz;

--

-- Name: forest_os_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forest_os_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forest_os_objectid_seq OWNER TO fiz;

--
-- TOC entry 8904 (class 0 OID 0)
-- Dependencies: 444
-- Name: forest_os_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forest_os_objectid_seq OWNED BY fiz.forest_os.objectid;


--

-- Name: forest_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.forest_t OWNER TO fiz;

--

-- Name: forest_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forest_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forest_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8905 (class 0 OID 0)
-- Dependencies: 446
-- Name: forest_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forest_t_objectid_seq OWNED BY fiz.forest_t.objectid;


--

-- Name: forest_val; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forest_val (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.forest_val OWNER TO fiz;

--

-- Name: forest_val_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forest_val_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forest_val_objectid_seq OWNER TO fiz;

--
-- TOC entry 8906 (class 0 OID 0)
-- Dependencies: 448
-- Name: forest_val_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forest_val_objectid_seq OWNED BY fiz.forest_val.objectid;


--

-- Name: forestpark; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forestpark (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    obj_desc character varying(255),
    area numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.forestpark OWNER TO fiz;

--

-- Name: forestpark_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.forestpark_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.forestpark_extension OWNER TO fiz;

--

-- Name: forestpark_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.forestpark_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.forestpark_objectid_seq OWNER TO fiz;

--
-- TOC entry 8907 (class 0 OID 0)
-- Dependencies: 451
-- Name: forestpark_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.forestpark_objectid_seq OWNED BY fiz.forestpark.objectid;


--

-- Name: fp_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fp_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fp_class OWNER TO fiz;

--

-- Name: fp_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fp_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fp_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 8908 (class 0 OID 0)
-- Dependencies: 453
-- Name: fp_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fp_class_objectid_seq OWNED BY fiz.fp_class.objectid;


--

-- Name: fp_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fp_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fp_type OWNER TO fiz;

--

-- Name: fp_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fp_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fp_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8909 (class 0 OID 0)
-- Dependencies: 455
-- Name: fp_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fp_type_objectid_seq OWNED BY fiz.fp_type.objectid;


--

-- Name: fs_objects; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fs_objects (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fs_objects OWNER TO fiz;

--

-- Name: fs_objects_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fs_objects_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fs_objects_objectid_seq OWNER TO fiz;

--
-- TOC entry 8910 (class 0 OID 0)
-- Dependencies: 457
-- Name: fs_objects_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fs_objects_objectid_seq OWNED BY fiz.fs_objects.objectid;


--

-- Name: fses_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fses_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE fiz.fses_stype OWNER TO fiz;

CREATE SEQUENCE fiz.fses_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.fses_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.fses_stype_objectid_seq OWNED BY fiz.fses_stype.objectid;

CREATE TABLE fiz.fuel_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE fiz.fuel_type OWNER TO fiz;

CREATE SEQUENCE fiz.fuel_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE fiz.fuel_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.fuel_type_objectid_seq OWNED BY fiz.fuel_type.objectid;


--
CREATE TABLE fiz.street_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(254),
    name character varying(254),
    address character varying(254),
    str_r_type smallint,
    str_l_type smallint,
    surface_exist smallint,
    surface_plan smallint,
    function character varying(254),
    event_time integer,
    source character varying(254),
    note character varying(254),
    status smallint,
    reg_status smallint,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.street_line OWNER to fiz;

CREATE SEQUENCE fiz.street_line_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.street_line_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.street_line_objectid_seq OWNED BY fiz.street_line.objectid;

--
CREATE TABLE fiz.streetv_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(254),
    name character varying(254),
    address character varying(254),
    str_r_type smallint,
    surface_exist smallint,
    surface_plan smallint,
    function character varying(254),
    event_time integer,
    source character varying(254),
    note character varying(254),
    status smallint,
    reg_status smallint,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.streetv_line OWNER to fiz;

CREATE SEQUENCE fiz.streetv_line_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.streetv_line_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.streetv_line_objectid_seq OWNED BY fiz.streetv_line.objectid;

--
CREATE TABLE fiz.telecomnetworkline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(254),
    name character varying(254),
    wear_prcnt double precision,
    comm_type integer,
    comm_ctype integer,
    cable_type integer,
    zone_size double precision,
    danger_obj integer,
    function character varying(254),
    event_time integer,
    source character varying(254),
    note character varying(254),
    status smallint,
    reg_status smallint,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.telecomnetworkline_line OWNER to fiz;

CREATE SEQUENCE fiz.telecomnetworkline_line_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.telecomnetworkline_line_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.telecomnetworkline_line_objectid_seq OWNED BY fiz.telecomnetworkline_line.objectid;


--
CREATE TABLE fiz.functionalzone (
    objectid integer NOT NULL,
    classid integer,
    fz_mfstp smallint,
    fz_odstp smallint,
    fz_ingstp smallint,
    fz_trstp smallint,
    fz_shstp smallint,
    fz_recstp smallint,
    fz_orecstp smallint,
    area numeric(38,8),
    info_obj character varying(255),
    constr_den numeric(38,8),
    bld_height integer,
    pop_den numeric(38,8),
    population integer,
    hzrd_class integer,
    other character varying(255),
    event_time integer,
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    shape_leng numeric,
    shape_area numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);
ALTER TABLE fiz.functionalzone OWNER TO fiz;

CREATE TABLE fiz.functionalzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);
ALTER TABLE fiz.functionalzone_extension OWNER TO fiz;

CREATE SEQUENCE fiz.functionalzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.functionalzone_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.functionalzone_objectid_seq OWNED BY fiz.functionalzone.objectid;


--
CREATE TABLE fiz.fz_ingstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE fiz.fz_ingstp OWNER TO fiz;

CREATE SEQUENCE fiz.fz_ingstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.fz_ingstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.fz_ingstp_objectid_seq OWNED BY fiz.fz_ingstp.objectid;


--

-- Name: fz_mfstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_mfstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_mfstp OWNER TO fiz;

--

-- Name: fz_mfstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_mfstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_mfstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8915 (class 0 OID 0)
-- Dependencies: 468
-- Name: fz_mfstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_mfstp_objectid_seq OWNED BY fiz.fz_mfstp.objectid;


--

-- Name: fz_odstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_odstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_odstp OWNER TO fiz;

--

-- Name: fz_odstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_odstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_odstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8916 (class 0 OID 0)
-- Dependencies: 470
-- Name: fz_odstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_odstp_objectid_seq OWNED BY fiz.fz_odstp.objectid;


--

-- Name: fz_orecstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_orecstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_orecstp OWNER TO fiz;

--

-- Name: fz_orecstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_orecstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_orecstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8917 (class 0 OID 0)
-- Dependencies: 472
-- Name: fz_orecstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_orecstp_objectid_seq OWNED BY fiz.fz_orecstp.objectid;


--

-- Name: fz_recstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_recstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_recstp OWNER TO fiz;

--

-- Name: fz_recstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_recstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_recstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8918 (class 0 OID 0)
-- Dependencies: 474
-- Name: fz_recstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_recstp_objectid_seq OWNED BY fiz.fz_recstp.objectid;


--

-- Name: fz_shstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_shstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_shstp OWNER TO fiz;

--

-- Name: fz_shstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_shstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_shstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8919 (class 0 OID 0)
-- Dependencies: 476
-- Name: fz_shstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_shstp_objectid_seq OWNED BY fiz.fz_shstp.objectid;


--

-- Name: fz_trstp; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.fz_trstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.fz_trstp OWNER TO fiz;

--

-- Name: fz_trstp_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.fz_trstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.fz_trstp_objectid_seq OWNER TO fiz;

--
-- TOC entry 8920 (class 0 OID 0)
-- Dependencies: 478
-- Name: fz_trstp_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.fz_trstp_objectid_seq OWNED BY fiz.fz_trstp.objectid;


--

-- Name: gas_st_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gas_st_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.gas_st_type OWNER TO fiz;

--

-- Name: gas_st_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.gas_st_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.gas_st_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8921 (class 0 OID 0)
-- Dependencies: 480
-- Name: gas_st_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.gas_st_type_objectid_seq OWNED BY fiz.gas_st_type.objectid;


--

-- Name: gasfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gasfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    shape_leng numeric,
    shape_area numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.gasfacility OWNER TO fiz;

--

-- Name: gasfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gasfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.gasfacility_extension OWNER TO fiz;

--

-- Name: gasfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.gasfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.gasfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 8922 (class 0 OID 0)
-- Dependencies: 483
-- Name: gasfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.gasfacility_objectid_seq OWNED BY fiz.gasfacility.objectid;


--

-- Name: gasfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gasfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.gasfacility_point OWNER TO fiz;

--

-- Name: gasfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gasfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.gasfacility_point_extension OWNER TO fiz;

--

-- Name: gasfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.gasfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.gasfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8923 (class 0 OID 0)
-- Dependencies: 486
-- Name: gasfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.gasfacility_point_objectid_seq OWNED BY fiz.gasfacility_point.objectid;


--

-- Name: gaspipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gaspipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    pline_cnt integer,
    d_pline integer,
    cat_distr smallint,
    pressure numeric(38,8),
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    shape_leng numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.gaspipeline_line OWNER TO fiz;

--

-- Name: gaspipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gaspipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.gaspipeline_line_extension OWNER TO fiz;

--

-- Name: gaspipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.gaspipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.gaspipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 8924 (class 0 OID 0)
-- Dependencies: 489
-- Name: gaspipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.gaspipeline_objectid_seq OWNED BY fiz.gaspipeline_line.objectid;


--

-- Name: greeneryplanting; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.greeneryplanting (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    obj_desc character varying(255),
    ozsn_type smallint,
    area numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.greeneryplanting OWNER TO fiz;

--

-- Name: greeneryplanting_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.greeneryplanting_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.greeneryplanting_extension OWNER TO fiz;

--

-- Name: greeneryplanting_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.greeneryplanting_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.greeneryplanting_objectid_seq OWNER TO fiz;

--
-- TOC entry 8925 (class 0 OID 0)
-- Dependencies: 492
-- Name: greeneryplanting_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.greeneryplanting_objectid_seq OWNED BY fiz.greeneryplanting.objectid;


--

-- Name: ground_pos; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ground_pos (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ground_pos OWNER TO fiz;

--

-- Name: ground_pos_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ground_pos_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ground_pos_objectid_seq OWNER TO fiz;

--
-- TOC entry 8926 (class 0 OID 0)
-- Dependencies: 494
-- Name: ground_pos_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ground_pos_objectid_seq OWNED BY fiz.ground_pos.objectid;


--

-- Name: gts_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.gts_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.gts_class OWNER TO fiz;

--

-- Name: gts_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.gts_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.gts_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 8927 (class 0 OID 0)
-- Dependencies: 496
-- Name: gts_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.gts_class_objectid_seq OWNED BY fiz.gts_class.objectid;


--

-- Name: hazardarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hazardarea (
    objectid integer NOT NULL,
    classid integer,
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hazardarea OWNER TO fiz;

--

-- Name: hazardarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hazardarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hazardarea_extension OWNER TO fiz;

--

-- Name: hazardarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hazardarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hazardarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 8928 (class 0 OID 0)
-- Dependencies: 499
-- Name: hazardarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hazardarea_objectid_seq OWNED BY fiz.hazardarea.objectid;


--

-- Name: health; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.health (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    md_stype smallint,
    amb_type smallint,
    mst_type smallint,
    su_type smallint,
    msd_type smallint,
    mc_type smallint,
    capacity_s integer,
    capacity24 integer,
    capacity integer,
    num_cars integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.health OWNER TO fiz;

--

-- Name: health_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.health_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.health_extension OWNER TO fiz;

--

-- Name: health_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.health_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.health_objectid_seq OWNER TO fiz;

--
-- TOC entry 8929 (class 0 OID 0)
-- Dependencies: 502
-- Name: health_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.health_objectid_seq OWNED BY fiz.health.objectid;


--

-- Name: health_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.health_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    md_stype smallint,
    amb_type smallint,
    mst_type smallint,
    su_type smallint,
    msd_type smallint,
    mc_type smallint,
    capacity_s integer,
    capacity24 integer,
    capacity integer,
    num_cars integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.health_point OWNER TO fiz;

--

-- Name: health_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.health_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.health_point_extension OWNER TO fiz;

--

-- Name: health_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.health_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.health_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8930 (class 0 OID 0)
-- Dependencies: 505
-- Name: health_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.health_point_objectid_seq OWNED BY fiz.health_point.objectid;


--

-- Name: her_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.her_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.her_type OWNER TO fiz;

--

-- Name: her_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.her_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.her_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8931 (class 0 OID 0)
-- Dependencies: 507
-- Name: her_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.her_type_objectid_seq OWNED BY fiz.her_type.objectid;


--

-- Name: heritage_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritage_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    reg_number character varying(255),
    hist_cat smallint,
    her_type smallint,
    ans_type smallint,
    hist_out character varying(255),
    och_use smallint,
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.heritage_point OWNER TO fiz;

--

-- Name: heritage_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.heritage_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.heritage_objectid_seq OWNER TO fiz;

--
-- TOC entry 8932 (class 0 OID 0)
-- Dependencies: 509
-- Name: heritage_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.heritage_objectid_seq OWNED BY fiz.heritage_point.objectid;


--

-- Name: heritage_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritage_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.heritage_point_extension OWNER TO fiz;

--

-- Name: heritagearea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritagearea (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    reg_number character varying(255),
    specific smallint,
    hist_cat smallint,
    hist_out smallint,
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.heritagearea OWNER TO fiz;

--

-- Name: heritagearea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritagearea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.heritagearea_extension OWNER TO fiz;

--

-- Name: heritagearea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.heritagearea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.heritagearea_objectid_seq OWNER TO fiz;

--
-- TOC entry 8933 (class 0 OID 0)
-- Dependencies: 513
-- Name: heritagearea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.heritagearea_objectid_seq OWNED BY fiz.heritagearea.objectid;


--

-- Name: heritageprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritageprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.heritageprotectionzone OWNER TO fiz;

--

-- Name: heritageprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.heritageprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.heritageprotectionzone_extension OWNER TO fiz;

--

-- Name: heritageprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.heritageprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.heritageprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8934 (class 0 OID 0)
-- Dependencies: 516
-- Name: heritageprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.heritageprotectionzone_objectid_seq OWNED BY fiz.heritageprotectionzone.objectid;


--

-- Name: hist_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hist_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.hist_cat OWNER TO fiz;

--

-- Name: hist_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hist_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hist_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 8935 (class 0 OID 0)
-- Dependencies: 518
-- Name: hist_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hist_cat_objectid_seq OWNED BY fiz.hist_cat.objectid;


--

-- Name: hist_out; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hist_out (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.hist_out OWNER TO fiz;

--

-- Name: hist_out_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hist_out_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hist_out_objectid_seq OWNER TO fiz;

--
-- TOC entry 8936 (class 0 OID 0)
-- Dependencies: 520
-- Name: hist_out_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hist_out_objectid_seq OWNED BY fiz.hist_out.objectid;


--

-- Name: historicsettlement; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.historicsettlement (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    settl_cat smallint,
    source character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.historicsettlement OWNER TO fiz;

--

-- Name: historicsettlement_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.historicsettlement_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.historicsettlement_extension OWNER TO fiz;

--

-- Name: historicsettlement_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.historicsettlement_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.historicsettlement_objectid_seq OWNER TO fiz;

--
-- TOC entry 8937 (class 0 OID 0)
-- Dependencies: 523
-- Name: historicsettlement_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.historicsettlement_objectid_seq OWNED BY fiz.historicsettlement.objectid;


--

-- Name: hot_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hot_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.hot_stype OWNER TO fiz;

--

-- Name: hot_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hot_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hot_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8938 (class 0 OID 0)
-- Dependencies: 525
-- Name: hot_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hot_stype_objectid_seq OWNED BY fiz.hot_stype.objectid;


--

-- Name: hydraulicstructures_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydraulicstructures_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    gts_class smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    zone_size numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hydraulicstructures_line OWNER TO fiz;

--

-- Name: hydraulicstructures_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydraulicstructures_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hydraulicstructures_line_extension OWNER TO fiz;

--

-- Name: hydraulicstructures_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hydraulicstructures_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hydraulicstructures_objectid_seq OWNER TO fiz;

--
-- TOC entry 8939 (class 0 OID 0)
-- Dependencies: 528
-- Name: hydraulicstructures_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hydraulicstructures_objectid_seq OWNED BY fiz.hydraulicstructures_line.objectid;


--

-- Name: hydraulicstructures_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydraulicstructures_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    gts_class smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    zone_size numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hydraulicstructures_point OWNER TO fiz;

--

-- Name: hydraulicstructures_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydraulicstructures_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hydraulicstructures_point_extension OWNER TO fiz;

--

-- Name: hydraulicstructures_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hydraulicstructures_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hydraulicstructures_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8940 (class 0 OID 0)
-- Dependencies: 531
-- Name: hydraulicstructures_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hydraulicstructures_point_objectid_seq OWNED BY fiz.hydraulicstructures_point.objectid;


--

-- Name: hydro; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    length numeric(38,8),
    area numeric(38,8),
    wpz_size numeric(38,8),
    rs_size numeric(38,8),
    fsh_size numeric(38,8),
    event_time integer,
    source character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hydro OWNER TO fiz;

--

-- Name: hydro_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hydro_extension OWNER TO fiz;

--

-- Name: hydro_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    length numeric(38,8),
    area numeric(38,8),
    wpz_size numeric(38,8),
    rs_size numeric(38,8),
    fsh_size numeric(38,8),
    event_time integer,
    source character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hydro_line OWNER TO fiz;

--

-- Name: hydro_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hydro_line_extension OWNER TO fiz;

--

-- Name: hydro_line_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hydro_line_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hydro_line_objectid_seq OWNER TO fiz;

--
-- TOC entry 8941 (class 0 OID 0)
-- Dependencies: 536
-- Name: hydro_line_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hydro_line_objectid_seq OWNED BY fiz.hydro_line.objectid;


--

-- Name: hydro_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hydro_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hydro_objectid_seq OWNER TO fiz;

--
-- TOC entry 8942 (class 0 OID 0)
-- Dependencies: 537
-- Name: hydro_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hydro_objectid_seq OWNED BY fiz.hydro.objectid;


--

-- Name: hydro_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    length numeric(38,8),
    area numeric(38,8),
    wpz_size numeric(38,8),
    rs_size numeric(38,8),
    fsh_size numeric(38,8),
    event_time integer,
    source character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.hydro_point OWNER TO fiz;

--

-- Name: hydro_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hydro_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.hydro_point_extension OWNER TO fiz;

--

-- Name: hydro_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hydro_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hydro_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8943 (class 0 OID 0)
-- Dependencies: 540
-- Name: hydro_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hydro_point_objectid_seq OWNED BY fiz.hydro_point.objectid;


--

-- Name: hzrd_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hzrd_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.hzrd_cat OWNER TO fiz;

--

-- Name: hzrd_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hzrd_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hzrd_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 8944 (class 0 OID 0)
-- Dependencies: 542
-- Name: hzrd_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hzrd_cat_objectid_seq OWNED BY fiz.hzrd_cat.objectid;


--

-- Name: hzrd_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.hzrd_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.hzrd_class OWNER TO fiz;

--

-- Name: hzrd_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.hzrd_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.hzrd_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 8945 (class 0 OID 0)
-- Dependencies: 544
-- Name: hzrd_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.hzrd_class_objectid_seq OWNED BY fiz.hzrd_class.objectid;


--

-- Name: ind_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ind_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ind_type OWNER TO fiz;

--

-- Name: ind_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ind_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ind_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8946 (class 0 OID 0)
-- Dependencies: 546
-- Name: ind_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ind_type_objectid_seq OWNED BY fiz.ind_type.objectid;


--

-- Name: int_trf_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.int_trf_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.int_trf_t OWNER TO fiz;

--

-- Name: int_trf_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.int_trf_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.int_trf_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8947 (class 0 OID 0)
-- Dependencies: 548
-- Name: int_trf_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.int_trf_t_objectid_seq OWNED BY fiz.int_trf_t.objectid;


--

-- Name: int_trn_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.int_trn_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.int_trn_t OWNER TO fiz;

--

-- Name: int_trn_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.int_trn_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.int_trn_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 8948 (class 0 OID 0)
-- Dependencies: 550
-- Name: int_trn_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.int_trn_t_objectid_seq OWNED BY fiz.int_trn_t.objectid;


--

-- Name: investmentsite; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.investmentsite (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    location character varying(255),
    prom_direct smallint,
    soc_direct smallint,
    add_direct character varying(255),
    objects character varying(255),
    r_affinity smallint,
    area_hect numeric(38,8),
    avail_room character varying(255),
    ownership character varying(255),
    grant_cond smallint,
    road smallint,
    railway smallint,
    port smallint,
    gas smallint,
    heat smallint,
    electr smallint,
    water smallint,
    sewer smallint,
    telecom smallint,
    foundation character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.investmentsite OWNER TO fiz;

--

-- Name: investmentsite_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.investmentsite_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.investmentsite_objectid_seq OWNER TO fiz;

--
-- TOC entry 8949 (class 0 OID 0)
-- Dependencies: 552
-- Name: investmentsite_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.investmentsite_objectid_seq OWNED BY fiz.investmentsite.objectid;


--

-- Name: investmentzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.investmentzone (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    main_activ character varying(255),
    area numeric(38,8),
    live_time integer,
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.investmentzone OWNER TO fiz;

--

-- Name: investmentzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.investmentzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.investmentzone_extension OWNER TO fiz;

--

-- Name: investmentzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.investmentzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.investmentzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8950 (class 0 OID 0)
-- Dependencies: 555
-- Name: investmentzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.investmentzone_objectid_seq OWNED BY fiz.investmentzone.objectid;


--

-- Name: land_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.land_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.land_type OWNER TO fiz;

--

-- Name: land_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.land_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.land_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8951 (class 0 OID 0)
-- Dependencies: 557
-- Name: land_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.land_type_objectid_seq OWNED BY fiz.land_type.objectid;


--

-- Name: landuse; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.landuse (
    objectid integer NOT NULL,
    classid integer,
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.landuse OWNER TO fiz;

--

-- Name: landuse_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.landuse_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.landuse_extension OWNER TO fiz;

--

-- Name: landuse_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.landuse_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.landuse_objectid_seq OWNER TO fiz;

--
-- TOC entry 8952 (class 0 OID 0)
-- Dependencies: 560
-- Name: landuse_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.landuse_objectid_seq OWNED BY fiz.landuse.objectid;


--

-- Name: main_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.main_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.main_type OWNER TO fiz;

--

-- Name: main_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.main_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.main_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8953 (class 0 OID 0)
-- Dependencies: 562
-- Name: main_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.main_type_objectid_seq OWNED BY fiz.main_type.objectid;


--

-- Name: manufacturing; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.manufacturing (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    main_activ character varying(255),
    add_activ character varying(255),
    mp_type smallint,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.manufacturing OWNER TO fiz;

--

-- Name: manufacturing_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.manufacturing_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.manufacturing_extension OWNER TO fiz;

--

-- Name: manufacturing_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.manufacturing_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.manufacturing_objectid_seq OWNER TO fiz;

--
-- TOC entry 8954 (class 0 OID 0)
-- Dependencies: 565
-- Name: manufacturing_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.manufacturing_objectid_seq OWNED BY fiz.manufacturing.objectid;


--

-- Name: manufacturing_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.manufacturing_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    main_activ character varying(255),
    add_activ character varying(255),
    mp_type smallint,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.manufacturing_point OWNER TO fiz;

--

-- Name: manufacturing_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.manufacturing_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.manufacturing_point_extension OWNER TO fiz;

--

-- Name: manufacturing_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.manufacturing_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.manufacturing_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8955 (class 0 OID 0)
-- Dependencies: 568
-- Name: manufacturing_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.manufacturing_point_objectid_seq OWNED BY fiz.manufacturing_point.objectid;


--

-- Name: mc_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mc_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.mc_type OWNER TO fiz;

--

-- Name: mc_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mc_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mc_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8956 (class 0 OID 0)
-- Dependencies: 570
-- Name: mc_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mc_type_objectid_seq OWNED BY fiz.mc_type.objectid;


--

-- Name: md_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.md_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.md_stype OWNER TO fiz;

--

-- Name: md_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.md_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.md_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8957 (class 0 OID 0)
-- Dependencies: 572
-- Name: md_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.md_stype_objectid_seq OWNED BY fiz.md_stype.objectid;


--

-- Name: min_atype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.min_atype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.min_atype OWNER TO fiz;

--

-- Name: min_atype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.min_atype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.min_atype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8958 (class 0 OID 0)
-- Dependencies: 574
-- Name: min_atype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.min_atype_objectid_seq OWNED BY fiz.min_atype.objectid;


--

-- Name: min_mtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.min_mtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.min_mtype OWNER TO fiz;

--

-- Name: min_mtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.min_mtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.min_mtype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8959 (class 0 OID 0)
-- Dependencies: 576
-- Name: min_mtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.min_mtype_objectid_seq OWNED BY fiz.min_mtype.objectid;


--

-- Name: min_ntype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.min_ntype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.min_ntype OWNER TO fiz;

--

-- Name: min_ntype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.min_ntype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.min_ntype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8960 (class 0 OID 0)
-- Dependencies: 578
-- Name: min_ntype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.min_ntype_objectid_seq OWNED BY fiz.min_ntype.objectid;


--

-- Name: mineralarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineralarea (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    location character varying(255),
    min_develp character varying(255),
    minerals character varying(255),
    licence character varying(255),
    date_start timestamp without time zone,
    date_close timestamp without time zone,
    area numeric(38,8),
    status_otv character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.mineralarea OWNER TO fiz;

--

-- Name: mineralarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineralarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.mineralarea_extension OWNER TO fiz;

--

-- Name: mineralarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mineralarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mineralarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 8961 (class 0 OID 0)
-- Dependencies: 581
-- Name: mineralarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mineralarea_objectid_seq OWNED BY fiz.mineralarea.objectid;


--

-- Name: mineraldep; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineraldep (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    min_mtype smallint,
    min_ntype smallint,
    minerals character varying(255),
    min_atype smallint,
    n_grf character varying(255),
    mas character varying(255),
    note character varying(255),
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.mineraldep OWNER TO fiz;

--

-- Name: mineraldep_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineraldep_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.mineraldep_extension OWNER TO fiz;

--

-- Name: mineraldep_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mineraldep_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mineraldep_objectid_seq OWNER TO fiz;

--
-- TOC entry 8962 (class 0 OID 0)
-- Dependencies: 584
-- Name: mineraldep_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mineraldep_objectid_seq OWNED BY fiz.mineraldep.objectid;


--

-- Name: mineraldep_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineraldep_point (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    min_mtype smallint,
    min_ntype smallint,
    minerals character varying(255),
    min_atype smallint,
    n_grf character varying(255),
    mas character varying(255),
    note character varying(255),
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.mineraldep_point OWNER TO fiz;

--

-- Name: mineraldep_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mineraldep_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.mineraldep_point_extension OWNER TO fiz;

--

-- Name: mineraldep_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mineraldep_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mineraldep_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8963 (class 0 OID 0)
-- Dependencies: 587
-- Name: mineraldep_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mineraldep_point_objectid_seq OWNED BY fiz.mineraldep_point.objectid;


--

-- Name: mp_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mp_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.mp_type OWNER TO fiz;

--

-- Name: mp_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mp_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mp_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8964 (class 0 OID 0)
-- Dependencies: 589
-- Name: mp_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mp_type_objectid_seq OWNED BY fiz.mp_type.objectid;


--

-- Name: msd_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.msd_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.msd_type OWNER TO fiz;

--

-- Name: msd_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.msd_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.msd_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8965 (class 0 OID 0)
-- Dependencies: 591
-- Name: msd_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.msd_type_objectid_seq OWNED BY fiz.msd_type.objectid;


--

-- Name: mst_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.mst_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.mst_type OWNER TO fiz;

--

-- Name: mst_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.mst_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.mst_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8966 (class 0 OID 0)
-- Dependencies: 593
-- Name: mst_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.mst_type_objectid_seq OWNED BY fiz.mst_type.objectid;


--

-- Name: naturalriskzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.naturalriskzone (
    objectid integer NOT NULL,
    classid integer,
    eme_source smallint,
    risk_cat smallint,
    eme_class smallint,
    other character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.naturalriskzone OWNER TO fiz;

--

-- Name: naturalriskzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.naturalriskzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.naturalriskzone_extension OWNER TO fiz;

--

-- Name: naturalriskzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.naturalriskzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.naturalriskzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8967 (class 0 OID 0)
-- Dependencies: 596
-- Name: naturalriskzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.naturalriskzone_objectid_seq OWNED BY fiz.naturalriskzone.objectid;


--

-- Name: naturalriskzone_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.naturalriskzone_point (
    objectid integer NOT NULL,
    classid integer,
    eme_source smallint,
    risk_cat smallint,
    eme_class smallint,
    other character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.naturalriskzone_point OWNER TO fiz;

--

-- Name: naturalriskzone_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.naturalriskzone_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.naturalriskzone_point_extension OWNER TO fiz;

--

-- Name: naturalriskzone_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.naturalriskzone_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.naturalriskzone_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8968 (class 0 OID 0)
-- Dependencies: 599
-- Name: naturalriskzone_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.naturalriskzone_point_objectid_seq OWNED BY fiz.naturalriskzone_point.objectid;


--

-- Name: natureprotectarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectarea (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    location character varying(255),
    area numeric(38,8),
    obj_desc character varying(255),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.natureprotectarea OWNER TO fiz;

--

-- Name: natureprotectarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.natureprotectarea_extension OWNER TO fiz;

--

-- Name: natureprotectarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.natureprotectarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.natureprotectarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 8969 (class 0 OID 0)
-- Dependencies: 602
-- Name: natureprotectarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.natureprotectarea_objectid_seq OWNED BY fiz.natureprotectarea.objectid;


--

-- Name: natureprotectarea_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectarea_point (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    location character varying(255),
    area numeric(38,8),
    obj_desc character varying(255),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.natureprotectarea_point OWNER TO fiz;

--

-- Name: natureprotectarea_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectarea_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.natureprotectarea_point_extension OWNER TO fiz;

--

-- Name: natureprotectarea_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.natureprotectarea_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.natureprotectarea_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8970 (class 0 OID 0)
-- Dependencies: 605
-- Name: natureprotectarea_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.natureprotectarea_point_objectid_seq OWNED BY fiz.natureprotectarea_point.objectid;


--

-- Name: natureprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_oopt smallint,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.natureprotectionzone OWNER TO fiz;

--

-- Name: natureprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.natureprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.natureprotectionzone_extension OWNER TO fiz;

--

-- Name: natureprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.natureprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.natureprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8971 (class 0 OID 0)
-- Dependencies: 608
-- Name: natureprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.natureprotectionzone_objectid_seq OWNED BY fiz.natureprotectionzone.objectid;


--

-- Name: num_tracks; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.num_tracks (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.num_tracks OWNER TO fiz;

--

-- Name: num_tracks_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.num_tracks_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.num_tracks_objectid_seq OWNER TO fiz;

--
-- TOC entry 8972 (class 0 OID 0)
-- Dependencies: 610
-- Name: num_tracks_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.num_tracks_objectid_seq OWNED BY fiz.num_tracks.objectid;


--

-- Name: object_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.object_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.object_extension OWNER TO fiz;

--

-- Name: och_use; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.och_use (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.och_use OWNER TO fiz;

--

-- Name: och_use_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.och_use_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.och_use_objectid_seq OWNER TO fiz;

--
-- TOC entry 8973 (class 0 OID 0)
-- Dependencies: 613
-- Name: och_use_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.och_use_objectid_seq OWNED BY fiz.och_use.objectid;


--

-- Name: oilfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    volume numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.oilfacility OWNER TO fiz;

--

-- Name: oilfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.oilfacility_extension OWNER TO fiz;

--

-- Name: oilfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.oilfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.oilfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 8974 (class 0 OID 0)
-- Dependencies: 616
-- Name: oilfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.oilfacility_objectid_seq OWNED BY fiz.oilfacility.objectid;


--

-- Name: oilfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    volume numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.oilfacility_point OWNER TO fiz;

--

-- Name: oilfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.oilfacility_point_extension OWNER TO fiz;

--

-- Name: oilfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.oilfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.oilfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8975 (class 0 OID 0)
-- Dependencies: 619
-- Name: oilfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.oilfacility_point_objectid_seq OWNED BY fiz.oilfacility_point.objectid;


--

-- Name: oilpipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilpipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    pline_cnt integer,
    d_pline integer,
    pressure numeric(38,8),
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.oilpipeline_line OWNER TO fiz;

--

-- Name: oilpipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oilpipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.oilpipeline_line_extension OWNER TO fiz;

--

-- Name: oilpipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.oilpipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.oilpipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 8976 (class 0 OID 0)
-- Dependencies: 622
-- Name: oilpipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.oilpipeline_objectid_seq OWNED BY fiz.oilpipeline_line.objectid;


--

-- Name: oro_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oro_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.oro_stype OWNER TO fiz;

--

-- Name: oro_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.oro_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.oro_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 8977 (class 0 OID 0)
-- Dependencies: 624
-- Name: oro_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.oro_stype_objectid_seq OWNED BY fiz.oro_stype.objectid;


--

-- Name: oro_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.oro_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.oro_type OWNER TO fiz;

--

-- Name: oro_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.oro_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.oro_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8978 (class 0 OID 0)
-- Dependencies: 626
-- Name: oro_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.oro_type_objectid_seq OWNED BY fiz.oro_type.objectid;


--

-- Name: otherobject; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherobject (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(255),
    address character varying(255),
    lawsource character varying(255),
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    szz_size numeric(38,8),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.otherobject OWNER TO fiz;

--

-- Name: otherobject_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherobject_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.otherobject_extension OWNER TO fiz;

--

-- Name: otherobject_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.otherobject_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.otherobject_objectid_seq OWNER TO fiz;

--
-- TOC entry 8979 (class 0 OID 0)
-- Dependencies: 629
-- Name: otherobject_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.otherobject_objectid_seq OWNED BY fiz.otherobject.objectid;


--

-- Name: otherobject_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherobject_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(255),
    address character varying(255),
    lawsource character varying(255),
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    szz_size numeric(38,8),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.otherobject_point OWNER TO fiz;

--

-- Name: otherobject_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherobject_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.otherobject_point_extension OWNER TO fiz;

--

-- Name: otherobject_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.otherobject_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.otherobject_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8980 (class 0 OID 0)
-- Dependencies: 632
-- Name: otherobject_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.otherobject_point_objectid_seq OWNED BY fiz.otherobject_point.objectid;


--

-- Name: otherprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.otherprotectionzone OWNER TO fiz;

--

-- Name: otherprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.otherprotectionzone_extension OWNER TO fiz;

--

-- Name: otherprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.otherprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.otherprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8981 (class 0 OID 0)
-- Dependencies: 635
-- Name: otherprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.otherprotectionzone_objectid_seq OWNED BY fiz.otherprotectionzone.objectid;


--

-- Name: otherzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    aeroszone smallint,
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.otherzone OWNER TO fiz;

--

-- Name: otherzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.otherzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.otherzone_extension OWNER TO fiz;

--

-- Name: otherzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.otherzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.otherzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8982 (class 0 OID 0)
-- Dependencies: 638
-- Name: otherzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.otherzone_objectid_seq OWNED BY fiz.otherzone.objectid;


--

-- Name: ozsn_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ozsn_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ozsn_type OWNER TO fiz;

--

-- Name: ozsn_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ozsn_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ozsn_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8983 (class 0 OID 0)
-- Dependencies: 640
-- Name: ozsn_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ozsn_type_objectid_seq OWNED BY fiz.ozsn_type.objectid;


--

-- Name: pass_term; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pass_term (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.pass_term OWNER TO fiz;

--

-- Name: pass_term_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pass_term_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pass_term_objectid_seq OWNER TO fiz;

--
-- TOC entry 8984 (class 0 OID 0)
-- Dependencies: 642
-- Name: pass_term_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pass_term_objectid_seq OWNED BY fiz.pass_term.objectid;


--

-- Name: ped_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ped_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ped_type OWNER TO fiz;

--

-- Name: ped_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ped_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ped_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8985 (class 0 OID 0)
-- Dependencies: 644
-- Name: ped_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ped_type_objectid_seq OWNED BY fiz.ped_type.objectid;


--

-- Name: pipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    pline_cnt integer,
    d_pline integer,
    cat_main smallint,
    pressure numeric(38,8),
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.pipeline_line OWNER TO fiz;

--

-- Name: pipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.pipeline_line_extension OWNER TO fiz;

--

-- Name: pipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 8986 (class 0 OID 0)
-- Dependencies: 647
-- Name: pipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pipeline_objectid_seq OWNED BY fiz.pipeline_line.objectid;


--

-- Name: pkio_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pkio_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.pkio_type OWNER TO fiz;

--

-- Name: pkio_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pkio_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pkio_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8987 (class 0 OID 0)
-- Dependencies: 649
-- Name: pkio_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pkio_type_objectid_seq OWNED BY fiz.pkio_type.objectid;


--

-- Name: pl_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pl_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.pl_type OWNER TO fiz;

--

-- Name: pl_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pl_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pl_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8988 (class 0 OID 0)
-- Dependencies: 651
-- Name: pl_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pl_type_objectid_seq OWNED BY fiz.pl_type.objectid;


--

-- Name: pline_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pline_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.pline_type OWNER TO fiz;

--

-- Name: pline_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pline_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pline_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8989 (class 0 OID 0)
-- Dependencies: 653
-- Name: pline_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pline_type_objectid_seq OWNED BY fiz.pline_type.objectid;


--

-- Name: power_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.power_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.power_type OWNER TO fiz;

--

-- Name: power_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.power_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.power_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8990 (class 0 OID 0)
-- Dependencies: 655
-- Name: power_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.power_type_objectid_seq OWNED BY fiz.power_type.objectid;


--

-- Name: prg_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prg_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.prg_type OWNER TO fiz;

--

-- Name: prg_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prg_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prg_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8991 (class 0 OID 0)
-- Dependencies: 657
-- Name: prg_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prg_type_objectid_seq OWNED BY fiz.prg_type.objectid;


--

-- Name: prison; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prison (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fses_stype smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    reg_status smallint,
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.prison OWNER TO fiz;

--

-- Name: prison_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prison_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.prison_extension OWNER TO fiz;

--

-- Name: prison_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prison_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prison_objectid_seq OWNER TO fiz;

--
-- TOC entry 8992 (class 0 OID 0)
-- Dependencies: 660
-- Name: prison_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prison_objectid_seq OWNED BY fiz.prison.objectid;


--

-- Name: prison_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prison_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fses_stype smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    reg_status smallint,
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.prison_point OWNER TO fiz;

--

-- Name: prison_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prison_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.prison_point_extension OWNER TO fiz;

--

-- Name: prison_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prison_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prison_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 8993 (class 0 OID 0)
-- Dependencies: 663
-- Name: prison_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prison_point_objectid_seq OWNED BY fiz.prison_point.objectid;


--

-- Name: prkng_lvl; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prkng_lvl (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.prkng_lvl OWNER TO fiz;

--

-- Name: prkng_lvl_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prkng_lvl_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prkng_lvl_objectid_seq OWNER TO fiz;

--
-- TOC entry 8994 (class 0 OID 0)
-- Dependencies: 665
-- Name: prkng_lvl_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prkng_lvl_objectid_seq OWNED BY fiz.prkng_lvl.objectid;


--

-- Name: prkng_time; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prkng_time (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.prkng_time OWNER TO fiz;

--

-- Name: prkng_time_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prkng_time_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prkng_time_objectid_seq OWNER TO fiz;

--
-- TOC entry 8995 (class 0 OID 0)
-- Dependencies: 667
-- Name: prkng_time_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prkng_time_objectid_seq OWNED BY fiz.prkng_time.objectid;


--

-- Name: prkng_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prkng_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.prkng_type OWNER TO fiz;

--

-- Name: prkng_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prkng_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prkng_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 8996 (class 0 OID 0)
-- Dependencies: 669
-- Name: prkng_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prkng_type_objectid_seq OWNED BY fiz.prkng_type.objectid;


--

-- Name: prom_direct; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.prom_direct (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.prom_direct OWNER TO fiz;

--

-- Name: prom_direct_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.prom_direct_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.prom_direct_objectid_seq OWNER TO fiz;

--
-- TOC entry 8997 (class 0 OID 0)
-- Dependencies: 671
-- Name: prom_direct_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.prom_direct_objectid_seq OWNED BY fiz.prom_direct.objectid;


--

-- Name: protectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.protectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.protectionzone OWNER TO fiz;

--

-- Name: protectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.protectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.protectionzone_extension OWNER TO fiz;

--

-- Name: protectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.protectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.protectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 8998 (class 0 OID 0)
-- Dependencies: 674
-- Name: protectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.protectionzone_objectid_seq OWNED BY fiz.protectionzone.objectid;


--

-- Name: proximity; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.proximity (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.proximity OWNER TO fiz;

--

-- Name: proximity_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.proximity_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.proximity_objectid_seq OWNER TO fiz;

--
-- TOC entry 8999 (class 0 OID 0)
-- Dependencies: 676
-- Name: proximity_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.proximity_objectid_seq OWNED BY fiz.proximity.objectid;


--

-- Name: pu_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.pu_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.pu_stype OWNER TO fiz;

--

-- Name: pu_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.pu_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.pu_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9000 (class 0 OID 0)
-- Dependencies: 678
-- Name: pu_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.pu_stype_objectid_seq OWNED BY fiz.pu_stype.objectid;


--

-- Name: public; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.public (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    tpark_type smallint,
    pkio_type smallint,
    ped_type smallint,
    aq_stype smallint,
    sp_area numeric(38,8),
    capacity integer,
    season smallint,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.public OWNER TO fiz;

--

-- Name: public_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.public_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.public_extension OWNER TO fiz;

--

-- Name: public_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.public_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.public_objectid_seq OWNER TO fiz;

--
-- TOC entry 9001 (class 0 OID 0)
-- Dependencies: 681
-- Name: public_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.public_objectid_seq OWNED BY fiz.public.objectid;


--

-- Name: public_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.public_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    tpark_type smallint,
    pkio_type smallint,
    ped_type smallint,
    aq_stype smallint,
    sp_area numeric(38,8),
    capacity integer,
    season smallint,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.public_point OWNER TO fiz;

--

-- Name: public_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.public_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.public_point_extension OWNER TO fiz;

--

-- Name: public_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.public_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.public_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9002 (class 0 OID 0)
-- Dependencies: 684
-- Name: public_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.public_point_objectid_seq OWNED BY fiz.public_point.objectid;


--

-- Name: publictransportline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    ground_pos smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportline_line OWNER TO fiz;

--

-- Name: publictransportline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportline_line_extension OWNER TO fiz;

--

-- Name: publictransportline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportline_objectid_seq OWNER TO fiz;

--
-- TOC entry 9003 (class 0 OID 0)
-- Dependencies: 687
-- Name: publictransportline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportline_objectid_seq OWNED BY fiz.publictransportline_line.objectid;


--

-- Name: publictransportobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    capacity integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportobj OWNER TO fiz;

--

-- Name: publictransportobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportobj_extension OWNER TO fiz;

--

-- Name: publictransportobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 9004 (class 0 OID 0)
-- Dependencies: 690
-- Name: publictransportobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportobj_objectid_seq OWNED BY fiz.publictransportobj.objectid;


--

-- Name: publictransportobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    capacity integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportobj_point OWNER TO fiz;

--

-- Name: publictransportobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportobj_point_extension OWNER TO fiz;

--

-- Name: publictransportobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9005 (class 0 OID 0)
-- Dependencies: 693
-- Name: publictransportobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportobj_point_objectid_seq OWNED BY fiz.publictransportobj_point.objectid;


--

-- Name: publictransportservice; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportservice (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    capacity integer,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportservice OWNER TO fiz;

--

-- Name: publictransportservice_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportservice_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportservice_extension OWNER TO fiz;

--

-- Name: publictransportservice_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportservice_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportservice_objectid_seq OWNER TO fiz;

--
-- TOC entry 9006 (class 0 OID 0)
-- Dependencies: 696
-- Name: publictransportservice_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportservice_objectid_seq OWNED BY fiz.publictransportservice.objectid;


--

-- Name: publictransportservice_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportservice_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    capacity integer,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportservice_point OWNER TO fiz;

--

-- Name: publictransportservice_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportservice_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportservice_point_extension OWNER TO fiz;

--

-- Name: publictransportservice_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportservice_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportservice_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9007 (class 0 OID 0)
-- Dependencies: 699
-- Name: publictransportservice_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportservice_point_objectid_seq OWNED BY fiz.publictransportservice_point.objectid;


--

-- Name: publictransportstops; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportstops (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    stop_type smallint,
    ground_pos smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportstops OWNER TO fiz;

--

-- Name: publictransportstops_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportstops_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportstops_extension OWNER TO fiz;

--

-- Name: publictransportstops_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportstops_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportstops_objectid_seq OWNER TO fiz;

--
-- TOC entry 9008 (class 0 OID 0)
-- Dependencies: 702
-- Name: publictransportstops_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportstops_objectid_seq OWNED BY fiz.publictransportstops.objectid;


--

-- Name: publictransportstops_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportstops_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    stop_type smallint,
    ground_pos smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.publictransportstops_point OWNER TO fiz;

--

-- Name: publictransportstops_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.publictransportstops_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.publictransportstops_point_extension OWNER TO fiz;

--

-- Name: publictransportstops_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.publictransportstops_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.publictransportstops_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9009 (class 0 OID 0)
-- Dependencies: 705
-- Name: publictransportstops_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.publictransportstops_point_objectid_seq OWNED BY fiz.publictransportstops_point.objectid;


--

-- Name: r_affinity; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.r_affinity (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.r_affinity OWNER TO fiz;

--

-- Name: r_affinity_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.r_affinity_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.r_affinity_objectid_seq OWNER TO fiz;

--
-- TOC entry 9010 (class 0 OID 0)
-- Dependencies: 707
-- Name: r_affinity_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.r_affinity_objectid_seq OWNED BY fiz.r_affinity.objectid;


--

-- Name: rad_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rad_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rad_class OWNER TO fiz;

--

-- Name: rad_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rad_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rad_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 9011 (class 0 OID 0)
-- Dependencies: 709
-- Name: rad_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rad_class_objectid_seq OWNED BY fiz.rad_class.objectid;


--

-- Name: railwayfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    using_type smallint,
    rst_type smallint,
    rst_class smallint,
    rfo_type smallint,
    capacity integer,
    suburban_tr smallint,
    freight numeric(38,8),
    pass_train integer,
    cargo_train integer,
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.railwayfacility OWNER TO fiz;

--

-- Name: railwayfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.railwayfacility_extension OWNER TO fiz;

--

-- Name: railwayfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.railwayfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.railwayfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9012 (class 0 OID 0)
-- Dependencies: 712
-- Name: railwayfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.railwayfacility_objectid_seq OWNED BY fiz.railwayfacility.objectid;


--

-- Name: railwayfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    using_type smallint,
    rst_type smallint,
    rst_class smallint,
    rfo_type smallint,
    capacity integer,
    suburban_tr smallint,
    freight numeric(38,8),
    pass_train integer,
    cargo_train integer,
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.railwayfacility_point OWNER TO fiz;

--

-- Name: railwayfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.railwayfacility_point_extension OWNER TO fiz;

--

-- Name: railwayfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.railwayfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.railwayfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9013 (class 0 OID 0)
-- Dependencies: 715
-- Name: railwayfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.railwayfacility_point_objectid_seq OWNED BY fiz.railwayfacility_point.objectid;


--

-- Name: railwayline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    cat_rr smallint,
    el_supply smallint,
    track_type smallint,
    num_tracks smallint,
    capacity integer,
    suburban_tr smallint,
    compl_name character varying(255),
    danger_obj smallint,
    num_tc character varying(255),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.railwayline_line OWNER TO fiz;

--

-- Name: railwayline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.railwayline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.railwayline_line_extension OWNER TO fiz;

--

-- Name: railwayline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.railwayline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.railwayline_objectid_seq OWNER TO fiz;

--
-- TOC entry 9014 (class 0 OID 0)
-- Dependencies: 718
-- Name: railwayline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.railwayline_objectid_seq OWNED BY fiz.railwayline_line.objectid;


--

-- Name: rdwin_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rdwin_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rdwin_cat OWNER TO fiz;

--

-- Name: rdwin_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rdwin_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rdwin_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 9015 (class 0 OID 0)
-- Dependencies: 720
-- Name: rdwin_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rdwin_cat_objectid_seq OWNED BY fiz.rdwin_cat.objectid;


--

-- Name: rdwin_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rdwin_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rdwin_type OWNER TO fiz;

--

-- Name: rdwin_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rdwin_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rdwin_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9016 (class 0 OID 0)
-- Dependencies: 722
-- Name: rdwin_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rdwin_type_objectid_seq OWNED BY fiz.rdwin_type.objectid;


--

-- Name: recreation; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.recreation (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    hot_stype smallint,
    saf_stype smallint,
    chi_stype smallint,
    al_stype smallint,
    capacity integer,
    person_pd integer,
    one_time integer,
    boat_count integer,
    seat_count integer,
    season smallint,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.recreation OWNER TO fiz;

--

-- Name: recreation_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.recreation_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.recreation_extension OWNER TO fiz;

--

-- Name: recreation_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.recreation_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.recreation_objectid_seq OWNER TO fiz;

--
-- TOC entry 9017 (class 0 OID 0)
-- Dependencies: 725
-- Name: recreation_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.recreation_objectid_seq OWNED BY fiz.recreation.objectid;


--

-- Name: recreation_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.recreation_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    hot_stype smallint,
    saf_stype smallint,
    chi_stype smallint,
    al_stype smallint,
    capacity integer,
    person_pd integer,
    one_time integer,
    boat_count integer,
    seat_count integer,
    season smallint,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.recreation_point OWNER TO fiz;

--

-- Name: recreation_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.recreation_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.recreation_point_extension OWNER TO fiz;

--

-- Name: recreation_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.recreation_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.recreation_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9018 (class 0 OID 0)
-- Dependencies: 728
-- Name: recreation_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.recreation_point_objectid_seq OWNED BY fiz.recreation_point.objectid;


--

-- Name: recyc_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.recyc_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.recyc_type OWNER TO fiz;

--

-- Name: recyc_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.recyc_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.recyc_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9019 (class 0 OID 0)
-- Dependencies: 730
-- Name: recyc_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.recyc_type_objectid_seq OWNED BY fiz.recyc_type.objectid;


--

-- Name: reg_rdtype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.reg_rdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.reg_rdtype OWNER TO fiz;

--

-- Name: reg_rdtype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.reg_rdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.reg_rdtype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9020 (class 0 OID 0)
-- Dependencies: 732
-- Name: reg_rdtype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.reg_rdtype_objectid_seq OWNED BY fiz.reg_rdtype.objectid;


--

-- Name: reg_status; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.reg_status (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.reg_status OWNER TO fiz;

--

-- Name: reg_status_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.reg_status_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.reg_status_objectid_seq OWNER TO fiz;

--
-- TOC entry 9021 (class 0 OID 0)
-- Dependencies: 734
-- Name: reg_status_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.reg_status_objectid_seq OWNED BY fiz.reg_status.objectid;


--

-- Name: res_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.res_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.res_stype OWNER TO fiz;

--

-- Name: res_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.res_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.res_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9022 (class 0 OID 0)
-- Dependencies: 736
-- Name: res_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.res_stype_objectid_seq OWNED BY fiz.res_stype.objectid;


--

-- Name: resort; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resort (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    res_stype smallint,
    capacity integer,
    person_pd integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.resort OWNER TO fiz;

--

-- Name: resort_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resort_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.resort_extension OWNER TO fiz;

--

-- Name: resort_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.resort_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.resort_objectid_seq OWNER TO fiz;

--
-- TOC entry 9023 (class 0 OID 0)
-- Dependencies: 739
-- Name: resort_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.resort_objectid_seq OWNED BY fiz.resort.objectid;


--

-- Name: resort_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resort_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    res_stype smallint,
    capacity integer,
    person_pd integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time numeric(38,8),
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.resort_point OWNER TO fiz;

--

-- Name: resort_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resort_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.resort_point_extension OWNER TO fiz;

--

-- Name: resort_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.resort_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.resort_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9024 (class 0 OID 0)
-- Dependencies: 742
-- Name: resort_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.resort_point_objectid_seq OWNED BY fiz.resort_point.objectid;


--

-- Name: resortarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortarea (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.resortarea OWNER TO fiz;

--

-- Name: resortarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.resortarea_extension OWNER TO fiz;

--

-- Name: resortarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.resortarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.resortarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 9025 (class 0 OID 0)
-- Dependencies: 745
-- Name: resortarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.resortarea_objectid_seq OWNED BY fiz.resortarea.objectid;


--

-- Name: resortarea_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortarea_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.resortarea_point OWNER TO fiz;

--

-- Name: resortarea_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortarea_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.resortarea_point_extension OWNER TO fiz;

--

-- Name: resortarea_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.resortarea_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.resortarea_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9026 (class 0 OID 0)
-- Dependencies: 748
-- Name: resortarea_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.resortarea_point_objectid_seq OWNED BY fiz.resortarea_point.objectid;


--

-- Name: resortprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.resortprotectionzone OWNER TO fiz;

--

-- Name: resortprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.resortprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.resortprotectionzone_extension OWNER TO fiz;

--

-- Name: resortprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.resortprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.resortprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 9027 (class 0 OID 0)
-- Dependencies: 751
-- Name: resortprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.resortprotectionzone_objectid_seq OWNED BY fiz.resortprotectionzone.objectid;


--

-- Name: rfo_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rfo_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rfo_type OWNER TO fiz;

--

-- Name: rfo_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rfo_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rfo_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9028 (class 0 OID 0)
-- Dependencies: 753
-- Name: rfo_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rfo_type_objectid_seq OWNED BY fiz.rfo_type.objectid;


--

-- Name: risk_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.risk_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.risk_cat OWNER TO fiz;

--

-- Name: risk_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.risk_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.risk_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 9029 (class 0 OID 0)
-- Dependencies: 755
-- Name: risk_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.risk_cat_objectid_seq OWNED BY fiz.risk_cat.objectid;


--

-- Name: road_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.road_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    using_type smallint,
    cat_exist smallint,
    cat_plan smallint,
    road_id character varying(255),
    surface_exist smallint,
    surface_plan smallint,
    reg_rdtype smallint,
    time_ltype smallint,
    rdwin_type smallint,
    rdwin_cat smallint,
    compl_name character varying(255),
    num_tc character varying(255),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.road_line OWNER TO fiz;

--

-- Name: road_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.road_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.road_line_extension OWNER TO fiz;

--

-- Name: road_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.road_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.road_objectid_seq OWNER TO fiz;

--
-- TOC entry 9030 (class 0 OID 0)
-- Dependencies: 758
-- Name: road_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.road_objectid_seq OWNED BY fiz.road_line.objectid;


--

-- Name: rs_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rs_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rs_stype OWNER TO fiz;

--

-- Name: rs_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rs_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rs_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9031 (class 0 OID 0)
-- Dependencies: 760
-- Name: rs_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rs_stype_objectid_seq OWNED BY fiz.rs_stype.objectid;


--

-- Name: rst_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rst_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rst_class OWNER TO fiz;

--

-- Name: rst_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rst_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rst_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 9032 (class 0 OID 0)
-- Dependencies: 762
-- Name: rst_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rst_class_objectid_seq OWNED BY fiz.rst_class.objectid;


--

-- Name: rst_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rst_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rst_type OWNER TO fiz;

--

-- Name: rst_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rst_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rst_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9033 (class 0 OID 0)
-- Dependencies: 764
-- Name: rst_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rst_type_objectid_seq OWNED BY fiz.rst_type.objectid;


--

-- Name: rwy_class; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.rwy_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.rwy_class OWNER TO fiz;

--

-- Name: rwy_class_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.rwy_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.rwy_class_objectid_seq OWNER TO fiz;

--
-- TOC entry 9034 (class 0 OID 0)
-- Dependencies: 766
-- Name: rwy_class_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.rwy_class_objectid_seq OWNED BY fiz.rwy_class.objectid;


--

-- Name: s_alert; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.s_alert (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.s_alert OWNER TO fiz;

--

-- Name: s_alert_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.s_alert_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.s_alert_objectid_seq OWNER TO fiz;

--
-- TOC entry 9035 (class 0 OID 0)
-- Dependencies: 768
-- Name: s_alert_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.s_alert_objectid_seq OWNED BY fiz.s_alert.objectid;


--

-- Name: saf_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.saf_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.saf_stype OWNER TO fiz;

--

-- Name: saf_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.saf_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.saf_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9036 (class 0 OID 0)
-- Dependencies: 770
-- Name: saf_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.saf_stype_objectid_seq OWNED BY fiz.saf_stype.objectid;


--

-- Name: sanitaryprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sanitaryprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    szz_type smallint,
    hzrd_class smallint,
    spz_event smallint,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sanitaryprotectionzone OWNER TO fiz;

--

-- Name: sanitaryprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sanitaryprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sanitaryprotectionzone_extension OWNER TO fiz;

--

-- Name: sanitaryprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sanitaryprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sanitaryprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 9037 (class 0 OID 0)
-- Dependencies: 773
-- Name: sanitaryprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sanitaryprotectionzone_objectid_seq OWNED BY fiz.sanitaryprotectionzone.objectid;


--

-- Name: sci_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sci_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.sci_type OWNER TO fiz;

--

-- Name: sci_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sci_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sci_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9038 (class 0 OID 0)
-- Dependencies: 775
-- Name: sci_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sci_type_objectid_seq OWNED BY fiz.sci_type.objectid;


--

-- Name: season; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.season (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.season OWNER TO fiz;

--

-- Name: season_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.season_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.season_objectid_seq OWNER TO fiz;

--
-- TOC entry 9039 (class 0 OID 0)
-- Dependencies: 777
-- Name: season_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.season_objectid_seq OWNED BY fiz.season.objectid;


--

-- Name: serv_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.serv_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.serv_stype OWNER TO fiz;

--

-- Name: serv_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.serv_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.serv_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9040 (class 0 OID 0)
-- Dependencies: 779
-- Name: serv_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.serv_stype_objectid_seq OWNED BY fiz.serv_stype.objectid;


--

-- Name: servicefacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.servicefacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    serv_stype smallint,
    main_activ character varying(255),
    add_activ character varying(255),
    lot_size numeric(38,8),
    bld_area numeric(38,8),
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.servicefacility OWNER TO fiz;

--

-- Name: servicefacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.servicefacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.servicefacility_extension OWNER TO fiz;

--

-- Name: servicefacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.servicefacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.servicefacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9041 (class 0 OID 0)
-- Dependencies: 782
-- Name: servicefacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.servicefacility_objectid_seq OWNED BY fiz.servicefacility.objectid;


--

-- Name: servicefacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.servicefacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    serv_stype smallint,
    main_activ character varying(255),
    add_activ character varying(255),
    lot_size numeric(38,8),
    bld_area numeric(38,8),
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    bent_type smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.servicefacility_point OWNER TO fiz;

--

-- Name: servicefacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.servicefacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.servicefacility_point_extension OWNER TO fiz;

--

-- Name: servicefacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.servicefacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.servicefacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9042 (class 0 OID 0)
-- Dependencies: 785
-- Name: servicefacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.servicefacility_point_objectid_seq OWNED BY fiz.servicefacility_point.objectid;


--

-- Name: settl_cat; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.settl_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.settl_cat OWNER TO fiz;

--

-- Name: settl_cat_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.settl_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.settl_cat_objectid_seq OWNER TO fiz;

--
-- TOC entry 9043 (class 0 OID 0)
-- Dependencies: 787
-- Name: settl_cat_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.settl_cat_objectid_seq OWNED BY fiz.settl_cat.objectid;


--

-- Name: settl_level; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.settl_level (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.settl_level OWNER TO fiz;

--

-- Name: settl_level_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.settl_level_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.settl_level_objectid_seq OWNER TO fiz;

--
-- TOC entry 9044 (class 0 OID 0)
-- Dependencies: 789
-- Name: settl_level_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.settl_level_objectid_seq OWNED BY fiz.settl_level.objectid;


--

-- Name: settl_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.settl_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.settl_type OWNER TO fiz;

--

-- Name: settl_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.settl_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.settl_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9045 (class 0 OID 0)
-- Dependencies: 791
-- Name: settl_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.settl_type_objectid_seq OWNED BY fiz.settl_type.objectid;


--

-- Name: sewerfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    snow_type smallint,
    hzrd_cat smallint,
    szz_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sewerfacility OWNER TO fiz;

--

-- Name: sewerfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sewerfacility_extension OWNER TO fiz;

--

-- Name: sewerfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sewerfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sewerfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9046 (class 0 OID 0)
-- Dependencies: 794
-- Name: sewerfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sewerfacility_objectid_seq OWNED BY fiz.sewerfacility.objectid;


--

-- Name: sewerfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    snow_type smallint,
    hzrd_cat smallint,
    szz_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sewerfacility_point OWNER TO fiz;

--

-- Name: sewerfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sewerfacility_point_extension OWNER TO fiz;

--

-- Name: sewerfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sewerfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sewerfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9047 (class 0 OID 0)
-- Dependencies: 797
-- Name: sewerfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sewerfacility_point_objectid_seq OWNED BY fiz.sewerfacility_point.objectid;


--

-- Name: sewerpipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerpipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    pline_cnt integer,
    d_pline integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sewerpipeline_line OWNER TO fiz;

--

-- Name: sewerpipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sewerpipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sewerpipeline_line_extension OWNER TO fiz;

--

-- Name: sewerpipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sewerpipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sewerpipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 9048 (class 0 OID 0)
-- Dependencies: 800
-- Name: sewerpipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sewerpipeline_objectid_seq OWNED BY fiz.sewerpipeline_line.objectid;


--

-- Name: snow_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.snow_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.snow_type OWNER TO fiz;

--

-- Name: snow_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.snow_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.snow_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9049 (class 0 OID 0)
-- Dependencies: 802
-- Name: snow_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.snow_type_objectid_seq OWNED BY fiz.snow_type.objectid;


--

-- Name: soc_direct; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.soc_direct (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.soc_direct OWNER TO fiz;

--

-- Name: soc_direct_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.soc_direct_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.soc_direct_objectid_seq OWNER TO fiz;

--
-- TOC entry 9050 (class 0 OID 0)
-- Dependencies: 804
-- Name: soc_direct_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.soc_direct_objectid_seq OWNED BY fiz.soc_direct.objectid;


--

-- Name: social; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.social (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    st_stype smallint,
    sp_stype smallint,
    ssah_stype smallint,
    usa_stype smallint,
    capacity integer,
    person_ph integer,
    person_pd integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.social OWNER TO fiz;

--

-- Name: social_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.social_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.social_extension OWNER TO fiz;

--

-- Name: social_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.social_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.social_objectid_seq OWNER TO fiz;

--
-- TOC entry 9051 (class 0 OID 0)
-- Dependencies: 807
-- Name: social_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.social_objectid_seq OWNED BY fiz.social.objectid;


--

-- Name: social_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.social_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    st_stype smallint,
    sp_stype smallint,
    ssah_stype smallint,
    usa_stype smallint,
    capacity integer,
    person_ph integer,
    person_pd integer,
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.social_point OWNER TO fiz;

--

-- Name: social_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.social_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.social_point_extension OWNER TO fiz;

--

-- Name: social_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.social_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.social_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9052 (class 0 OID 0)
-- Dependencies: 810
-- Name: social_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.social_point_objectid_seq OWNED BY fiz.social_point.objectid;


--

-- Name: sp_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sp_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.sp_stype OWNER TO fiz;

--

-- Name: sp_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sp_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sp_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9053 (class 0 OID 0)
-- Dependencies: 812
-- Name: sp_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sp_stype_objectid_seq OWNED BY fiz.sp_stype.objectid;


--

-- Name: specialeconomicarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.specialeconomicarea (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    address character varying(255),
    main_activ character varying(255),
    add_activ character varying(255),
    area numeric(38,8),
    bld_area numeric(38,8),
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.specialeconomicarea OWNER TO fiz;

--

-- Name: specialeconomicarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.specialeconomicarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.specialeconomicarea_extension OWNER TO fiz;

--

-- Name: specialeconomicarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.specialeconomicarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.specialeconomicarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 9054 (class 0 OID 0)
-- Dependencies: 815
-- Name: specialeconomicarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.specialeconomicarea_objectid_seq OWNED BY fiz.specialeconomicarea.objectid;


--

-- Name: specific; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.specific (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.specific OWNER TO fiz;

--

-- Name: specific_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.specific_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.specific_objectid_seq OWNER TO fiz;

--
-- TOC entry 9055 (class 0 OID 0)
-- Dependencies: 817
-- Name: specific_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.specific_objectid_seq OWNED BY fiz.specific.objectid;


--

-- Name: sport; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sport (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    af_type smallint,
    sp_area numeric(38,8),
    pool_area numeric(38,8),
    sps_area numeric(38,8),
    capacity integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sport OWNER TO fiz;

--

-- Name: sport_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sport_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sport_extension OWNER TO fiz;

--

-- Name: sport_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sport_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sport_objectid_seq OWNER TO fiz;

--
-- TOC entry 9056 (class 0 OID 0)
-- Dependencies: 820
-- Name: sport_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sport_objectid_seq OWNED BY fiz.sport.objectid;


--

-- Name: sport_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sport_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    af_type smallint,
    sp_area numeric(38,8),
    pool_area numeric(38,8),
    sps_area numeric(38,8),
    capacity integer,
    wrk_count integer,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.sport_point OWNER TO fiz;

--

-- Name: sport_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.sport_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.sport_point_extension OWNER TO fiz;

--

-- Name: sport_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.sport_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.sport_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9057 (class 0 OID 0)
-- Dependencies: 823
-- Name: sport_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.sport_point_objectid_seq OWNED BY fiz.sport_point.objectid;


--

-- Name: spz_event; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.spz_event (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.spz_event OWNER TO fiz;

--

-- Name: spz_event_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.spz_event_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.spz_event_objectid_seq OWNER TO fiz;

--
-- TOC entry 9058 (class 0 OID 0)
-- Dependencies: 825
-- Name: spz_event_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.spz_event_objectid_seq OWNED BY fiz.spz_event.objectid;


--

-- Name: ssah_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.ssah_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.ssah_stype OWNER TO fiz;

--

-- Name: ssah_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.ssah_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.ssah_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9059 (class 0 OID 0)
-- Dependencies: 827
-- Name: ssah_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.ssah_stype_objectid_seq OWNED BY fiz.ssah_stype.objectid;


--

-- Name: st_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.st_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.st_stype OWNER TO fiz;

--

-- Name: st_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.st_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.st_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9060 (class 0 OID 0)
-- Dependencies: 829
-- Name: st_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.st_stype_objectid_seq OWNED BY fiz.st_stype.objectid;


--

-- Name: status; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.status (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.status OWNER TO fiz;

--

-- Name: status_adm; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.status_adm (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.status_adm OWNER TO fiz;

--

-- Name: status_adm_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.status_adm_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.status_adm_objectid_seq OWNER TO fiz;

--
-- TOC entry 9061 (class 0 OID 0)
-- Dependencies: 832
-- Name: status_adm_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.status_adm_objectid_seq OWNED BY fiz.status_adm.objectid;


--

-- Name: status_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.status_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.status_objectid_seq OWNER TO fiz;

--
-- TOC entry 9062 (class 0 OID 0)
-- Dependencies: 833
-- Name: status_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.status_objectid_seq OWNED BY fiz.status.objectid;


--

-- Name: status_och; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.status_och (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.status_och OWNER TO fiz;

--

-- Name: status_och_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.status_och_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.status_och_objectid_seq OWNER TO fiz;

--
-- TOC entry 9063 (class 0 OID 0)
-- Dependencies: 835
-- Name: status_och_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.status_och_objectid_seq OWNED BY fiz.status_och.objectid;


--

-- Name: status_pr; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.status_pr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.status_pr OWNER TO fiz;

--

-- Name: status_pr_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.status_pr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.status_pr_objectid_seq OWNER TO fiz;

--
-- TOC entry 9064 (class 0 OID 0)
-- Dependencies: 837
-- Name: status_pr_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.status_pr_objectid_seq OWNED BY fiz.status_pr.objectid;


--

-- Name: stop_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.stop_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.stop_type OWNER TO fiz;

--

-- Name: stop_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.stop_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.stop_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9065 (class 0 OID 0)
-- Dependencies: 839
-- Name: stop_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.stop_type_objectid_seq OWNED BY fiz.stop_type.objectid;


--

-- Name: store_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.store_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.store_type OWNER TO fiz;

--

-- Name: store_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.store_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.store_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9066 (class 0 OID 0)
-- Dependencies: 841
-- Name: store_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.store_type_objectid_seq OWNED BY fiz.store_type.objectid;


--

-- Name: str_l_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.str_l_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.str_l_type OWNER TO fiz;

--

-- Name: str_l_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.str_l_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.str_l_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9067 (class 0 OID 0)
-- Dependencies: 843
-- Name: str_l_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.str_l_type_objectid_seq OWNED BY fiz.str_l_type.objectid;


--

-- Name: str_r_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.str_r_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.str_r_type OWNER TO fiz;

--

-- Name: str_r_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.str_r_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.str_r_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9068 (class 0 OID 0)
-- Dependencies: 845
-- Name: str_r_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.str_r_type_objectid_seq OWNED BY fiz.str_r_type.objectid;


--

-- Name: str_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.str_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);


ALTER TABLE fiz.str_type OWNER TO fiz;

--

-- Name: str_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.str_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE fiz.str_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE fiz.str_type_objectid_seq OWNED BY fiz.str_type.objectid;

CREATE TABLE fiz.street_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);
ALTER TABLE fiz.street_line_extension OWNER TO fiz;

CREATE TABLE fiz.streetv_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);
ALTER TABLE fiz.streetv_line_extension OWNER TO fiz;

--
CREATE TABLE fiz.su_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.su_type OWNER TO fiz;

--

-- Name: su_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.su_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.su_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9070 (class 0 OID 0)
-- Dependencies: 851
-- Name: su_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.su_type_objectid_seq OWNED BY fiz.su_type.objectid;


--

-- Name: suburban_tr; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.suburban_tr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.suburban_tr OWNER TO fiz;

--

-- Name: suburban_tr_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.suburban_tr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.suburban_tr_objectid_seq OWNER TO fiz;

--
-- TOC entry 9071 (class 0 OID 0)
-- Dependencies: 853
-- Name: suburban_tr_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.suburban_tr_objectid_seq OWNED BY fiz.suburban_tr.objectid;


--

-- Name: surface_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.surface_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.surface_type OWNER TO fiz;

--

-- Name: surface_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.surface_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.surface_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9072 (class 0 OID 0)
-- Dependencies: 855
-- Name: surface_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.surface_type_objectid_seq OWNED BY fiz.surface_type.objectid;


--

-- Name: szz_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.szz_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.szz_type OWNER TO fiz;

--

-- Name: szz_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.szz_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.szz_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9073 (class 0 OID 0)
-- Dependencies: 857
-- Name: szz_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.szz_type_objectid_seq OWNED BY fiz.szz_type.objectid;


--

-- Name: technoriskarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.technoriskarea (
    objectid integer NOT NULL,
    classid integer,
    tm_source smallint,
    ind_type smallint,
    rad_class smallint,
    eme_class smallint,
    other character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.technoriskarea OWNER TO fiz;

--

-- Name: technoriskarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.technoriskarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.technoriskarea_extension OWNER TO fiz;

--

-- Name: technoriskarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.technoriskarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.technoriskarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 9074 (class 0 OID 0)
-- Dependencies: 860
-- Name: technoriskarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.technoriskarea_objectid_seq OWNED BY fiz.technoriskarea.objectid;


--

-- Name: technoriskarea_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.technoriskarea_point (
    objectid integer NOT NULL,
    classid integer,
    tm_source smallint,
    ind_type smallint,
    rad_class smallint,
    eme_class smallint,
    other character varying(255),
    note character varying(255),
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.technoriskarea_point OWNER TO fiz;

--

-- Name: technoriskarea_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.technoriskarea_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.technoriskarea_point_extension OWNER TO fiz;

--

-- Name: technoriskarea_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.technoriskarea_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.technoriskarea_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9075 (class 0 OID 0)
-- Dependencies: 863
-- Name: technoriskarea_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.technoriskarea_point_objectid_seq OWNED BY fiz.technoriskarea_point.objectid;


--

-- Name: telecomfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.telecomfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    capacity integer,
    data_rate numeric(38,8),
    zone_msize numeric(38,8),
    hght_zone numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint NOT NULL,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.telecomfacility OWNER TO fiz;

--

-- Name: telecomfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.telecomfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.telecomfacility_extension OWNER TO fiz;

--

-- Name: telecomfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.telecomfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.telecomfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9076 (class 0 OID 0)
-- Dependencies: 866
-- Name: telecomfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.telecomfacility_objectid_seq OWNED BY fiz.telecomfacility.objectid;


--

-- Name: telecomfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.telecomfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    capacity integer,
    data_rate numeric(38,8),
    zone_msize numeric(38,8),
    hght_zone numeric(38,8),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.telecomfacility_point OWNER TO fiz;

--

-- Name: telecomfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.telecomfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.telecomfacility_point_extension OWNER TO fiz;

--

-- Name: telecomfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.telecomfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.telecomfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9077 (class 0 OID 0)
-- Dependencies: 869
-- Name: telecomfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.telecomfacility_point_objectid_seq OWNED BY fiz.telecomfacility_point.objectid;


--

-- Name: telecomnetworkline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.telecomnetworkline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.telecomnetworkline_line_extension OWNER TO fiz;

--

-- Name: thermalfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fuel_type smallint,
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    elect_power numeric(38,8),
    ht_power numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.thermalfacility OWNER TO fiz;

--

-- Name: thermalfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.thermalfacility_extension OWNER TO fiz;

--

-- Name: thermalfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.thermalfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.thermalfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9078 (class 0 OID 0)
-- Dependencies: 873
-- Name: thermalfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.thermalfacility_objectid_seq OWNED BY fiz.thermalfacility.objectid;


--

-- Name: thermalfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    fuel_type smallint,
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    elect_power numeric(38,8),
    ht_power numeric(38,8),
    hzrd_cat smallint,
    szz_size numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.thermalfacility_point OWNER TO fiz;

--

-- Name: thermalfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.thermalfacility_point_extension OWNER TO fiz;

--

-- Name: thermalfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.thermalfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.thermalfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9079 (class 0 OID 0)
-- Dependencies: 876
-- Name: thermalfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.thermalfacility_point_objectid_seq OWNED BY fiz.thermalfacility_point.objectid;


--

-- Name: thermalpipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalpipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    d1_pline integer,
    d2_pline integer,
    d3_pline integer,
    d4_pline integer,
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.thermalpipeline_line OWNER TO fiz;

--

-- Name: thermalpipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.thermalpipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.thermalpipeline_line_extension OWNER TO fiz;

--

-- Name: thermalpipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.thermalpipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.thermalpipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 9080 (class 0 OID 0)
-- Dependencies: 879
-- Name: thermalpipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.thermalpipeline_objectid_seq OWNED BY fiz.thermalpipeline_line.objectid;


--

-- Name: time_ltype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.time_ltype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.time_ltype OWNER TO fiz;

--

-- Name: time_ltype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.time_ltype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.time_ltype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9081 (class 0 OID 0)
-- Dependencies: 881
-- Name: time_ltype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.time_ltype_objectid_seq OWNED BY fiz.time_ltype.objectid;


--

-- Name: tm_source; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.tm_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.tm_source OWNER TO fiz;

--

-- Name: tm_source_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.tm_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.tm_source_objectid_seq OWNER TO fiz;

--
-- TOC entry 9082 (class 0 OID 0)
-- Dependencies: 883
-- Name: tm_source_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.tm_source_objectid_seq OWNED BY fiz.tm_source.objectid;


--

-- Name: tpark_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.tpark_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.tpark_type OWNER TO fiz;

--

-- Name: tpark_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.tpark_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.tpark_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9083 (class 0 OID 0)
-- Dependencies: 885
-- Name: tpark_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.tpark_type_objectid_seq OWNED BY fiz.tpark_type.objectid;


--

-- Name: track_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.track_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.track_type OWNER TO fiz;

--

-- Name: track_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.track_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.track_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9084 (class 0 OID 0)
-- Dependencies: 887
-- Name: track_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.track_type_objectid_seq OWNED BY fiz.track_type.objectid;


--

-- Name: traditionalarea; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.traditionalarea (
    objectid integer NOT NULL,
    classid integer,
    name character varying(255),
    area numeric(38,8),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.traditionalarea OWNER TO fiz;

--

-- Name: traditionalarea_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.traditionalarea_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.traditionalarea_extension OWNER TO fiz;

--

-- Name: traditionalarea_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.traditionalarea_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.traditionalarea_objectid_seq OWNER TO fiz;

--
-- TOC entry 9085 (class 0 OID 0)
-- Dependencies: 890
-- Name: traditionalarea_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.traditionalarea_objectid_seq OWNED BY fiz.traditionalarea.objectid;


--

-- Name: transplogisticobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transplogisticobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transplogisticobj OWNER TO fiz;

--

-- Name: transplogisticobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transplogisticobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transplogisticobj_extension OWNER TO fiz;

--

-- Name: transplogisticobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transplogisticobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transplogisticobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 9086 (class 0 OID 0)
-- Dependencies: 893
-- Name: transplogisticobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transplogisticobj_objectid_seq OWNED BY fiz.transplogisticobj.objectid;


--

-- Name: transplogisticobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transplogisticobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    ground_pos smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transplogisticobj_point OWNER TO fiz;

--

-- Name: transplogisticobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transplogisticobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transplogisticobj_point_extension OWNER TO fiz;

--

-- Name: transplogisticobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transplogisticobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transplogisticobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9087 (class 0 OID 0)
-- Dependencies: 896
-- Name: transplogisticobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transplogisticobj_point_objectid_seq OWNED BY fiz.transplogisticobj_point.objectid;


--

-- Name: transportobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    bridge_t smallint,
    tunnel_t smallint,
    crossp_t smallint,
    crossr_t smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transportobj OWNER TO fiz;

--

-- Name: transportobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transportobj_extension OWNER TO fiz;

--

-- Name: transportobj_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    bridge_t smallint,
    tunnel_t smallint,
    crossp_t smallint,
    crossr_t smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transportobj_line OWNER TO fiz;

--

-- Name: transportobj_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transportobj_line_extension OWNER TO fiz;

--

-- Name: transportobj_line_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transportobj_line_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transportobj_line_objectid_seq OWNER TO fiz;

--
-- TOC entry 9088 (class 0 OID 0)
-- Dependencies: 901
-- Name: transportobj_line_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transportobj_line_objectid_seq OWNED BY fiz.transportobj_line.objectid;


--

-- Name: transportobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transportobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transportobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 9089 (class 0 OID 0)
-- Dependencies: 902
-- Name: transportobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transportobj_objectid_seq OWNED BY fiz.transportobj.objectid;


--

-- Name: transportobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    bridge_t smallint,
    tunnel_t smallint,
    crossp_t smallint,
    crossr_t smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transportobj_point OWNER TO fiz;

--

-- Name: transportobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transportobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transportobj_point_extension OWNER TO fiz;

--

-- Name: transportobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transportobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transportobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9090 (class 0 OID 0)
-- Dependencies: 905
-- Name: transportobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transportobj_point_objectid_seq OWNED BY fiz.transportobj_point.objectid;


--

-- Name: transpprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transpprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transpprotectionzone OWNER TO fiz;

--

-- Name: transpprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transpprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transpprotectionzone_extension OWNER TO fiz;

--

-- Name: transpprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transpprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transpprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 9091 (class 0 OID 0)
-- Dependencies: 908
-- Name: transpprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transpprotectionzone_objectid_seq OWNED BY fiz.transpprotectionzone.objectid;


--

-- Name: transpsanitarygapzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transpsanitarygapzone (
    objectid integer NOT NULL,
    classid integer,
    zone_desc character varying(255),
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.transpsanitarygapzone OWNER TO fiz;

--

-- Name: transpsanitarygapzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.transpsanitarygapzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.transpsanitarygapzone_extension OWNER TO fiz;

--

-- Name: transpsanitarygapzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.transpsanitarygapzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.transpsanitarygapzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 9092 (class 0 OID 0)
-- Dependencies: 911
-- Name: transpsanitarygapzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.transpsanitarygapzone_objectid_seq OWNED BY fiz.transpsanitarygapzone.objectid;


--

-- Name: trd_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.trd_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.trd_stype OWNER TO fiz;

--

-- Name: trd_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.trd_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.trd_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9093 (class 0 OID 0)
-- Dependencies: 913
-- Name: trd_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.trd_stype_objectid_seq OWNED BY fiz.trd_stype.objectid;


--

-- Name: tunnel_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.tunnel_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.tunnel_t OWNER TO fiz;

--

-- Name: tunnel_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.tunnel_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.tunnel_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 9094 (class 0 OID 0)
-- Dependencies: 915
-- Name: tunnel_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.tunnel_t_objectid_seq OWNED BY fiz.tunnel_t.objectid;


--

-- Name: type_law; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.type_law (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.type_law OWNER TO fiz;

--

-- Name: type_law_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.type_law_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.type_law_objectid_seq OWNER TO fiz;

--
-- TOC entry 9095 (class 0 OID 0)
-- Dependencies: 917
-- Name: type_law_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.type_law_objectid_seq OWNED BY fiz.type_law.objectid;


--

-- Name: type_subj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.type_subj (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.type_subj OWNER TO fiz;

--

-- Name: type_subj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.type_subj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.type_subj_objectid_seq OWNER TO fiz;

--
-- TOC entry 9096 (class 0 OID 0)
-- Dependencies: 919
-- Name: type_subj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.type_subj_objectid_seq OWNED BY fiz.type_subj.objectid;


--

-- Name: uderfl_t; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.uderfl_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.uderfl_t OWNER TO fiz;

--

-- Name: uderfl_t_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.uderfl_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.uderfl_t_objectid_seq OWNER TO fiz;

--
-- TOC entry 9097 (class 0 OID 0)
-- Dependencies: 921
-- Name: uderfl_t_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.uderfl_t_objectid_seq OWNED BY fiz.uderfl_t.objectid;


--

-- Name: usa_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.usa_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.usa_stype OWNER TO fiz;

--

-- Name: usa_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.usa_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.usa_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9098 (class 0 OID 0)
-- Dependencies: 923
-- Name: usa_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.usa_stype_objectid_seq OWNED BY fiz.usa_stype.objectid;


--

-- Name: using_type; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.using_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.using_type OWNER TO fiz;

--

-- Name: using_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.using_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.using_type_objectid_seq OWNER TO fiz;

--
-- TOC entry 9099 (class 0 OID 0)
-- Dependencies: 925
-- Name: using_type_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.using_type_objectid_seq OWNED BY fiz.using_type.objectid;


--

-- Name: voltage; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.voltage (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.voltage OWNER TO fiz;

--

-- Name: voltage_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.voltage_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.voltage_objectid_seq OWNER TO fiz;

--
-- TOC entry 9100 (class 0 OID 0)
-- Dependencies: 927
-- Name: voltage_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.voltage_objectid_seq OWNED BY fiz.voltage.objectid;


--

-- Name: w_source; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.w_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.w_source OWNER TO fiz;

--

-- Name: w_source_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.w_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.w_source_objectid_seq OWNER TO fiz;

--
-- TOC entry 9101 (class 0 OID 0)
-- Dependencies: 929
-- Name: w_source_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.w_source_objectid_seq OWNED BY fiz.w_source.objectid;


--

-- Name: wastefacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wastefacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    oro_number character varying(255),
    oro_type smallint,
    oro_stype smallint,
    recyc_type smallint,
    bur_type smallint,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.wastefacility OWNER TO fiz;

--

-- Name: wastefacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wastefacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.wastefacility_extension OWNER TO fiz;

--

-- Name: wastefacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.wastefacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.wastefacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9102 (class 0 OID 0)
-- Dependencies: 932
-- Name: wastefacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.wastefacility_objectid_seq OWNED BY fiz.wastefacility.objectid;


--

-- Name: wastefacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wastefacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    oro_number character varying(255),
    oro_type smallint,
    oro_stype smallint,
    recyc_type smallint,
    bur_type smallint,
    wrk_count integer,
    hzrd_class smallint,
    hzrd_cat smallint,
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.wastefacility_point OWNER TO fiz;

--

-- Name: wastefacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wastefacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.wastefacility_point_extension OWNER TO fiz;

--

-- Name: wastefacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.wastefacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.wastefacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9103 (class 0 OID 0)
-- Dependencies: 935
-- Name: wastefacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.wastefacility_point_objectid_seq OWNED BY fiz.wastefacility_point.objectid;


--

-- Name: water_stype; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.water_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.water_stype OWNER TO fiz;

--

-- Name: water_stype_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.water_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.water_stype_objectid_seq OWNER TO fiz;

--
-- TOC entry 9104 (class 0 OID 0)
-- Dependencies: 937
-- Name: water_stype_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.water_stype_objectid_seq OWNED BY fiz.water_stype.objectid;


--

-- Name: waterfacility; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterfacility (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    water_stype smallint,
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    size_zso_1 numeric(38,8),
    size_zso_2 numeric(38,8),
    size_zso_3 numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    water_styp integer,
    shape_leng numeric,
    shape_area numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.waterfacility OWNER TO fiz;

--

-- Name: waterfacility_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterfacility_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.waterfacility_extension OWNER TO fiz;

--

-- Name: waterfacility_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.waterfacility_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.waterfacility_objectid_seq OWNER TO fiz;

--
-- TOC entry 9105 (class 0 OID 0)
-- Dependencies: 940
-- Name: waterfacility_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.waterfacility_objectid_seq OWNED BY fiz.waterfacility.objectid;


--

-- Name: waterfacility_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterfacility_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    water_stype smallint,
    ground_pos smallint,
    wear_prcnt numeric(38,8),
    fact_use numeric(38,8),
    output numeric(38,8),
    size_zso_1 numeric(38,8),
    size_zso_2 numeric(38,8),
    size_zso_3 numeric(38,8),
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    water_styp integer,
    shape_leng numeric,
    shape_area numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.waterfacility_point OWNER TO fiz;

--

-- Name: waterfacility_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterfacility_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.waterfacility_point_extension OWNER TO fiz;

--

-- Name: waterfacility_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.waterfacility_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.waterfacility_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9106 (class 0 OID 0)
-- Dependencies: 943
-- Name: waterfacility_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.waterfacility_point_objectid_seq OWNED BY fiz.waterfacility_point.objectid;


--

-- Name: waterpipeline_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterpipeline_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    pline_type smallint,
    length numeric(38,8),
    wear_prcnt numeric(38,8),
    pline_cnt integer,
    d_pline integer,
    zone_size numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    shape_leng numeric,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.waterpipeline_line OWNER TO fiz;

--

-- Name: waterpipeline_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterpipeline_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.waterpipeline_line_extension OWNER TO fiz;

--

-- Name: waterpipeline_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.waterpipeline_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.waterpipeline_objectid_seq OWNER TO fiz;

--
-- TOC entry 9107 (class 0 OID 0)
-- Dependencies: 946
-- Name: waterpipeline_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.waterpipeline_objectid_seq OWNED BY fiz.waterpipeline_line.objectid;


--

-- Name: waterprotectionzone; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterprotectionzone (
    objectid integer NOT NULL,
    classid integer,
    objectname character varying(255),
    source character varying(255),
    note character varying(255),
    status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.waterprotectionzone OWNER TO fiz;

--

-- Name: waterprotectionzone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterprotectionzone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.waterprotectionzone_extension OWNER TO fiz;

--

-- Name: waterprotectionzone_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.waterprotectionzone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.waterprotectionzone_objectid_seq OWNER TO fiz;

--
-- TOC entry 9108 (class 0 OID 0)
-- Dependencies: 949
-- Name: waterprotectionzone_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.waterprotectionzone_objectid_seq OWNED BY fiz.waterprotectionzone.objectid;


--

-- Name: watertransportobj; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.watertransportobj (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    pass_term smallint,
    ferry_crgt smallint,
    ferry_mvt smallint,
    yatch_cls smallint,
    capacity numeric(38,8),
    sh_capacity numeric(38,8),
    freight numeric(38,8),
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.watertransportobj OWNER TO fiz;

--

-- Name: watertransportobj_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.watertransportobj_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.watertransportobj_extension OWNER TO fiz;

--

-- Name: watertransportobj_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.watertransportobj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.watertransportobj_objectid_seq OWNER TO fiz;

--
-- TOC entry 9109 (class 0 OID 0)
-- Dependencies: 952
-- Name: watertransportobj_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.watertransportobj_objectid_seq OWNED BY fiz.watertransportobj.objectid;


--

-- Name: watertransportobj_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.watertransportobj_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    pass_term smallint,
    ferry_crgt smallint,
    ferry_mvt smallint,
    yatch_cls smallint,
    capacity numeric(38,8),
    sh_capacity numeric(38,8),
    freight numeric(38,8),
    compl_name character varying(255),
    danger_obj smallint,
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.watertransportobj_point OWNER TO fiz;

--

-- Name: watertransportobj_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.watertransportobj_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.watertransportobj_point_extension OWNER TO fiz;

--

-- Name: watertransportobj_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.watertransportobj_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.watertransportobj_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9110 (class 0 OID 0)
-- Dependencies: 955
-- Name: watertransportobj_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.watertransportobj_point_objectid_seq OWNED BY fiz.watertransportobj_point.objectid;


--

-- Name: waterways_line; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterways_line (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    upper_bnd character varying(255),
    lower_bnd character varying(255),
    waylenght numeric(38,8),
    compl_name character varying(255),
    num_tc character varying(255),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.waterways_line OWNER TO fiz;

--

-- Name: waterways_line_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.waterways_line_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.waterways_line_extension OWNER TO fiz;

--

-- Name: waterways_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.waterways_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.waterways_objectid_seq OWNER TO fiz;

--
-- TOC entry 9111 (class 0 OID 0)
-- Dependencies: 958
-- Name: waterways_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.waterways_objectid_seq OWNED BY fiz.waterways_line.objectid;


--

-- Name: wildlifeprotection; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wildlifeprotection (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    hzrd_class smallint,
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.wildlifeprotection OWNER TO fiz;

--

-- Name: wildlifeprotection_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wildlifeprotection_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.wildlifeprotection_extension OWNER TO fiz;

--

-- Name: wildlifeprotection_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.wildlifeprotection_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.wildlifeprotection_objectid_seq OWNER TO fiz;

--
-- TOC entry 9112 (class 0 OID 0)
-- Dependencies: 961
-- Name: wildlifeprotection_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.wildlifeprotection_objectid_seq OWNED BY fiz.wildlifeprotection.objectid;


--

-- Name: wildlifeprotection_point; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wildlifeprotection_point (
    objectid integer NOT NULL,
    classid integer,
    number character varying(255),
    name character varying(255),
    oktmo character varying(50),
    address character varying(255),
    hzrd_class smallint,
    area numeric(38,8),
    function character varying(255),
    event_time integer,
    source character varying(255),
    note character varying(255),
    status smallint,
    reg_status smallint,
    globalid character varying(38) DEFAULT '{00000000-0000-0000-0000-000000000000}'::character varying,
    shape public.geometry,
    CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406))
);


ALTER TABLE fiz.wildlifeprotection_point OWNER TO fiz;

--

-- Name: wildlifeprotection_point_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.wildlifeprotection_point_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.wildlifeprotection_point_extension OWNER TO fiz;

--

-- Name: wildlifeprotection_point_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.wildlifeprotection_point_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.wildlifeprotection_point_objectid_seq OWNER TO fiz;

--
-- TOC entry 9113 (class 0 OID 0)
-- Dependencies: 964
-- Name: wildlifeprotection_point_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.wildlifeprotection_point_objectid_seq OWNED BY fiz.wildlifeprotection_point.objectid;


--

-- Name: yatch_cls; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.yatch_cls (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.yatch_cls OWNER TO fiz;

--

-- Name: yatch_cls_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.yatch_cls_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.yatch_cls_objectid_seq OWNER TO fiz;

--
-- TOC entry 9114 (class 0 OID 0)
-- Dependencies: 966
-- Name: yatch_cls_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.yatch_cls_objectid_seq OWNED BY fiz.yatch_cls.objectid;


--

-- Name: zone_extension; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.zone_extension (
    object_id integer NOT NULL,
    violations jsonb,
    _xmin integer,
    valid boolean,
    class_id integer
);


ALTER TABLE fiz.zone_extension OWNER TO fiz;

--

-- Name: zone_oopt; Type: TABLE; Schema: fiz; Owner: fiz
--

CREATE TABLE fiz.zone_oopt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);


ALTER TABLE fiz.zone_oopt OWNER TO fiz;

--

-- Name: zone_oopt_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
--

CREATE SEQUENCE fiz.zone_oopt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fiz.zone_oopt_objectid_seq OWNER TO fiz;

--
-- TOC entry 9115 (class 0 OID 0)
-- Dependencies: 969
-- Name: zone_oopt_objectid_seq; Type: SEQUENCE OWNED BY; Schema: fiz; Owner: fiz
--

ALTER SEQUENCE fiz.zone_oopt_objectid_seq OWNED BY fiz.zone_oopt.objectid;


--


-- Name: ab_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ab_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.ab_stype_objectid_seq'::regclass);


--


-- Name: admborder_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admborder_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.admborder_objectid_seq'::regclass);


--


-- Name: admemo objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admemo ALTER COLUMN objectid SET DEFAULT nextval('fiz.admemo_objectid_seq'::regclass);


--

-- Name: admenp objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admenp ALTER COLUMN objectid SET DEFAULT nextval('fiz.admenp_objectid_seq'::regclass);


--

-- Name: admerf objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admerf ALTER COLUMN objectid SET DEFAULT nextval('fiz.admerf_objectid_seq'::regclass);


--

-- Name: admesrf objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admesrf ALTER COLUMN objectid SET DEFAULT nextval('fiz.admesrf_objectid_seq'::regclass);


--

-- Name: aeroszone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.aeroszone ALTER COLUMN objectid SET DEFAULT nextval('fiz.aeroszone_objectid_seq'::regclass);


--

-- Name: af_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.af_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.af_type_objectid_seq'::regclass);


--
-- TOC entry 7079 (class 2604 OID 34289)
-- Name: agriculture objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture ALTER COLUMN objectid SET DEFAULT nextval('fiz.agriculture_objectid_seq'::regclass);


--
-- TOC entry 7082 (class 2604 OID 34290)
-- Name: agriculture_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.agriculture_point_objectid_seq'::regclass);


--
-- TOC entry 7085 (class 2604 OID 34291)
-- Name: airtransportobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.airtransportobj_objectid_seq'::regclass);


--
-- TOC entry 7088 (class 2604 OID 34292)
-- Name: airtransportobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.airtransportobj_point_objectid_seq'::regclass);


--

-- Name: al_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.al_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.al_stype_objectid_seq'::regclass);


--

-- Name: amb_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.amb_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.amb_type_objectid_seq'::regclass);


--

-- Name: ans_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ans_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.ans_type_objectid_seq'::regclass);


--

-- Name: aq_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.aq_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.aq_stype_objectid_seq'::regclass);


--

-- Name: areabasedevelopment objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.areabasedevelopment ALTER COLUMN objectid SET DEFAULT nextval('fiz.areabasedevelopment_objectid_seq'::regclass);


--

-- Name: authorityservice objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice ALTER COLUMN objectid SET DEFAULT nextval('fiz.authorityservice_objectid_seq'::regclass);


--

-- Name: authorityservice_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.authorityservice_point_objectid_seq'::regclass);


--

-- Name: autoservice objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice ALTER COLUMN objectid SET DEFAULT nextval('fiz.autoservice_objectid_seq'::regclass);


--
-- TOC entry 7107 (class 2604 OID 34301)
-- Name: autoservice_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.autoservice_point_objectid_seq'::regclass);


--
-- TOC entry 7110 (class 2604 OID 34302)
-- Name: avia_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.avia_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.avia_type_objectid_seq'::regclass);


--
-- TOC entry 7111 (class 2604 OID 34303)
-- Name: bent_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bent_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.bent_type_objectid_seq'::regclass);


--
-- TOC entry 7112 (class 2604 OID 34304)
-- Name: bridge_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bridge_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.bridge_t_objectid_seq'::regclass);


--
-- TOC entry 7113 (class 2604 OID 34305)
-- Name: bur_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bur_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.bur_type_objectid_seq'::regclass);


--
-- TOC entry 7114 (class 2604 OID 34306)
-- Name: cable_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cable_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.cable_type_objectid_seq'::regclass);


--
-- TOC entry 7115 (class 2604 OID 34307)
-- Name: cat_distr objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_distr ALTER COLUMN objectid SET DEFAULT nextval('fiz.cat_distr_objectid_seq'::regclass);


--
-- TOC entry 7116 (class 2604 OID 34308)
-- Name: cat_main objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_main ALTER COLUMN objectid SET DEFAULT nextval('fiz.cat_main_objectid_seq'::regclass);


--
-- TOC entry 7117 (class 2604 OID 34309)
-- Name: cat_rdtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_rdtype ALTER COLUMN objectid SET DEFAULT nextval('fiz.cat_rdtype_objectid_seq'::regclass);


--
-- TOC entry 7118 (class 2604 OID 34310)
-- Name: cat_rr objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_rr ALTER COLUMN objectid SET DEFAULT nextval('fiz.cat_rr_objectid_seq'::regclass);


--
-- TOC entry 7119 (class 2604 OID 34311)
-- Name: cemet_stat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_stat ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemet_stat_objectid_seq'::regclass);


--
-- TOC entry 7120 (class 2604 OID 34312)
-- Name: cemet_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemet_stype_objectid_seq'::regclass);


--
-- TOC entry 7121 (class 2604 OID 34313)
-- Name: cemet_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemet_type_objectid_seq'::regclass);


--
-- TOC entry 7122 (class 2604 OID 34314)
-- Name: cemet_wtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_wtype ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemet_wtype_objectid_seq'::regclass);


--
-- TOC entry 7123 (class 2604 OID 34315)
-- Name: cemetery objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemetery_objectid_seq'::regclass);


--
-- TOC entry 7126 (class 2604 OID 34316)
-- Name: cemetery_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.cemetery_point_objectid_seq'::regclass);


--
-- TOC entry 7129 (class 2604 OID 34317)
-- Name: cep_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cep_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.cep_class_objectid_seq'::regclass);


--
-- TOC entry 7130 (class 2604 OID 34318)
-- Name: chi_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.chi_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.chi_stype_objectid_seq'::regclass);


--
-- TOC entry 7131 (class 2604 OID 34319)
-- Name: clb_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.clb_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.clb_type_objectid_seq'::regclass);


--
-- TOC entry 7132 (class 2604 OID 34320)
-- Name: coastalprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.coastalprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.coastalprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7135 (class 2604 OID 34321)
-- Name: comm_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.comm_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.comm_type_objectid_seq'::regclass);


--
-- TOC entry 7136 (class 2604 OID 34322)
-- Name: comm_сtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz."comm_сtype" ALTER COLUMN objectid SET DEFAULT nextval('fiz."comm_сtype_objectid_seq"'::regclass);


--
-- TOC entry 7137 (class 2604 OID 34323)
-- Name: cr_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cr_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.cr_stype_objectid_seq'::regclass);


--
-- TOC entry 7138 (class 2604 OID 34324)
-- Name: crossp_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.crossp_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.crossp_t_objectid_seq'::regclass);


--
-- TOC entry 7139 (class 2604 OID 34325)
-- Name: crossr_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.crossr_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.crossr_t_objectid_seq'::regclass);


--
-- TOC entry 7140 (class 2604 OID 34326)
-- Name: ctm_time_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ctm_time_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.ctm_time_t_objectid_seq'::regclass);


--
-- TOC entry 7141 (class 2604 OID 34327)
-- Name: ctm_use_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ctm_use_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.ctm_use_t_objectid_seq'::regclass);


--
-- TOC entry 7142 (class 2604 OID 34328)
-- Name: cu_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cu_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.cu_type_objectid_seq'::regclass);


--
-- TOC entry 7143 (class 2604 OID 34329)
-- Name: culture objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture ALTER COLUMN objectid SET DEFAULT nextval('fiz.culture_objectid_seq'::regclass);


--
-- TOC entry 7146 (class 2604 OID 34330)
-- Name: culture_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.culture_point_objectid_seq'::regclass);


--
-- TOC entry 7149 (class 2604 OID 34331)
-- Name: current objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.current ALTER COLUMN objectid SET DEFAULT nextval('fiz.current_objectid_seq'::regclass);


--
-- TOC entry 7150 (class 2604 OID 34332)
-- Name: customcontrol objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol ALTER COLUMN objectid SET DEFAULT nextval('fiz.customcontrol_objectid_seq'::regclass);


--
-- TOC entry 7153 (class 2604 OID 34333)
-- Name: customcontrol_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.customcontrol_point_objectid_seq'::regclass);


--
-- TOC entry 7156 (class 2604 OID 34334)
-- Name: d_objects objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.d_objects ALTER COLUMN objectid SET DEFAULT nextval('fiz.d_objects_objectid_seq'::regclass);


--
-- TOC entry 7157 (class 2604 OID 34335)
-- Name: danger_obj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.danger_obj ALTER COLUMN objectid SET DEFAULT nextval('fiz.danger_obj_objectid_seq'::regclass);


--
-- TOC entry 7158 (class 2604 OID 34336)
-- Name: drinkwaterprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.drinkwaterprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.drinkwaterprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7161 (class 2604 OID 34337)
-- Name: edu_sdtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_sdtype ALTER COLUMN objectid SET DEFAULT nextval('fiz.edu_sdtype_objectid_seq'::regclass);


--
-- TOC entry 7162 (class 2604 OID 34338)
-- Name: edu_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.edu_stype_objectid_seq'::regclass);


--
-- TOC entry 7163 (class 2604 OID 34339)
-- Name: edu_tunit objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_tunit ALTER COLUMN objectid SET DEFAULT nextval('fiz.edu_tunit_objectid_seq'::regclass);


--
-- TOC entry 7164 (class 2604 OID 34340)
-- Name: education objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education ALTER COLUMN objectid SET DEFAULT nextval('fiz.education_objectid_seq'::regclass);


--
-- TOC entry 7167 (class 2604 OID 34341)
-- Name: education_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.education_point_objectid_seq'::regclass);


--
-- TOC entry 7170 (class 2604 OID 34342)
-- Name: el_supply objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.el_supply ALTER COLUMN objectid SET DEFAULT nextval('fiz.el_supply_objectid_seq'::regclass);


--
-- TOC entry 7171 (class 2604 OID 34343)
-- Name: electricline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.electricline_objectid_seq'::regclass);


--
-- TOC entry 7174 (class 2604 OID 34344)
-- Name: electricpowerstation objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation ALTER COLUMN objectid SET DEFAULT nextval('fiz.electricpowerstation_objectid_seq'::regclass);


--
-- TOC entry 7177 (class 2604 OID 34345)
-- Name: electricpowerstation_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.electricpowerstation_point_objectid_seq'::regclass);


--
-- TOC entry 7180 (class 2604 OID 34346)
-- Name: electrictransformer objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer ALTER COLUMN objectid SET DEFAULT nextval('fiz.electrictransformer_objectid_seq'::regclass);


--
-- TOC entry 7183 (class 2604 OID 34347)
-- Name: electrictransformer_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.electrictransformer_point_objectid_seq'::regclass);


--
-- TOC entry 7186 (class 2604 OID 34348)
-- Name: eme_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.eme_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.eme_class_objectid_seq'::regclass);


--
-- TOC entry 7187 (class 2604 OID 34349)
-- Name: eme_source objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.eme_source ALTER COLUMN objectid SET DEFAULT nextval('fiz.eme_source_objectid_seq'::regclass);


--
-- TOC entry 7188 (class 2604 OID 34350)
-- Name: emergencyprotectionobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.emergencyprotectionobj_objectid_seq'::regclass);


--
-- TOC entry 7191 (class 2604 OID 34351)
-- Name: emergencyprotectionobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.emergencyprotectionobj_point_objectid_seq'::regclass);


--
-- TOC entry 7194 (class 2604 OID 34352)
-- Name: engprotectionobj_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.engprotectionobj_objectid_seq'::regclass);


--
-- TOC entry 7197 (class 2604 OID 34353)
-- Name: engprotectionobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.engprotectionobj_point_objectid_seq'::regclass);


--
-- TOC entry 7200 (class 2604 OID 34354)
-- Name: engprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.engprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7203 (class 2604 OID 34355)
-- Name: engsanitarygapzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engsanitarygapzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.engsanitarygapzone_objectid_seq'::regclass);


--
-- TOC entry 7206 (class 2604 OID 34356)
-- Name: ent_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ent_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.ent_type_objectid_seq'::regclass);


--
-- TOC entry 7207 (class 2604 OID 34357)
-- Name: envdanger objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger ALTER COLUMN objectid SET DEFAULT nextval('fiz.envdanger_objectid_seq'::regclass);


--
-- TOC entry 7210 (class 2604 OID 34358)
-- Name: envdanger_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.envdanger_point_objectid_seq'::regclass);


--
-- TOC entry 7213 (class 2604 OID 34359)
-- Name: envmonitoring objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring ALTER COLUMN objectid SET DEFAULT nextval('fiz.envmonitoring_objectid_seq'::regclass);


--
-- TOC entry 7216 (class 2604 OID 34360)
-- Name: envmonitoring_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.envmonitoring_point_objectid_seq'::regclass);


--
-- TOC entry 7219 (class 2604 OID 34361)
-- Name: feature_lep objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.feature_lep ALTER COLUMN objectid SET DEFAULT nextval('fiz.feature_lep_objectid_seq'::regclass);


--
-- TOC entry 7220 (class 2604 OID 34362)
-- Name: ferry_crgt objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ferry_crgt ALTER COLUMN objectid SET DEFAULT nextval('fiz.ferry_crgt_objectid_seq'::regclass);


--
-- TOC entry 7221 (class 2604 OID 34363)
-- Name: ferry_mvt objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ferry_mvt ALTER COLUMN objectid SET DEFAULT nextval('fiz.ferry_mvt_objectid_seq'::regclass);


--
-- TOC entry 7222 (class 2604 OID 34364)
-- Name: fishprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fishprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.fishprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7225 (class 2604 OID 34365)
-- Name: floodarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.floodarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.floodarea_objectid_seq'::regclass);


--
-- TOC entry 7228 (class 2604 OID 34366)
-- Name: flooding_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.flooding_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.flooding_t_objectid_seq'::regclass);


--
-- TOC entry 7229 (class 2604 OID 34367)
-- Name: foreshore objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.foreshore ALTER COLUMN objectid SET DEFAULT nextval('fiz.foreshore_objectid_seq'::regclass);


--
-- TOC entry 7232 (class 2604 OID 34368)
-- Name: forest objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest ALTER COLUMN objectid SET DEFAULT nextval('fiz.forest_objectid_seq'::regclass);


--
-- TOC entry 7235 (class 2604 OID 34369)
-- Name: forest_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.forest_cat_objectid_seq'::regclass);


--
-- TOC entry 7236 (class 2604 OID 34370)
-- Name: forest_os objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_os ALTER COLUMN objectid SET DEFAULT nextval('fiz.forest_os_objectid_seq'::regclass);


--
-- TOC entry 7237 (class 2604 OID 34371)
-- Name: forest_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.forest_t_objectid_seq'::regclass);


--
-- TOC entry 7238 (class 2604 OID 34372)
-- Name: forest_val objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_val ALTER COLUMN objectid SET DEFAULT nextval('fiz.forest_val_objectid_seq'::regclass);


--
-- TOC entry 7239 (class 2604 OID 34373)
-- Name: forestpark objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forestpark ALTER COLUMN objectid SET DEFAULT nextval('fiz.forestpark_objectid_seq'::regclass);


--
-- TOC entry 7242 (class 2604 OID 34374)
-- Name: fp_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fp_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.fp_class_objectid_seq'::regclass);


--
-- TOC entry 7243 (class 2604 OID 34375)
-- Name: fp_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fp_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.fp_type_objectid_seq'::regclass);


--
-- TOC entry 7244 (class 2604 OID 34376)
-- Name: fs_objects objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fs_objects ALTER COLUMN objectid SET DEFAULT nextval('fiz.fs_objects_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fses_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.fses_stype_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fuel_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.fuel_type_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.functionalzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.functionalzone_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.street_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.street_line_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.streetv_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.streetv_line_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.telecomnetworkline_line ALTER COLUMN objectid
    SET DEFAULT nextval('fiz.telecomnetworkline_line_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fz_ingstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_ingstp_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fz_mfstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_mfstp_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fz_odstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_odstp_objectid_seq'::regclass);
ALTER TABLE ONLY fiz.fz_orecstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_orecstp_objectid_seq'::regclass);


--
-- TOC entry 7254 (class 2604 OID 34384)
-- Name: fz_recstp objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_recstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_recstp_objectid_seq'::regclass);


--
-- TOC entry 7255 (class 2604 OID 34385)
-- Name: fz_shstp objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_shstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_shstp_objectid_seq'::regclass);


--
-- TOC entry 7256 (class 2604 OID 34386)
-- Name: fz_trstp objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_trstp ALTER COLUMN objectid SET DEFAULT nextval('fiz.fz_trstp_objectid_seq'::regclass);


--
-- TOC entry 7257 (class 2604 OID 34387)
-- Name: gas_st_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gas_st_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.gas_st_type_objectid_seq'::regclass);


--
-- TOC entry 7258 (class 2604 OID 34388)
-- Name: gasfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.gasfacility_objectid_seq'::regclass);


--
-- TOC entry 7261 (class 2604 OID 34389)
-- Name: gasfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.gasfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7264 (class 2604 OID 34390)
-- Name: gaspipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gaspipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.gaspipeline_objectid_seq'::regclass);


--
-- TOC entry 7267 (class 2604 OID 34391)
-- Name: greeneryplanting objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.greeneryplanting ALTER COLUMN objectid SET DEFAULT nextval('fiz.greeneryplanting_objectid_seq'::regclass);


--
-- TOC entry 7270 (class 2604 OID 34392)
-- Name: ground_pos objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ground_pos ALTER COLUMN objectid SET DEFAULT nextval('fiz.ground_pos_objectid_seq'::regclass);


--
-- TOC entry 7271 (class 2604 OID 34393)
-- Name: gts_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gts_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.gts_class_objectid_seq'::regclass);


--
-- TOC entry 7272 (class 2604 OID 34394)
-- Name: hazardarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hazardarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.hazardarea_objectid_seq'::regclass);


--
-- TOC entry 7275 (class 2604 OID 34395)
-- Name: health objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health ALTER COLUMN objectid SET DEFAULT nextval('fiz.health_objectid_seq'::regclass);


--
-- TOC entry 7278 (class 2604 OID 34396)
-- Name: health_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.health_point_objectid_seq'::regclass);


--
-- TOC entry 7281 (class 2604 OID 34397)
-- Name: her_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.her_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.her_type_objectid_seq'::regclass);


--
-- TOC entry 7282 (class 2604 OID 34398)
-- Name: heritage_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritage_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.heritage_objectid_seq'::regclass);


--
-- TOC entry 7285 (class 2604 OID 34399)
-- Name: heritagearea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritagearea ALTER COLUMN objectid SET DEFAULT nextval('fiz.heritagearea_objectid_seq'::regclass);


--
-- TOC entry 7288 (class 2604 OID 34400)
-- Name: heritageprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritageprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.heritageprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7291 (class 2604 OID 34401)
-- Name: hist_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hist_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.hist_cat_objectid_seq'::regclass);


--
-- TOC entry 7292 (class 2604 OID 34402)
-- Name: hist_out objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hist_out ALTER COLUMN objectid SET DEFAULT nextval('fiz.hist_out_objectid_seq'::regclass);


--
-- TOC entry 7293 (class 2604 OID 34403)
-- Name: historicsettlement objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.historicsettlement ALTER COLUMN objectid SET DEFAULT nextval('fiz.historicsettlement_objectid_seq'::regclass);


--
-- TOC entry 7296 (class 2604 OID 34404)
-- Name: hot_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hot_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.hot_stype_objectid_seq'::regclass);


--
-- TOC entry 7297 (class 2604 OID 34405)
-- Name: hydraulicstructures_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.hydraulicstructures_objectid_seq'::regclass);


--
-- TOC entry 7300 (class 2604 OID 34406)
-- Name: hydraulicstructures_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.hydraulicstructures_point_objectid_seq'::regclass);


--
-- TOC entry 7303 (class 2604 OID 34407)
-- Name: hydro objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro ALTER COLUMN objectid SET DEFAULT nextval('fiz.hydro_objectid_seq'::regclass);


--
-- TOC entry 7306 (class 2604 OID 34408)
-- Name: hydro_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.hydro_line_objectid_seq'::regclass);


--
-- TOC entry 7309 (class 2604 OID 34409)
-- Name: hydro_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.hydro_point_objectid_seq'::regclass);


--
-- TOC entry 7312 (class 2604 OID 34410)
-- Name: hzrd_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hzrd_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.hzrd_cat_objectid_seq'::regclass);


--
-- TOC entry 7313 (class 2604 OID 34411)
-- Name: hzrd_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hzrd_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.hzrd_class_objectid_seq'::regclass);


--
-- TOC entry 7314 (class 2604 OID 34412)
-- Name: ind_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ind_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.ind_type_objectid_seq'::regclass);


--
-- TOC entry 7315 (class 2604 OID 34413)
-- Name: int_trf_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.int_trf_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.int_trf_t_objectid_seq'::regclass);


--
-- TOC entry 7316 (class 2604 OID 34414)
-- Name: int_trn_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.int_trn_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.int_trn_t_objectid_seq'::regclass);


--
-- TOC entry 7317 (class 2604 OID 34415)
-- Name: investmentsite objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.investmentsite ALTER COLUMN objectid SET DEFAULT nextval('fiz.investmentsite_objectid_seq'::regclass);


--
-- TOC entry 7320 (class 2604 OID 34416)
-- Name: investmentzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.investmentzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.investmentzone_objectid_seq'::regclass);


--
-- TOC entry 7323 (class 2604 OID 34417)
-- Name: land_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.land_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.land_type_objectid_seq'::regclass);


--
-- TOC entry 7324 (class 2604 OID 34418)
-- Name: landuse objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.landuse ALTER COLUMN objectid SET DEFAULT nextval('fiz.landuse_objectid_seq'::regclass);


--
-- TOC entry 7327 (class 2604 OID 34419)
-- Name: main_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.main_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.main_type_objectid_seq'::regclass);


--
-- TOC entry 7328 (class 2604 OID 34420)
-- Name: manufacturing objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing ALTER COLUMN objectid SET DEFAULT nextval('fiz.manufacturing_objectid_seq'::regclass);


--
-- TOC entry 7331 (class 2604 OID 34421)
-- Name: manufacturing_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.manufacturing_point_objectid_seq'::regclass);


--
-- TOC entry 7334 (class 2604 OID 34422)
-- Name: mc_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mc_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.mc_type_objectid_seq'::regclass);


--
-- TOC entry 7335 (class 2604 OID 34423)
-- Name: md_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.md_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.md_stype_objectid_seq'::regclass);


--
-- TOC entry 7336 (class 2604 OID 34424)
-- Name: min_atype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_atype ALTER COLUMN objectid SET DEFAULT nextval('fiz.min_atype_objectid_seq'::regclass);


--
-- TOC entry 7337 (class 2604 OID 34425)
-- Name: min_mtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_mtype ALTER COLUMN objectid SET DEFAULT nextval('fiz.min_mtype_objectid_seq'::regclass);


--
-- TOC entry 7338 (class 2604 OID 34426)
-- Name: min_ntype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_ntype ALTER COLUMN objectid SET DEFAULT nextval('fiz.min_ntype_objectid_seq'::regclass);


--
-- TOC entry 7339 (class 2604 OID 34427)
-- Name: mineralarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineralarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.mineralarea_objectid_seq'::regclass);


--
-- TOC entry 7342 (class 2604 OID 34428)
-- Name: mineraldep objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep ALTER COLUMN objectid SET DEFAULT nextval('fiz.mineraldep_objectid_seq'::regclass);


--
-- TOC entry 7345 (class 2604 OID 34429)
-- Name: mineraldep_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.mineraldep_point_objectid_seq'::regclass);


--
-- TOC entry 7348 (class 2604 OID 34430)
-- Name: mp_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mp_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.mp_type_objectid_seq'::regclass);


--
-- TOC entry 7349 (class 2604 OID 34431)
-- Name: msd_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.msd_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.msd_type_objectid_seq'::regclass);


--
-- TOC entry 7350 (class 2604 OID 34432)
-- Name: mst_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mst_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.mst_type_objectid_seq'::regclass);


--
-- TOC entry 7351 (class 2604 OID 34433)
-- Name: naturalriskzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.naturalriskzone_objectid_seq'::regclass);


--
-- TOC entry 7354 (class 2604 OID 34434)
-- Name: naturalriskzone_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.naturalriskzone_point_objectid_seq'::regclass);


--
-- TOC entry 7357 (class 2604 OID 34435)
-- Name: natureprotectarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.natureprotectarea_objectid_seq'::regclass);


--
-- TOC entry 7360 (class 2604 OID 34436)
-- Name: natureprotectarea_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.natureprotectarea_point_objectid_seq'::regclass);


--
-- TOC entry 7363 (class 2604 OID 34437)
-- Name: natureprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.natureprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7366 (class 2604 OID 34438)
-- Name: num_tracks objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.num_tracks ALTER COLUMN objectid SET DEFAULT nextval('fiz.num_tracks_objectid_seq'::regclass);


--
-- TOC entry 7367 (class 2604 OID 34439)
-- Name: och_use objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.och_use ALTER COLUMN objectid SET DEFAULT nextval('fiz.och_use_objectid_seq'::regclass);


--
-- TOC entry 7368 (class 2604 OID 34440)
-- Name: oilfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.oilfacility_objectid_seq'::regclass);


--
-- TOC entry 7371 (class 2604 OID 34441)
-- Name: oilfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.oilfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7374 (class 2604 OID 34442)
-- Name: oilpipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilpipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.oilpipeline_objectid_seq'::regclass);


--
-- TOC entry 7377 (class 2604 OID 34443)
-- Name: oro_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oro_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.oro_stype_objectid_seq'::regclass);


--
-- TOC entry 7378 (class 2604 OID 34444)
-- Name: oro_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oro_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.oro_type_objectid_seq'::regclass);


--
-- TOC entry 7379 (class 2604 OID 34445)
-- Name: otherobject objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject ALTER COLUMN objectid SET DEFAULT nextval('fiz.otherobject_objectid_seq'::regclass);


--
-- TOC entry 7382 (class 2604 OID 34446)
-- Name: otherobject_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.otherobject_point_objectid_seq'::regclass);


--
-- TOC entry 7385 (class 2604 OID 34447)
-- Name: otherprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.otherprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7388 (class 2604 OID 34448)
-- Name: otherzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.otherzone_objectid_seq'::regclass);


--
-- TOC entry 7391 (class 2604 OID 34449)
-- Name: ozsn_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ozsn_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.ozsn_type_objectid_seq'::regclass);


--
-- TOC entry 7392 (class 2604 OID 34450)
-- Name: pass_term objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pass_term ALTER COLUMN objectid SET DEFAULT nextval('fiz.pass_term_objectid_seq'::regclass);


--
-- TOC entry 7393 (class 2604 OID 34451)
-- Name: ped_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ped_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.ped_type_objectid_seq'::regclass);


--
-- TOC entry 7394 (class 2604 OID 34452)
-- Name: pipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.pipeline_objectid_seq'::regclass);


--
-- TOC entry 7397 (class 2604 OID 34453)
-- Name: pkio_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pkio_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.pkio_type_objectid_seq'::regclass);


--
-- TOC entry 7398 (class 2604 OID 34454)
-- Name: pl_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pl_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.pl_type_objectid_seq'::regclass);


--
-- TOC entry 7399 (class 2604 OID 34455)
-- Name: pline_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pline_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.pline_type_objectid_seq'::regclass);


--
-- TOC entry 7400 (class 2604 OID 34456)
-- Name: power_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.power_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.power_type_objectid_seq'::regclass);


--
-- TOC entry 7401 (class 2604 OID 34457)
-- Name: prg_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prg_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.prg_type_objectid_seq'::regclass);


--
-- TOC entry 7402 (class 2604 OID 34458)
-- Name: prison objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison ALTER COLUMN objectid SET DEFAULT nextval('fiz.prison_objectid_seq'::regclass);


--
-- TOC entry 7405 (class 2604 OID 34459)
-- Name: prison_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.prison_point_objectid_seq'::regclass);


--
-- TOC entry 7408 (class 2604 OID 34460)
-- Name: prkng_lvl objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_lvl ALTER COLUMN objectid SET DEFAULT nextval('fiz.prkng_lvl_objectid_seq'::regclass);


--
-- TOC entry 7409 (class 2604 OID 34461)
-- Name: prkng_time objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_time ALTER COLUMN objectid SET DEFAULT nextval('fiz.prkng_time_objectid_seq'::regclass);


--
-- TOC entry 7410 (class 2604 OID 34462)
-- Name: prkng_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.prkng_type_objectid_seq'::regclass);


--
-- TOC entry 7411 (class 2604 OID 34463)
-- Name: prom_direct objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prom_direct ALTER COLUMN objectid SET DEFAULT nextval('fiz.prom_direct_objectid_seq'::regclass);


--
-- TOC entry 7412 (class 2604 OID 34464)
-- Name: protectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.protectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.protectionzone_objectid_seq'::regclass);


--
-- TOC entry 7415 (class 2604 OID 34465)
-- Name: proximity objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.proximity ALTER COLUMN objectid SET DEFAULT nextval('fiz.proximity_objectid_seq'::regclass);


--
-- TOC entry 7416 (class 2604 OID 34466)
-- Name: pu_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pu_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.pu_stype_objectid_seq'::regclass);


--
-- TOC entry 7417 (class 2604 OID 34467)
-- Name: public objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public ALTER COLUMN objectid SET DEFAULT nextval('fiz.public_objectid_seq'::regclass);


--
-- TOC entry 7420 (class 2604 OID 34468)
-- Name: public_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.public_point_objectid_seq'::regclass);


--
-- TOC entry 7423 (class 2604 OID 34469)
-- Name: publictransportline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportline_objectid_seq'::regclass);


--
-- TOC entry 7426 (class 2604 OID 34470)
-- Name: publictransportobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportobj_objectid_seq'::regclass);


--
-- TOC entry 7429 (class 2604 OID 34471)
-- Name: publictransportobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportobj_point_objectid_seq'::regclass);


--
-- TOC entry 7432 (class 2604 OID 34472)
-- Name: publictransportservice objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportservice_objectid_seq'::regclass);


--
-- TOC entry 7435 (class 2604 OID 34473)
-- Name: publictransportservice_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportservice_point_objectid_seq'::regclass);


--
-- TOC entry 7438 (class 2604 OID 34474)
-- Name: publictransportstops objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportstops_objectid_seq'::regclass);


--
-- TOC entry 7441 (class 2604 OID 34475)
-- Name: publictransportstops_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.publictransportstops_point_objectid_seq'::regclass);


--
-- TOC entry 7444 (class 2604 OID 34476)
-- Name: r_affinity objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.r_affinity ALTER COLUMN objectid SET DEFAULT nextval('fiz.r_affinity_objectid_seq'::regclass);


--
-- TOC entry 7445 (class 2604 OID 34477)
-- Name: rad_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rad_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.rad_class_objectid_seq'::regclass);


--
-- TOC entry 7446 (class 2604 OID 34478)
-- Name: railwayfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.railwayfacility_objectid_seq'::regclass);


--
-- TOC entry 7449 (class 2604 OID 34479)
-- Name: railwayfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.railwayfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7452 (class 2604 OID 34480)
-- Name: railwayline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.railwayline_objectid_seq'::regclass);


--
-- TOC entry 7455 (class 2604 OID 34481)
-- Name: rdwin_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rdwin_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.rdwin_cat_objectid_seq'::regclass);


--
-- TOC entry 7456 (class 2604 OID 34482)
-- Name: rdwin_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rdwin_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.rdwin_type_objectid_seq'::regclass);


--
-- TOC entry 7457 (class 2604 OID 34483)
-- Name: recreation objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation ALTER COLUMN objectid SET DEFAULT nextval('fiz.recreation_objectid_seq'::regclass);


--
-- TOC entry 7460 (class 2604 OID 34484)
-- Name: recreation_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.recreation_point_objectid_seq'::regclass);


--
-- TOC entry 7463 (class 2604 OID 34485)
-- Name: recyc_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recyc_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.recyc_type_objectid_seq'::regclass);


--
-- TOC entry 7464 (class 2604 OID 34486)
-- Name: reg_rdtype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.reg_rdtype ALTER COLUMN objectid SET DEFAULT nextval('fiz.reg_rdtype_objectid_seq'::regclass);


--
-- TOC entry 7465 (class 2604 OID 34487)
-- Name: reg_status objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.reg_status ALTER COLUMN objectid SET DEFAULT nextval('fiz.reg_status_objectid_seq'::regclass);


--
-- TOC entry 7466 (class 2604 OID 34488)
-- Name: res_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.res_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.res_stype_objectid_seq'::regclass);


--
-- TOC entry 7467 (class 2604 OID 34489)
-- Name: resort objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort ALTER COLUMN objectid SET DEFAULT nextval('fiz.resort_objectid_seq'::regclass);


--
-- TOC entry 7470 (class 2604 OID 34490)
-- Name: resort_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.resort_point_objectid_seq'::regclass);


--
-- TOC entry 7473 (class 2604 OID 34491)
-- Name: resortarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.resortarea_objectid_seq'::regclass);


--
-- TOC entry 7476 (class 2604 OID 34492)
-- Name: resortarea_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.resortarea_point_objectid_seq'::regclass);


--
-- TOC entry 7479 (class 2604 OID 34493)
-- Name: resortprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.resortprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7482 (class 2604 OID 34494)
-- Name: rfo_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rfo_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.rfo_type_objectid_seq'::regclass);


--
-- TOC entry 7483 (class 2604 OID 34495)
-- Name: risk_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.risk_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.risk_cat_objectid_seq'::regclass);


--
-- TOC entry 7484 (class 2604 OID 34496)
-- Name: road_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.road_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.road_objectid_seq'::regclass);


--
-- TOC entry 7487 (class 2604 OID 34497)
-- Name: rs_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rs_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.rs_stype_objectid_seq'::regclass);


--
-- TOC entry 7488 (class 2604 OID 34498)
-- Name: rst_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rst_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.rst_class_objectid_seq'::regclass);


--
-- TOC entry 7489 (class 2604 OID 34499)
-- Name: rst_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rst_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.rst_type_objectid_seq'::regclass);


--
-- TOC entry 7490 (class 2604 OID 34500)
-- Name: rwy_class objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rwy_class ALTER COLUMN objectid SET DEFAULT nextval('fiz.rwy_class_objectid_seq'::regclass);


--
-- TOC entry 7491 (class 2604 OID 34501)
-- Name: s_alert objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.s_alert ALTER COLUMN objectid SET DEFAULT nextval('fiz.s_alert_objectid_seq'::regclass);


--
-- TOC entry 7492 (class 2604 OID 34502)
-- Name: saf_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.saf_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.saf_stype_objectid_seq'::regclass);


--
-- TOC entry 7493 (class 2604 OID 34503)
-- Name: sanitaryprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sanitaryprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.sanitaryprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7496 (class 2604 OID 34504)
-- Name: sci_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sci_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.sci_type_objectid_seq'::regclass);


--
-- TOC entry 7497 (class 2604 OID 34505)
-- Name: season objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.season ALTER COLUMN objectid SET DEFAULT nextval('fiz.season_objectid_seq'::regclass);


--
-- TOC entry 7498 (class 2604 OID 34506)
-- Name: serv_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.serv_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.serv_stype_objectid_seq'::regclass);


--
-- TOC entry 7499 (class 2604 OID 34507)
-- Name: servicefacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.servicefacility_objectid_seq'::regclass);


--
-- TOC entry 7502 (class 2604 OID 34508)
-- Name: servicefacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.servicefacility_point_objectid_seq'::regclass);


--
-- TOC entry 7505 (class 2604 OID 34509)
-- Name: settl_cat objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_cat ALTER COLUMN objectid SET DEFAULT nextval('fiz.settl_cat_objectid_seq'::regclass);


--
-- TOC entry 7506 (class 2604 OID 34510)
-- Name: settl_level objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_level ALTER COLUMN objectid SET DEFAULT nextval('fiz.settl_level_objectid_seq'::regclass);


--
-- TOC entry 7507 (class 2604 OID 34511)
-- Name: settl_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.settl_type_objectid_seq'::regclass);


--
-- TOC entry 7508 (class 2604 OID 34512)
-- Name: sewerfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.sewerfacility_objectid_seq'::regclass);


--
-- TOC entry 7511 (class 2604 OID 34513)
-- Name: sewerfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.sewerfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7514 (class 2604 OID 34514)
-- Name: sewerpipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerpipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.sewerpipeline_objectid_seq'::regclass);


--
-- TOC entry 7517 (class 2604 OID 34515)
-- Name: snow_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.snow_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.snow_type_objectid_seq'::regclass);


--
-- TOC entry 7518 (class 2604 OID 34516)
-- Name: soc_direct objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.soc_direct ALTER COLUMN objectid SET DEFAULT nextval('fiz.soc_direct_objectid_seq'::regclass);


--
-- TOC entry 7519 (class 2604 OID 34517)
-- Name: social objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social ALTER COLUMN objectid SET DEFAULT nextval('fiz.social_objectid_seq'::regclass);


--
-- TOC entry 7522 (class 2604 OID 34518)
-- Name: social_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.social_point_objectid_seq'::regclass);


--
-- TOC entry 7525 (class 2604 OID 34519)
-- Name: sp_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sp_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.sp_stype_objectid_seq'::regclass);


--
-- TOC entry 7526 (class 2604 OID 34520)
-- Name: specialeconomicarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.specialeconomicarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.specialeconomicarea_objectid_seq'::regclass);


--
-- TOC entry 7529 (class 2604 OID 34521)
-- Name: specific objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.specific ALTER COLUMN objectid SET DEFAULT nextval('fiz.specific_objectid_seq'::regclass);


--
-- TOC entry 7530 (class 2604 OID 34522)
-- Name: sport objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport ALTER COLUMN objectid SET DEFAULT nextval('fiz.sport_objectid_seq'::regclass);


--
-- TOC entry 7533 (class 2604 OID 34523)
-- Name: sport_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.sport_point_objectid_seq'::regclass);


--
-- TOC entry 7536 (class 2604 OID 34524)
-- Name: spz_event objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.spz_event ALTER COLUMN objectid SET DEFAULT nextval('fiz.spz_event_objectid_seq'::regclass);


--
-- TOC entry 7537 (class 2604 OID 34525)
-- Name: ssah_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ssah_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.ssah_stype_objectid_seq'::regclass);


--
-- TOC entry 7538 (class 2604 OID 34526)
-- Name: st_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.st_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.st_stype_objectid_seq'::regclass);


--
-- TOC entry 7539 (class 2604 OID 34527)
-- Name: status objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status ALTER COLUMN objectid SET DEFAULT nextval('fiz.status_objectid_seq'::regclass);


--
-- TOC entry 7540 (class 2604 OID 34528)
-- Name: status_adm objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_adm ALTER COLUMN objectid SET DEFAULT nextval('fiz.status_adm_objectid_seq'::regclass);


--
-- TOC entry 7541 (class 2604 OID 34529)
-- Name: status_och objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_och ALTER COLUMN objectid SET DEFAULT nextval('fiz.status_och_objectid_seq'::regclass);


--
-- TOC entry 7542 (class 2604 OID 34530)
-- Name: status_pr objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_pr ALTER COLUMN objectid SET DEFAULT nextval('fiz.status_pr_objectid_seq'::regclass);


--
-- TOC entry 7543 (class 2604 OID 34531)
-- Name: stop_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.stop_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.stop_type_objectid_seq'::regclass);


--
-- TOC entry 7544 (class 2604 OID 34532)
-- Name: store_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.store_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.store_type_objectid_seq'::regclass);


--
-- TOC entry 7545 (class 2604 OID 34533)
-- Name: str_l_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_l_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.str_l_type_objectid_seq'::regclass);


--
-- TOC entry 7546 (class 2604 OID 34534)
-- Name: str_r_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_r_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.str_r_type_objectid_seq'::regclass);


--
-- TOC entry 7547 (class 2604 OID 34535)
-- Name: str_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.str_type_objectid_seq'::regclass);


--
-- TOC entry 7548 (class 2604 OID 34536)
-- Name: su_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.su_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.su_type_objectid_seq'::regclass);


--
-- TOC entry 7549 (class 2604 OID 34537)
-- Name: suburban_tr objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.suburban_tr ALTER COLUMN objectid SET DEFAULT nextval('fiz.suburban_tr_objectid_seq'::regclass);


--
-- TOC entry 7550 (class 2604 OID 34538)
-- Name: surface_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.surface_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.surface_type_objectid_seq'::regclass);


--
-- TOC entry 7551 (class 2604 OID 34539)
-- Name: szz_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.szz_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.szz_type_objectid_seq'::regclass);


--
-- TOC entry 7552 (class 2604 OID 34540)
-- Name: technoriskarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.technoriskarea_objectid_seq'::regclass);


--
-- TOC entry 7555 (class 2604 OID 34541)
-- Name: technoriskarea_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.technoriskarea_point_objectid_seq'::regclass);


--
-- TOC entry 7558 (class 2604 OID 34542)
-- Name: telecomfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.telecomfacility_objectid_seq'::regclass);


--
-- TOC entry 7561 (class 2604 OID 34543)
-- Name: telecomfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.telecomfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7564 (class 2604 OID 34544)
-- Name: thermalfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.thermalfacility_objectid_seq'::regclass);


--
-- TOC entry 7567 (class 2604 OID 34545)
-- Name: thermalfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.thermalfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7570 (class 2604 OID 34546)
-- Name: thermalpipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalpipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.thermalpipeline_objectid_seq'::regclass);


--
-- TOC entry 7573 (class 2604 OID 34547)
-- Name: time_ltype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.time_ltype ALTER COLUMN objectid SET DEFAULT nextval('fiz.time_ltype_objectid_seq'::regclass);


--
-- TOC entry 7574 (class 2604 OID 34548)
-- Name: tm_source objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tm_source ALTER COLUMN objectid SET DEFAULT nextval('fiz.tm_source_objectid_seq'::regclass);


--
-- TOC entry 7575 (class 2604 OID 34549)
-- Name: tpark_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tpark_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.tpark_type_objectid_seq'::regclass);


--
-- TOC entry 7576 (class 2604 OID 34550)
-- Name: track_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.track_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.track_type_objectid_seq'::regclass);


--
-- TOC entry 7577 (class 2604 OID 34551)
-- Name: traditionalarea objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.traditionalarea ALTER COLUMN objectid SET DEFAULT nextval('fiz.traditionalarea_objectid_seq'::regclass);


--
-- TOC entry 7580 (class 2604 OID 34552)
-- Name: transplogisticobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.transplogisticobj_objectid_seq'::regclass);


--
-- TOC entry 7583 (class 2604 OID 34553)
-- Name: transplogisticobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.transplogisticobj_point_objectid_seq'::regclass);


--
-- TOC entry 7586 (class 2604 OID 34554)
-- Name: transportobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.transportobj_objectid_seq'::regclass);


--
-- TOC entry 7589 (class 2604 OID 34555)
-- Name: transportobj_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.transportobj_line_objectid_seq'::regclass);


--
-- TOC entry 7592 (class 2604 OID 34556)
-- Name: transportobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.transportobj_point_objectid_seq'::regclass);


--
-- TOC entry 7595 (class 2604 OID 34557)
-- Name: transpprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.transpprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7598 (class 2604 OID 34558)
-- Name: transpsanitarygapzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpsanitarygapzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.transpsanitarygapzone_objectid_seq'::regclass);


--
-- TOC entry 7601 (class 2604 OID 34559)
-- Name: trd_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.trd_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.trd_stype_objectid_seq'::regclass);


--
-- TOC entry 7602 (class 2604 OID 34560)
-- Name: tunnel_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tunnel_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.tunnel_t_objectid_seq'::regclass);


--
-- TOC entry 7603 (class 2604 OID 34561)
-- Name: type_law objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.type_law ALTER COLUMN objectid SET DEFAULT nextval('fiz.type_law_objectid_seq'::regclass);


--
-- TOC entry 7604 (class 2604 OID 34562)
-- Name: type_subj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.type_subj ALTER COLUMN objectid SET DEFAULT nextval('fiz.type_subj_objectid_seq'::regclass);


--
-- TOC entry 7605 (class 2604 OID 34563)
-- Name: uderfl_t objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.uderfl_t ALTER COLUMN objectid SET DEFAULT nextval('fiz.uderfl_t_objectid_seq'::regclass);


--
-- TOC entry 7606 (class 2604 OID 34564)
-- Name: usa_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.usa_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.usa_stype_objectid_seq'::regclass);


--
-- TOC entry 7607 (class 2604 OID 34565)
-- Name: using_type objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.using_type ALTER COLUMN objectid SET DEFAULT nextval('fiz.using_type_objectid_seq'::regclass);


--
-- TOC entry 7608 (class 2604 OID 34566)
-- Name: voltage objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.voltage ALTER COLUMN objectid SET DEFAULT nextval('fiz.voltage_objectid_seq'::regclass);


--
-- TOC entry 7609 (class 2604 OID 34567)
-- Name: w_source objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.w_source ALTER COLUMN objectid SET DEFAULT nextval('fiz.w_source_objectid_seq'::regclass);


--
-- TOC entry 7610 (class 2604 OID 34568)
-- Name: wastefacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.wastefacility_objectid_seq'::regclass);


--
-- TOC entry 7613 (class 2604 OID 34569)
-- Name: wastefacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.wastefacility_point_objectid_seq'::regclass);


--
-- TOC entry 7616 (class 2604 OID 34570)
-- Name: water_stype objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.water_stype ALTER COLUMN objectid SET DEFAULT nextval('fiz.water_stype_objectid_seq'::regclass);


--
-- TOC entry 7617 (class 2604 OID 34571)
-- Name: waterfacility objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility ALTER COLUMN objectid SET DEFAULT nextval('fiz.waterfacility_objectid_seq'::regclass);


--
-- TOC entry 7620 (class 2604 OID 34572)
-- Name: waterfacility_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.waterfacility_point_objectid_seq'::regclass);


--
-- TOC entry 7623 (class 2604 OID 34573)
-- Name: waterpipeline_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterpipeline_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.waterpipeline_objectid_seq'::regclass);


--
-- TOC entry 7626 (class 2604 OID 34574)
-- Name: waterprotectionzone objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterprotectionzone ALTER COLUMN objectid SET DEFAULT nextval('fiz.waterprotectionzone_objectid_seq'::regclass);


--
-- TOC entry 7629 (class 2604 OID 34575)
-- Name: watertransportobj objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj ALTER COLUMN objectid SET DEFAULT nextval('fiz.watertransportobj_objectid_seq'::regclass);


--
-- TOC entry 7632 (class 2604 OID 34576)
-- Name: watertransportobj_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.watertransportobj_point_objectid_seq'::regclass);


--
-- TOC entry 7635 (class 2604 OID 34577)
-- Name: waterways_line objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterways_line ALTER COLUMN objectid SET DEFAULT nextval('fiz.waterways_objectid_seq'::regclass);


--
-- TOC entry 7638 (class 2604 OID 34578)
-- Name: wildlifeprotection objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection ALTER COLUMN objectid SET DEFAULT nextval('fiz.wildlifeprotection_objectid_seq'::regclass);


--
-- TOC entry 7641 (class 2604 OID 34579)
-- Name: wildlifeprotection_point objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection_point ALTER COLUMN objectid SET DEFAULT nextval('fiz.wildlifeprotection_point_objectid_seq'::regclass);


--
-- TOC entry 7644 (class 2604 OID 34580)
-- Name: yatch_cls objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.yatch_cls ALTER COLUMN objectid SET DEFAULT nextval('fiz.yatch_cls_objectid_seq'::regclass);


--
-- TOC entry 7645 (class 2604 OID 34581)
-- Name: zone_oopt objectid; Type: DEFAULT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.zone_oopt ALTER COLUMN objectid SET DEFAULT nextval('fiz.zone_oopt_objectid_seq'::regclass);


--
-- TOC entry 7647 (class 2606 OID 34707)
-- Name: ab_stype ab_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ab_stype
    ADD CONSTRAINT ab_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7652 (class 2606 OID 34709)
-- Name: admborder_line_extension admborder_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admborder_line_extension
    ADD CONSTRAINT admborder_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7649 (class 2606 OID 34711)
-- Name: admborder_line admborder_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admborder_line
    ADD CONSTRAINT admborder_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7657 (class 2606 OID 34713)
-- Name: admemo_extension admemo_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admemo_extension
    ADD CONSTRAINT admemo_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7654 (class 2606 OID 34715)
-- Name: admemo admemo_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admemo
    ADD CONSTRAINT admemo_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7662 (class 2606 OID 34717)
-- Name: admenp_extension admenp_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admenp_extension
    ADD CONSTRAINT admenp_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7659 (class 2606 OID 34719)
-- Name: admenp admenp_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admenp
    ADD CONSTRAINT admenp_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7667 (class 2606 OID 34721)
-- Name: admerf_extension admerf_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admerf_extension
    ADD CONSTRAINT admerf_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7664 (class 2606 OID 34723)
-- Name: admerf admerf_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admerf
    ADD CONSTRAINT admerf_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7672 (class 2606 OID 34725)
-- Name: admesrf_extension admesrf_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admesrf_extension
    ADD CONSTRAINT admesrf_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7669 (class 2606 OID 34727)
-- Name: admesrf admesrf_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.admesrf
    ADD CONSTRAINT admesrf_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7674 (class 2606 OID 34729)
-- Name: aeroszone aeroszone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.aeroszone
    ADD CONSTRAINT aeroszone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7676 (class 2606 OID 34731)
-- Name: af_type af_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.af_type
    ADD CONSTRAINT af_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7681 (class 2606 OID 34733)
-- Name: agriculture_extension agriculture_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture_extension
    ADD CONSTRAINT agriculture_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7678 (class 2606 OID 34735)
-- Name: agriculture agriculture_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture
    ADD CONSTRAINT agriculture_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7686 (class 2606 OID 34737)
-- Name: agriculture_point_extension agriculture_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture_point_extension
    ADD CONSTRAINT agriculture_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7683 (class 2606 OID 34739)
-- Name: agriculture_point agriculture_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.agriculture_point
    ADD CONSTRAINT agriculture_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7691 (class 2606 OID 34741)
-- Name: airtransportobj_extension airtransportobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj_extension
    ADD CONSTRAINT airtransportobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7688 (class 2606 OID 34743)
-- Name: airtransportobj airtransportobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj
    ADD CONSTRAINT airtransportobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7696 (class 2606 OID 34745)
-- Name: airtransportobj_point_extension airtransportobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj_point_extension
    ADD CONSTRAINT airtransportobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7693 (class 2606 OID 34747)
-- Name: airtransportobj_point airtransportobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.airtransportobj_point
    ADD CONSTRAINT airtransportobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7698 (class 2606 OID 34749)
-- Name: al_stype al_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.al_stype
    ADD CONSTRAINT al_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7700 (class 2606 OID 34751)
-- Name: amb_type amb_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.amb_type
    ADD CONSTRAINT amb_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7702 (class 2606 OID 34753)
-- Name: ans_type ans_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ans_type
    ADD CONSTRAINT ans_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7704 (class 2606 OID 34755)
-- Name: aq_stype aq_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.aq_stype
    ADD CONSTRAINT aq_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7709 (class 2606 OID 34757)
-- Name: areabasedevelopment_extension areabasedevelopment_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.areabasedevelopment_extension
    ADD CONSTRAINT areabasedevelopment_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7706 (class 2606 OID 34759)
-- Name: areabasedevelopment areabasedevelopment_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.areabasedevelopment
    ADD CONSTRAINT areabasedevelopment_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7714 (class 2606 OID 34761)
-- Name: authorityservice_extension authorityservice_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice_extension
    ADD CONSTRAINT authorityservice_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7711 (class 2606 OID 34763)
-- Name: authorityservice authorityservice_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice
    ADD CONSTRAINT authorityservice_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7719 (class 2606 OID 34765)
-- Name: authorityservice_point_extension authorityservice_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice_point_extension
    ADD CONSTRAINT authorityservice_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7716 (class 2606 OID 34767)
-- Name: authorityservice_point authorityservice_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.authorityservice_point
    ADD CONSTRAINT authorityservice_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7724 (class 2606 OID 34769)
-- Name: autoservice_extension autoservice_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice_extension
    ADD CONSTRAINT autoservice_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7721 (class 2606 OID 34771)
-- Name: autoservice autoservice_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice
    ADD CONSTRAINT autoservice_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7729 (class 2606 OID 34773)
-- Name: autoservice_point_extension autoservice_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice_point_extension
    ADD CONSTRAINT autoservice_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7726 (class 2606 OID 34775)
-- Name: autoservice_point autoservice_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.autoservice_point
    ADD CONSTRAINT autoservice_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7731 (class 2606 OID 34777)
-- Name: avia_type avia_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.avia_type
    ADD CONSTRAINT avia_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7733 (class 2606 OID 34779)
-- Name: bent_type bent_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bent_type
    ADD CONSTRAINT bent_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7735 (class 2606 OID 34781)
-- Name: bridge_t bridge_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bridge_t
    ADD CONSTRAINT bridge_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7737 (class 2606 OID 34783)
-- Name: bur_type bur_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.bur_type
    ADD CONSTRAINT bur_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7739 (class 2606 OID 34785)
-- Name: cable_type cable_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cable_type
    ADD CONSTRAINT cable_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7741 (class 2606 OID 34787)
-- Name: cat_distr cat_distr_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_distr
    ADD CONSTRAINT cat_distr_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7743 (class 2606 OID 34789)
-- Name: cat_main cat_main_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_main
    ADD CONSTRAINT cat_main_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7745 (class 2606 OID 34791)
-- Name: cat_rdtype cat_rdtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_rdtype
    ADD CONSTRAINT cat_rdtype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7747 (class 2606 OID 34793)
-- Name: cat_rr cat_rr_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cat_rr
    ADD CONSTRAINT cat_rr_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7749 (class 2606 OID 34795)
-- Name: cemet_stat cemet_stat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_stat
    ADD CONSTRAINT cemet_stat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7751 (class 2606 OID 34797)
-- Name: cemet_stype cemet_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_stype
    ADD CONSTRAINT cemet_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7753 (class 2606 OID 34799)
-- Name: cemet_type cemet_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_type
    ADD CONSTRAINT cemet_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7755 (class 2606 OID 34801)
-- Name: cemet_wtype cemet_wtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemet_wtype
    ADD CONSTRAINT cemet_wtype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7760 (class 2606 OID 34803)
-- Name: cemetery_extension cemetery_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery_extension
    ADD CONSTRAINT cemetery_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7757 (class 2606 OID 34805)
-- Name: cemetery cemetery_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery
    ADD CONSTRAINT cemetery_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7765 (class 2606 OID 34807)
-- Name: cemetery_point_extension cemetery_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery_point_extension
    ADD CONSTRAINT cemetery_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7762 (class 2606 OID 34809)
-- Name: cemetery_point cemetery_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cemetery_point
    ADD CONSTRAINT cemetery_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7767 (class 2606 OID 34811)
-- Name: cep_class cep_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cep_class
    ADD CONSTRAINT cep_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7769 (class 2606 OID 34813)
-- Name: chi_stype chi_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.chi_stype
    ADD CONSTRAINT chi_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7771 (class 2606 OID 34815)
-- Name: clb_type clb_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.clb_type
    ADD CONSTRAINT clb_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7776 (class 2606 OID 34817)
-- Name: coastalprotectionzone_extension coastalprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.coastalprotectionzone_extension
    ADD CONSTRAINT coastalprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7773 (class 2606 OID 34819)
-- Name: coastalprotectionzone coastalprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.coastalprotectionzone
    ADD CONSTRAINT coastalprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7778 (class 2606 OID 34821)
-- Name: comm_type comm_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.comm_type
    ADD CONSTRAINT comm_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7780 (class 2606 OID 34823)
-- Name: comm_сtype comm_сtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz."comm_сtype"
    ADD CONSTRAINT "comm_сtype_pkey" PRIMARY KEY (objectid);


--
-- TOC entry 7782 (class 2606 OID 34825)
-- Name: cr_stype cr_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cr_stype
    ADD CONSTRAINT cr_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7784 (class 2606 OID 34827)
-- Name: crossp_t crossp_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.crossp_t
    ADD CONSTRAINT crossp_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7786 (class 2606 OID 34829)
-- Name: crossr_t crossr_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.crossr_t
    ADD CONSTRAINT crossr_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7788 (class 2606 OID 34831)
-- Name: ctm_time_t ctm_time_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ctm_time_t
    ADD CONSTRAINT ctm_time_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7790 (class 2606 OID 34833)
-- Name: ctm_use_t ctm_use_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ctm_use_t
    ADD CONSTRAINT ctm_use_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7792 (class 2606 OID 34835)
-- Name: cu_type cu_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.cu_type
    ADD CONSTRAINT cu_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7797 (class 2606 OID 34837)
-- Name: culture_extension culture_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture_extension
    ADD CONSTRAINT culture_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7794 (class 2606 OID 34839)
-- Name: culture culture_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture
    ADD CONSTRAINT culture_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7802 (class 2606 OID 34841)
-- Name: culture_point_extension culture_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture_point_extension
    ADD CONSTRAINT culture_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7799 (class 2606 OID 34843)
-- Name: culture_point culture_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.culture_point
    ADD CONSTRAINT culture_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7804 (class 2606 OID 34845)
-- Name: current current_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.current
    ADD CONSTRAINT current_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7809 (class 2606 OID 34847)
-- Name: customcontrol_extension customcontrol_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol_extension
    ADD CONSTRAINT customcontrol_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7806 (class 2606 OID 34849)
-- Name: customcontrol customcontrol_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol
    ADD CONSTRAINT customcontrol_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7814 (class 2606 OID 34851)
-- Name: customcontrol_point_extension customcontrol_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol_point_extension
    ADD CONSTRAINT customcontrol_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7811 (class 2606 OID 34853)
-- Name: customcontrol_point customcontrol_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.customcontrol_point
    ADD CONSTRAINT customcontrol_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7816 (class 2606 OID 34855)
-- Name: d_objects d_objects_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.d_objects
    ADD CONSTRAINT d_objects_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7818 (class 2606 OID 34857)
-- Name: danger_obj danger_obj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.danger_obj
    ADD CONSTRAINT danger_obj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7823 (class 2606 OID 34859)
-- Name: drinkwaterprotectionzone_extension drinkwaterprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.drinkwaterprotectionzone_extension
    ADD CONSTRAINT drinkwaterprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7820 (class 2606 OID 34861)
-- Name: drinkwaterprotectionzone drinkwaterprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.drinkwaterprotectionzone
    ADD CONSTRAINT drinkwaterprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7825 (class 2606 OID 34863)
-- Name: edu_sdtype edu_sdtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_sdtype
    ADD CONSTRAINT edu_sdtype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7827 (class 2606 OID 34865)
-- Name: edu_stype edu_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_stype
    ADD CONSTRAINT edu_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7829 (class 2606 OID 34867)
-- Name: edu_tunit edu_tunit_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.edu_tunit
    ADD CONSTRAINT edu_tunit_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7834 (class 2606 OID 34869)
-- Name: education_extension education_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education_extension
    ADD CONSTRAINT education_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7831 (class 2606 OID 34871)
-- Name: education education_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7839 (class 2606 OID 34873)
-- Name: education_point_extension education_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education_point_extension
    ADD CONSTRAINT education_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7836 (class 2606 OID 34875)
-- Name: education_point education_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.education_point
    ADD CONSTRAINT education_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7841 (class 2606 OID 34877)
-- Name: el_supply el_supply_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.el_supply
    ADD CONSTRAINT el_supply_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7846 (class 2606 OID 34879)
-- Name: electricline_line_extension electricline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricline_line_extension
    ADD CONSTRAINT electricline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7843 (class 2606 OID 34881)
-- Name: electricline_line electricline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricline_line
    ADD CONSTRAINT electricline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7851 (class 2606 OID 34883)
-- Name: electricpowerstation_extension electricpowerstation_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation_extension
    ADD CONSTRAINT electricpowerstation_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7848 (class 2606 OID 34885)
-- Name: electricpowerstation electricpowerstation_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation
    ADD CONSTRAINT electricpowerstation_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7856 (class 2606 OID 34887)
-- Name: electricpowerstation_point_extension electricpowerstation_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation_point_extension
    ADD CONSTRAINT electricpowerstation_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7853 (class 2606 OID 34889)
-- Name: electricpowerstation_point electricpowerstation_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electricpowerstation_point
    ADD CONSTRAINT electricpowerstation_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7861 (class 2606 OID 34891)
-- Name: electrictransformer_extension electrictransformer_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer_extension
    ADD CONSTRAINT electrictransformer_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7858 (class 2606 OID 34893)
-- Name: electrictransformer electrictransformer_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer
    ADD CONSTRAINT electrictransformer_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7866 (class 2606 OID 34895)
-- Name: electrictransformer_point_extension electrictransformer_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer_point_extension
    ADD CONSTRAINT electrictransformer_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7863 (class 2606 OID 34897)
-- Name: electrictransformer_point electrictransformer_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.electrictransformer_point
    ADD CONSTRAINT electrictransformer_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7868 (class 2606 OID 34899)
-- Name: eme_class eme_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.eme_class
    ADD CONSTRAINT eme_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7870 (class 2606 OID 34901)
-- Name: eme_source eme_source_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.eme_source
    ADD CONSTRAINT eme_source_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7875 (class 2606 OID 34903)
-- Name: emergencyprotectionobj_extension emergencyprotectionobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj_extension
    ADD CONSTRAINT emergencyprotectionobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7872 (class 2606 OID 34905)
-- Name: emergencyprotectionobj emergencyprotectionobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj
    ADD CONSTRAINT emergencyprotectionobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7880 (class 2606 OID 34907)
-- Name: emergencyprotectionobj_point_extension emergencyprotectionobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj_point_extension
    ADD CONSTRAINT emergencyprotectionobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7877 (class 2606 OID 34909)
-- Name: emergencyprotectionobj_point emergencyprotectionobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.emergencyprotectionobj_point
    ADD CONSTRAINT emergencyprotectionobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7885 (class 2606 OID 34911)
-- Name: engprotectionobj_line_extension engprotectionobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_line_extension
    ADD CONSTRAINT engprotectionobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7882 (class 2606 OID 34913)
-- Name: engprotectionobj_line engprotectionobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_line
    ADD CONSTRAINT engprotectionobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7890 (class 2606 OID 34915)
-- Name: engprotectionobj_point_extension engprotectionobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_point_extension
    ADD CONSTRAINT engprotectionobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7887 (class 2606 OID 34917)
-- Name: engprotectionobj_point engprotectionobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionobj_point
    ADD CONSTRAINT engprotectionobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7895 (class 2606 OID 34919)
-- Name: engprotectionzone_extension engprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionzone_extension
    ADD CONSTRAINT engprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7892 (class 2606 OID 34921)
-- Name: engprotectionzone engprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engprotectionzone
    ADD CONSTRAINT engprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7900 (class 2606 OID 34923)
-- Name: engsanitarygapzone_extension engsanitarygapzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engsanitarygapzone_extension
    ADD CONSTRAINT engsanitarygapzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7897 (class 2606 OID 34925)
-- Name: engsanitarygapzone engsanitarygapzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.engsanitarygapzone
    ADD CONSTRAINT engsanitarygapzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7902 (class 2606 OID 34927)
-- Name: ent_type ent_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ent_type
    ADD CONSTRAINT ent_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7907 (class 2606 OID 34929)
-- Name: envdanger_extension envdanger_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger_extension
    ADD CONSTRAINT envdanger_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7904 (class 2606 OID 34931)
-- Name: envdanger envdanger_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger
    ADD CONSTRAINT envdanger_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7912 (class 2606 OID 34933)
-- Name: envdanger_point_extension envdanger_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger_point_extension
    ADD CONSTRAINT envdanger_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7909 (class 2606 OID 34935)
-- Name: envdanger_point envdanger_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envdanger_point
    ADD CONSTRAINT envdanger_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7917 (class 2606 OID 34937)
-- Name: envmonitoring_extension envmonitoring_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring_extension
    ADD CONSTRAINT envmonitoring_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7914 (class 2606 OID 34939)
-- Name: envmonitoring envmonitoring_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring
    ADD CONSTRAINT envmonitoring_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7922 (class 2606 OID 34941)
-- Name: envmonitoring_point_extension envmonitoring_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring_point_extension
    ADD CONSTRAINT envmonitoring_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7919 (class 2606 OID 34943)
-- Name: envmonitoring_point envmonitoring_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.envmonitoring_point
    ADD CONSTRAINT envmonitoring_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7924 (class 2606 OID 34945)
-- Name: feature_lep feature_lep_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.feature_lep
    ADD CONSTRAINT feature_lep_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7926 (class 2606 OID 34947)
-- Name: ferry_crgt ferry_crgt_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ferry_crgt
    ADD CONSTRAINT ferry_crgt_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7928 (class 2606 OID 34949)
-- Name: ferry_mvt ferry_mvt_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ferry_mvt
    ADD CONSTRAINT ferry_mvt_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7933 (class 2606 OID 34951)
-- Name: fishprotectionzone_extension fishprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fishprotectionzone_extension
    ADD CONSTRAINT fishprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7930 (class 2606 OID 34953)
-- Name: fishprotectionzone fishprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fishprotectionzone
    ADD CONSTRAINT fishprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7938 (class 2606 OID 34955)
-- Name: floodarea_extension floodarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.floodarea_extension
    ADD CONSTRAINT floodarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7935 (class 2606 OID 34957)
-- Name: floodarea floodarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.floodarea
    ADD CONSTRAINT floodarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7940 (class 2606 OID 34959)
-- Name: flooding_t flooding_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.flooding_t
    ADD CONSTRAINT flooding_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7945 (class 2606 OID 34961)
-- Name: foreshore_extension foreshore_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.foreshore_extension
    ADD CONSTRAINT foreshore_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7942 (class 2606 OID 34963)
-- Name: foreshore foreshore_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.foreshore
    ADD CONSTRAINT foreshore_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7950 (class 2606 OID 34965)
-- Name: forest_cat forest_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_cat
    ADD CONSTRAINT forest_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7952 (class 2606 OID 34967)
-- Name: forest_extension forest_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_extension
    ADD CONSTRAINT forest_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7954 (class 2606 OID 34969)
-- Name: forest_os forest_os_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_os
    ADD CONSTRAINT forest_os_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7947 (class 2606 OID 34971)
-- Name: forest forest_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest
    ADD CONSTRAINT forest_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7956 (class 2606 OID 34973)
-- Name: forest_t forest_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_t
    ADD CONSTRAINT forest_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7958 (class 2606 OID 34975)
-- Name: forest_val forest_val_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forest_val
    ADD CONSTRAINT forest_val_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7963 (class 2606 OID 34977)
-- Name: forestpark_extension forestpark_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forestpark_extension
    ADD CONSTRAINT forestpark_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7960 (class 2606 OID 34979)
-- Name: forestpark forestpark_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.forestpark
    ADD CONSTRAINT forestpark_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7965 (class 2606 OID 34981)
-- Name: fp_class fp_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fp_class
    ADD CONSTRAINT fp_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7967 (class 2606 OID 34983)
-- Name: fp_type fp_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fp_type
    ADD CONSTRAINT fp_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7969 (class 2606 OID 34985)
-- Name: fs_objects fs_objects_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fs_objects
    ADD CONSTRAINT fs_objects_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7971 (class 2606 OID 34987)
-- Name: fses_stype fses_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fses_stype ADD CONSTRAINT fses_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.fuel_type ADD CONSTRAINT fuel_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.functionalzone_extension ADD CONSTRAINT functionalzone_extension_pkey PRIMARY KEY (object_id);
ALTER TABLE ONLY fiz.functionalzone ADD CONSTRAINT functionalzone_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.street_line ADD CONSTRAINT street_line_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.streetv_line ADD CONSTRAINT streetv_line_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.telecomnetworkline_line ADD CONSTRAINT telecomnetworkline_line_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.fz_ingstp ADD CONSTRAINT fz_ingstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.fz_mfstp ADD CONSTRAINT fz_mfstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.fz_odstp ADD CONSTRAINT fz_odstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY fiz.fz_orecstp ADD CONSTRAINT fz_orecstp_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7988 (class 2606 OID 35003)
-- Name: fz_recstp fz_recstp_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_recstp
    ADD CONSTRAINT fz_recstp_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7990 (class 2606 OID 35005)
-- Name: fz_shstp fz_shstp_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_shstp
    ADD CONSTRAINT fz_shstp_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7992 (class 2606 OID 35007)
-- Name: fz_trstp fz_trstp_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.fz_trstp
    ADD CONSTRAINT fz_trstp_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7994 (class 2606 OID 35009)
-- Name: gas_st_type gas_st_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gas_st_type
    ADD CONSTRAINT gas_st_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 7999 (class 2606 OID 35011)
-- Name: gasfacility_extension gasfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility_extension
    ADD CONSTRAINT gasfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 7996 (class 2606 OID 35013)
-- Name: gasfacility gasfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility
    ADD CONSTRAINT gasfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8004 (class 2606 OID 35015)
-- Name: gasfacility_point_extension gasfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility_point_extension
    ADD CONSTRAINT gasfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8001 (class 2606 OID 35017)
-- Name: gasfacility_point gasfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gasfacility_point
    ADD CONSTRAINT gasfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8009 (class 2606 OID 35019)
-- Name: gaspipeline_line_extension gaspipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gaspipeline_line_extension
    ADD CONSTRAINT gaspipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8006 (class 2606 OID 35021)
-- Name: gaspipeline_line gaspipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gaspipeline_line
    ADD CONSTRAINT gaspipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8014 (class 2606 OID 35023)
-- Name: greeneryplanting_extension greeneryplanting_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.greeneryplanting_extension
    ADD CONSTRAINT greeneryplanting_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8011 (class 2606 OID 35025)
-- Name: greeneryplanting greeneryplanting_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.greeneryplanting
    ADD CONSTRAINT greeneryplanting_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8016 (class 2606 OID 35027)
-- Name: ground_pos ground_pos_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ground_pos
    ADD CONSTRAINT ground_pos_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8018 (class 2606 OID 35029)
-- Name: gts_class gts_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.gts_class
    ADD CONSTRAINT gts_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8023 (class 2606 OID 35031)
-- Name: hazardarea_extension hazardarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hazardarea_extension
    ADD CONSTRAINT hazardarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8020 (class 2606 OID 35033)
-- Name: hazardarea hazardarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hazardarea
    ADD CONSTRAINT hazardarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8028 (class 2606 OID 35035)
-- Name: health_extension health_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health_extension
    ADD CONSTRAINT health_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8025 (class 2606 OID 35037)
-- Name: health health_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health
    ADD CONSTRAINT health_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8033 (class 2606 OID 35039)
-- Name: health_point_extension health_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health_point_extension
    ADD CONSTRAINT health_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8030 (class 2606 OID 35041)
-- Name: health_point health_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.health_point
    ADD CONSTRAINT health_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8035 (class 2606 OID 35043)
-- Name: her_type her_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.her_type
    ADD CONSTRAINT her_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8040 (class 2606 OID 35045)
-- Name: heritage_point_extension heritage_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritage_point_extension
    ADD CONSTRAINT heritage_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8037 (class 2606 OID 35047)
-- Name: heritage_point heritage_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritage_point
    ADD CONSTRAINT heritage_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8045 (class 2606 OID 35049)
-- Name: heritagearea_extension heritagearea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritagearea_extension
    ADD CONSTRAINT heritagearea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8042 (class 2606 OID 35051)
-- Name: heritagearea heritagearea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritagearea
    ADD CONSTRAINT heritagearea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8050 (class 2606 OID 35053)
-- Name: heritageprotectionzone_extension heritageprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritageprotectionzone_extension
    ADD CONSTRAINT heritageprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8047 (class 2606 OID 35055)
-- Name: heritageprotectionzone heritageprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.heritageprotectionzone
    ADD CONSTRAINT heritageprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8052 (class 2606 OID 35057)
-- Name: hist_cat hist_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hist_cat
    ADD CONSTRAINT hist_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8054 (class 2606 OID 35059)
-- Name: hist_out hist_out_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hist_out
    ADD CONSTRAINT hist_out_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8059 (class 2606 OID 35061)
-- Name: historicsettlement_extension historicsettlement_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.historicsettlement_extension
    ADD CONSTRAINT historicsettlement_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8056 (class 2606 OID 35063)
-- Name: historicsettlement historicsettlement_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.historicsettlement
    ADD CONSTRAINT historicsettlement_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8061 (class 2606 OID 35065)
-- Name: hot_stype hot_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hot_stype
    ADD CONSTRAINT hot_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8066 (class 2606 OID 35067)
-- Name: hydraulicstructures_line_extension hydraulicstructures_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_line_extension
    ADD CONSTRAINT hydraulicstructures_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8063 (class 2606 OID 35069)
-- Name: hydraulicstructures_line hydraulicstructures_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_line
    ADD CONSTRAINT hydraulicstructures_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8071 (class 2606 OID 35071)
-- Name: hydraulicstructures_point_extension hydraulicstructures_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_point_extension
    ADD CONSTRAINT hydraulicstructures_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8068 (class 2606 OID 35073)
-- Name: hydraulicstructures_point hydraulicstructures_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydraulicstructures_point
    ADD CONSTRAINT hydraulicstructures_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8076 (class 2606 OID 35075)
-- Name: hydro_extension hydro_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_extension
    ADD CONSTRAINT hydro_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8081 (class 2606 OID 35077)
-- Name: hydro_line_extension hydro_line_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_line_extension
    ADD CONSTRAINT hydro_line_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8078 (class 2606 OID 35079)
-- Name: hydro_line hydro_line_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_line
    ADD CONSTRAINT hydro_line_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8073 (class 2606 OID 35081)
-- Name: hydro hydro_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro
    ADD CONSTRAINT hydro_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8086 (class 2606 OID 35083)
-- Name: hydro_point_extension hydro_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_point_extension
    ADD CONSTRAINT hydro_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8083 (class 2606 OID 35085)
-- Name: hydro_point hydro_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hydro_point
    ADD CONSTRAINT hydro_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8088 (class 2606 OID 35087)
-- Name: hzrd_cat hzrd_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hzrd_cat
    ADD CONSTRAINT hzrd_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8090 (class 2606 OID 35089)
-- Name: hzrd_class hzrd_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.hzrd_class
    ADD CONSTRAINT hzrd_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8092 (class 2606 OID 35091)
-- Name: ind_type ind_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ind_type
    ADD CONSTRAINT ind_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8094 (class 2606 OID 35093)
-- Name: int_trf_t int_trf_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.int_trf_t
    ADD CONSTRAINT int_trf_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8096 (class 2606 OID 35095)
-- Name: int_trn_t int_trn_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.int_trn_t
    ADD CONSTRAINT int_trn_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8098 (class 2606 OID 35097)
-- Name: investmentsite investmentsite_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.investmentsite
    ADD CONSTRAINT investmentsite_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8104 (class 2606 OID 35099)
-- Name: investmentzone_extension investmentzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.investmentzone_extension
    ADD CONSTRAINT investmentzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8101 (class 2606 OID 35101)
-- Name: investmentzone investmentzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.investmentzone
    ADD CONSTRAINT investmentzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8106 (class 2606 OID 35103)
-- Name: land_type land_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.land_type
    ADD CONSTRAINT land_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8111 (class 2606 OID 35105)
-- Name: landuse_extension landuse_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.landuse_extension
    ADD CONSTRAINT landuse_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8108 (class 2606 OID 35107)
-- Name: landuse landuse_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.landuse
    ADD CONSTRAINT landuse_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8113 (class 2606 OID 35109)
-- Name: main_type main_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.main_type
    ADD CONSTRAINT main_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8118 (class 2606 OID 35111)
-- Name: manufacturing_extension manufacturing_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing_extension
    ADD CONSTRAINT manufacturing_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8115 (class 2606 OID 35113)
-- Name: manufacturing manufacturing_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing
    ADD CONSTRAINT manufacturing_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8123 (class 2606 OID 35115)
-- Name: manufacturing_point_extension manufacturing_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing_point_extension
    ADD CONSTRAINT manufacturing_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8120 (class 2606 OID 35117)
-- Name: manufacturing_point manufacturing_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.manufacturing_point
    ADD CONSTRAINT manufacturing_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8125 (class 2606 OID 35119)
-- Name: mc_type mc_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mc_type
    ADD CONSTRAINT mc_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8127 (class 2606 OID 35121)
-- Name: md_stype md_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.md_stype
    ADD CONSTRAINT md_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8129 (class 2606 OID 35123)
-- Name: min_atype min_atype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_atype
    ADD CONSTRAINT min_atype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8131 (class 2606 OID 35125)
-- Name: min_mtype min_mtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_mtype
    ADD CONSTRAINT min_mtype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8133 (class 2606 OID 35127)
-- Name: min_ntype min_ntype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.min_ntype
    ADD CONSTRAINT min_ntype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8138 (class 2606 OID 35129)
-- Name: mineralarea_extension mineralarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineralarea_extension
    ADD CONSTRAINT mineralarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8135 (class 2606 OID 35131)
-- Name: mineralarea mineralarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineralarea
    ADD CONSTRAINT mineralarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8143 (class 2606 OID 35133)
-- Name: mineraldep_extension mineraldep_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep_extension
    ADD CONSTRAINT mineraldep_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8140 (class 2606 OID 35135)
-- Name: mineraldep mineraldep_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep
    ADD CONSTRAINT mineraldep_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8148 (class 2606 OID 35137)
-- Name: mineraldep_point_extension mineraldep_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep_point_extension
    ADD CONSTRAINT mineraldep_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8145 (class 2606 OID 35139)
-- Name: mineraldep_point mineraldep_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mineraldep_point
    ADD CONSTRAINT mineraldep_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8150 (class 2606 OID 35141)
-- Name: mp_type mp_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mp_type
    ADD CONSTRAINT mp_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8152 (class 2606 OID 35143)
-- Name: msd_type msd_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.msd_type
    ADD CONSTRAINT msd_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8154 (class 2606 OID 35145)
-- Name: mst_type mst_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.mst_type
    ADD CONSTRAINT mst_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8159 (class 2606 OID 35147)
-- Name: naturalriskzone_extension naturalriskzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone_extension
    ADD CONSTRAINT naturalriskzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8156 (class 2606 OID 35149)
-- Name: naturalriskzone naturalriskzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone
    ADD CONSTRAINT naturalriskzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8164 (class 2606 OID 35151)
-- Name: naturalriskzone_point_extension naturalriskzone_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone_point_extension
    ADD CONSTRAINT naturalriskzone_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8161 (class 2606 OID 35153)
-- Name: naturalriskzone_point naturalriskzone_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.naturalriskzone_point
    ADD CONSTRAINT naturalriskzone_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8169 (class 2606 OID 35155)
-- Name: natureprotectarea_extension natureprotectarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea_extension
    ADD CONSTRAINT natureprotectarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8166 (class 2606 OID 35157)
-- Name: natureprotectarea natureprotectarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea
    ADD CONSTRAINT natureprotectarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8174 (class 2606 OID 35159)
-- Name: natureprotectarea_point_extension natureprotectarea_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea_point_extension
    ADD CONSTRAINT natureprotectarea_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8171 (class 2606 OID 35161)
-- Name: natureprotectarea_point natureprotectarea_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectarea_point
    ADD CONSTRAINT natureprotectarea_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8179 (class 2606 OID 35163)
-- Name: natureprotectionzone_extension natureprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectionzone_extension
    ADD CONSTRAINT natureprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8176 (class 2606 OID 35165)
-- Name: natureprotectionzone natureprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.natureprotectionzone
    ADD CONSTRAINT natureprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8181 (class 2606 OID 35167)
-- Name: num_tracks num_tracks_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.num_tracks
    ADD CONSTRAINT num_tracks_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8183 (class 2606 OID 35169)
-- Name: object_extension object_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.object_extension
    ADD CONSTRAINT object_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8185 (class 2606 OID 35171)
-- Name: och_use och_use_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.och_use
    ADD CONSTRAINT och_use_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8190 (class 2606 OID 35173)
-- Name: oilfacility_extension oilfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility_extension
    ADD CONSTRAINT oilfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8187 (class 2606 OID 35175)
-- Name: oilfacility oilfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility
    ADD CONSTRAINT oilfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8195 (class 2606 OID 35177)
-- Name: oilfacility_point_extension oilfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility_point_extension
    ADD CONSTRAINT oilfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8192 (class 2606 OID 35179)
-- Name: oilfacility_point oilfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilfacility_point
    ADD CONSTRAINT oilfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8200 (class 2606 OID 35181)
-- Name: oilpipeline_line_extension oilpipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilpipeline_line_extension
    ADD CONSTRAINT oilpipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8197 (class 2606 OID 35183)
-- Name: oilpipeline_line oilpipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oilpipeline_line
    ADD CONSTRAINT oilpipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8202 (class 2606 OID 35185)
-- Name: oro_stype oro_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oro_stype
    ADD CONSTRAINT oro_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8204 (class 2606 OID 35187)
-- Name: oro_type oro_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.oro_type
    ADD CONSTRAINT oro_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8209 (class 2606 OID 35189)
-- Name: otherobject_extension otherobject_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject_extension
    ADD CONSTRAINT otherobject_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8206 (class 2606 OID 35191)
-- Name: otherobject otherobject_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject
    ADD CONSTRAINT otherobject_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8214 (class 2606 OID 35193)
-- Name: otherobject_point_extension otherobject_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject_point_extension
    ADD CONSTRAINT otherobject_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8211 (class 2606 OID 35195)
-- Name: otherobject_point otherobject_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherobject_point
    ADD CONSTRAINT otherobject_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8219 (class 2606 OID 35197)
-- Name: otherprotectionzone_extension otherprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherprotectionzone_extension
    ADD CONSTRAINT otherprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8216 (class 2606 OID 35199)
-- Name: otherprotectionzone otherprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherprotectionzone
    ADD CONSTRAINT otherprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8224 (class 2606 OID 35201)
-- Name: otherzone_extension otherzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherzone_extension
    ADD CONSTRAINT otherzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8221 (class 2606 OID 35203)
-- Name: otherzone otherzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.otherzone
    ADD CONSTRAINT otherzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8226 (class 2606 OID 35205)
-- Name: ozsn_type ozsn_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ozsn_type
    ADD CONSTRAINT ozsn_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8228 (class 2606 OID 35207)
-- Name: pass_term pass_term_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pass_term
    ADD CONSTRAINT pass_term_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8230 (class 2606 OID 35209)
-- Name: ped_type ped_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ped_type
    ADD CONSTRAINT ped_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8235 (class 2606 OID 35211)
-- Name: pipeline_line_extension pipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pipeline_line_extension
    ADD CONSTRAINT pipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8232 (class 2606 OID 35213)
-- Name: pipeline_line pipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pipeline_line
    ADD CONSTRAINT pipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8237 (class 2606 OID 35215)
-- Name: pkio_type pkio_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pkio_type
    ADD CONSTRAINT pkio_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8239 (class 2606 OID 35217)
-- Name: pl_type pl_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pl_type
    ADD CONSTRAINT pl_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8241 (class 2606 OID 35219)
-- Name: pline_type pline_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pline_type
    ADD CONSTRAINT pline_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8243 (class 2606 OID 35221)
-- Name: power_type power_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.power_type
    ADD CONSTRAINT power_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8245 (class 2606 OID 35223)
-- Name: prg_type prg_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prg_type
    ADD CONSTRAINT prg_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8250 (class 2606 OID 35225)
-- Name: prison_extension prison_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison_extension
    ADD CONSTRAINT prison_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8247 (class 2606 OID 35227)
-- Name: prison prison_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison
    ADD CONSTRAINT prison_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8255 (class 2606 OID 35229)
-- Name: prison_point_extension prison_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison_point_extension
    ADD CONSTRAINT prison_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8252 (class 2606 OID 35231)
-- Name: prison_point prison_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prison_point
    ADD CONSTRAINT prison_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8257 (class 2606 OID 35233)
-- Name: prkng_lvl prkng_lvl_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_lvl
    ADD CONSTRAINT prkng_lvl_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8259 (class 2606 OID 35235)
-- Name: prkng_time prkng_time_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_time
    ADD CONSTRAINT prkng_time_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8261 (class 2606 OID 35237)
-- Name: prkng_type prkng_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prkng_type
    ADD CONSTRAINT prkng_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8263 (class 2606 OID 35239)
-- Name: prom_direct prom_direct_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.prom_direct
    ADD CONSTRAINT prom_direct_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8268 (class 2606 OID 35241)
-- Name: protectionzone_extension protectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.protectionzone_extension
    ADD CONSTRAINT protectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8265 (class 2606 OID 35243)
-- Name: protectionzone protectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.protectionzone
    ADD CONSTRAINT protectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8270 (class 2606 OID 35245)
-- Name: proximity proximity_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.proximity
    ADD CONSTRAINT proximity_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8272 (class 2606 OID 35247)
-- Name: pu_stype pu_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.pu_stype
    ADD CONSTRAINT pu_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8277 (class 2606 OID 35249)
-- Name: public_extension public_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public_extension
    ADD CONSTRAINT public_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8274 (class 2606 OID 35251)
-- Name: public public_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public
    ADD CONSTRAINT public_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8282 (class 2606 OID 35253)
-- Name: public_point_extension public_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public_point_extension
    ADD CONSTRAINT public_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8279 (class 2606 OID 35255)
-- Name: public_point public_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.public_point
    ADD CONSTRAINT public_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8287 (class 2606 OID 35257)
-- Name: publictransportline_line_extension publictransportline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportline_line_extension
    ADD CONSTRAINT publictransportline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8284 (class 2606 OID 35259)
-- Name: publictransportline_line publictransportline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportline_line
    ADD CONSTRAINT publictransportline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8292 (class 2606 OID 35261)
-- Name: publictransportobj_extension publictransportobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj_extension
    ADD CONSTRAINT publictransportobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8289 (class 2606 OID 35263)
-- Name: publictransportobj publictransportobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj
    ADD CONSTRAINT publictransportobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8297 (class 2606 OID 35265)
-- Name: publictransportobj_point_extension publictransportobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj_point_extension
    ADD CONSTRAINT publictransportobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8294 (class 2606 OID 35267)
-- Name: publictransportobj_point publictransportobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportobj_point
    ADD CONSTRAINT publictransportobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8302 (class 2606 OID 35269)
-- Name: publictransportservice_extension publictransportservice_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice_extension
    ADD CONSTRAINT publictransportservice_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8299 (class 2606 OID 35271)
-- Name: publictransportservice publictransportservice_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice
    ADD CONSTRAINT publictransportservice_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8307 (class 2606 OID 35273)
-- Name: publictransportservice_point_extension publictransportservice_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice_point_extension
    ADD CONSTRAINT publictransportservice_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8304 (class 2606 OID 35275)
-- Name: publictransportservice_point publictransportservice_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportservice_point
    ADD CONSTRAINT publictransportservice_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8312 (class 2606 OID 35277)
-- Name: publictransportstops_extension publictransportstops_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops_extension
    ADD CONSTRAINT publictransportstops_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8309 (class 2606 OID 35279)
-- Name: publictransportstops publictransportstops_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops
    ADD CONSTRAINT publictransportstops_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8317 (class 2606 OID 35281)
-- Name: publictransportstops_point_extension publictransportstops_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops_point_extension
    ADD CONSTRAINT publictransportstops_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8314 (class 2606 OID 35283)
-- Name: publictransportstops_point publictransportstops_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.publictransportstops_point
    ADD CONSTRAINT publictransportstops_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8319 (class 2606 OID 35285)
-- Name: r_affinity r_affinity_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.r_affinity
    ADD CONSTRAINT r_affinity_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8321 (class 2606 OID 35287)
-- Name: rad_class rad_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rad_class
    ADD CONSTRAINT rad_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8326 (class 2606 OID 35289)
-- Name: railwayfacility_extension railwayfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility_extension
    ADD CONSTRAINT railwayfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8323 (class 2606 OID 35291)
-- Name: railwayfacility railwayfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility
    ADD CONSTRAINT railwayfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8331 (class 2606 OID 35293)
-- Name: railwayfacility_point_extension railwayfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility_point_extension
    ADD CONSTRAINT railwayfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8328 (class 2606 OID 35295)
-- Name: railwayfacility_point railwayfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayfacility_point
    ADD CONSTRAINT railwayfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8336 (class 2606 OID 35297)
-- Name: railwayline_line_extension railwayline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayline_line_extension
    ADD CONSTRAINT railwayline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8333 (class 2606 OID 35299)
-- Name: railwayline_line railwayline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.railwayline_line
    ADD CONSTRAINT railwayline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8338 (class 2606 OID 35301)
-- Name: rdwin_cat rdwin_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rdwin_cat
    ADD CONSTRAINT rdwin_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8340 (class 2606 OID 35303)
-- Name: rdwin_type rdwin_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rdwin_type
    ADD CONSTRAINT rdwin_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8345 (class 2606 OID 35305)
-- Name: recreation_extension recreation_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation_extension
    ADD CONSTRAINT recreation_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8342 (class 2606 OID 35307)
-- Name: recreation recreation_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation
    ADD CONSTRAINT recreation_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8350 (class 2606 OID 35309)
-- Name: recreation_point_extension recreation_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation_point_extension
    ADD CONSTRAINT recreation_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8347 (class 2606 OID 35311)
-- Name: recreation_point recreation_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recreation_point
    ADD CONSTRAINT recreation_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8352 (class 2606 OID 35313)
-- Name: recyc_type recyc_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.recyc_type
    ADD CONSTRAINT recyc_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8354 (class 2606 OID 35315)
-- Name: reg_rdtype reg_rdtype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.reg_rdtype
    ADD CONSTRAINT reg_rdtype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8356 (class 2606 OID 35317)
-- Name: reg_status reg_status_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.reg_status
    ADD CONSTRAINT reg_status_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8358 (class 2606 OID 35319)
-- Name: res_stype res_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.res_stype
    ADD CONSTRAINT res_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8363 (class 2606 OID 35321)
-- Name: resort_extension resort_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort_extension
    ADD CONSTRAINT resort_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8360 (class 2606 OID 35323)
-- Name: resort resort_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort
    ADD CONSTRAINT resort_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8368 (class 2606 OID 35325)
-- Name: resort_point_extension resort_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort_point_extension
    ADD CONSTRAINT resort_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8365 (class 2606 OID 35327)
-- Name: resort_point resort_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resort_point
    ADD CONSTRAINT resort_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8373 (class 2606 OID 35329)
-- Name: resortarea_extension resortarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea_extension
    ADD CONSTRAINT resortarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8370 (class 2606 OID 35331)
-- Name: resortarea resortarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea
    ADD CONSTRAINT resortarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8378 (class 2606 OID 35333)
-- Name: resortarea_point_extension resortarea_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea_point_extension
    ADD CONSTRAINT resortarea_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8375 (class 2606 OID 35335)
-- Name: resortarea_point resortarea_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortarea_point
    ADD CONSTRAINT resortarea_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8383 (class 2606 OID 35337)
-- Name: resortprotectionzone_extension resortprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortprotectionzone_extension
    ADD CONSTRAINT resortprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8380 (class 2606 OID 35339)
-- Name: resortprotectionzone resortprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.resortprotectionzone
    ADD CONSTRAINT resortprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8385 (class 2606 OID 35341)
-- Name: rfo_type rfo_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rfo_type
    ADD CONSTRAINT rfo_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8387 (class 2606 OID 35343)
-- Name: risk_cat risk_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.risk_cat
    ADD CONSTRAINT risk_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8392 (class 2606 OID 35345)
-- Name: road_line_extension road_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.road_line_extension
    ADD CONSTRAINT road_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8389 (class 2606 OID 35347)
-- Name: road_line road_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.road_line
    ADD CONSTRAINT road_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8394 (class 2606 OID 35349)
-- Name: rs_stype rs_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rs_stype
    ADD CONSTRAINT rs_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8396 (class 2606 OID 35351)
-- Name: rst_class rst_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rst_class
    ADD CONSTRAINT rst_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8398 (class 2606 OID 35353)
-- Name: rst_type rst_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rst_type
    ADD CONSTRAINT rst_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8400 (class 2606 OID 35355)
-- Name: rwy_class rwy_class_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.rwy_class
    ADD CONSTRAINT rwy_class_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8402 (class 2606 OID 35357)
-- Name: s_alert s_alert_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.s_alert
    ADD CONSTRAINT s_alert_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8404 (class 2606 OID 35359)
-- Name: saf_stype saf_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.saf_stype
    ADD CONSTRAINT saf_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8409 (class 2606 OID 35361)
-- Name: sanitaryprotectionzone_extension sanitaryprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sanitaryprotectionzone_extension
    ADD CONSTRAINT sanitaryprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8406 (class 2606 OID 35363)
-- Name: sanitaryprotectionzone sanitaryprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sanitaryprotectionzone
    ADD CONSTRAINT sanitaryprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8411 (class 2606 OID 35365)
-- Name: sci_type sci_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sci_type
    ADD CONSTRAINT sci_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8413 (class 2606 OID 35367)
-- Name: season season_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.season
    ADD CONSTRAINT season_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8415 (class 2606 OID 35369)
-- Name: serv_stype serv_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.serv_stype
    ADD CONSTRAINT serv_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8420 (class 2606 OID 35371)
-- Name: servicefacility_extension servicefacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility_extension
    ADD CONSTRAINT servicefacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8417 (class 2606 OID 35373)
-- Name: servicefacility servicefacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility
    ADD CONSTRAINT servicefacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8425 (class 2606 OID 35375)
-- Name: servicefacility_point_extension servicefacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility_point_extension
    ADD CONSTRAINT servicefacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8422 (class 2606 OID 35377)
-- Name: servicefacility_point servicefacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.servicefacility_point
    ADD CONSTRAINT servicefacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8427 (class 2606 OID 35379)
-- Name: settl_cat settl_cat_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_cat
    ADD CONSTRAINT settl_cat_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8429 (class 2606 OID 35381)
-- Name: settl_level settl_level_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_level
    ADD CONSTRAINT settl_level_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8431 (class 2606 OID 35383)
-- Name: settl_type settl_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.settl_type
    ADD CONSTRAINT settl_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8436 (class 2606 OID 35385)
-- Name: sewerfacility_extension sewerfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility_extension
    ADD CONSTRAINT sewerfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8433 (class 2606 OID 35387)
-- Name: sewerfacility sewerfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility
    ADD CONSTRAINT sewerfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8441 (class 2606 OID 35389)
-- Name: sewerfacility_point_extension sewerfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility_point_extension
    ADD CONSTRAINT sewerfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8438 (class 2606 OID 35391)
-- Name: sewerfacility_point sewerfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerfacility_point
    ADD CONSTRAINT sewerfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8446 (class 2606 OID 35393)
-- Name: sewerpipeline_line_extension sewerpipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerpipeline_line_extension
    ADD CONSTRAINT sewerpipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8443 (class 2606 OID 35395)
-- Name: sewerpipeline_line sewerpipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sewerpipeline_line
    ADD CONSTRAINT sewerpipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8448 (class 2606 OID 35397)
-- Name: snow_type snow_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.snow_type
    ADD CONSTRAINT snow_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8450 (class 2606 OID 35399)
-- Name: soc_direct soc_direct_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.soc_direct
    ADD CONSTRAINT soc_direct_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8455 (class 2606 OID 35401)
-- Name: social_extension social_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social_extension
    ADD CONSTRAINT social_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8453 (class 2606 OID 35403)
-- Name: social social_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social
    ADD CONSTRAINT social_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8460 (class 2606 OID 35405)
-- Name: social_point_extension social_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social_point_extension
    ADD CONSTRAINT social_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8458 (class 2606 OID 35407)
-- Name: social_point social_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.social_point
    ADD CONSTRAINT social_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8462 (class 2606 OID 35409)
-- Name: sp_stype sp_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sp_stype
    ADD CONSTRAINT sp_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8467 (class 2606 OID 35411)
-- Name: specialeconomicarea_extension specialeconomicarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.specialeconomicarea_extension
    ADD CONSTRAINT specialeconomicarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8465 (class 2606 OID 35413)
-- Name: specialeconomicarea specialeconomicarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.specialeconomicarea
    ADD CONSTRAINT specialeconomicarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8469 (class 2606 OID 35415)
-- Name: specific specific_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.specific
    ADD CONSTRAINT specific_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8474 (class 2606 OID 35417)
-- Name: sport_extension sport_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport_extension
    ADD CONSTRAINT sport_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8472 (class 2606 OID 35419)
-- Name: sport sport_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport
    ADD CONSTRAINT sport_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8479 (class 2606 OID 35421)
-- Name: sport_point_extension sport_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport_point_extension
    ADD CONSTRAINT sport_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8477 (class 2606 OID 35423)
-- Name: sport_point sport_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.sport_point
    ADD CONSTRAINT sport_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8481 (class 2606 OID 35425)
-- Name: spz_event spz_event_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.spz_event
    ADD CONSTRAINT spz_event_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8483 (class 2606 OID 35427)
-- Name: ssah_stype ssah_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.ssah_stype
    ADD CONSTRAINT ssah_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8485 (class 2606 OID 35429)
-- Name: st_stype st_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.st_stype
    ADD CONSTRAINT st_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8489 (class 2606 OID 35431)
-- Name: status_adm status_adm_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_adm
    ADD CONSTRAINT status_adm_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8491 (class 2606 OID 35433)
-- Name: status_och status_och_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_och
    ADD CONSTRAINT status_och_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8487 (class 2606 OID 35435)
-- Name: status status_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8493 (class 2606 OID 35437)
-- Name: status_pr status_pr_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.status_pr
    ADD CONSTRAINT status_pr_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8495 (class 2606 OID 35439)
-- Name: stop_type stop_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.stop_type
    ADD CONSTRAINT stop_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8497 (class 2606 OID 35441)
-- Name: store_type store_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.store_type
    ADD CONSTRAINT store_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8499 (class 2606 OID 35443)
-- Name: str_l_type str_l_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_l_type
    ADD CONSTRAINT str_l_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8501 (class 2606 OID 35445)
-- Name: str_r_type str_r_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_r_type
    ADD CONSTRAINT str_r_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8503 (class 2606 OID 35447)
-- Name: str_type str_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.str_type
    ADD CONSTRAINT str_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8505 (class 2606 OID 35449)
-- Name: street_line_extension street_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.street_line_extension
    ADD CONSTRAINT street_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8507 (class 2606 OID 35451)
-- Name: streetv_line_extension streetv_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.streetv_line_extension
    ADD CONSTRAINT streetv_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8509 (class 2606 OID 35453)
-- Name: su_type su_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.su_type
    ADD CONSTRAINT su_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8511 (class 2606 OID 35455)
-- Name: suburban_tr suburban_tr_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.suburban_tr
    ADD CONSTRAINT suburban_tr_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8513 (class 2606 OID 35457)
-- Name: surface_type surface_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.surface_type
    ADD CONSTRAINT surface_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8515 (class 2606 OID 35459)
-- Name: szz_type szz_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.szz_type
    ADD CONSTRAINT szz_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8520 (class 2606 OID 35461)
-- Name: technoriskarea_extension technoriskarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea_extension
    ADD CONSTRAINT technoriskarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8518 (class 2606 OID 35463)
-- Name: technoriskarea technoriskarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea
    ADD CONSTRAINT technoriskarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8525 (class 2606 OID 35465)
-- Name: technoriskarea_point_extension technoriskarea_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea_point_extension
    ADD CONSTRAINT technoriskarea_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8523 (class 2606 OID 35467)
-- Name: technoriskarea_point technoriskarea_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.technoriskarea_point
    ADD CONSTRAINT technoriskarea_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8530 (class 2606 OID 35469)
-- Name: telecomfacility_extension telecomfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility_extension
    ADD CONSTRAINT telecomfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8528 (class 2606 OID 35471)
-- Name: telecomfacility telecomfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility
    ADD CONSTRAINT telecomfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8535 (class 2606 OID 35473)
-- Name: telecomfacility_point_extension telecomfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility_point_extension
    ADD CONSTRAINT telecomfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8533 (class 2606 OID 35475)
-- Name: telecomfacility_point telecomfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomfacility_point
    ADD CONSTRAINT telecomfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8537 (class 2606 OID 35477)
-- Name: telecomnetworkline_line_extension telecomnetworkline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.telecomnetworkline_line_extension
    ADD CONSTRAINT telecomnetworkline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8542 (class 2606 OID 35479)
-- Name: thermalfacility_extension thermalfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility_extension
    ADD CONSTRAINT thermalfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8540 (class 2606 OID 35481)
-- Name: thermalfacility thermalfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility
    ADD CONSTRAINT thermalfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8547 (class 2606 OID 35483)
-- Name: thermalfacility_point_extension thermalfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility_point_extension
    ADD CONSTRAINT thermalfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8545 (class 2606 OID 35485)
-- Name: thermalfacility_point thermalfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalfacility_point
    ADD CONSTRAINT thermalfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8552 (class 2606 OID 35487)
-- Name: thermalpipeline_line_extension thermalpipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalpipeline_line_extension
    ADD CONSTRAINT thermalpipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8550 (class 2606 OID 35489)
-- Name: thermalpipeline_line thermalpipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.thermalpipeline_line
    ADD CONSTRAINT thermalpipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8554 (class 2606 OID 35491)
-- Name: time_ltype time_ltype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.time_ltype
    ADD CONSTRAINT time_ltype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8556 (class 2606 OID 35493)
-- Name: tm_source tm_source_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tm_source
    ADD CONSTRAINT tm_source_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8558 (class 2606 OID 35495)
-- Name: tpark_type tpark_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tpark_type
    ADD CONSTRAINT tpark_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8560 (class 2606 OID 35497)
-- Name: track_type track_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.track_type
    ADD CONSTRAINT track_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8565 (class 2606 OID 35499)
-- Name: traditionalarea_extension traditionalarea_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.traditionalarea_extension
    ADD CONSTRAINT traditionalarea_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8563 (class 2606 OID 35501)
-- Name: traditionalarea traditionalarea_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.traditionalarea
    ADD CONSTRAINT traditionalarea_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8570 (class 2606 OID 35503)
-- Name: transplogisticobj_extension transplogisticobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj_extension
    ADD CONSTRAINT transplogisticobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8568 (class 2606 OID 35505)
-- Name: transplogisticobj transplogisticobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj
    ADD CONSTRAINT transplogisticobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8575 (class 2606 OID 35507)
-- Name: transplogisticobj_point_extension transplogisticobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj_point_extension
    ADD CONSTRAINT transplogisticobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8573 (class 2606 OID 35509)
-- Name: transplogisticobj_point transplogisticobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transplogisticobj_point
    ADD CONSTRAINT transplogisticobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8580 (class 2606 OID 35511)
-- Name: transportobj_extension transportobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_extension
    ADD CONSTRAINT transportobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8585 (class 2606 OID 35513)
-- Name: transportobj_line_extension transportobj_line_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_line_extension
    ADD CONSTRAINT transportobj_line_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8583 (class 2606 OID 35515)
-- Name: transportobj_line transportobj_line_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_line
    ADD CONSTRAINT transportobj_line_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8578 (class 2606 OID 35517)
-- Name: transportobj transportobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj
    ADD CONSTRAINT transportobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8590 (class 2606 OID 35519)
-- Name: transportobj_point_extension transportobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_point_extension
    ADD CONSTRAINT transportobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8588 (class 2606 OID 35521)
-- Name: transportobj_point transportobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transportobj_point
    ADD CONSTRAINT transportobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8595 (class 2606 OID 35523)
-- Name: transpprotectionzone_extension transpprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpprotectionzone_extension
    ADD CONSTRAINT transpprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8593 (class 2606 OID 35525)
-- Name: transpprotectionzone transpprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpprotectionzone
    ADD CONSTRAINT transpprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8600 (class 2606 OID 35527)
-- Name: transpsanitarygapzone_extension transpsanitarygapzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpsanitarygapzone_extension
    ADD CONSTRAINT transpsanitarygapzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8598 (class 2606 OID 35529)
-- Name: transpsanitarygapzone transpsanitarygapzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.transpsanitarygapzone
    ADD CONSTRAINT transpsanitarygapzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8602 (class 2606 OID 35531)
-- Name: trd_stype trd_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.trd_stype
    ADD CONSTRAINT trd_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8604 (class 2606 OID 35533)
-- Name: tunnel_t tunnel_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.tunnel_t
    ADD CONSTRAINT tunnel_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8606 (class 2606 OID 35535)
-- Name: type_law type_law_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.type_law
    ADD CONSTRAINT type_law_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8608 (class 2606 OID 35537)
-- Name: type_subj type_subj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.type_subj
    ADD CONSTRAINT type_subj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8610 (class 2606 OID 35539)
-- Name: uderfl_t uderfl_t_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.uderfl_t
    ADD CONSTRAINT uderfl_t_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8612 (class 2606 OID 35541)
-- Name: usa_stype usa_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.usa_stype
    ADD CONSTRAINT usa_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8614 (class 2606 OID 35543)
-- Name: using_type using_type_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.using_type
    ADD CONSTRAINT using_type_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8616 (class 2606 OID 35545)
-- Name: voltage voltage_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.voltage
    ADD CONSTRAINT voltage_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8618 (class 2606 OID 35547)
-- Name: w_source w_source_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.w_source
    ADD CONSTRAINT w_source_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8623 (class 2606 OID 35549)
-- Name: wastefacility_extension wastefacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility_extension
    ADD CONSTRAINT wastefacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8621 (class 2606 OID 35551)
-- Name: wastefacility wastefacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility
    ADD CONSTRAINT wastefacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8628 (class 2606 OID 35553)
-- Name: wastefacility_point_extension wastefacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility_point_extension
    ADD CONSTRAINT wastefacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8626 (class 2606 OID 35555)
-- Name: wastefacility_point wastefacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wastefacility_point
    ADD CONSTRAINT wastefacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8630 (class 2606 OID 35557)
-- Name: water_stype water_stype_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.water_stype
    ADD CONSTRAINT water_stype_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8635 (class 2606 OID 35559)
-- Name: waterfacility_extension waterfacility_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility_extension
    ADD CONSTRAINT waterfacility_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8633 (class 2606 OID 35561)
-- Name: waterfacility waterfacility_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility
    ADD CONSTRAINT waterfacility_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8640 (class 2606 OID 35563)
-- Name: waterfacility_point_extension waterfacility_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility_point_extension
    ADD CONSTRAINT waterfacility_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8638 (class 2606 OID 35565)
-- Name: waterfacility_point waterfacility_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterfacility_point
    ADD CONSTRAINT waterfacility_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8645 (class 2606 OID 35567)
-- Name: waterpipeline_line_extension waterpipeline_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterpipeline_line_extension
    ADD CONSTRAINT waterpipeline_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8643 (class 2606 OID 35569)
-- Name: waterpipeline_line waterpipeline_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterpipeline_line
    ADD CONSTRAINT waterpipeline_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8650 (class 2606 OID 35571)
-- Name: waterprotectionzone_extension waterprotectionzone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterprotectionzone_extension
    ADD CONSTRAINT waterprotectionzone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8648 (class 2606 OID 35573)
-- Name: waterprotectionzone waterprotectionzone_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterprotectionzone
    ADD CONSTRAINT waterprotectionzone_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8655 (class 2606 OID 35575)
-- Name: watertransportobj_extension watertransportobj_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj_extension
    ADD CONSTRAINT watertransportobj_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8653 (class 2606 OID 35577)
-- Name: watertransportobj watertransportobj_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj
    ADD CONSTRAINT watertransportobj_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8660 (class 2606 OID 35579)
-- Name: watertransportobj_point_extension watertransportobj_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj_point_extension
    ADD CONSTRAINT watertransportobj_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8658 (class 2606 OID 35581)
-- Name: watertransportobj_point watertransportobj_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.watertransportobj_point
    ADD CONSTRAINT watertransportobj_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8665 (class 2606 OID 35583)
-- Name: waterways_line_extension waterways_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterways_line_extension
    ADD CONSTRAINT waterways_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8663 (class 2606 OID 35585)
-- Name: waterways_line waterways_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.waterways_line
    ADD CONSTRAINT waterways_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8670 (class 2606 OID 35587)
-- Name: wildlifeprotection_extension wildlifeprotection_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection_extension
    ADD CONSTRAINT wildlifeprotection_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8668 (class 2606 OID 35589)
-- Name: wildlifeprotection wildlifeprotection_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection
    ADD CONSTRAINT wildlifeprotection_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8675 (class 2606 OID 35591)
-- Name: wildlifeprotection_point_extension wildlifeprotection_point_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection_point_extension
    ADD CONSTRAINT wildlifeprotection_point_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8673 (class 2606 OID 35593)
-- Name: wildlifeprotection_point wildlifeprotection_point_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.wildlifeprotection_point
    ADD CONSTRAINT wildlifeprotection_point_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8677 (class 2606 OID 35595)
-- Name: yatch_cls yatch_cls_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.yatch_cls
    ADD CONSTRAINT yatch_cls_pkey PRIMARY KEY (objectid);


--
-- TOC entry 8679 (class 2606 OID 35597)
-- Name: zone_extension zone_extension_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.zone_extension
    ADD CONSTRAINT zone_extension_pkey PRIMARY KEY (object_id);


--
-- TOC entry 8681 (class 2606 OID 35599)
-- Name: zone_oopt zone_oopt_pkey; Type: CONSTRAINT; Schema: fiz; Owner: fiz
--

ALTER TABLE ONLY fiz.zone_oopt
    ADD CONSTRAINT zone_oopt_pkey PRIMARY KEY (objectid);


--
--
CREATE INDEX sidx_18198_22 ON fiz.functionalzone USING gist (shape);
CREATE INDEX spatial_street_line_geom ON fiz.street_line USING gist (shape);
CREATE INDEX sidx_19489_8 ON fiz.admesrf USING gist (shape);
CREATE INDEX sidx_19506_11 ON fiz.admenp USING gist (shape);
CREATE INDEX sidx_19523_7 ON fiz.admerf USING gist (shape);
CREATE INDEX sidx_19540_9 ON fiz.admemo USING gist (shape);
CREATE INDEX sidx_19557_6 ON fiz.admborder_line USING gist (shape);
CREATE INDEX sidx_19576_18 ON fiz.specialeconomicarea USING gist (shape);
CREATE INDEX sidx_19763_18 ON fiz.waterpipeline_line USING gist (shape);
CREATE INDEX sidx_19915_17 ON fiz.sewerpipeline_line USING gist (shape);
CREATE INDEX sidx_19932_21 ON fiz.electricline_line USING gist (shape);
CREATE INDEX sidx_19949_23 ON fiz.electricpowerstation USING gist (shape);
CREATE INDEX sidx_19966_23 ON fiz.electricpowerstation_point USING gist (shape);
CREATE INDEX sidx_19983_25 ON fiz.electrictransformer USING gist (shape);
CREATE INDEX sidx_20000_25 ON fiz.electrictransformer_point USING gist (shape);
CREATE INDEX sidx_20017_15 ON fiz.engprotectionobj_line USING gist (shape);
CREATE INDEX sidx_20034_15 ON fiz.engprotectionobj_point USING gist (shape);
CREATE INDEX sidx_20051_21 ON fiz.gasfacility USING gist (shape);
CREATE INDEX sidx_20068_21 ON fiz.gasfacility_point USING gist (shape);
CREATE INDEX sidx_20085_21 ON fiz.gaspipeline_line USING gist (shape);
CREATE INDEX sidx_20102_19 ON fiz.hydraulicstructures_line USING gist (shape);
CREATE INDEX sidx_20119_19 ON fiz.hydraulicstructures_point USING gist (shape);
CREATE INDEX sidx_20136_22 ON fiz.oilfacility USING gist (shape);
CREATE INDEX sidx_20153_22 ON fiz.oilfacility_point USING gist (shape);
CREATE INDEX sidx_20170_20 ON fiz.oilpipeline_line USING gist (shape);
CREATE INDEX sidx_20187_21 ON fiz.pipeline_line USING gist (shape);
CREATE INDEX sidx_20204_21 ON fiz.sewerfacility USING gist (shape);
CREATE INDEX sidx_20221_21 ON fiz.sewerfacility_point USING gist (shape);
CREATE INDEX sidx_20288_21 ON fiz.telecomfacility USING gist (shape);
CREATE INDEX sidx_20305_21 ON fiz.telecomfacility_point USING gist (shape);
CREATE INDEX sidx_20338_23 ON fiz.thermalfacility USING gist (shape);
CREATE INDEX sidx_20357_23 ON fiz.thermalfacility_point USING gist (shape);
CREATE INDEX sidx_20374_20 ON fiz.thermalpipeline_line USING gist (shape);
CREATE INDEX sidx_20391_23 ON fiz.waterfacility USING gist (shape);
CREATE INDEX sidx_20408_23 ON fiz.waterfacility_point USING gist (shape);
CREATE INDEX sidx_20425_12 ON fiz.forestpark USING gist (shape);
CREATE INDEX sidx_20442_13 ON fiz.greeneryplanting USING gist (shape);
CREATE INDEX sidx_20459_12 ON fiz.envdanger_point USING gist (shape);
CREATE INDEX sidx_20476_12 ON fiz.envdanger USING gist (shape);


--
-- TOC entry 8057 (class 1259 OID 35638)
-- Name: sidx_20493_8; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20493_8 ON fiz.historicsettlement USING gist (shape);


--
-- TOC entry 8038 (class 1259 OID 35639)
-- Name: sidx_20510_17; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20510_17 ON fiz.heritage_point USING gist (shape);


--
-- TOC entry 8043 (class 1259 OID 35640)
-- Name: sidx_20527_15; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20527_15 ON fiz.heritagearea USING gist (shape);


--
-- TOC entry 8423 (class 1259 OID 35641)
-- Name: sidx_20544_24; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20544_24 ON fiz.servicefacility_point USING gist (shape);


--
-- TOC entry 7679 (class 1259 OID 35642)
-- Name: sidx_20561_25; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20561_25 ON fiz.agriculture USING gist (shape);


--
-- TOC entry 7684 (class 1259 OID 35643)
-- Name: sidx_20578_25; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20578_25 ON fiz.agriculture_point USING gist (shape);


--
-- TOC entry 8116 (class 1259 OID 35644)
-- Name: sidx_20595_22; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20595_22 ON fiz.manufacturing USING gist (shape);


--
-- TOC entry 8121 (class 1259 OID 35645)
-- Name: sidx_20612_22; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20612_22 ON fiz.manufacturing_point USING gist (shape);


--
-- TOC entry 8418 (class 1259 OID 35646)
-- Name: sidx_20629_24; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20629_24 ON fiz.servicefacility USING gist (shape);


--
-- TOC entry 8619 (class 1259 OID 35647)
-- Name: sidx_20647_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20647_23 ON fiz.wastefacility USING gist (shape);


--
-- TOC entry 8624 (class 1259 OID 35648)
-- Name: sidx_20665_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20665_23 ON fiz.wastefacility_point USING gist (shape);


--
-- TOC entry 8102 (class 1259 OID 35649)
-- Name: sidx_20682_15; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20682_15 ON fiz.investmentzone USING gist (shape);


--
-- TOC entry 8099 (class 1259 OID 35650)
-- Name: sidx_20699_30; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20699_30 ON fiz.investmentsite USING gist (shape);


--
-- TOC entry 7707 (class 1259 OID 35651)
-- Name: sidx_20716_13; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20716_13 ON fiz.areabasedevelopment USING gist (shape);


--
-- TOC entry 8109 (class 1259 OID 35652)
-- Name: sidx_20733_5; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20733_5 ON fiz.landuse USING gist (shape);


--
-- TOC entry 8141 (class 1259 OID 35653)
-- Name: sidx_20750_13; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20750_13 ON fiz.mineraldep USING gist (shape);


--
-- TOC entry 8146 (class 1259 OID 35654)
-- Name: sidx_20767_13; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20767_13 ON fiz.mineraldep_point USING gist (shape);


--
-- TOC entry 8136 (class 1259 OID 35655)
-- Name: sidx_20784_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20784_14 ON fiz.mineralarea USING gist (shape);


--
-- TOC entry 8084 (class 1259 OID 35656)
-- Name: sidx_20801_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20801_14 ON fiz.hydro_point USING gist (shape);


--
-- TOC entry 8074 (class 1259 OID 35657)
-- Name: sidx_20818_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20818_14 ON fiz.hydro USING gist (shape);


--
-- TOC entry 8079 (class 1259 OID 35658)
-- Name: sidx_20835_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20835_14 ON fiz.hydro_line USING gist (shape);


--
-- TOC entry 7948 (class 1259 OID 35659)
-- Name: sidx_20852_13; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20852_13 ON fiz.forest USING gist (shape);


--
-- TOC entry 8348 (class 1259 OID 35660)
-- Name: sidx_20869_25; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20869_25 ON fiz.recreation_point USING gist (shape);


--
-- TOC entry 7712 (class 1259 OID 35661)
-- Name: sidx_20886_24; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20886_24 ON fiz.authorityservice USING gist (shape);


--
-- TOC entry 7717 (class 1259 OID 35662)
-- Name: sidx_20903_24; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20903_24 ON fiz.authorityservice_point USING gist (shape);


--
-- TOC entry 7795 (class 1259 OID 35663)
-- Name: sidx_20920_22; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20920_22 ON fiz.culture USING gist (shape);


--
-- TOC entry 7800 (class 1259 OID 35664)
-- Name: sidx_20937_22; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20937_22 ON fiz.culture_point USING gist (shape);


--
-- TOC entry 7832 (class 1259 OID 35665)
-- Name: sidx_20954_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20954_23 ON fiz.education USING gist (shape);


--
-- TOC entry 7837 (class 1259 OID 35666)
-- Name: sidx_20971_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20971_23 ON fiz.education_point USING gist (shape);


--
-- TOC entry 8026 (class 1259 OID 35667)
-- Name: sidx_20988_26; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_20988_26 ON fiz.health USING gist (shape);


--
-- TOC entry 8031 (class 1259 OID 35668)
-- Name: sidx_21005_26; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21005_26 ON fiz.health_point USING gist (shape);


--
-- TOC entry 8275 (class 1259 OID 35669)
-- Name: sidx_21022_21; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21022_21 ON fiz.public USING gist (shape);


--
-- TOC entry 8280 (class 1259 OID 35670)
-- Name: sidx_21039_21; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21039_21 ON fiz.public_point USING gist (shape);


--
-- TOC entry 8343 (class 1259 OID 35671)
-- Name: sidx_21056_25; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21056_25 ON fiz.recreation USING gist (shape);


--
-- TOC entry 8361 (class 1259 OID 35672)
-- Name: sidx_21073_19; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21073_19 ON fiz.resort USING gist (shape);


--
-- TOC entry 8366 (class 1259 OID 35673)
-- Name: sidx_21090_19; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21090_19 ON fiz.resort_point USING gist (shape);


--
-- TOC entry 8451 (class 1259 OID 35674)
-- Name: sidx_21107_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21107_23 ON fiz.social USING gist (shape);


--
-- TOC entry 8456 (class 1259 OID 35675)
-- Name: sidx_21124_23; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21124_23 ON fiz.social_point USING gist (shape);

--
-- TOC entry 8470 (class 1259 OID 35676)
-- Name: sidx_21141_20; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21141_20 ON fiz.sport USING gist (shape);


--
-- TOC entry 8475 (class 1259 OID 35677)
-- Name: sidx_21158_20; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21158_20 ON fiz.sport_point USING gist (shape);


--
-- TOC entry 8167 (class 1259 OID 35678)
-- Name: sidx_21175_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21175_14 ON fiz.natureprotectarea USING gist (shape);


--
-- TOC entry 8172 (class 1259 OID 35679)
-- Name: sidx_21192_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21192_14 ON fiz.natureprotectarea_point USING gist (shape);


--
-- TOC entry 8521 (class 1259 OID 35680)
-- Name: sidx_21209_10; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21209_10 ON fiz.technoriskarea_point USING gist (shape);


--
-- TOC entry 8157 (class 1259 OID 35681)
-- Name: sidx_21226_9; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21226_9 ON fiz.naturalriskzone USING gist (shape);


--
-- TOC entry 8162 (class 1259 OID 35682)
-- Name: sidx_21243_9; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21243_9 ON fiz.naturalriskzone_point USING gist (shape);


--
-- TOC entry 8516 (class 1259 OID 35683)
-- Name: sidx_21260_10; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21260_10 ON fiz.technoriskarea USING gist (shape);


--
-- TOC entry 8021 (class 1259 OID 35684)
-- Name: sidx_21277_5; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21277_5 ON fiz.hazardarea USING gist (shape);


--
-- TOC entry 8376 (class 1259 OID 35685)
-- Name: sidx_21296_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21296_14 ON fiz.resortarea_point USING gist (shape);


--
-- TOC entry 8561 (class 1259 OID 35686)
-- Name: sidx_21313_11; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21313_11 ON fiz.traditionalarea USING gist (shape);


--
-- TOC entry 8371 (class 1259 OID 35687)
-- Name: sidx_21330_14; Type: INDEX; Schema: fiz; Owner: fiz
--

CREATE INDEX sidx_21330_14 ON fiz.resortarea USING gist (shape);
CREATE INDEX sidx_21347_9 ON fiz.transpprotectionzone USING gist (shape);
CREATE INDEX sidx_21364_9 ON fiz.transpsanitarygapzone USING gist (shape);
CREATE INDEX sidx_21381_8 ON fiz.waterprotectionzone USING gist (shape);
CREATE INDEX sidx_21398_8 ON fiz.foreshore USING gist (shape);
CREATE INDEX sidx_21415_9 ON fiz.heritageprotectionzone USING gist (shape);
CREATE INDEX sidx_21432_10 ON fiz.natureprotectionzone USING gist (shape);
CREATE INDEX sidx_21449_9 ON fiz.otherprotectionzone USING gist (shape);
CREATE INDEX sidx_21466_10 ON fiz.otherzone USING gist (shape);
CREATE INDEX sidx_21483_9 ON fiz.protectionzone USING gist (shape);
CREATE INDEX sidx_21500_9 ON fiz.resortprotectionzone USING gist (shape);
CREATE INDEX sidx_21517_12 ON fiz.sanitaryprotectionzone USING gist (shape);
CREATE INDEX sidx_21534_8 ON fiz.coastalprotectionzone USING gist (shape);
CREATE INDEX sidx_21551_9 ON fiz.drinkwaterprotectionzone USING gist (shape);
CREATE INDEX sidx_21568_9 ON fiz.engprotectionzone USING gist (shape);
CREATE INDEX sidx_21585_9 ON fiz.engsanitarygapzone USING gist (shape);
CREATE INDEX sidx_21602_9 ON fiz.fishprotectionzone USING gist (shape);
CREATE INDEX sidx_21619_10 ON fiz.floodarea USING gist (shape);
CREATE INDEX sidx_21788_16 ON fiz.wildlifeprotection USING gist (shape);
CREATE INDEX sidx_21805_16 ON fiz.wildlifeprotection_point USING gist (shape);
CREATE INDEX sidx_21822_21 ON fiz.emergencyprotectionobj USING gist (shape);
CREATE INDEX sidx_21839_21 ON fiz.emergencyprotectionobj_point USING gist (shape);
CREATE INDEX sidx_21856_16 ON fiz.envmonitoring USING gist (shape);
CREATE INDEX sidx_21873_16 ON fiz.envmonitoring_point USING gist (shape);
CREATE INDEX sidx_21890_20 ON fiz.otherobject USING gist (shape);
CREATE INDEX sidx_21907_20 ON fiz.otherobject_point USING gist (shape);
CREATE INDEX sidx_21924_15 ON fiz.prison USING gist (shape);
CREATE INDEX sidx_21941_15 ON fiz.prison_point USING gist (shape);
CREATE INDEX sidx_21958_19 ON fiz.cemetery USING gist (shape);
CREATE INDEX sidx_21975_19 ON fiz.cemetery_point USING gist (shape);
CREATE INDEX sidx_22147_17 ON fiz.publictransportstops_point USING gist (shape);
CREATE INDEX sidx_22164_21 ON fiz.airtransportobj USING gist (shape);
CREATE INDEX sidx_22181_21 ON fiz.airtransportobj_point USING gist (shape);
CREATE INDEX sidx_22198_22 ON fiz.autoservice USING gist (shape);
CREATE INDEX sidx_22215_22 ON fiz.autoservice_point USING gist (shape);
CREATE INDEX sidx_22232_18 ON fiz.customcontrol USING gist (shape);
CREATE INDEX sidx_22249_18 ON fiz.customcontrol_point USING gist (shape);
CREATE INDEX sidx_22266_14 ON fiz.publictransportline_line USING gist (shape);
CREATE INDEX sidx_22283_15 ON fiz.publictransportobj USING gist (shape);
CREATE INDEX sidx_22300_15 ON fiz.publictransportobj_point USING gist (shape);
CREATE INDEX sidx_22317_16 ON fiz.publictransportservice USING gist (shape);
CREATE INDEX sidx_22334_16 ON fiz.publictransportservice_point USING gist (shape);
CREATE INDEX sidx_22351_17 ON fiz.publictransportstops USING gist (shape);
CREATE INDEX sidx_22452_25 ON fiz.railwayfacility USING gist (shape);
CREATE INDEX sidx_22469_25 ON fiz.railwayfacility_point USING gist (shape);
CREATE INDEX sidx_22486_21 ON fiz.railwayline_line USING gist (shape);
CREATE INDEX sidx_22503_24 ON fiz.road_line USING gist (shape);
CREATE INDEX sidx_22554_15 ON fiz.transplogisticobj USING gist (shape);
CREATE INDEX sidx_22571_15 ON fiz.transplogisticobj_point USING gist (shape);
CREATE INDEX sidx_22588_18 ON fiz.transportobj USING gist (shape);
CREATE INDEX sidx_22605_18 ON fiz.transportobj_line USING gist (shape);
CREATE INDEX sidx_22622_18 ON fiz.transportobj_point USING gist (shape);
CREATE INDEX sidx_22639_23 ON fiz.watertransportobj USING gist (shape);
CREATE INDEX sidx_22656_23 ON fiz.watertransportobj_point USING gist (shape);
CREATE INDEX sidx_22673_17 ON fiz.waterways_line USING gist (shape);

-- PostgreSQL database dump complete
