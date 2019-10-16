UPDATE public.custom_rules SET calculated_fields='var results = {};

var status;
if (!obj.status) {
  status = 0;
} else {
  var nStatus = Number(obj.status);
  if (!nStatus) {
    status = 0;
  } else {
    if (nStatus > 0 && nStatus <= 4) {
      status = obj.status;
    } else {
      status = 0;
    }
  }
}

if (!obj.classid) {
  results.ruleid = '''';
} else {
  results.ruleid = obj.classid + ''0'' + status;
}

return results;
';

UPDATE public.custom_rules SET calculated_fields='var results = {};

var regStatus;
if (!obj.reg_status) {
  regStatus = 0;
} else {
  var nRegStatus = Number(obj.reg_status);
  if (!nRegStatus) {
    regStatus = 0;
  } else {
    if (nRegStatus < 1 || nRegStatus > 6) {
      regStatus = 0;
    } else if (nRegStatus > 3) {
      regStatus = 3;
    } else {
      regStatus = nRegStatus;
    }
  }
}

var status;
if (!obj.status) {
  status = 0;
} else {
  var nStatus = Number(obj.status);
  if (!nStatus) {
    status = 0;
  } else {
    if (nStatus > 0 && nStatus <= 4) {
      status = obj.status;
    } else {
      status = 0;
    }
  }
}

if (!obj.classid) {
  results.ruleid = '''';
} else {
  results.ruleid = String(obj.classid) + regStatus + status;
}

return results;
' WHERE class_name LIKE '%_point';
