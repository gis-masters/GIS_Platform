-- PostgreSQL database dump
-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.5 (Ubuntu 11.5-1.pgdg19.04+1)

TRUNCATE public.custom_rules;

-- functionalzone
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
    VALUES ('functionalzone', 'var errors = [];
  if (obj.classid === 701010301 && !obj.fz_mfstp) {
    errors.push(''fz_mfstp'');
  }

  if (obj.classid === 701010302 && !obj.fz_odstp) {
    errors.push(''fz_odstp'');
  }

  if (obj.classid === 701010404 && !obj.fz_ingstp) {
    errors.push(''fz_ingstp'');
  }

  if (obj.classid === 701010405 && !obj.fz_trstp) {
    errors.push(''fz_trstp'');
  }

  if (obj.classid === 701010504 && !obj.fz_shstp) {
    errors.push(''fz_shstp'');
  }

  if (obj.classid === 701010602 && !obj.fz_recstp) {
    errors.push(''fz_recstp'');
  }

  if (obj.classid === 701010606 && !obj.fz_orecstp) {
    errors.push(''fz_orecstp'');
  }

  if (obj.classid === 701010100 || obj.classid === 701010101 ||
    obj.classid === 701010102 || obj.classid === 701010103 ||
    obj.classid === 701010104 || obj.classid === 701010200 ||
    obj.classid === 701010300 || obj.classid === 701010301 ||
    obj.classid === 701010302 || obj.classid === 701010303) {

    if (!obj.pop_den) {
      errors.push (''pop_den'');
    }

    if (!obj.population) {
      errors.push (''population'');
    }
  }

  if (Number(obj.status) === 2 && !obj.reg_status) {
    errors.push(''reg_status'');
  }

  return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- health
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
    VALUES ('health', 'var errors = [];
  if (obj.classid === 602010401 && !obj.md_stype) {
    errors.push(''md_stype'');
  }

  if (obj.classid === 602010402 && !obj.amd_type) {
    errors.push(''amd_type'');
  }

  if (obj.classid === 602010403 && !obj.mst_type) {
    errors.push(''mst_type'');
  }

  if (obj.classid === 602010404 && !obj.su_type) {
    errors.push(''su_type'');
  }

  if (obj.classid === 602010406 && !obj.msd_type) {
    errors.push(''msd_type'');
  }

  if (obj.classid === 602010407 && !obj.mc_type) {
    errors.push(''mc_type'');
  }

  if (obj.classid === 602010401 || obj.classid === 602010402 || obj.classid === 602010406) {
    if (!obj.capacity_s) {
      errors.push (''capacity_s'');
    }
  }

  if (obj.classid === 602010401 || obj.classid === 602010405) {
    if (!obj.capacity24) {
      errors.push (''capacity24'');
    }
  }

  if (obj.classid === 602010401 || obj.classid === 602010402 || obj.classid === 602010405) {
    if (!obj.capacity) {
      errors.push (''capacity'');
    }
  }

  if (obj.classid === 602010401 || obj.classid === 602010402 ||
    obj.classid === 602010405 || obj.classid === 602010407) {
    if (!obj.num_cars) {
      errors.push (''num_cars'');
    }
  }

  return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- education
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
    VALUES ('education', 'var errors = [];
  if (obj.classid === 602010102 && !obj.edu_stype) {
    errors.push(''edu_stype'');
  }

  if (obj.classid === 602010104 && !obj.edu_sdtype) {
    errors.push(''edu_sdtype'');
  }

  if (obj.classid === 602010106 && !obj.sci_type) {
    errors.push(''sci_type'');
  }

  if ((obj.classid === 602010102 || obj.classid === 602010103) && !obj.prg_type) {
    errors.push(''prg_type'');
  }

  if (obj.classid === 602010104 && !obj.edu_tunit) {
    errors.push(''edu_tunit'');
  }

  return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- sport
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
    VALUES ('sport', 'var errors = [];
  if (obj.classid === 602010302 && !obj.af_type) {
    errors.push(''af_type'');
  }

  return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- culture
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
    VALUES ('culture', 'var errors = [];
  if (obj.classid === 602010201 && !obj.cu_type) {
    errors.push(''cu_type'');
  }

  if (obj.classid === 602010202 && !obj.clb_type) {
    errors.push(''clb_type'');
  }

  if (obj.classid === 602010203 && !obj.ent_type) {
    errors.push(''ent_type'');
  }

  if (obj.classid === 602010201 || obj.classid === 602010202) {
    if (!obj.lb_stock) {
      errors.push (''lb_stock'');
    }

    if (!obj.exb_area) {
      errors.push (''exb_area'');
    }
  }

  return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- social
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('social', 'var errors = [];
if (obj.classid === 602010501) {
    if(!obj.st_stype) {
        errors.push (''st_stype'');
    }
}
if (obj.classid === 602010502) {
    if(!obj.sp_stype) {
        errors.push (''sp_stype'');
    }
}
if (obj.classid === 602010503) {
    if(!obj.ssah_stype) {
        errors.push (''ssah_stype'');
    }
}
if (obj.classid === 602010504) {
    if(!obj.usa_stype) {
        errors.push (''usa_stype'');
    }
}
if (obj.classid === 602010501 || obj.classid == 602010502) {
    if(!obj.capacity) {
        errors.push (''capacity'');
    }
}
if (obj.classid === 602010502 || obj.classid == 602010503) {
    if(!obj.person_ph) {
        errors.push (''person_ph'');
    }
}
if (obj.classid === 602010502 || obj.classid == 602010504) {
    if(!obj.person_pd) {
        errors.push (''person_pd'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- recreation
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('recreation', 'var errors = [];
  if (obj.classid === 602010601) {
    if(!obj.hot_stype) {
        errors.push (''hot_stype'');
    }
}
if (obj.classid === 602010602) {
    if(!obj.saf_stype) {
        errors.push (''saf_stype'');
    }
}
if (obj.classid === 602010603) {
    if(!obj.chi_stype) {
        errors.push (''chi_stype'');
    }
}
if (obj.classid === 602010605) {
    if(!obj.al_stype) {
        errors.push (''al_stype'');
    }
    if(!obj.person_pd) {
        errors.push (''person_pd'');
    }
    if(!obj.one_time) {
        errors.push (''one_time'');
    }
    if(!obj.boat_count) {
        errors.push (''boat_count'');
    }
    if(!obj.seat_count) {
        errors.push (''seat_count'');
    }
}
if (obj.classid === 602010601 || obj.classid === 602010602 ||
    obj.classid === 602010603 || obj.classid === 602010604 || obj.classid === 602010605) {
    if(!obj.capacity) {
        errors.push (''capacity'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- authorityservice
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('authorityservice', 'var errors = [];
    if (obj.classid === 602010801) {
    if(!obj.ab_stype) {
        errors.push (''ab_stype'');
    }
}
if (obj.classid === 602010802) {
    if(!obj.cr_stype) {
        errors.push (''cr_stype'');
    }
}
if (obj.classid === 602010804) {
    if(!obj.trd_stype) {
        errors.push (''trd_stype'');
    }
    if(!obj.trd_area) {
        errors.push (''trd_area'');
    }
}
if (obj.classid === 602010805) {
    if(!obj.rs_stype) {
        errors.push (''rs_stype'');
    }
}
if (obj.classid === 602010806) {
    if(!obj.pu_stype) {
        errors.push (''pu_stype'');
    }
}
if (Number(obj.trd_stype) === 2) {
    if(!obj.trd_count) {
        errors.push (''trd_count'');
    }
}
if (Number(obj.trd_stype) === 3) {
    if(!obj.capacity) {
        errors.push (''capacity'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- public
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('public', 'var errors = [];
  if (obj.classid === 602010901) {
    if(!obj.tpark_type) {
        errors.push (''tpark_type'');
    }
}
if (obj.classid === 602010902) {
    if(!obj.pkio_type) {
        errors.push (''pkio_type'');
    }
}
if (obj.classid === 602010903) {
    if(!obj.ped_type) {
        errors.push (''ped_type'');
    }
}
if (obj.classid === 602010904) {
    if(!obj.aq_stype) {
        errors.push (''aq_stype'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- industry
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('industry', 'var errors = [];
if (obj.classid === 602020101 || obj.classid === 602020111) {
    if(!obj.mp_type) {
        errors.push (''mp_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- wastefacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('wastefacility', 'var errors = [];
  if (obj.classid === 602020401) {
    if(!obj.oro_number) {
        errors.push (''oro_number'');
    }
    if(!obj.oro_type) {
        errors.push (''oro_type'');
    }
    if(!obj.oro_stype) {
        errors.push (''oro_stype'');
    }
}
if (obj.classid === 602020402) {
    if(!obj.recyc_type) {
        errors.push (''recyc_type'');
    }
}
if (obj.classid === 602020403) {
    if(!obj.bur_type) {
        errors.push (''bur_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- railwayfacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('railwayfacility', 'var errors = [];
if (obj.classid === 602030201) {
    if(!obj.rst_type) {
        errors.push (''rst_type'');
    }
}
if (obj.classid === 602030201 || obj.classid === 602030202) {
    if(!obj.rst_class) {
        errors.push (''rst_class'');
    }
}
if (obj.classid === 602030205) {
    if(!obj.rfo_type) {
        errors.push (''rfo_type'');
    }
}
if (obj.classid === 602030201 || obj.classid === 602030202 || obj.classid === 602030204) {
    if(!obj.suburban_tr) {
        errors.push (''suburban_tr'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- road
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('road', 'var errors = [];
 if (Number(obj.status) === 1) {
    if(!obj.cat_exist) {
        errors.push (''cat_exist'');
    }
    if(!obj.surface_exist) {
        errors.push (''surface_exist'');
    }
}
if (Number(obj.status) === 2 || Number(obj.status) === 3) {
    if(!obj.cat_plan) {
        errors.push (''cat_plan'');
    }
    if(!obj.surface_plan) {
        errors.push (''surface_plan'');
    }
}
if (obj.classid === 602030302) {
    if(!obj.reg_rdtype) {
        errors.push (''reg_rdtype'');
    }
}
if (Number(obj.time_ltype) === 3) {
    if(!obj.rdwin_type) {
        errors.push (''rdwin_type'');
    }
    if(!obj.rdwin_cat) {
        errors.push (''rdwin_cat'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- street
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('street', 'var errors = [];
 if (obj.classid === 602030405) {
    if(!obj.str_r_type) {
        errors.push (''str_r_type'');
    }
}
if (obj.classid === 602030406) {
    if(!obj.str_l_type) {
        errors.push (''str_l_type'');
    }
}
if (Number(obj.status) === 1) {
    if(!obj.surface_exist) {
        errors.push (''surface_exist'');
    }
}
if (Number(obj.status) === 2 || Number(obj.status) === 3) {
    if(!obj.surface_plan) {
        errors.push (''surface_plan'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- streetv
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('streetv', 'var errors = [];
if (Number(obj.status) === 1) {
    if(!obj.surface_exist) {
        errors.push (''surface_exist'');
    }
}
if (Number(obj.status) === 2 || Number(obj.status) === 3) {
    if(!obj.surface_plan) {
        errors.push (''surface_plan'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- autoservice
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('autoservice', 'var errors = [];
 if (obj.classid === 602030901) {
    if(!obj.gas_st_type) {
        errors.push (''gas_st_type'');
    }
    if(!obj.fuel_count) {
        errors.push (''fuel_count'');
    }
}
if (obj.classid === 602030902) {
    if(!obj.post_count) {
        errors.push (''post_count'');
    }
}
if (obj.classid === 602030903) {
    if(!obj.prkng_type) {
        errors.push (''prkng_type'');
    }
    if(!obj.prkng_lvl) {
        errors.push (''prkng_lvl'');
    }
    if(!obj.prkng_time) {
        errors.push (''prkng_time'');
    }
    if(!obj.prkng_fls) {
        errors.push (''prkng_fls'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- publictransportstops
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('publictransportstops', 'var errors = [];
  if (obj.classid === 602031106) {
    if(!obj.stop_type) {
        errors.push (''stop_type'');
    }
}

return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- airtransportobj
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('airtransportobj', 'var errors = [];
if (obj.classid === 602031201 || obj.classid === 602031202 || obj.classid === 602031203 || obj.classid === 602031204) {
    if(!obj.avia_type) {
        errors.push (''avia_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- watertransportobj
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('watertransportobj', 'var errors = [];
if (obj.classid === 602031301 || obj.classid === 602031303 || obj.classid === 602031305) {
    if(!obj.pass_term) {
        errors.push (''pass_term'');
    }
    if(!obj.capacity) {
        errors.push (''capacity'');
    }
}
if (obj.classid === 602031306) {
    if(!obj.ferry_crgt) {
        errors.push (''ferry_crgt'');
    }
    if(!obj.ferry_mvt) {
        errors.push (''ferry_mvt'');
    }
}
if (obj.classid === 602031307) {
    if(!obj.yatch_cls) {
        errors.push (''yatch_cls'');
    }
}
if (obj.classid === 602031308) {
    if(!obj.sh_capacity) {
        errors.push (''sh_capacity'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- transportobj
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('transportobj', 'var errors = [];
if (obj.classid === 602031601) {
    if(!obj.bridge_t) {
        errors.push (''bridge_t'');
    }
}
if (obj.classid === 602031603) {
    if(!obj.tunnel_t) {
        errors.push (''tunnel_t'');
    }
}
if (obj.classid === 602031604) {
    if(!obj.crossp_t) {
        errors.push (''crossp_t'');
    }
}
if (obj.classid === 602031605) {
    if(!obj.crossr_t) {
        errors.push (''crossr_t'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- pipeline
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('pipeline', 'var errors = [];
 if (obj.classid === 602040503) {
    if(!obj.cat_main) {
        errors.push (''cat_main'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- thermalfacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('thermalfacility', 'var errors = [];
if (obj.classid === 602040801) {
    if(!obj.fuel_type) {
        errors.push (''fuel_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- waterfacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('waterfacility', 'var errors = [];
if (obj.classid === 602041101) {
    if(!obj.water_stype) {
        errors.push (''water_stype'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- waterpipeline
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('waterpipeline', 'var errors = [];
if (obj.classid === 602041201) {
    if(!obj.zone_size) {
        errors.push (''zone_size'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- sewerfacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('sewerfacility', 'var errors = [];
if (obj.classid === 602041306) {
    if(!obj.snow_type) {
        errors.push (''snow_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- telecomfacility
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('telecomfacility', 'var errors = [];
if (obj.classid === 602041602) {
    if(!obj.comm_сtype) {
        errors.push (''comm_сtype'');
    }
    if(!obj.cable_type) {
        errors.push (''cable_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- prison
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('prison', 'var errors = [];
  if (Number(obj.reg_status) !=== 1) {
    errors.push (''reg_status'');
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- emergencyprotectionobj
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('emergencyprotectionobj', 'var errors = [];
if (obj.classid === 602050202) {
    if(!obj.fp_type) {
        errors.push (''fp_type'');
    }
    if(!obj.fp_class) {
        errors.push (''fp_class'');
    }
    if(!obj.fe_count) {
        errors.push (''fe_count'');
    }
    if(!obj.w_source) {
        errors.push (''w_source'');
    }
}
if (obj.classid === 602050203) {
    if(!obj.fs_objects) {
        errors.push (''fs_objects'');
    }
}
if (obj.classid === 602050204) {
    if(!obj.d_objects) {
        errors.push (''d_objects'');
    }
}
if (obj.classid === 602050205) {
    if(!obj.s_alert) {
        errors.push (''s_alert'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- cemetery
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('cemetery', 'var errors = [];
if (obj.classid === 602020301) {
    if(!obj.cemet_type) {
        errors.push (''cemet_type'');
    }
    if(!obj.cemet_stype) {
        errors.push (''cemet_stype'');
    }
}
if (obj.classid === 602020302) {
    if(!obj.cemet_wtype) {
        errors.push (''cemet_wtype'');
    }
}
if (obj.classid === 602020301 || obj.classid == 602020302) {
    if(!obj.cemet_stat) {
        errors.push (''cemet_stat'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- floodarea
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('floodarea', 'var errors = [];
if (obj.classid === 603011401) {
    if(!obj.flooding_t) {
        errors.push (''flooding_t'');
    }
}
if (obj.classid === 603011402) {
    if(!obj.uderfl_t) {
        errors.push (''uderfl_t'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- otherzone
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('otherzone', 'var errors = [];
if (obj.classid === 603011702) {
    if(!obj.aeroszone) {
        errors.push (''aeroszone'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- heritage
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('heritage', 'var errors = [];
 if (obj.classid === 604010101) {
    if(!obj.her_type) {
        errors.push (''her_type'');
    }
}
if (obj.classid === 604010102) {
    if(!obj.ans_type) {
        errors.push (''ans_type'');
    }
}
if (obj.classid === 604010103 || obj.classid === 604010104) {
    if(!obj.status) {
        errors.push (''status'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- mineraldep
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('mineraldep', 'var errors = [];
if (obj.classid === 609010204) {
    if(!obj.min_mtype) {
        errors.push (''min_mtype'');
    }
}
if (obj.classid === 609010205) {
    if(!obj.min_ntype) {
        errors.push (''min_ntype'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- greeneryplanting
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('greeneryplanting', 'var errors = [];
 if (obj.classid === 705010500) {
    if(!obj.ozsn_type) {
        errors.push (''ozsn_type'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;

-- forest
INSERT INTO public.custom_rules (class_name, class_rule, group_, group_alias)
VALUES ('forest', 'var errors = [];
 if (obj.classid === 706010100) {
    if(!obj.forest_cat) {
        errors.push (''forest_cat'');
    }
    if(!obj.forest_os) {
        errors.push (''forest_os'');
    }
}
if (obj.classid === 706010100 && obj.forest_cat === 3) {
    if(!obj.forest_t) {
        errors.push (''forest_t'');
    }
}
if (obj.classid === 706010100 && obj.forest_cat === 4) {
    if(!obj.forest_val) {
        errors.push (''forest_val'');
    }
}
return errors;', NULL, NULL) ON CONFLICT DO NOTHING;
