CREATE TABLE IF NOT EXISTS data.smev_message_meta
(
    id                        uuid PRIMARY KEY,
    direction                 text      NOT NULL,
    client_id                 uuid      NOT NULL UNIQUE,
    reference_client_id       uuid,
    mnemonic                  text      NOT NULL,
    mnemonic_version          text      NOT NULL,
    reference_reestr_incoming uuid references data.reestr_incoming,
    reference_reestr_outgoing uuid references data.reestr_outgoing,
    xml_object                text      NOT NULL,
    xml_string                text      NOT NULL,
    records                   text,
    attachments               text,
    created_at                timestamp NOT NULL,
    CONSTRAINT smev_message_meta_smev_reference_client_id_fk
        FOREIGN KEY (reference_client_id) REFERENCES data.smev_message_meta (client_id)
);
