import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { type PropertyOption } from '../../data/schema/schema.models';
import { isArray } from '../../util/typeGuards/isArray';

export function getSchemaTagsOptions(tags: string[] = []): PropertyOption[] {
  const organizationTags = isArray(organizationSettings.orgSettings?.organization?.tags)
    ? organizationSettings.orgSettings.organization.tags
    : [];

  const uniqueTags = [...new Set([...organizationTags, ...tags])];

  return uniqueTags.map(tag => ({
    value: tag,
    title: tag
  }));
}
