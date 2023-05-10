export interface CurrentMapPosition {
  zoom: number;
  center: number[];
}

export async function getMapPosition(): Promise<CurrentMapPosition> {
  const url = new URL(await browser.getUrl());
  const center = url.searchParams.get('center')?.split(',').map(Number);
  const zoom = Number(url.searchParams.get('zoom'));

  if (!center || !zoom) {
    throw new Error('В url отсутствует позиция карты');
  }

  return { center, zoom };
}
