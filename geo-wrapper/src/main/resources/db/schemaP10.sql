-- PostgreSQL database dump
-- Dumped from database version 11.1 / pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP SCHEMA IF EXISTS schema_fgistp_10 CASCADE;

CREATE SCHEMA schema_fgistp_10;
ALTER SCHEMA schema_fgistp_10 OWNER TO fiz;
SET default_tablespace = '';
SET default_with_oids = false;

--
CREATE TABLE schema_fgistp_10.ab_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ab_stype OWNER TO fiz;
CREATE SEQUENCE schema_fgistp_10.ab_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ab_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ab_stype_objectid_seq OWNED BY schema_fgistp_10.ab_stype.objectid;

--
CREATE TABLE schema_fgistp_10.aeroszone (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.aeroszone OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.aeroszone_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.aeroszone_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.aeroszone_objectid_seq OWNED BY schema_fgistp_10.aeroszone.objectid;

--
CREATE TABLE schema_fgistp_10.af_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.af_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.af_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.af_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.af_type_objectid_seq OWNED BY schema_fgistp_10.af_type.objectid;

--
CREATE TABLE schema_fgistp_10.al_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.al_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.al_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.al_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.al_stype_objectid_seq OWNED BY schema_fgistp_10.al_stype.objectid;

--
CREATE TABLE schema_fgistp_10.amb_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.amb_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.amb_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.amb_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.amb_type_objectid_seq OWNED BY schema_fgistp_10.amb_type.objectid;

--
CREATE TABLE schema_fgistp_10.ans_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ans_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ans_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ans_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ans_type_objectid_seq OWNED BY schema_fgistp_10.ans_type.objectid;

--
CREATE TABLE schema_fgistp_10.aq_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.aq_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.aq_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.aq_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.aq_stype_objectid_seq OWNED BY schema_fgistp_10.aq_stype.objectid;

--
CREATE TABLE schema_fgistp_10.avia_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.avia_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.avia_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.avia_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.avia_type_objectid_seq OWNED BY schema_fgistp_10.avia_type.objectid;

--
CREATE TABLE schema_fgistp_10.bent_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.bent_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.bent_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.bent_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.bent_type_objectid_seq OWNED BY schema_fgistp_10.bent_type.objectid;

--
CREATE TABLE schema_fgistp_10.bridge_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.bridge_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.bridge_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.bridge_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.bridge_t_objectid_seq OWNED BY schema_fgistp_10.bridge_t.objectid;

--
CREATE TABLE schema_fgistp_10.bur_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.bur_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.bur_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.bur_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.bur_type_objectid_seq OWNED BY schema_fgistp_10.bur_type.objectid;

--
CREATE TABLE schema_fgistp_10.cable_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cable_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cable_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cable_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cable_type_objectid_seq OWNED BY schema_fgistp_10.cable_type.objectid;

--
CREATE TABLE schema_fgistp_10.cat_distr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cat_distr OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cat_distr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cat_distr_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cat_distr_objectid_seq OWNED BY schema_fgistp_10.cat_distr.objectid;

--
CREATE TABLE schema_fgistp_10.cat_main (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cat_main OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cat_main_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cat_main_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cat_main_objectid_seq OWNED BY schema_fgistp_10.cat_main.objectid;

--
CREATE TABLE schema_fgistp_10.cat_rdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cat_rdtype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cat_rdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cat_rdtype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cat_rdtype_objectid_seq OWNED BY schema_fgistp_10.cat_rdtype.objectid;

--
CREATE TABLE schema_fgistp_10.cat_rr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cat_rr OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cat_rr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cat_rr_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cat_rr_objectid_seq OWNED BY schema_fgistp_10.cat_rr.objectid;

--
CREATE TABLE schema_fgistp_10.cemet_stat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cemet_stat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cemet_stat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cemet_stat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cemet_stat_objectid_seq OWNED BY schema_fgistp_10.cemet_stat.objectid;

--
CREATE TABLE schema_fgistp_10.cemet_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cemet_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cemet_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cemet_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cemet_stype_objectid_seq OWNED BY schema_fgistp_10.cemet_stype.objectid;

--
CREATE TABLE schema_fgistp_10.cemet_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cemet_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cemet_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cemet_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cemet_type_objectid_seq OWNED BY schema_fgistp_10.cemet_type.objectid;

--
CREATE TABLE schema_fgistp_10.cemet_wtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cemet_wtype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cemet_wtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cemet_wtype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cemet_wtype_objectid_seq OWNED BY schema_fgistp_10.cemet_wtype.objectid;

--
CREATE TABLE schema_fgistp_10.cep_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.cep_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cep_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cep_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cep_class_objectid_seq OWNED BY schema_fgistp_10.cep_class.objectid;

--
CREATE TABLE schema_fgistp_10.chi_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.chi_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.chi_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.chi_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.chi_stype_objectid_seq OWNED BY schema_fgistp_10.chi_stype.objectid;

--
CREATE TABLE schema_fgistp_10.clb_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.clb_type OWNER TO fiz;
CREATE SEQUENCE schema_fgistp_10.clb_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.clb_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.clb_type_objectid_seq OWNED BY schema_fgistp_10.clb_type.objectid;

--
CREATE TABLE schema_fgistp_10.comm_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.comm_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.comm_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.comm_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.comm_type_objectid_seq OWNED BY schema_fgistp_10.comm_type.objectid;

--
CREATE TABLE schema_fgistp_10.comm_ctype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.comm_ctype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.comm_ctype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.comm_ctype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.comm_ctype_objectid_seq OWNED BY schema_fgistp_10.comm_ctype.objectid;

--
CREATE TABLE schema_fgistp_10.cr_stype (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.cr_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cr_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cr_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cr_stype_objectid_seq OWNED BY schema_fgistp_10.cr_stype.objectid;

--
CREATE TABLE schema_fgistp_10.crossp_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.crossp_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.crossp_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.crossp_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.crossp_t_objectid_seq OWNED BY schema_fgistp_10.crossp_t.objectid;

--
CREATE TABLE schema_fgistp_10.crossr_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.crossr_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.crossr_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.crossr_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.crossr_t_objectid_seq OWNED BY schema_fgistp_10.crossr_t.objectid;

--
CREATE TABLE schema_fgistp_10.ctm_time_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ctm_time_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ctm_time_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ctm_time_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ctm_time_t_objectid_seq OWNED BY schema_fgistp_10.ctm_time_t.objectid;

--
CREATE TABLE schema_fgistp_10.ctm_use_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ctm_use_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ctm_use_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ctm_use_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ctm_use_t_objectid_seq OWNED BY schema_fgistp_10.ctm_use_t.objectid;

--
CREATE TABLE schema_fgistp_10.cu_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.cu_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.cu_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.cu_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.cu_type_objectid_seq OWNED BY schema_fgistp_10.cu_type.objectid;

--
CREATE TABLE schema_fgistp_10.current (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.current OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.current_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.current_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.current_objectid_seq OWNED BY schema_fgistp_10.current.objectid;

--
CREATE TABLE schema_fgistp_10.d_objects (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.d_objects OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.d_objects_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.d_objects_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.d_objects_objectid_seq OWNED BY schema_fgistp_10.d_objects.objectid;

--
CREATE TABLE schema_fgistp_10.danger_obj (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.danger_obj OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.danger_obj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.danger_obj_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.danger_obj_objectid_seq OWNED BY schema_fgistp_10.danger_obj.objectid;

--
CREATE TABLE schema_fgistp_10.edu_sdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.edu_sdtype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.edu_sdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.edu_sdtype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.edu_sdtype_objectid_seq OWNED BY schema_fgistp_10.edu_sdtype.objectid;

--
CREATE TABLE schema_fgistp_10.edu_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.edu_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.edu_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.edu_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.edu_stype_objectid_seq OWNED BY schema_fgistp_10.edu_stype.objectid;

--
CREATE TABLE schema_fgistp_10.edu_tunit (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.edu_tunit OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.edu_tunit_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.edu_tunit_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.edu_tunit_objectid_seq OWNED BY schema_fgistp_10.edu_tunit.objectid;

--
CREATE TABLE schema_fgistp_10.el_supply (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.el_supply OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.el_supply_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.el_supply_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.el_supply_objectid_seq OWNED BY schema_fgistp_10.el_supply.objectid;

--
CREATE TABLE schema_fgistp_10.eme_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.eme_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.eme_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.eme_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.eme_class_objectid_seq OWNED BY schema_fgistp_10.eme_class.objectid;

--
CREATE TABLE schema_fgistp_10.eme_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.eme_source OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.eme_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.eme_source_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.eme_source_objectid_seq OWNED BY schema_fgistp_10.eme_source.objectid;

--
CREATE TABLE schema_fgistp_10.ent_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ent_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ent_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ent_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ent_type_objectid_seq OWNED BY schema_fgistp_10.ent_type.objectid;

--
CREATE TABLE schema_fgistp_10.feature_lep (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.feature_lep OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.feature_lep_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.feature_lep_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.feature_lep_objectid_seq OWNED BY schema_fgistp_10.feature_lep.objectid;

--
CREATE TABLE schema_fgistp_10.ferry_crgt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ferry_crgt OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ferry_crgt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ferry_crgt_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ferry_crgt_objectid_seq OWNED BY schema_fgistp_10.ferry_crgt.objectid;

--
CREATE TABLE schema_fgistp_10.ferry_mvt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ferry_mvt OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ferry_mvt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ferry_mvt_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ferry_mvt_objectid_seq OWNED BY schema_fgistp_10.ferry_mvt.objectid;

--
CREATE TABLE schema_fgistp_10.flooding_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.flooding_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.flooding_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE schema_fgistp_10.flooding_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.flooding_t_objectid_seq OWNED BY schema_fgistp_10.flooding_t.objectid;

CREATE TABLE schema_fgistp_10.forest_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.forest_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.forest_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.forest_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.forest_cat_objectid_seq OWNED BY schema_fgistp_10.forest_cat.objectid;

--
CREATE TABLE schema_fgistp_10.forest_os (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.forest_os OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.forest_os_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.forest_os_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.forest_os_objectid_seq OWNED BY schema_fgistp_10.forest_os.objectid;

--
CREATE TABLE schema_fgistp_10.forest_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.forest_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.forest_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.forest_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.forest_t_objectid_seq OWNED BY schema_fgistp_10.forest_t.objectid;

--
CREATE TABLE schema_fgistp_10.forest_val (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.forest_val OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.forest_val_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.forest_val_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.forest_val_objectid_seq OWNED BY schema_fgistp_10.forest_val.objectid;

CREATE TABLE schema_fgistp_10.fp_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fp_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fp_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fp_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fp_class_objectid_seq OWNED BY schema_fgistp_10.fp_class.objectid;

--
CREATE TABLE schema_fgistp_10.fp_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fp_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fp_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fp_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fp_type_objectid_seq OWNED BY schema_fgistp_10.fp_type.objectid;

--
CREATE TABLE schema_fgistp_10.fs_objects (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fs_objects OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fs_objects_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fs_objects_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fs_objects_objectid_seq OWNED BY schema_fgistp_10.fs_objects.objectid;

--
CREATE TABLE schema_fgistp_10.fses_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fses_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fses_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fses_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fses_stype_objectid_seq OWNED BY schema_fgistp_10.fses_stype.objectid;

CREATE TABLE schema_fgistp_10.fuel_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fuel_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fuel_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE schema_fgistp_10.fuel_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fuel_type_objectid_seq OWNED BY schema_fgistp_10.fuel_type.objectid;

--
CREATE TABLE schema_fgistp_10.fz_ingstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_ingstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_ingstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_ingstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_ingstp_objectid_seq OWNED BY schema_fgistp_10.fz_ingstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_mfstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_mfstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_mfstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_mfstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_mfstp_objectid_seq OWNED BY schema_fgistp_10.fz_mfstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_odstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_odstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_odstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_odstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_odstp_objectid_seq OWNED BY schema_fgistp_10.fz_odstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_orecstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_orecstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_orecstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_orecstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_orecstp_objectid_seq OWNED BY schema_fgistp_10.fz_orecstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_recstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_recstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_recstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_recstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_recstp_objectid_seq OWNED BY schema_fgistp_10.fz_recstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_shstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_shstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_shstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_shstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_shstp_objectid_seq OWNED BY schema_fgistp_10.fz_shstp.objectid;

--
CREATE TABLE schema_fgistp_10.fz_trstp (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.fz_trstp OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.fz_trstp_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.fz_trstp_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.fz_trstp_objectid_seq OWNED BY schema_fgistp_10.fz_trstp.objectid;

--
CREATE TABLE schema_fgistp_10.gas_st_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.gas_st_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.gas_st_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.gas_st_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.gas_st_type_objectid_seq OWNED BY schema_fgistp_10.gas_st_type.objectid;


--
CREATE TABLE schema_fgistp_10.ground_pos (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ground_pos OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ground_pos_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ground_pos_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ground_pos_objectid_seq OWNED BY schema_fgistp_10.ground_pos.objectid;

--
CREATE TABLE schema_fgistp_10.gts_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.gts_class OWNER TO fiz;
CREATE SEQUENCE schema_fgistp_10.gts_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.gts_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.gts_class_objectid_seq OWNED BY schema_fgistp_10.gts_class.objectid;

--
CREATE TABLE schema_fgistp_10.her_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.her_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.her_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.her_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.her_type_objectid_seq OWNED BY schema_fgistp_10.her_type.objectid;

--
CREATE TABLE schema_fgistp_10.hist_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.hist_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.hist_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.hist_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.hist_cat_objectid_seq OWNED BY schema_fgistp_10.hist_cat.objectid;

--
CREATE TABLE schema_fgistp_10.hist_out (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.hist_out OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.hist_out_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.hist_out_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.hist_out_objectid_seq OWNED BY schema_fgistp_10.hist_out.objectid;

--
CREATE TABLE schema_fgistp_10.hot_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.hot_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.hot_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.hot_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.hot_stype_objectid_seq OWNED BY schema_fgistp_10.hot_stype.objectid;

--
CREATE TABLE schema_fgistp_10.hzrd_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.hzrd_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.hzrd_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.hzrd_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.hzrd_cat_objectid_seq OWNED BY schema_fgistp_10.hzrd_cat.objectid;

--
CREATE TABLE schema_fgistp_10.hzrd_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.hzrd_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.hzrd_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.hzrd_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.hzrd_class_objectid_seq OWNED BY schema_fgistp_10.hzrd_class.objectid;

--
CREATE TABLE schema_fgistp_10.ind_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ind_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ind_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ind_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ind_type_objectid_seq OWNED BY schema_fgistp_10.ind_type.objectid;

--
CREATE TABLE schema_fgistp_10.int_trf_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.int_trf_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.int_trf_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.int_trf_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.int_trf_t_objectid_seq OWNED BY schema_fgistp_10.int_trf_t.objectid;

--
CREATE TABLE schema_fgistp_10.int_trn_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.int_trn_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.int_trn_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.int_trn_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.int_trn_t_objectid_seq OWNED BY schema_fgistp_10.int_trn_t.objectid;

--
CREATE TABLE schema_fgistp_10.land_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.land_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.land_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.land_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.land_type_objectid_seq OWNED BY schema_fgistp_10.land_type.objectid;

--
CREATE TABLE schema_fgistp_10.main_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.main_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.main_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.main_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.main_type_objectid_seq OWNED BY schema_fgistp_10.main_type.objectid;

--
CREATE TABLE schema_fgistp_10.mc_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.mc_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.mc_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.mc_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.mc_type_objectid_seq OWNED BY schema_fgistp_10.mc_type.objectid;

--
CREATE TABLE schema_fgistp_10.md_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.md_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.md_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.md_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.md_stype_objectid_seq OWNED BY schema_fgistp_10.md_stype.objectid;

--
CREATE TABLE schema_fgistp_10.min_atype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.min_atype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.min_atype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.min_atype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.min_atype_objectid_seq OWNED BY schema_fgistp_10.min_atype.objectid;

--
CREATE TABLE schema_fgistp_10.min_mtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.min_mtype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.min_mtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.min_mtype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.min_mtype_objectid_seq OWNED BY schema_fgistp_10.min_mtype.objectid;

--
CREATE TABLE schema_fgistp_10.min_ntype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.min_ntype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.min_ntype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.min_ntype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.min_ntype_objectid_seq OWNED BY schema_fgistp_10.min_ntype.objectid;

--
CREATE TABLE schema_fgistp_10.mp_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.mp_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.mp_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.mp_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.mp_type_objectid_seq OWNED BY schema_fgistp_10.mp_type.objectid;

--
CREATE TABLE schema_fgistp_10.msd_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.msd_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.msd_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.msd_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.msd_type_objectid_seq OWNED BY schema_fgistp_10.msd_type.objectid;

--
CREATE TABLE schema_fgistp_10.mst_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.mst_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.mst_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.mst_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.mst_type_objectid_seq OWNED BY schema_fgistp_10.mst_type.objectid;

--
CREATE TABLE schema_fgistp_10.num_tracks (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.num_tracks OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.num_tracks_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.num_tracks_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.num_tracks_objectid_seq OWNED BY schema_fgistp_10.num_tracks.objectid;

--
CREATE TABLE schema_fgistp_10.och_use (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.och_use OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.och_use_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.och_use_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.och_use_objectid_seq OWNED BY schema_fgistp_10.och_use.objectid;

--
CREATE TABLE schema_fgistp_10.oro_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.oro_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.oro_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.oro_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.oro_stype_objectid_seq OWNED BY schema_fgistp_10.oro_stype.objectid;

--
CREATE TABLE schema_fgistp_10.oro_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.oro_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.oro_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.oro_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.oro_type_objectid_seq OWNED BY schema_fgistp_10.oro_type.objectid;

--
CREATE TABLE schema_fgistp_10.ozsn_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ozsn_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ozsn_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ozsn_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ozsn_type_objectid_seq OWNED BY schema_fgistp_10.ozsn_type.objectid;

--
CREATE TABLE schema_fgistp_10.pass_term (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.pass_term OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.pass_term_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.pass_term_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.pass_term_objectid_seq OWNED BY schema_fgistp_10.pass_term.objectid;

--
CREATE TABLE schema_fgistp_10.ped_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ped_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ped_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ped_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ped_type_objectid_seq OWNED BY schema_fgistp_10.ped_type.objectid;

--
CREATE TABLE schema_fgistp_10.pkio_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.pkio_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.pkio_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.pkio_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.pkio_type_objectid_seq OWNED BY schema_fgistp_10.pkio_type.objectid;

--
CREATE TABLE schema_fgistp_10.pl_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.pl_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.pl_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.pl_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.pl_type_objectid_seq OWNED BY schema_fgistp_10.pl_type.objectid;

--
CREATE TABLE schema_fgistp_10.pline_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.pline_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.pline_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.pline_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.pline_type_objectid_seq OWNED BY schema_fgistp_10.pline_type.objectid;

--
CREATE TABLE schema_fgistp_10.power_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.power_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.power_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.power_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.power_type_objectid_seq OWNED BY schema_fgistp_10.power_type.objectid;

--
CREATE TABLE schema_fgistp_10.prg_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.prg_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.prg_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.prg_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.prg_type_objectid_seq OWNED BY schema_fgistp_10.prg_type.objectid;

--
CREATE TABLE schema_fgistp_10.prkng_lvl (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.prkng_lvl OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.prkng_lvl_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.prkng_lvl_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.prkng_lvl_objectid_seq OWNED BY schema_fgistp_10.prkng_lvl.objectid;

--
CREATE TABLE schema_fgistp_10.prkng_time (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.prkng_time OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.prkng_time_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.prkng_time_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.prkng_time_objectid_seq OWNED BY schema_fgistp_10.prkng_time.objectid;

--
CREATE TABLE schema_fgistp_10.prkng_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.prkng_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.prkng_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.prkng_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.prkng_type_objectid_seq OWNED BY schema_fgistp_10.prkng_type.objectid;

--
CREATE TABLE schema_fgistp_10.prom_direct (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.prom_direct OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.prom_direct_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.prom_direct_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.prom_direct_objectid_seq OWNED BY schema_fgistp_10.prom_direct.objectid;

--
CREATE TABLE schema_fgistp_10.proximity (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.proximity OWNER TO fiz;

--
CREATE SEQUENCE schema_fgistp_10.proximity_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.proximity_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.proximity_objectid_seq OWNED BY schema_fgistp_10.proximity.objectid;

--
CREATE TABLE schema_fgistp_10.pu_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.pu_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.pu_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.pu_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.pu_stype_objectid_seq OWNED BY schema_fgistp_10.pu_stype.objectid;

--
CREATE TABLE schema_fgistp_10.r_affinity (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.r_affinity OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.r_affinity_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.r_affinity_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.r_affinity_objectid_seq OWNED BY schema_fgistp_10.r_affinity.objectid;

CREATE TABLE schema_fgistp_10.rad_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rad_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rad_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rad_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rad_class_objectid_seq OWNED BY schema_fgistp_10.rad_class.objectid;

--
CREATE TABLE schema_fgistp_10.rdwin_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rdwin_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rdwin_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rdwin_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rdwin_cat_objectid_seq OWNED BY schema_fgistp_10.rdwin_cat.objectid;

CREATE TABLE schema_fgistp_10.rdwin_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rdwin_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rdwin_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rdwin_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rdwin_type_objectid_seq OWNED BY schema_fgistp_10.rdwin_type.objectid;


CREATE TABLE schema_fgistp_10.recyc_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.recyc_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.recyc_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.recyc_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.recyc_type_objectid_seq OWNED BY schema_fgistp_10.recyc_type.objectid;

CREATE TABLE schema_fgistp_10.reg_rdtype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.reg_rdtype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.reg_rdtype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.reg_rdtype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.reg_rdtype_objectid_seq OWNED BY schema_fgistp_10.reg_rdtype.objectid;

CREATE TABLE schema_fgistp_10.reg_status (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.reg_status OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.reg_status_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.reg_status_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.reg_status_objectid_seq OWNED BY schema_fgistp_10.reg_status.objectid;

CREATE TABLE schema_fgistp_10.res_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.res_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.res_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.res_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.res_stype_objectid_seq OWNED BY schema_fgistp_10.res_stype.objectid;

--
CREATE TABLE schema_fgistp_10.rfo_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rfo_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rfo_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rfo_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rfo_type_objectid_seq OWNED BY schema_fgistp_10.rfo_type.objectid;

CREATE TABLE schema_fgistp_10.risk_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.risk_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.risk_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.risk_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.risk_cat_objectid_seq OWNED BY schema_fgistp_10.risk_cat.objectid;

--
CREATE TABLE schema_fgistp_10.rs_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rs_stype OWNER TO fiz;

--
CREATE SEQUENCE schema_fgistp_10.rs_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rs_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rs_stype_objectid_seq OWNED BY schema_fgistp_10.rs_stype.objectid;

--
CREATE TABLE schema_fgistp_10.rst_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rst_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rst_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rst_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rst_class_objectid_seq OWNED BY schema_fgistp_10.rst_class.objectid;

--
CREATE TABLE schema_fgistp_10.rst_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rst_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rst_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rst_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rst_type_objectid_seq OWNED BY schema_fgistp_10.rst_type.objectid;

--
CREATE TABLE schema_fgistp_10.rwy_class (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.rwy_class OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.rwy_class_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.rwy_class_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.rwy_class_objectid_seq OWNED BY schema_fgistp_10.rwy_class.objectid;

--
CREATE TABLE schema_fgistp_10.s_alert (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.s_alert OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.s_alert_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.s_alert_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.s_alert_objectid_seq OWNED BY schema_fgistp_10.s_alert.objectid;

--
CREATE TABLE schema_fgistp_10.saf_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.saf_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.saf_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.saf_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.saf_stype_objectid_seq OWNED BY schema_fgistp_10.saf_stype.objectid;

--
CREATE TABLE schema_fgistp_10.sci_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.sci_type OWNER TO fiz;

--
CREATE SEQUENCE schema_fgistp_10.sci_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.sci_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.sci_type_objectid_seq OWNED BY schema_fgistp_10.sci_type.objectid;

--
CREATE TABLE schema_fgistp_10.season (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.season OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.season_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.season_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.season_objectid_seq OWNED BY schema_fgistp_10.season.objectid;

--
CREATE TABLE schema_fgistp_10.serv_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.serv_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.serv_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.serv_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.serv_stype_objectid_seq OWNED BY schema_fgistp_10.serv_stype.objectid;

--
CREATE TABLE schema_fgistp_10.settl_cat (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.settl_cat OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.settl_cat_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.settl_cat_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.settl_cat_objectid_seq OWNED BY schema_fgistp_10.settl_cat.objectid;

--
CREATE TABLE schema_fgistp_10.settl_level (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.settl_level OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.settl_level_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.settl_level_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.settl_level_objectid_seq OWNED BY schema_fgistp_10.settl_level.objectid;

--
CREATE TABLE schema_fgistp_10.settl_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.settl_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.settl_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.settl_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.settl_type_objectid_seq OWNED BY schema_fgistp_10.settl_type.objectid;

--
CREATE TABLE schema_fgistp_10.snow_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.snow_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.snow_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.snow_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.snow_type_objectid_seq OWNED BY schema_fgistp_10.snow_type.objectid;

--
CREATE TABLE schema_fgistp_10.soc_direct (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.soc_direct OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.soc_direct_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.soc_direct_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.soc_direct_objectid_seq OWNED BY schema_fgistp_10.soc_direct.objectid;

--
CREATE TABLE schema_fgistp_10.sp_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.sp_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.sp_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.sp_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.sp_stype_objectid_seq OWNED BY schema_fgistp_10.sp_stype.objectid;

--
CREATE TABLE schema_fgistp_10.specific (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.specific OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.specific_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.specific_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.specific_objectid_seq OWNED BY schema_fgistp_10.specific.objectid;

--
CREATE TABLE schema_fgistp_10.spz_event (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.spz_event OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.spz_event_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.spz_event_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.spz_event_objectid_seq OWNED BY schema_fgistp_10.spz_event.objectid;

--
CREATE TABLE schema_fgistp_10.ssah_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.ssah_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.ssah_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.ssah_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.ssah_stype_objectid_seq OWNED BY schema_fgistp_10.ssah_stype.objectid;

--
CREATE TABLE schema_fgistp_10.st_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.st_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.st_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.st_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.st_stype_objectid_seq OWNED BY schema_fgistp_10.st_stype.objectid;

--
CREATE TABLE schema_fgistp_10.status (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.status OWNER TO fiz;

--
CREATE TABLE schema_fgistp_10.status_adm (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.status_adm OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.status_adm_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.status_adm_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.status_adm_objectid_seq OWNED BY schema_fgistp_10.status_adm.objectid;

CREATE SEQUENCE schema_fgistp_10.status_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.status_objectid_seq OWNER TO fiz;

ALTER SEQUENCE schema_fgistp_10.status_objectid_seq OWNED BY schema_fgistp_10.status.objectid;

--
CREATE TABLE schema_fgistp_10.status_och (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.status_och OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.status_och_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.status_och_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.status_och_objectid_seq OWNED BY schema_fgistp_10.status_och.objectid;

--
CREATE TABLE schema_fgistp_10.status_pr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.status_pr OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.status_pr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.status_pr_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.status_pr_objectid_seq OWNED BY schema_fgistp_10.status_pr.objectid;

--
CREATE TABLE schema_fgistp_10.stop_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.stop_type OWNER TO fiz;
CREATE SEQUENCE schema_fgistp_10.stop_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.stop_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.stop_type_objectid_seq OWNED BY schema_fgistp_10.stop_type.objectid;

--
CREATE TABLE schema_fgistp_10.store_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.store_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.store_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.store_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.store_type_objectid_seq OWNED BY schema_fgistp_10.store_type.objectid;

--
CREATE TABLE schema_fgistp_10.str_l_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.str_l_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.str_l_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.str_l_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.str_l_type_objectid_seq OWNED BY schema_fgistp_10.str_l_type.objectid;

--
CREATE TABLE schema_fgistp_10.str_r_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.str_r_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.str_r_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.str_r_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.str_r_type_objectid_seq OWNED BY schema_fgistp_10.str_r_type.objectid;

--
CREATE TABLE schema_fgistp_10.str_type (
    objectid integer NOT NULL,
    code smallint,
    descroption character varying(255)
);
ALTER TABLE schema_fgistp_10.str_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.str_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.str_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.str_type_objectid_seq OWNED BY schema_fgistp_10.str_type.objectid;

--
CREATE TABLE schema_fgistp_10.su_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.su_type OWNER TO fiz;

-- Name: su_type_objectid_seq; Type: SEQUENCE; Schema: fiz; Owner: fiz
CREATE SEQUENCE schema_fgistp_10.su_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.su_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.su_type_objectid_seq OWNED BY schema_fgistp_10.su_type.objectid;

--
CREATE TABLE schema_fgistp_10.suburban_tr (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.suburban_tr OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.suburban_tr_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.suburban_tr_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.suburban_tr_objectid_seq OWNED BY schema_fgistp_10.suburban_tr.objectid;

--
CREATE TABLE schema_fgistp_10.surface_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.surface_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.surface_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.surface_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.surface_type_objectid_seq OWNED BY schema_fgistp_10.surface_type.objectid;

--
CREATE TABLE schema_fgistp_10.szz_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.szz_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.szz_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.szz_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.szz_type_objectid_seq OWNED BY schema_fgistp_10.szz_type.objectid;

--
CREATE TABLE schema_fgistp_10.time_ltype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.time_ltype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.time_ltype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.time_ltype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.time_ltype_objectid_seq OWNED BY schema_fgistp_10.time_ltype.objectid;

--
CREATE TABLE schema_fgistp_10.tm_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.tm_source OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.tm_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.tm_source_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.tm_source_objectid_seq OWNED BY schema_fgistp_10.tm_source.objectid;

--
CREATE TABLE schema_fgistp_10.tpark_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.tpark_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.tpark_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.tpark_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.tpark_type_objectid_seq OWNED BY schema_fgistp_10.tpark_type.objectid;

--
CREATE TABLE schema_fgistp_10.track_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.track_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.track_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.track_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.track_type_objectid_seq OWNED BY schema_fgistp_10.track_type.objectid;

--
CREATE TABLE schema_fgistp_10.trd_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.trd_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.trd_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.trd_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.trd_stype_objectid_seq OWNED BY schema_fgistp_10.trd_stype.objectid;

--
CREATE TABLE schema_fgistp_10.tunnel_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.tunnel_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.tunnel_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.tunnel_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.tunnel_t_objectid_seq OWNED BY schema_fgistp_10.tunnel_t.objectid;

--
CREATE TABLE schema_fgistp_10.type_law (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.type_law OWNER TO fiz;

--
CREATE SEQUENCE schema_fgistp_10.type_law_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.type_law_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.type_law_objectid_seq OWNED BY schema_fgistp_10.type_law.objectid;

--
CREATE TABLE schema_fgistp_10.type_subj (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.type_subj OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.type_subj_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.type_subj_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.type_subj_objectid_seq OWNED BY schema_fgistp_10.type_subj.objectid;

--
CREATE TABLE schema_fgistp_10.uderfl_t (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.uderfl_t OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.uderfl_t_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.uderfl_t_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.uderfl_t_objectid_seq OWNED BY schema_fgistp_10.uderfl_t.objectid;

--
CREATE TABLE schema_fgistp_10.usa_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.usa_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.usa_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.usa_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.usa_stype_objectid_seq OWNED BY schema_fgistp_10.usa_stype.objectid;

--
CREATE TABLE schema_fgistp_10.using_type (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.using_type OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.using_type_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE schema_fgistp_10.using_type_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.using_type_objectid_seq OWNED BY schema_fgistp_10.using_type.objectid;

--
CREATE TABLE schema_fgistp_10.voltage (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.voltage OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.voltage_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.voltage_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.voltage_objectid_seq OWNED BY schema_fgistp_10.voltage.objectid;

--
CREATE TABLE schema_fgistp_10.w_source (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.w_source OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.w_source_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.w_source_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.w_source_objectid_seq OWNED BY schema_fgistp_10.w_source.objectid;

--
CREATE TABLE schema_fgistp_10.water_stype (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.water_stype OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.water_stype_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.water_stype_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.water_stype_objectid_seq OWNED BY schema_fgistp_10.water_stype.objectid;

--
CREATE TABLE schema_fgistp_10.yatch_cls (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.yatch_cls OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.yatch_cls_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.yatch_cls_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.yatch_cls_objectid_seq OWNED BY schema_fgistp_10.yatch_cls.objectid;

--
CREATE TABLE schema_fgistp_10.zone_oopt (
    objectid integer NOT NULL,
    code smallint,
    description character varying(255)
);
ALTER TABLE schema_fgistp_10.zone_oopt OWNER TO fiz;

CREATE SEQUENCE schema_fgistp_10.zone_oopt_objectid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE schema_fgistp_10.zone_oopt_objectid_seq OWNER TO fiz;
ALTER SEQUENCE schema_fgistp_10.zone_oopt_objectid_seq OWNED BY schema_fgistp_10.zone_oopt.objectid;

--
ALTER TABLE ONLY schema_fgistp_10.ab_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ab_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.aeroszone ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.aeroszone_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.af_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.af_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.al_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.al_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.amb_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.amb_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ans_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ans_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.aq_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.aq_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.avia_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.avia_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.bent_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.bent_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.bridge_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.bridge_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.bur_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.bur_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cable_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cable_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cat_distr ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cat_distr_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cat_main ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cat_main_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cat_rdtype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cat_rdtype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cat_rr ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cat_rr_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cemet_stat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cemet_stat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cemet_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cemet_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cemet_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cemet_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cemet_wtype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cemet_wtype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cep_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cep_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.chi_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.chi_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.clb_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.clb_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.comm_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.comm_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.comm_ctype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.comm_ctype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cr_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cr_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.crossp_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.crossp_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.crossr_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.crossr_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ctm_time_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ctm_time_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ctm_use_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ctm_use_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.cu_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.cu_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.current ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.current_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.d_objects ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.d_objects_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.danger_obj ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.danger_obj_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.edu_sdtype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.edu_sdtype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.edu_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.edu_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.edu_tunit ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.edu_tunit_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.el_supply ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.el_supply_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.eme_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.eme_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.eme_source ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.eme_source_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ent_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ent_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.feature_lep ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.feature_lep_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ferry_crgt ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ferry_crgt_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ferry_mvt ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ferry_mvt_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.flooding_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.flooding_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.forest_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.forest_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.forest_os ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.forest_os_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.forest_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.forest_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.forest_val ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.forest_val_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fp_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fp_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fp_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fp_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fs_objects ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fs_objects_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fses_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fses_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fuel_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fuel_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_ingstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_ingstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_mfstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_mfstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_odstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_odstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_orecstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_orecstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_recstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_recstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_shstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_shstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.fz_trstp ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.fz_trstp_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.gas_st_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.gas_st_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ground_pos ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ground_pos_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.gts_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.gts_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.her_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.her_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.hist_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.hist_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.hist_out ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.hist_out_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.hot_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.hot_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.hzrd_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.hzrd_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.hzrd_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.hzrd_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ind_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ind_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.int_trf_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.int_trf_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.int_trn_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.int_trn_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.land_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.land_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.main_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.main_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.mc_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.mc_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.md_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.md_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.min_atype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.min_atype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.min_mtype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.min_mtype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.min_ntype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.min_ntype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.mp_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.mp_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.msd_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.msd_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.mst_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.mst_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.num_tracks ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.num_tracks_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.och_use ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.och_use_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.oro_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.oro_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.oro_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.oro_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ozsn_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ozsn_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.pass_term ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.pass_term_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ped_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ped_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.pkio_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.pkio_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.pl_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.pl_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.pline_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.pline_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.power_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.power_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.prg_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.prg_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.prkng_lvl ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.prkng_lvl_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.prkng_time ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.prkng_time_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.prkng_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.prkng_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.prom_direct ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.prom_direct_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.proximity ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.proximity_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.pu_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.pu_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.r_affinity ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.r_affinity_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rad_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rad_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rdwin_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rdwin_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rdwin_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rdwin_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.recyc_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.recyc_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.reg_rdtype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.reg_rdtype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.reg_status ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.reg_status_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.res_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.res_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rfo_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rfo_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.risk_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.risk_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rs_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rs_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rst_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rst_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rst_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rst_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.rwy_class ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.rwy_class_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.s_alert ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.s_alert_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.saf_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.saf_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.sci_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.sci_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.season ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.season_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.serv_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.serv_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.settl_cat ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.settl_cat_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.settl_level ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.settl_level_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.settl_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.settl_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.snow_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.snow_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.soc_direct ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.soc_direct_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.sp_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.sp_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.specific ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.specific_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.spz_event ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.spz_event_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.ssah_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.ssah_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.st_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.st_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.status ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.status_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.status_adm ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.status_adm_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.status_och ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.status_och_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.status_pr ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.status_pr_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.stop_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.stop_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.store_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.store_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.str_l_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.str_l_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.str_r_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.str_r_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.str_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.str_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.su_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.su_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.suburban_tr ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.suburban_tr_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.surface_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.surface_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.szz_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.szz_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.time_ltype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.time_ltype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.tm_source ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.tm_source_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.tpark_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.tpark_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.track_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.track_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.trd_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.trd_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.tunnel_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.tunnel_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.type_law ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.type_law_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.type_subj ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.type_subj_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.uderfl_t ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.uderfl_t_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.usa_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.usa_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.using_type ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.using_type_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.voltage ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.voltage_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.w_source ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.w_source_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.water_stype ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.water_stype_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.yatch_cls ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.yatch_cls_objectid_seq'::regclass);
ALTER TABLE ONLY schema_fgistp_10.zone_oopt ALTER COLUMN objectid SET DEFAULT nextval('schema_fgistp_10.zone_oopt_objectid_seq'::regclass);

ALTER TABLE ONLY schema_fgistp_10.ab_stype ADD CONSTRAINT ab_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.aeroszone ADD CONSTRAINT aeroszone_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.af_type ADD CONSTRAINT af_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.al_stype ADD CONSTRAINT al_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.amb_type ADD CONSTRAINT amb_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ans_type ADD CONSTRAINT ans_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.aq_stype ADD CONSTRAINT aq_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.avia_type ADD CONSTRAINT avia_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.bent_type ADD CONSTRAINT bent_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.bridge_t ADD CONSTRAINT bridge_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.bur_type ADD CONSTRAINT bur_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cable_type ADD CONSTRAINT cable_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cat_distr ADD CONSTRAINT cat_distr_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cat_main ADD CONSTRAINT cat_main_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cat_rdtype ADD CONSTRAINT cat_rdtype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cat_rr ADD CONSTRAINT cat_rr_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cemet_stat ADD CONSTRAINT cemet_stat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cemet_stype ADD CONSTRAINT cemet_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cemet_type ADD CONSTRAINT cemet_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cemet_wtype ADD CONSTRAINT cemet_wtype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cep_class ADD CONSTRAINT cep_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.chi_stype ADD CONSTRAINT chi_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.clb_type ADD CONSTRAINT clb_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.comm_type ADD CONSTRAINT comm_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.comm_ctype ADD CONSTRAINT comm_ctype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cr_stype ADD CONSTRAINT cr_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.crossp_t ADD CONSTRAINT crossp_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.crossr_t ADD CONSTRAINT crossr_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ctm_time_t ADD CONSTRAINT ctm_time_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ctm_use_t ADD CONSTRAINT ctm_use_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.cu_type ADD CONSTRAINT cu_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.current ADD CONSTRAINT current_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.d_objects ADD CONSTRAINT d_objects_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.danger_obj ADD CONSTRAINT danger_obj_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.edu_sdtype ADD CONSTRAINT edu_sdtype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.edu_stype ADD CONSTRAINT edu_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.edu_tunit ADD CONSTRAINT edu_tunit_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.el_supply ADD CONSTRAINT el_supply_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.eme_class ADD CONSTRAINT eme_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.eme_source ADD CONSTRAINT eme_source_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ent_type ADD CONSTRAINT ent_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.feature_lep ADD CONSTRAINT feature_lep_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ferry_crgt ADD CONSTRAINT ferry_crgt_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ferry_mvt ADD CONSTRAINT ferry_mvt_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.flooding_t ADD CONSTRAINT flooding_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.forest_cat ADD CONSTRAINT forest_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.forest_os ADD CONSTRAINT forest_os_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.forest_t ADD CONSTRAINT forest_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.forest_val ADD CONSTRAINT forest_val_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fp_class ADD CONSTRAINT fp_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fp_type ADD CONSTRAINT fp_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fs_objects ADD CONSTRAINT fs_objects_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fses_stype ADD CONSTRAINT fses_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fuel_type ADD CONSTRAINT fuel_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_ingstp ADD CONSTRAINT fz_ingstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_mfstp ADD CONSTRAINT fz_mfstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_odstp ADD CONSTRAINT fz_odstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_orecstp ADD CONSTRAINT fz_orecstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_recstp ADD CONSTRAINT fz_recstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_shstp ADD CONSTRAINT fz_shstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.fz_trstp ADD CONSTRAINT fz_trstp_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.gas_st_type ADD CONSTRAINT gas_st_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ground_pos ADD CONSTRAINT ground_pos_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.gts_class ADD CONSTRAINT gts_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.her_type ADD CONSTRAINT her_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.hist_cat ADD CONSTRAINT hist_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.hist_out ADD CONSTRAINT hist_out_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.hot_stype ADD CONSTRAINT hot_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.hzrd_cat ADD CONSTRAINT hzrd_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.hzrd_class ADD CONSTRAINT hzrd_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ind_type ADD CONSTRAINT ind_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.int_trf_t ADD CONSTRAINT int_trf_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.int_trn_t ADD CONSTRAINT int_trn_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.land_type ADD CONSTRAINT land_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.main_type ADD CONSTRAINT main_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.mc_type ADD CONSTRAINT mc_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.md_stype ADD CONSTRAINT md_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.min_atype ADD CONSTRAINT min_atype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.min_mtype ADD CONSTRAINT min_mtype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.min_ntype ADD CONSTRAINT min_ntype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.mp_type ADD CONSTRAINT mp_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.msd_type ADD CONSTRAINT msd_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.mst_type ADD CONSTRAINT mst_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.num_tracks ADD CONSTRAINT num_tracks_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.och_use ADD CONSTRAINT och_use_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.oro_stype ADD CONSTRAINT oro_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.oro_type ADD CONSTRAINT oro_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ozsn_type ADD CONSTRAINT ozsn_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.pass_term ADD CONSTRAINT pass_term_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ped_type ADD CONSTRAINT ped_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.pkio_type ADD CONSTRAINT pkio_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.pl_type ADD CONSTRAINT pl_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.pline_type ADD CONSTRAINT pline_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.power_type ADD CONSTRAINT power_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.prg_type ADD CONSTRAINT prg_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.prkng_lvl ADD CONSTRAINT prkng_lvl_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.prkng_time ADD CONSTRAINT prkng_time_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.prkng_type ADD CONSTRAINT prkng_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.prom_direct ADD CONSTRAINT prom_direct_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.proximity ADD CONSTRAINT proximity_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.pu_stype ADD CONSTRAINT pu_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.r_affinity ADD CONSTRAINT r_affinity_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rad_class ADD CONSTRAINT rad_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rdwin_cat ADD CONSTRAINT rdwin_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rdwin_type ADD CONSTRAINT rdwin_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.recyc_type ADD CONSTRAINT recyc_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.reg_rdtype ADD CONSTRAINT reg_rdtype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.reg_status ADD CONSTRAINT reg_status_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.res_stype ADD CONSTRAINT res_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rfo_type ADD CONSTRAINT rfo_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.risk_cat ADD CONSTRAINT risk_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rs_stype ADD CONSTRAINT rs_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rst_class ADD CONSTRAINT rst_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rst_type ADD CONSTRAINT rst_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.rwy_class ADD CONSTRAINT rwy_class_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.s_alert ADD CONSTRAINT s_alert_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.saf_stype ADD CONSTRAINT saf_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.sci_type ADD CONSTRAINT sci_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.season ADD CONSTRAINT season_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.serv_stype ADD CONSTRAINT serv_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.settl_cat ADD CONSTRAINT settl_cat_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.settl_level ADD CONSTRAINT settl_level_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.settl_type ADD CONSTRAINT settl_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.snow_type ADD CONSTRAINT snow_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.soc_direct ADD CONSTRAINT soc_direct_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.sp_stype ADD CONSTRAINT sp_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.specific ADD CONSTRAINT specific_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.spz_event ADD CONSTRAINT spz_event_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.ssah_stype ADD CONSTRAINT ssah_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.st_stype ADD CONSTRAINT st_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.status_adm ADD CONSTRAINT status_adm_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.status_och ADD CONSTRAINT status_och_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.status ADD CONSTRAINT status_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.status_pr ADD CONSTRAINT status_pr_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.stop_type ADD CONSTRAINT stop_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.store_type ADD CONSTRAINT store_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.str_l_type ADD CONSTRAINT str_l_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.str_r_type ADD CONSTRAINT str_r_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.str_type ADD CONSTRAINT str_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.su_type ADD CONSTRAINT su_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.suburban_tr ADD CONSTRAINT suburban_tr_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.surface_type ADD CONSTRAINT surface_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.szz_type ADD CONSTRAINT szz_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.time_ltype ADD CONSTRAINT time_ltype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.tm_source ADD CONSTRAINT tm_source_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.tpark_type ADD CONSTRAINT tpark_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.track_type ADD CONSTRAINT track_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.trd_stype ADD CONSTRAINT trd_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.tunnel_t ADD CONSTRAINT tunnel_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.type_law ADD CONSTRAINT type_law_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.type_subj ADD CONSTRAINT type_subj_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.uderfl_t ADD CONSTRAINT uderfl_t_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.usa_stype ADD CONSTRAINT usa_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.using_type ADD CONSTRAINT using_type_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.voltage ADD CONSTRAINT voltage_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.w_source ADD CONSTRAINT w_source_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.water_stype ADD CONSTRAINT water_stype_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.yatch_cls ADD CONSTRAINT yatch_cls_pkey PRIMARY KEY (objectid);
ALTER TABLE ONLY schema_fgistp_10.zone_oopt ADD CONSTRAINT zone_oopt_pkey PRIMARY KEY (objectid);
