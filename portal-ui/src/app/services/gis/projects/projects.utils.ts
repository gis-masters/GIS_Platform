import { type CrgProject } from './projects.models';

/**
 * Извлекает parentId из поля path проекта
 * path имеет вид "/42/14" где 14 — id непосредственного родителя
 * Если path отсутствует — это корневая запись (возвращает undefined)
 *
 * @param project - проект для извлечения parentId
 * @returns parentId или undefined для корневых проектов
 */
export function getProjectParentId(project: CrgProject): number | undefined {
  if (!project.path) {
    return undefined;
  }

  const pathSegments = project.path.split('/').filter(Boolean);
  const lastSegment = pathSegments.at(-1);

  return lastSegment ? Number(lastSegment) : undefined;
}
