UPDATE
  public.layers
SET
  source_type = 'document'
WHERE
  source_type IS NULL
  OR source_type != 'document';
