import impressCss from '../../assets/vendor/impress-demo.css?raw';
import impressSource from '../../assets/vendor/impress.js?raw';
import type { Presentation, Slide } from '../../types/presentation';

const APP_EXPORT_CSS = `
body {
  background:
    radial-gradient(circle at top, rgba(255, 215, 150, 0.35), transparent 32%),
    linear-gradient(180deg, #1b2735 0%, #090a0f 100%);
  color: #f7f2e8;
  font-family: 'Trebuchet MS', 'Segoe UI Variable', sans-serif;
}

.slide {
  border-radius: 28px;
  border: 1px solid rgba(32, 49, 63, 0.18);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.24);
}

.slide-inner {
  display: grid;
  gap: 1rem;
  min-height: 100%;
}

.slide-title {
  font-size: 2.2rem;
  line-height: 1.1;
  margin: 0;
}

.slide-body {
  font-size: 1.2rem;
  line-height: 1.5;
  white-space: pre-wrap;
}
`;

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

const renderSlideMarkup = (slide: Slide) => `
  <div
    id="${slide.id}"
    class="step slide"
    data-x="${slide.transform.x}"
    data-y="${slide.transform.y}"
    data-z="${slide.transform.z}"
    data-rotate="${slide.transform.rotate}"
    data-rotate-x="${slide.transform.rotateX}"
    data-rotate-y="${slide.transform.rotateY}"
    data-scale="${slide.transform.scale}"
    style="background:${escapeHtml(slide.background)}; color:#14212b; padding:48px;"
  >
    <div class="slide-inner">
      <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
      <div class="slide-body">${escapeHtml(slide.content)}</div>
    </div>
  </div>
`;

export const buildPresentationHtml = (presentation: Presentation) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1024" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>${escapeHtml(presentation.title)}</title>
    <style>${impressCss}</style>
    <style>${APP_EXPORT_CSS}</style>
  </head>
  <body class="impress-not-supported">
    <div class="fallback-message">
      <p>This browser does not support the features required by impress.js.</p>
    </div>
    <div id="impress-root">
      ${presentation.slides.map(renderSlideMarkup).join('')}
    </div>
    <script>${impressSource}</script>
    <script>impress('impress-root').init();</script>
  </body>
</html>`;

const downloadFile = (fileName: string, contents: string, type: string) => {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
};

export const downloadPresentationHtml = (presentation: Presentation) => {
    downloadFile(
        `${presentation.title.replace(/\s+/g, '-').toLowerCase() || 'presentation'}.html`,
        buildPresentationHtml(presentation),
        'text/html;charset=utf-8',
    );
};

export const downloadPresentationJson = (presentation: Presentation) => {
    downloadFile(
        `${presentation.title.replace(/\s+/g, '-').toLowerCase() || 'presentation'}.json`,
        JSON.stringify(presentation, null, 2),
        'application/json;charset=utf-8',
    );
};