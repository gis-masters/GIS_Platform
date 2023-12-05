create table if not exists data.smev_message_meta
(
    id                        uuid primary key,
    direction                 text      not null,
    client_id                 uuid      not null,
    reference_client_id       uuid references data.smev_message_meta,
    mnemonic                  text      not null,
    mnemonic_version          text      not null,
    reference_reestr_incoming uuid references data.reestr_incoming,
    reference_reestr_outgoing uuid references data.reestr_outgoing,
    xml_object                json      not null,
    xml_string                text      not null,
    records                   json,
    attachments               json,
    created_at                timestamp not null
);
