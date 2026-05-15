import { getLibraryRecord } from '../../data/library/library.service';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { isArray } from '../../util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';

const SOURCE_DOC_PROPERTY = 'source_doc';
const DATE_RECEIVED_REQUEST = 'date_received_request';

type SourceDocRef = {
  id: number;
  libraryTableName: string;
};

function parseSourceDocFirstRef(raw: unknown): SourceDocRef | undefined {
  let documents: unknown[];

  if (typeof raw === 'string') {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    if (!isArray(parsed)) {
      return;
    }

    documents = parsed;
  } else if (isArray(raw)) {
    documents = raw;
  } else {
    return;
  }

  const first = documents[0];

  if (!first || !isRecordStringUnknown(first)) {
    return;
  }

  const libraryTableName = first.libraryTableName;
  const idRaw = first.id;

  if (typeof libraryTableName !== 'string' || !libraryTableName) {
    return;
  }

  let id: number;

  if (typeof idRaw === 'number') {
    id = idRaw;
  } else if (typeof idRaw === 'string') {
    id = Number(idRaw);
  } else {
    return;
  }

  if (!Number.isFinite(id)) {
    return;
  }

  return { id, libraryTableName };
}

export async function resolvePlotDataDateFromSourceDoc(feature: WfsFeature): Promise<string> {
  const ref = parseSourceDocFirstRef(feature.properties[SOURCE_DOC_PROPERTY]);

  if (!ref) {
    console.warn('Не удалось определить документ-источник по полю source_doc');

    return '';
  }

  try {
    const record = await getLibraryRecord(ref.libraryTableName, ref.id);
    const dateReceived = record[DATE_RECEIVED_REQUEST];

    if (typeof dateReceived === 'string' && dateReceived.trim() !== '') {
      return dateReceived.trim();
    }

    console.warn('У документа-источника не заполнена дата date_received_request');

    return '';
  } catch (error) {
    console.warn(error instanceof Error ? error.message : 'Не удалось загрузить документ-источник из библиотеки');

    return '';
  }
}
