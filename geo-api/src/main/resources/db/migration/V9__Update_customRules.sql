UPDATE public.custom_rules
    SET class_rule=NULL;

UPDATE public.custom_rules
    SET class_name='publictransportline_line'
    WHERE class_name='publictransport_line';

UPDATE public.custom_rules
    SET class_name='waterways_line'
    WHERE class_name='waterways';

DELETE FROM public.custom_rules
WHERE class_name= 'pipeline' OR class_name= 'industry' OR class_name= 'road'
    OR class_name= 'street' OR class_name= 'streetv' OR class_name= 'heritage';

-- education
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010102'') {
  if (!obj.edu_stype) {
    errors.push({attribute: ''edu_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.edu_stype) {
    errors.push({attribute: ''edu_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Общеобразовательная организация"''});
}

if (obj.classid == ''602010104'') {
  if (!obj.edu_sdtype) {
    errors.push({attribute: ''edu_sdtype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.edu_sdtype) {
    errors.push({attribute: ''edu_sdtype'', error: ''Значение заполняется только для объекта ' ||
     '"Организация, реализующая программы профессионального и высшего образования"''});
}

if (obj.classid == ''602010106'') {
  if (!obj.sci_type) {
    errors.push({attribute: ''sci_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.sci_type) {
    errors.push({attribute: ''sci_type'', error: ''Значение заполняется только для объекта ' ||
     '"Научная организация и ее структурные подразделения"''});
}

if (obj.classid == ''602010102'' || obj.classid == ''602010103'') {
  if (!obj.prg_type) {
    errors.push({attribute: ''prg_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.prg_type) {
    errors.push({attribute: ''prg_type'', error: ''Значение заполняется только для объектов ' ||
     '"Общеобразовательная организация", "Организация дополнительного образования"''});
}

if (!(obj.classid == ''602010104'')) {
  if (obj.edu_tunit) {
    errors.push({attribute: ''edu_tunit'', error: ''Значение заполняется только для объекта ' ||
     '"Организация, реализующая программы профессионального и высшего образования"''});
  }
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='education' OR class_name='education_point';

-- culture
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010201'') {
  if (!obj.cu_type) {
    errors.push({attribute: ''cu_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cu_type) {
    errors.push({attribute: ''cu_type'', error: ''Значение заполняется только для объекта ' ||
     '"Объект культурно-просветительного назначения"''});
}

if (obj.classid == ''602010202'') {
  if (!obj.clb_type) {
    errors.push({attribute: ''clb_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.clb_type) {
    errors.push({attribute: ''clb_type'', error: ''Значение заполняется только для объекта ' ||
     '"Объект культурно-досугового (клубного) типа"''});
}

if (obj.classid == ''602010203'') {
  if (!obj.ent_type) {
    errors.push({attribute: ''ent_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ent_type) {
    errors.push({attribute: ''ent_type'', error: ''Значение заполняется только для объекта "Зрелищная организация"''});
}

if (obj.classid == ''602010201'' || obj.classid == ''602010202'') {
  if (!obj.lb_stock) {
    errors.push({attribute: ''lb_stock'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.lb_stock) {
    errors.push({attribute: ''lb_stock'', error: ''Значение заполняется только для объектов ' ||
     '"Объект культурно-просветительного назначения", "Объект культурно-досугового (клубного) типа"''});
}

if (obj.classid == ''602010201'' || obj.classid == ''602010202'') {
  if (!obj.exb_area) {
    errors.push({attribute: ''exb_area'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.exb_area) {
    errors.push({attribute: ''exb_area'', error: ''Значение заполняется только для объектов ' ||
     '"Объект культурно-просветительного назначения", "Объект культурно-досугового (клубного) типа"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='culture' OR class_name='culture_point';

-- sport
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010302'') {
  if (!obj.af_type) {
    errors.push({attribute: ''af_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.af_type) {
    errors.push({attribute: ''af_type'', error: ''Значение заполняется только для объекта "Спортивное сооружение"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='sport' OR class_name='sport_point';

-- health
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010401'') {
  if (!obj.md_type) {
    errors.push({attribute: ''md_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cu_type) {
    errors.push({attribute: ''md_type'', error: ''Значение заполняется только для объекта ' ||
     '"Лечебно-профилактическая медицинская организация (кроме санаторно-курортной), оказывающая медицинскую ' ||
      'помощь в стационарных условиях, ее структурное подразделение"''});
}

if (obj.classid == ''602010402'') {
  if (!obj.amd_type) {
    errors.push({attribute: ''amd_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.amd_type) {
    errors.push({attribute: ''amd_type'', error: ''Значение заполняется только для объекта ' ||
     '"Лечебно-профилактическая медицинская организация, оказывающая медицинскую помощь в амбулаторных условиях ' ||
      'и (или) в условиях дневного стационара"''});
}

if (obj.classid == ''602010403'') {
  if (!obj.mst_type) {
    errors.push({attribute: ''mst_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.mst_type) {
    errors.push({attribute: ''mst_type'', error: ''Значение заполняется только для объекта ' ||
     '"Медицинская организация особого типа"''});
}

if (obj.classid == ''602010404'') {
  if (!obj.su_type) {
    errors.push({attribute: ''su_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.su_type) {
    errors.push({attribute: ''su_type'', error: ''Значение заполняется только для объекта ' ||
     '"Медицинская организация по надзору в сфере защиты прав потребителей и благополучия человека"''});
}

if (obj.classid == ''602010406'') {
  if (!obj.msd_type) {
    errors.push({attribute: ''msd_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.msd_type) {
    errors.push({attribute: ''msd_type'', error: ''Значение заполняется только для объекта ' ||
     '"Обособленное структурное подразделение медицинской организации, оказывающей первичную медико-санитарную помощь"''});
}

if (obj.classid == ''602010407'') {
  if (!obj.mc_type) {
    errors.push({attribute: ''mc_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.mc_type) {
    errors.push({attribute: ''mc_type'', error: ''Значение заполняется только для объекта ' ||
     '"Медицинская организация, оказывающая скорую медицинскую помощь, ее структурное подразделение"''});
}

if (obj.classid == ''602010401'' || obj.classid == ''602010402'' || obj.classid == ''602010406'') {
  if (!obj.capacity_s) {
    errors.push({attribute: ''capacity_s'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity_s) {
    errors.push({attribute: ''capacity_s'', error: ''Значение заполняется только для объектов ' ||
     '"Лечебно-профилактическая медицинская организация (кроме санаторно-курортной), оказывающая медицинскую ' ||
      'помощь в стационарных условиях, ее структурное подразделение", ' ||
       '"Лечебно-профилактическая медицинская организация, оказывающая медицинскую помощь в амбулаторных условиях ' ||
        'и (или) в условиях дневного стационара", "Обособленное структурное подразделение медицинской организации, ' ||
         'оказывающей первичную медико-санитарную помощь"''});
}
if (obj.classid == ''602010401'' || obj.classid == ''602010405'') {
  if (!obj.capacity24) {
    errors.push({attribute: ''capacity24'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity24) {
    errors.push({attribute: ''capacity24'', error: ''Значение заполняется только для объектов ' ||
     '"Лечебно-профилактическая медицинская организация (кроме санаторно-курортной), оказывающая медицинскую ' ||
      'помощь в стационарных условиях, ее структурное подразделение", ' ||
       '"Клиники научных и научно-исследовательских организаций, организаций профессионального образования"''});
}

if (!(obj.classid == ''602010401'' || obj.classid == ''602010402'' || obj.classid == ''602010405'')) {
  if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для объектов ' ||
     '"Лечебно-профилактическая медицинская организация (кроме санаторно-курортной), оказывающая медицинскую ' ||
      'помощь в стационарных условиях, ее структурное подразделение", ' ||
       '"Лечебно-профилактическая медицинская организация, оказывающая медицинскую помощь в амбулаторных условиях ' ||
        'и (или) в условиях дневного стационара", "Клиники научных и научно-исследовательских организаций, ' ||
         'организаций профессионального образования"''});
  }
}

if (obj.classid == ''602010401'' || obj.classid == ''602010402'' ||
    obj.classid == ''602010405'' || obj.classid == ''602010407'') {
  if (!obj.num_cars) {
    errors.push({attribute: ''num_cars'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.num_cars) {
    errors.push({attribute: ''num_cars'', error: ''Значение заполняется только для объектов ' ||
     '"Лечебно-профилактическая медицинская организация (кроме санаторно-курортной), оказывающая медицинскую ' ||
      'помощь в стационарных условиях, ее структурное подразделение", ' ||
       '"Лечебно-профилактическая медицинская организация, оказывающая медицинскую помощь в амбулаторных условиях ' ||
        'и (или) в условиях дневного стационара", ' ||
         '"Клиники научных и научно-исследовательских организаций, организаций профессионального образования", ' ||
          '"Медицинская организация, оказывающая скорую медицинскую помощь, ее структурное подразделение"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='health' OR class_name='health_point';

-- social
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010501'') {
  if (!obj.st_stype) {
    errors.push({attribute: ''st_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.st_stype) {
    errors.push({attribute: ''st_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Стационарные организации социального обслуживания"''});
}

if (obj.classid == ''602010502'') {
  if (!obj.sp_stype) {
    errors.push({attribute: ''sp_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.sp_stype) {
    errors.push({attribute: ''sp_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Комплексные, полустационарные и нестационарные организации социального обслуживания"''});
}

if (obj.classid == ''602010503'') {
  if (!obj.ssah_stype) {
    errors.push({attribute: ''ssah_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ssah_stype) {
    errors.push({attribute: ''ssah_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Организации (отделения) социального обслуживания на дому"''});
}

if (obj.classid == ''602010504'') {
  if (!obj.usa_stype) {
    errors.push({attribute: ''usa_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.usa_stype) {
    errors.push({attribute: ''usa_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Организации (отделения) срочного социального обслуживания, срочной социально-консультационной помощи"''});
}

if (obj.classid == ''602010501'' || obj.classid == ''602010502'') {
  if (!obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для объектов ' ||
     '"Стационарные организации социального обслуживания", ' ||
      '"Комплексные, полустационарные и нестационарные организации социального обслуживания"''});
}

if (obj.classid == ''602010501'' || obj.classid == ''602010503'') {
  if (!obj.person_ph) {
    errors.push({attribute: ''person_ph'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.person_ph) {
    errors.push({attribute: ''person_ph'', error: ''Значение заполняется только для объектов ' ||
     '"Стационарные организации социального обслуживания", "Организации (отделения) социального обслуживания на дому"''});
}

if (obj.classid == ''602010502'' || obj.classid == ''602010504'') {
  if (!obj.person_pd) {
    errors.push({attribute: ''person_pd'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.person_pd) {
    errors.push({attribute: ''person_pd'', error: ''Значение заполняется только для объектов ' ||
     '"Комплексные, полустационарные и нестационарные организации социального обслуживания", ' ||
      '"Организации (отделения) срочного социального обслуживания, срочной социально-консультационной помощи"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='social' OR class_name='social_point';

-- recreation
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010601'') {
  if (!obj.hot_stype) {
    errors.push({attribute: ''hot_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.hot_stype) {
    errors.push({attribute: ''hot_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Гостиницы и аналогичные коллективные средства размещения"''});
}

if (obj.classid == ''602010602'') {
  if (!obj.saf_stype) {
    errors.push({attribute: ''saf_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.saf_stype) {
    errors.push({attribute: ''saf_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Специализированные коллективные средства размещения"''});
}

if (obj.classid == ''602010603'') {
  if (!obj.chi_stype) {
    errors.push({attribute: ''chi_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.chi_stype) {
    errors.push({attribute: ''chi_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Детский оздоровительный лагерь"''});
}

if (obj.classid == ''602010605'') {
  if (!obj.al_stype) {
    errors.push({attribute: ''al_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.al_stype) {
    errors.push({attribute: ''al_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.classid == ''602010605'') {
  if (!obj.person_pd) {
    errors.push({attribute: ''person_pd'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.person_pd) {
    errors.push({attribute: ''person_pd'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.classid == ''602010605'') {
  if (!obj.one_time) {
    errors.push({attribute: ''one_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.one_time) {
    errors.push({attribute: ''one_time'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.classid == ''602010605'') {
  if (!obj.boat_count) {
    errors.push({attribute: ''boat_count'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.boat_count) {
    errors.push({attribute: ''boat_count'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.classid == ''602010605'') {
 if (!obj.seat_count) {
    errors.push({attribute: ''seat_count'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.seat_count) {
    errors.push({attribute: ''seat_count'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.classid == ''602010601'' || obj.classid == ''602010602'' ||
    obj.classid == ''602010603'' || obj.classid == ''602010604'' ||
    obj.classid == ''602010605'') {
  if (!obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для объектов ' ||
     '"Гостиницы и аналогичные коллективные средства размещения", ' ||
      '"Специализированные коллективные средства размещения", "Детский оздоровительный лагерь", ' ||
       '"Оздоровительно-спортивный лагерь", "Объекты физкультурно-досугового назначения и активного отдыха"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='recreation' OR class_name='recreation_point';

-- resort
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='resort' OR class_name='resort_point';

-- authorityservice
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010801'') {
  if (!obj.ab_stype) {
    errors.push({attribute: ''ab_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ab_stype) {
    errors.push({attribute: ''ab_stype'', error: ''Значение заполняется только для объекта "Административное здание"''});
}

if (obj.classid == ''602010802'') {
  if (!obj.cr_stype) {
    errors.push({attribute: ''cr_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cr_stype) {
    errors.push({attribute: ''cr_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Объект проведения гражданских обрядов"''});
}

if (obj.classid == ''602010804'') {
  if (!obj.trd_stype) {
    errors.push({attribute: ''trd_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.trd_stype) {
    errors.push({attribute: ''trd_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты торговли, общественного питания"''});
}

if (obj.classid == ''602010804'') {
  if (!obj.trd_area) {
    errors.push({attribute: ''trd_area'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.trd_area) {
    errors.push({attribute: ''trd_area'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты торговли, общественного питания"''});
}

if (obj.classid == ''602010805'') {
  if (!obj.rs_stype) {
    errors.push({attribute: ''rs_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.rs_stype) {
    errors.push({attribute: ''rs_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Непроизводственный объект по предоставлению населению правовых, финансовых, консультационных и иных подобных услуг"''});
}

if (obj.classid == ''602010806'') {
  if (!obj.pu_stype) {
    errors.push({attribute: ''pu_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.pu_stype) {
    errors.push({attribute: ''pu_stype'', error: ''Значение заполняется только для объекта ' ||
     '"Непроизводственные объекты коммунально-бытового обслуживания и предоставления персональных услуг"''});
}

if (obj.trd_stype == ''2'') {
  if (!obj.trd_count) {
    errors.push({attribute: ''trd_count'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.trd_count) {
    errors.push({attribute: ''trd_count'', error: ''Значение заполняется только для подтипа объекта "Рыночный комплекс"''});
}

if (obj.trd_stype == ''3'') {
  if (!obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для подтипа объекта "Объект общественного питания"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='authorityservice' OR class_name='authorityservice_point';

-- public
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010901'') {
  if (!obj.tpark_type) {
    errors.push({attribute: ''tpark_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.tpark_type) {
    errors.push({attribute: ''tpark_type'', error: ''Значение заполняется только для объекта "Тематический парк"''});
}

if (obj.classid == ''602010902'') {
  if (!obj.pkio_type) {
    errors.push({attribute: ''pkio_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.pkio_type) {
    errors.push({attribute: ''pkio_type'', error: ''Значение заполняется только для объекта "Парк культуры и отдыха"''});
}

if (obj.classid == ''602010903'') {
  if (!obj.ped_type) {
    errors.push({attribute: ''ped_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ped_type) {
    errors.push({attribute: ''ped_type'', error: ''Значение заполняется только для объекта "Пешеходная зона"''});
}

if (obj.classid == ''602010904'') {
  if (!obj.aq_type) {
    errors.push({attribute: ''aq_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.aq_type) {
    errors.push({attribute: ''aq_type'', error: ''Значение заполняется только для объекта "Благоустроенный пляж, место массовой околоводной рекреации"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='public' OR class_name='public_point';

-- manufacturing
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602010901'') {
  if (!obj.tpark_type) {
    errors.push({attribute: ''tpark_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.tpark_type) {
    errors.push({attribute: ''tpark_type'', error: ''Значение заполняется только для объекта "Тематический парк"''});
}

if (!(obj.classid == ''602020101'' || obj.classid == ''602020111'')) {
  if (obj.mp_type) {
    errors.push({attribute: ''mp_type'', error: ''Значение заполняется только для объектов ' ||
     '"Предприятие добывающей промышленности (кроме угледобывающей промышленности)", ' ||
      '"Предприятие угледобывающей промышленности"''});
  }
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='manufacturing' OR class_name='manufacturing_point';

-- agriculture
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='agriculture' OR class_name='agriculture_point';

-- servicefacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='servicefacility' OR class_name='servicefacility_point';

-- wastefacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602020401'') {
  if (!obj.oro_number) {
    errors.push({attribute: ''oro_number'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.oro_number) {
    errors.push({attribute: ''oro_number'', error: ''Значение заполняется только для объекта "Объект размещения отходов"''});
}

if (obj.classid == ''602020401'') {
  if (!obj.oro_type) {
    errors.push({attribute: ''oro_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.oro_type) {
    errors.push({attribute: ''oro_type'', error: ''Значение заполняется только для объекта "Объект размещения отходов"''});
}

if (obj.classid == ''602020401'') {
  if (!obj.oro_stype) {
    errors.push({attribute: ''oro_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.oro_stype) {
    errors.push({attribute: ''oro_stype'', error: ''Значение заполняется только для объекта "Объект размещения отходов"''});
}

if (obj.classid == ''602020402'') {
  if (!obj.recyc_type) {
    errors.push({attribute: ''recyc_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.recyc_type) {
    errors.push({attribute: ''recyc_type'', error: ''Значение заполняется только для объекта "Объект по обработке, ' ||
     'утилизации, обезвреживанию отходов"''});
}

if (obj.classid == ''602020403'') {
  if (!obj.bur_type) {
    errors.push({attribute: ''bur_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.bur_type) {
    errors.push({attribute: ''bur_type'', error: ''Значение заполняется только для объекта "Объект утилизации, уничтожения биологических отходов"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='wastefacility' OR class_name='wastefacility_point';

-- railwayline_line
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='railwayline_line';

-- railwayfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.classid == ''602030201'')) {
  if (obj.rst_type) {
    errors.push({attribute: ''rst_type'', error: ''Значение заполняется только для объекта "Железнодорожная станция"''});
  }
}

if (!(obj.classid == ''602030201'' || obj.classid == ''602030202'')) {
  if (obj.rst_class) {
    errors.push({attribute: ''rst_class'', error: ''Значение заполняется только для объектов "Железнодорожная станция",' ||
     '"Железнодорожный вокзал"''});
  }
}

if (!(obj.classid == ''602030205'')) {
  if (obj.rfo_type) {
    errors.push({attribute: ''rfo_type'', error: ''Значение заполняется только для объекта "Иные объекты ' ||
     'железнодорожного транспорта"''});
  }
}

if (!(obj.classid == ''602030201'' || obj.classid == ''602030202'' || obj.classid == ''602030204'')) {
  if (obj.suburban_tr) {
    errors.push({attribute: ''suburban_tr'', error: ''Значение заполняется только для объектов "Железнодорожная станция", ' ||
     '"Железнодорожный вокзал", "Остановочный пассажирский железнодорожный пункт"''});
  }
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='railwayfacility' OR class_name='railwayfacility_point';

-- road
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602030302'') {
  if (!obj.reg_rdtype) {
    errors.push({attribute: ''reg_rdtype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.reg_rdtype) {
    errors.push({attribute: ''reg_rdtype'', error: ''Значение заполняется только для объекта "Автомобильные дороги ' ||
     'регионального или межмуниципального значения"''});
}

if (!(obj.time_ltype == ''3'')) {
  if (obj.rdwin_type) {
    errors.push({attribute: ''rdwin_type'', error: ''Значение заполняется только для подтипа объекта "Зимняя ' ||
     'автомобильная дорога (автозимник)"''});
  }
}

if (!(obj.time_ltype == ''3'')) {
  if (obj.rdwin_cat) {
    errors.push({attribute: ''rdwin_cat'', error: ''Значение заполняется только для подтипа объекта "Зимняя ' ||
     'автомобильная дорога (автозимник)"''});
  }
}

if (obj.status == ''1'') {
  if (!obj.cat_exist) {
    errors.push({attribute: ''cat_exist'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cat_exist) {
    errors.push({attribute: ''cat_exist'', error: ''Значение заполняется только для существующих объектов''});
}

if (obj.status == ''1'') {
  if (!obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение заполняется только для существующих объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'') {
  if (!obj.cat_plan) {
    errors.push({attribute: ''cat_plan'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cat_plan) {
    errors.push({attribute: ''cat_plan'', error: ''Значение заполняется только для планируемых к размещению или '' ||
     ''планируемых к реконструкции объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'') {
  if (!obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение заполняется только для планируемых к размещению или '' ||
     ''планируемых к реконструкции объектов''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='road_line';

-- street
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602030405'') {
  if (!obj.str_r_type) {
    errors.push({attribute: ''str_r_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.str_r_type) {
    errors.push({attribute: ''str_r_type'', error: ''Значение заполняется только для объекта "Магистральная улица ' ||
     'районного значения"''});
}

if (obj.classid == ''602030406'') {
  if (!obj.str_l_type) {
    errors.push({attribute: ''str_l_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.str_l_type) {
    errors.push({attribute: ''str_l_type'', error: ''Значение заполняется только для объекта "Улицы и дороги местного ' ||
     'значения"''});
}

if (obj.status == ''1'') {
  if (!obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение заполняется только для существующих объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'') {
  if (!obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение заполняется только для планируемых к размещению или '' ||
     ''планируемых к реконструкции объектов''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='street_line';

-- streetv
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''1'') {
  if (!obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_exist) {
    errors.push({attribute: ''surface_exist'', error: ''Значение заполняется только для существующих объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'') {
  if (!obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.surface_plan) {
    errors.push({attribute: ''surface_plan'', error: ''Значение заполняется только для планируемых к размещению или '' ||
     ''планируемых к реконструкции объектов''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='streetv_line';

-- transplogisticobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='transplogisticobj' OR class_name='transplogisticobj_point';

-- publictransportobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='publictransportobj' OR class_name='publictransportobj_point';

-- publictransportservice
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='publictransportservice' OR class_name='publictransportservice_point';

-- autoservice
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602030901'') {
  if (!obj.gas_st_type) {
    errors.push({attribute: ''gas_st_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.gas_st_type) {
    errors.push({attribute: ''gas_st_type'', error: ''Значение заполняется только для объекта "Станция автозаправочная"''});
}

if (obj.classid == ''602030901'') {
  if (!obj.fuel_count) {
    errors.push({attribute: ''fuel_count'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fuel_count) {
    errors.push({attribute: ''fuel_count'', error: ''Значение заполняется только для объекта "Станция автозаправочная"''});
}

if (obj.classid == ''602030902'') {
  if (!obj.post_count) {
    errors.push({attribute: ''post_count'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.post_count) {
    errors.push({attribute: ''post_count'', error: ''Значение заполняется только для объекта "Станция технического ' ||
     'обслуживания"''});
}

if (obj.classid == ''602030903'') {
  if (!obj.prkng_type) {
    errors.push({attribute: ''prkng_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.prkng_type) {
    errors.push({attribute: ''prkng_type'', error: ''Значение заполняется только для объекта "Стоянка (парковка) ' ||
     'автомобилей"''});
}

if (obj.classid == ''602030903'') {
  if (!obj.prkng_lvl) {
    errors.push({attribute: ''prkng_lvl'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.prkng_lvl) {
    errors.push({attribute: ''prkng_lvl'', error: ''Значение заполняется только для объекта "Стоянка (парковка) ' ||
     'автомобилей"''});
}

if (obj.classid == ''602030903'') {
  if (!obj.prkng_time) {
    errors.push({attribute: ''prkng_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.prkng_time) {
    errors.push({attribute: ''prkng_time'', error: ''Значение заполняется только для объекта "Стоянка (парковка) ' ||
     'автомобилей"''});
}

if (obj.classid == ''602030903'') {
  if (!obj.prkng_fls) {
    errors.push({attribute: ''prkng_fls'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.prkng_fls) {
    errors.push({attribute: ''prkng_fls'', error: ''Значение заполняется только для объекта "Стоянка (парковка) ' ||
     'автомобилей"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='autoservice' OR class_name='autoservice_point';

-- publictransportline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='publictransportline_line';

-- publictransportstops
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602031106'') {
  if (!obj.stop_type) {
    errors.push({attribute: ''stop_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.stop_type) {
    errors.push({attribute: ''stop_type'', error: ''Значение заполняется только для объекта "Остановочный пункт"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='publictransportstops' OR class_name='publictransportstops_point';

-- airtransportobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.classid == ''602031201'' || obj.classid == ''602031202'' || obj.classid == ''602031203'' || obj.classid == ''602031204'')) {
  if (obj.rdwin_type) {
    errors.push({attribute: ''rdwin_type'', error: ''Значение заполняется только для объектов ' ||
     '"Международный аэропорт", "Аэропорт", "Аэродром", "Вертодром"''});
  }
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='airtransportobj' OR class_name='airtransportobj_point';

-- watertransportobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602031301'' || obj.classid == ''602031303'' || obj.classid == ''602031305'') {
  if (!obj.pass_term) {
    errors.push({attribute: ''pass_term'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.pass_term) {
    errors.push({attribute: ''pass_term'', error: ''Значение заполняется только для объектов ' ||
     '"Морской порт и (или) морской терминал", "Речной порт", "Причал"''});
}

if (obj.classid == ''602031301'' || obj.classid == ''602031303'' || obj.classid == ''602031305'') {
  if (!obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для объектов ' ||
     '"Морской порт и (или) морской терминал", "Речной порт", "Причал"''});
}

if (obj.classid == ''602031306'') {
  if (!obj.ferry_crgt) {
    errors.push({attribute: ''ferry_crgt'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ferry_crgt) {
    errors.push({attribute: ''ferry_crgt'', error: ''Значение заполняется только для объекта "Паромная переправа"''});
}

if (obj.classid == ''602031306'') {
  if (!obj.ferry_mvt) {
    errors.push({attribute: ''ferry_mvt'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ferry_mvt) {
    errors.push({attribute: ''ferry_mvt'', error: ''Значение заполняется только для объекта "Паромная переправа"''});
}

if (obj.classid == ''602031307'') {
  if (!obj.yatch_cls) {
    errors.push({attribute: ''yatch_cls'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.yatch_cls) {
    errors.push({attribute: ''yatch_cls'', error: ''Значение заполняется только для объекта ' ||
     '"Место стоянки маломерных, спортивных парусных и прогулочных судов"''});
}

if (obj.classid == ''602031308'') {
  if (!obj.sh_capacity) {
    errors.push({attribute: ''sh_capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.sh_capacity) {
    errors.push({attribute: ''sh_capacity'', error: ''Значение заполняется только для объекта ' ||
     '"Судоходные гидротехнические сооружения внутренних водных путей"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='watertransportobj' OR class_name='watertransportobj_point';

-- waterways
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='waterways_line';

-- customcontrol
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='customcontrol' OR class_name='customcontrol_point';

-- transportobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602031601'') {
  if (!obj.bridge_t) {
    errors.push({attribute: ''bridge_t'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.bridge_t) {
    errors.push({attribute: ''bridge_t'', error: ''Значение заполняется только для объекта "Мостовое сооружение"''});
}

if (obj.classid == ''602031603'') {
  if (!obj.tunnel_t) {
    errors.push({attribute: ''tunnel_t'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.tunnel_t) {
    errors.push({attribute: ''tunnel_t'', error: ''Значение заполняется только для объекта "Тоннель"''});
}

if (obj.classid == ''602031605'') {
  if (!obj.crossr_t) {
    errors.push({attribute: ''crossr_t'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.crossr_t) {
    errors.push({attribute: ''crossr_t'', error: ''Значение заполняется только для объекта "Железнодорожный переезд"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='transportobj' OR class_name='transportobj_point' OR class_name='transportobj_line';

-- electricpowerstation
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='electricpowerstation' OR class_name='electricpowerstation_point';

-- electricline_line
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='electricline_line';

-- pipeline_line
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.classid == ''602040403'')) {
  if (obj.cat_main) {
    errors.push({attribute: ''cat_main'', error: ''Значение заполняется только для объекта "Мостовое сооружение"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='pipeline_line';

-- gasfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='gasfacility' OR class_name='gasfacility_point';

-- gaspipeline_line
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='gaspipeline_line';

-- oilfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='oilfacility' OR class_name='oilfacility_point';

-- oilpipeline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='oilpipeline_line';

-- thermalfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602040901'') {
  if (!obj.fuel_type) {
    errors.push({attribute: ''fuel_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fuel_type) {
    errors.push({attribute: ''fuel_type'', error: ''Значение заполняется только для объекта "Источник тепловой энергии"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='thermalfacility' OR class_name='thermalfacility_point';

-- thermalpipeline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='thermalpipeline_line';

-- waterfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602041101'') {
  if (!obj.water_stype) {
    errors.push({attribute: ''water_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.water_stype) {
    errors.push({attribute: ''water_stype'', error: ''Значение заполняется только для объекта "Водозабор"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='waterfacility' OR class_name='waterfacility_point';

-- waterpipeline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602041201'') {
  if (!obj.zone_size) {
    errors.push({attribute: ''zone_size'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.zone_size) {
    errors.push({attribute: ''zone_size'', error: ''Значение заполняется только для объекта "Водовод"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='waterpipeline_line';

-- sewerfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602041306'') {
  if (!obj.snow_type) {
    errors.push({attribute: ''snow_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.snow_type) {
    errors.push({attribute: ''snow_type'', error: ''Значение заполняется только для объекта "Снегоплавильный, ' ||
     'снегоприемный пункт"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='sewerfacility' OR class_name='sewerfacility_point';

-- sewerpipeline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='sewerpipeline_line';

-- telecomfacility
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602041501'') {
  if (!obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.capacity) {
    errors.push({attribute: ''capacity'', error: ''Значение заполняется только для объекта ' ||
     '"Автоматическая телефонная станция"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='telecomfacility' OR class_name='telecomfacility_point';

-- telecomnetworkline
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602041602'') {
  if (!obj.comm_ctype) {
    errors.push({attribute: ''comm_ctype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.comm_ctype) {
    errors.push({attribute: ''comm_ctype'', error: ''Значение заполняется только для объекта ' ||
     '"Линейно-кабельное сооружение связи"''});
}

if (obj.classid == ''602041602'') {
  if (!obj.cable_type) {
    errors.push({attribute: ''cable_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cable_type) {
    errors.push({attribute: ''cable_type'', error: ''Значение заполняется только для объекта ' ||
     '"Линейно-кабельное сооружение связи"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='telecomnetworkline_line';

-- hydraulicstructures
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='hydraulicstructures_point' OR class_name='hydraulicstructures_line';

-- engprotectionobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='engprotectionobj_point' OR class_name='engprotectionobj_line';

-- prison
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='prison_point' OR class_name='prison';

-- emergencyprotectionobj
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602050202'') {
  if (!obj.fp_type) {
    errors.push({attribute: ''fp_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fp_type) {
    errors.push({attribute: ''fp_type'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты обеспечения пожарной безопасности"''});
}

if (obj.classid == ''602050202'') {
  if (!obj.fp_class) {
    errors.push({attribute: ''fp_class'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fp_class) {
    errors.push({attribute: ''fp_class'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты обеспечения пожарной безопасности"''});
}

if (obj.classid == ''602050202'') {
  if (!obj.fe_coun) {
    errors.push({attribute: ''fe_coun'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fe_coun) {
    errors.push({attribute: ''fe_coun'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты обеспечения пожарной безопасности"''});
}

if (obj.classid == ''602050202'') {
  if (!obj.w_source) {
    errors.push({attribute: ''w_source'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.w_source) {
    errors.push({attribute: ''w_source'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты обеспечения пожарной безопасности"''});
}

if (obj.classid == ''602050203'') {
  if (!obj.fs_objects) {
    errors.push({attribute: ''fs_objects'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fs_objects) {
    errors.push({attribute: ''fs_objects'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты лесопожарной охраны"''});
}

if (obj.classid == ''602050204'') {
  if (!obj.d_objects) {
    errors.push({attribute: ''d_objects'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.d_objects) {
    errors.push({attribute: ''d_objects'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты мониторинга и прогнозирования"''});
}

if (obj.classid == ''602050205'') {
  if (!obj.s_alert) {
    errors.push({attribute: ''s_alert'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.s_alert) {
    errors.push({attribute: ''s_alert'', error: ''Значение заполняется только для объекта ' ||
     '"Объекты информирования и оповещения"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='emergencyprotectionobj' OR class_name='emergencyprotectionobj_point';

-- cemetery
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''602050301'') {
  if (!obj.cemet_type) {
    errors.push({attribute: ''cemet_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cemet_type) {
    errors.push({attribute: ''cemet_type'', error: ''Значение заполняется только для объекта "Кладбище"''});
}

if (obj.classid == ''602050301'') {
  if (!obj.cemet_stype) {
    errors.push({attribute: ''cemet_stype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cemet_stype) {
    errors.push({attribute: ''cemet_stype'', error: ''Значение заполняется только для объекта "Кладбище"''});
}

if (obj.classid == ''602050302'') {
  if (!obj.cemet_wtype) {
    errors.push({attribute: ''cemet_wtype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cemet_wtype) {
    errors.push({attribute: ''cemet_wtype'', error: ''Значение заполняется только для объекта ' ||
     '"Воинское кладбище, военное мемориальное кладбище"''});
}

if (obj.classid == ''602050301'' || obj.classid == ''602050302'') {
  if (!obj.cemet_stat) {
    errors.push({attribute: ''cemet_stat'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.cemet_stat) {
    errors.push({attribute: ''cemet_stat'', error: ''Значение заполняется только для объектов ' ||
     '"Кладбище", "Воинское кладбище, военное мемориальное кладбище"''});
}

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='cemetery' OR class_name='cemetery_point';

-- envmonitoring
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='envmonitoring' OR class_name='envmonitoring_point';

-- wildlifeprotection
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='wildlifeprotection' OR class_name='wildlifeprotection_point';

-- otherobject
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='otherobject' OR class_name='otherobject_point';

-- floodarea
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''603011401'') {
  if (!obj.flooding_t) {
    errors.push({attribute: ''flooding_t'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.flooding_t) {
    errors.push({attribute: ''flooding_t'', error: ''Значение заполняется только для объекта "Зона затопления"''});
}

if (obj.classid == ''603011402'') {
  if (!obj.uderfl_t) {
    errors.push({attribute: ''uderfl_t'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.uderfl_t) {
    errors.push({attribute: ''uderfl_t'', error: ''Значение заполняется только для объекта "Зона подтопления"''});
}

return errors;'
    WHERE class_name='floodarea';

-- otherzone
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''603011702'') {
  if (!obj.aeroszone) {
    errors.push({attribute: ''aeroszone'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.aeroszone) {
    errors.push({attribute: ''aeroszone'', error: ''Значение заполняется только для объекта "Приаэродромная территория"''});
}

return errors;'
    WHERE class_name='otherzone';

-- heritage_point
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''604010101'') {
  if (!obj.her_type) {
    errors.push({attribute: ''her_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.her_type) {
    errors.push({attribute: ''her_type'', error: ''Значение заполняется только для объекта "Памятник"''});
}

if (obj.classid == ''604010102'') {
  if (!obj.ans_type) {
    errors.push({attribute: ''ans_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ans_type) {
    errors.push({attribute: ''ans_type'', error: ''Значение заполняется только для объекта "Ансамбль"''});
}

if (!(obj.classid == ''604010103'' || obj.classid == ''604010104'')) {
 if (obj.status) {
    errors.push({attribute: ''status'', error: ''Значение заполняется только для объектов ' ||
     '"Достопримечательное место", "Историко-культурный заповедник"''});
}

return errors;'
    WHERE class_name='heritage_point';

-- natureprotectarea
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='natureprotectarea' OR class_name='natureprotectarea_point';

-- specialeconomicarea
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='specialeconomicarea';

-- mineraldep
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''609010204'') {
  if (!obj.min_mtype) {
    errors.push({attribute: ''min_mtype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.min_mtype) {
    errors.push({attribute: ''min_mtype'', error: ''Значение заполняется только для объекта ' ||
     '"Месторождения металлических полезных ископаемых"''});
}

if (obj.classid == ''609010205'') {
  if (!obj.min_ntype) {
    errors.push({attribute: ''min_ntype'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.min_mtype) {
    errors.push({attribute: ''min_ntype'', error: ''Значение заполняется только для объекта ' ||
     '"Месторождения неметаллических полезных ископаемых"''});
}

return errors;'
    WHERE class_name='mineraldep' OR class_name='mineraldep_point';

-- functionalzone
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''701010301'') {
  if (!obj.fz_mfstp) {
    errors.push({attribute: ''fz_mfstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_mfstp) {
  errors.push({attribute: ''fz_mfstp'', error: ''Значение заполняется только для объекта '' ||
     ''"Многофункциональная общественно-деловая зона"''});
}

if (obj.classid == ''701010302'') {
  if (!obj.fz_odstp) {
    errors.push({attribute: ''fz_odstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_odstp) {
  errors.push({attribute: ''fz_odstp'', error: ''Значение заполняется только для объекта '' ||
     ''"Зона специализированной общественной застройки"''});
}

if (obj.classid == ''701010404'') {
  if (!obj.fz_ingstp) {
    errors.push({attribute: ''fz_ingstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_ingstp) {
  errors.push({attribute: ''fz_ingstp'', error: ''Значение заполняется только для объекта ' ||
   '"Зона инженерной инфраструктуры"''});
}

if (obj.classid == ''701010405'') {
  if (!obj.fz_trstp) {
    errors.push({attribute: ''fz_trstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_trstp) {
  errors.push({attribute: ''fz_trstp'', error: ''Значение заполняется только для объекта ' ||
   '"Зона транспортной инфраструктуры"''});
}

if (obj.classid == ''701010504'') {
  if (!obj.fz_shstp) {
    errors.push({attribute: ''fz_shstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_shstp) {
  errors.push({attribute: ''fz_shstp'', error: ''Значение заполняется только для объекта ' ||
   '"Иные зоны сельскохозяйственного назначения"''});
}

if (obj.classid == ''701010602'') {
  if (!obj.fz_recstp) {
    errors.push({attribute: ''fz_recstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_recstp) {
  errors.push({attribute: ''fz_recstp'', error: ''Значение заполняется только для объекта "Зона отдыха"''});
}

if (obj.classid == ''701010606'') {
  if (!obj.fz_orecstp) {
    errors.push({attribute: ''fz_orecstp'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.fz_orecstp) {
  errors.push({attribute: ''fz_orecstp'', error: ''Значение заполняется только для объекта "Иные рекреационные зоны"''});
}

if (!(obj.classid == 701010100 || obj.classid == 701010101 ||
      obj.classid == 701010102 || obj.classid == 701010103 ||
      obj.classid == 701010104 || obj.classid == 701010200 ||
      obj.classid == 701010300 || obj.classid == 701010301 ||
      obj.classid == 701010302 || obj.classid == 701010303)) {
  if (obj.pop_den) {
    errors.push({attribute: ''pop_den'', error: ''Параметр должен быть не заполнен''});
  }

if (!(obj.classid == 701010100 || obj.classid == 701010101 ||
      obj.classid == 701010102 || obj.classid == 701010103 ||
      obj.classid == 701010104 || obj.classid == 701010200 ||
      obj.classid == 701010300 || obj.classid == 701010301 ||
      obj.classid == 701010302 || obj.classid == 701010303)) {
  if (obj.population) {
    errors.push({attribute: ''population'', error: ''Значение заполняется только для объекта "Жилые зоны", ' ||
     '"Зона застройки индивидуальными жилыми домами", ' ||
      '"Зона застройки малоэтажными жилыми домами (до 4 этажей, включая мансардный)", ' ||
       '"Зона застройки среднеэтажными жилыми домами (от 5 до 8 этажей, включая мансардный)", ' ||
        '"Зона застройки многоэтажными жилыми домами (9 этажей и более)", ' ||
         '"Зона смешанной и общественно-деловой застройки", "Общественно-деловые зоны", ' ||
          '"Многофункциональная общественно-деловая зона", "Зона специализированной общественной застройки", ' ||
           '"Зона исторической застройки"''});
  }
}

if (obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'') {
  if (!obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.event_time) {
  errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
   'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

if (obj.status == ''2'') {
  if (!obj.reg_status) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.reg_status) {
  errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых функциональных зон''});
}

return errors;'
    WHERE class_name='functionalzone';

-- resortarea
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.status == ''2'') {
  if (!obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.function) {
    errors.push({attribute: ''reg_status'', error: ''Значение заполняется только для планируемых к размещению объектов''});
}

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='resortarea' OR class_name='resortarea_point';

-- traditionalarea
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='traditionalarea';

-- investmentzone
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='investmentzone';

-- areabasedevelopment
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='areabasedevelopment';

-- greeneryplanting
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (obj.classid == ''705010500'') {
  if (!obj.ozsn_type) {
    errors.push({attribute: ''ozsn_type'', error: ''Значение обязательно к заполнению''});
  }
} else if (obj.ozsn_type) {
  errors.push({attribute: ''ozsn_type'', error: ''Значение заполняется только для объекта ' ||
   '"Озелененные территории специального назначения"''});
}

return errors;'
    WHERE class_name='greeneryplanting';

-- forest
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.classid == ''706010100'')) {
  if (obj.forest_cat) {
  errors.push({attribute: ''forest_cat'', error: ''Значение заполняется только для объекта "Леса защитные"''});
}

if (!(obj.classid == ''706010100'')) {
  if (obj.forest_os) {
  errors.push({attribute: ''forest_os'', error: ''Значение заполняется только для объекта "Леса защитные"''});
}

if (!(obj.classid == ''706010100'' && obj.forest_cat  == ''3'')) {
  if (obj.forest_t) {
  errors.push({attribute: ''forest_t'', error: ''Значение заполняется только для объекта ' ||
   '"Леса защитные" и защитных лесов, выполняющих функции защиты природных и иных объектов''});
}

if (!(obj.classid == ''706010100'' && obj.forest_cat  == ''4'')) {
  if (obj.forest_val) {
  errors.push({attribute: ''forest_val'', error: ''Значение заполняется только для объекта ' ||
   '"Леса защитные" и защитных лесов, ценных лесов ''});
}

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='forest';

-- hydro
UPDATE public.custom_rules
    SET class_rule='var errors = [];

if (!(obj.status == ''2'' || obj.status == ''3'' || obj.status == ''4'')) {
  if (obj.event_time) {
    errors.push({attribute: ''event_time'', error: ''Значение заполняется только для планируемых к размещению, ' ||
     'планируемых к реконструкции или планируемых к ликвидации (сносу) объектов''});
}

return errors;'
    WHERE class_name='hydro' OR class_name='hydro_point' OR class_name='hydro_line';