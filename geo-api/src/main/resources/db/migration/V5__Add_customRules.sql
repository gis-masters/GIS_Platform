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
