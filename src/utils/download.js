import api from '../services/api.js';

const filenameFrom = (disposition, fallback) => {
  const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition || '');
  return m ? decodeURIComponent(m[1]) : fallback;
};

/**
 * Download (or open in a new tab) an authenticated file such as an invoice PDF or Excel report.
 * Uses the JWT-enabled axios instance so protected endpoints work.
 */
export const downloadFile = async (url, { params, filename = 'download', open = false } = {}) => {
  // Open the tab synchronously (before await) so pop-up blockers allow it
  const win = open ? window.open('', '_blank') : null;
  if (win) {
    win.document.write('<p style="font-family:sans-serif;padding:24px;color:#555">Preparing document…</p>');
  }
  try {
    const response = await api.get(url, { params, responseType: 'blob', rawResponse: true });
    const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
    const name = filenameFrom(response.headers?.['content-disposition'], filename);
    const href = URL.createObjectURL(blob);
    if (win) {
      win.location.href = href;
    } else {
      const a = document.createElement('a');
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
    return true;
  } catch (err) {
    if (win) win.close();
    throw err;
  }
};
