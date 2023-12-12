
create table if not exists data.smev_message_meta
(
    id                        uuid primary key,
    direction                 text      not null,
    client_id                 uuid      not null unique,
    reference_client_id       uuid,
    mnemonic                  text      not null,
    mnemonic_version          text      not null,
    reference_reestr_incoming uuid references data.reestr_incoming,
    reference_reestr_outgoing uuid references data.reestr_outgoing,
    xml_object                text      not null,
    xml_string                text      not null,
    records                   text,
    attachments               text,
    created_at                timestamp not null,
    constraint smev_message_meta_smev_reference_client_id_fk
        foreign key (reference_client_id) references data.smev_message_meta (client_id)
);