import { FilterQuery, FilterQueryValue } from './filters.models';

export function getFieldFilterValue(
  filter: FilterQuery,
  field: string | undefined
): FilterQueryValue | FilterQuery | FilterQuery[] | undefined {
  if (!field) {
    return;
  }
  if (Array.isArray(filter.$and)) {
    const entry: FilterQuery | undefined = (filter.$and as FilterQuery[]).find(
      filterEntry => filterEntry[field] !== undefined
    );

    if (entry) {
      return entry[field];
    }
  }

  return filter[field];
}

export function getFieldFilterPart(filter: FilterQuery, field: string): FilterQuery | undefined {
  const [and, index] = getFilterRootAnd(filter, field);
  if (index !== -1) {
    const entry: FilterQuery | undefined = and.find(
      filterEntry =>
        filterEntry[field] !== undefined ||
        (filterEntry.$or && (filterEntry.$or as FilterQuery[])[0] && (filterEntry.$or as FilterQuery[])[0][field]) !==
          undefined
    );

    if (entry) {
      return entry;
    }
  }

  if (
    filter[field] !== undefined ||
    (filter.$or && (filter.$or as FilterQuery[])[0] && (filter.$or as FilterQuery[])[0][field]) !== undefined
  ) {
    return filter;
  }
}

export function modifyFieldFilterValue(
  filter: FilterQuery,
  field: string,
  value?: FilterQueryValue | FilterQuery | null
): void {
  if (value === undefined) {
    removeFieldFilter(filter, field);
  } else {
    addFieldFilter(filter, field, value);
  }
}

export function getFilterRootAnd(filter: FilterQuery, field = ''): [FilterQuery[], number] {
  const and: FilterQuery[] | undefined = filter.$and as FilterQuery[];
  const index = and?.findIndex(
    entry =>
      entry[field] !== undefined ||
      (entry.$or && (entry.$or as FilterQuery[])[0] && (entry.$or as FilterQuery[])[0][field]) !== undefined
  );

  return [and, index === undefined ? -1 : index];
}

export function removeFieldFilter(filter: FilterQuery, field: string): void {
  const [and, index] = getFilterRootAnd(filter, field);

  if (and) {
    if (index !== -1) {
      and.splice(index, 1);
      if (!and.length) {
        delete filter.$and;
      }
      if (and.length === 1) {
        Object.assign(filter, and[0]);
        delete filter.$and;
      }
    }
  } else {
    delete filter[field];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // todo починить (https://dev.azure.com/programgeoplan/GIS%20Platform/_workitems/edit/6054)
    if (Array.isArray(filter.$or) && filter.$or[field]) {
      delete filter.$or;
    }
  }
}

function addFieldFilter(filter: FilterQuery, field: string, value: FilterQueryValue | FilterQuery | null): void {
  const [and, index] = getFilterRootAnd(filter, field);
  if (and) {
    if (index === -1) {
      and.push({ [field]: value });
    } else {
      and[index][field] = value;
    }
  } else if (filter[field] !== undefined || !Object.keys(filter).length) {
    filter[field] = value;
  } else {
    const newAndValue = [{ ...filter }, { [field]: value }];
    for (const oldField of Object.keys(filter)) {
      delete filter[oldField];
    }

    filter.$and = newAndValue;
  }
}

export function addFilterPart(filter: FilterQuery, part: FilterQuery): void {
  const [and] = getFilterRootAnd(filter);
  if (and) {
    and.push(part);
  } else {
    const newAndValue = Object.keys(filter).length ? [{ ...filter }, part] : [part];
    for (const oldField of Object.keys(filter)) {
      delete filter[oldField];
    }
    filter.$and = newAndValue;
  }
}
