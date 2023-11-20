CREATE INDEX IF NOT EXISTS idx_resource_table	ON data.acl_permissions (resource_table);
CREATE INDEX IF NOT EXISTS idx_principal_id 	ON data.acl_permissions (principal_id);
CREATE INDEX IF NOT EXISTS idx_resource_id		ON data.acl_permissions (resource_id);
