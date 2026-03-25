import {
  paintBlockOutOnBaselineIfJustCreated,
  parseVisualServiceUserOptions,
  resolveVisualBaselinePngPath,
  visualBaselinePngExists,
  type VisualBlockOutRect
} from './blockOutPaint';

type FeatureExtractSnapshotTag = 'with-map' | 'without-map';

function isFeatureExtractSnapshotTag(value: string): value is FeatureExtractSnapshotTag {
  return value === 'with-map' || value === 'without-map';
}

/**
 * Плашки даты на полном скриншоте (JPEG / PDF viewer).
 * Запас влево под длинные месяцы.
 */
const featureExtractDateBlockOut: {
  jpeg: Record<FeatureExtractSnapshotTag, VisualBlockOutRect>;
  pdf: Record<FeatureExtractSnapshotTag, VisualBlockOutRect>;
} = {
  jpeg: {
    'with-map': { x: 756, y: 55, width: 154, height: 21 },
    'without-map': { x: 777, y: 67, width: 143, height: 22 }
  },
  pdf: {
    'without-map': { x: 982, y: 154, width: 188, height: 26 },
    'with-map': { x: 961, y: 134, width: 199, height: 25 }
  }
};

const pdfViewerChromeToolbar: VisualBlockOutRect = {
  x: 0,
  y: 0,
  width: 1300,
  height: 58
};

const pdfViewerChromeLeftOfSheet: VisualBlockOutRect = {
  x: 0,
  y: 58,
  width: 385,
  height: 703
};

const pdfViewerChromeRightOfSheet: VisualBlockOutRect = {
  x: 1201,
  y: 58,
  width: 1300 - 1201,
  height: 703
};

function isPrintResultOpenedInBrowserUrl(url: string): boolean {
  return (
    url.startsWith('blob:') ||
    url.startsWith('data:image') ||
    url.startsWith('data:application/pdf') ||
    /\/files\/[^/]+\/download/.test(url)
  );
}

/** Укороченный URL для лога. */
function formatUrlForDiagnostics(url: string): string {
  if (url.startsWith('blob:')) {
    return `blob:… (всего ${url.length} симв.) ${url.slice(0, 72)}${url.length > 72 ? '…' : ''}`;
  }
  if (url.startsWith('data:image') || url.startsWith('data:application/pdf')) {
    return `data:… (всего ${url.length} симв.) ${url.slice(0, 72)}…`;
  }
  const max = 160;

  return url.length <= max ? url : `${url.slice(0, max)}…`;
}

const printResultTabWaitTimeoutMsg = '__printResultTabWaitTimeout__';

export async function assertPrintResultOpenedInBrowserTab(): Promise<void> {
  try {
    await browser.waitUntil(async () => isPrintResultOpenedInBrowserUrl(await browser.getUrl()), {
      timeout: 10_000,
      interval: 300,
      timeoutMsg: printResultTabWaitTimeoutMsg
    });
  } catch (error) {
    if (error instanceof Error && error.message === printResultTabWaitTimeoutMsg) {
      const url = await browser.getUrl();
      throw new Error(
        'Ожидалась вкладка с результатом печати (blob:, data:… или …/files/<id>/download). ' +
          `Фактический URL: ${formatUrlForDiagnostics(url)}`
      );
    }
    throw error;
  }
}

/** Сколько раз подряд должна выполняться проверка отрисовки (один проход часто попадает между кадрами PDFium). */
const pdfViewerStableStreak = 5;

/** Интервал опроса; со streak — около секунды стабильного состояния после появления canvas. */
const pdfViewerPollMs = 220;

async function waitForChromeBuiltinPdfPainted(): Promise<void> {
  let streak = 0;

  await browser.waitUntil(
    async () => {
      const painted = await browser.execute(() => {
        if (document.readyState !== 'complete') {
          return false;
        }

        const minBitmap = 100;
        const minEmbedH = 64;

        function rootShowsPdfContent(root: Document | ShadowRoot): boolean {
          for (const node of root.querySelectorAll('canvas')) {
            if (!(node instanceof HTMLCanvasElement)) {
              continue;
            }
            const bigBitmap = node.width > minBitmap && node.height > minBitmap;
            const bigLayout = node.clientWidth > minBitmap && node.clientHeight > minBitmap;
            if (bigBitmap || bigLayout) {
              return true;
            }
          }

          for (const node of root.querySelectorAll('embed[type="application/pdf"]')) {
            if (node instanceof HTMLElement && node.clientHeight > minEmbedH) {
              return true;
            }
          }

          return false;
        }

        function walk(root: Document | ShadowRoot): boolean {
          if (rootShowsPdfContent(root)) {
            return true;
          }

          for (const el of root.querySelectorAll('*')) {
            if (el.shadowRoot && walk(el.shadowRoot)) {
              return true;
            }

            if (el instanceof HTMLIFrameElement) {
              let doc: Document | null = null;
              try {
                doc = el.contentDocument;
              } catch {
                doc = null;
              }
              if (doc && walk(doc)) {
                return true;
              }
            }
          }

          return false;
        }

        return walk(document);
      });

      if (painted) {
        streak += 1;
      } else {
        streak = 0;
      }

      return streak >= pdfViewerStableStreak;
    },
    {
      timeout: 30_000,
      interval: pdfViewerPollMs,
      timeoutMsg:
        'Просмотрщик PDF не стабилизировал отрисовку (canvas/embed в DOM/shadow/iframe или серия проверок). ' +
        'Возможна смена разметки Chrome.'
    }
  );
}

/**
 * Сравнение с эталоном. Если эталон только что создан — сразу подкрасить на нём зоны blockOut (один раз).
 */
async function assertFullPageSnapshotWithBlockOut(snapshotTag: string, rects: VisualBlockOutRect[]): Promise<void> {
  const opts = parseVisualServiceUserOptions(browser);
  const baselinePath = resolveVisualBaselinePngPath(process.cwd(), opts, snapshotTag);
  const baselineExistedBeforeAssert = visualBaselinePngExists(baselinePath);

  await expect(browser).toMatchFullPageSnapshot(snapshotTag, { blockOut: rects });
  paintBlockOutOnBaselineIfJustCreated(baselinePath, rects, { baselineExistedBeforeAssert });
}

export async function assertFeatureExtractJpegSnapshotMatchesBaseline(tag: string): Promise<void> {
  if (!isFeatureExtractSnapshotTag(tag)) {
    throw new Error(`Неизвестный тег эталона JPEG: ${tag}`);
  }

  const blockOut = featureExtractDateBlockOut.jpeg[tag];

  await assertFullPageSnapshotWithBlockOut(`FeatureExtractJpeg-${tag}`, [blockOut]);
}

export async function assertFeatureExtractPdfSnapshotMatchesBaseline(tag: string): Promise<void> {
  if (!isFeatureExtractSnapshotTag(tag)) {
    throw new Error(`Неизвестный тег эталона PDF: ${tag}`);
  }

  const blockOut = featureExtractDateBlockOut.pdf[tag];

  await waitForChromeBuiltinPdfPainted();

  await assertFullPageSnapshotWithBlockOut(`FeatureExtractPdf-${tag}`, [
    pdfViewerChromeToolbar,
    pdfViewerChromeLeftOfSheet,
    pdfViewerChromeRightOfSheet,
    blockOut
  ]);
}
