import fs from 'fs';
import path from 'path';

// Evita que un texto de la BD rompa el HTML (por ejemplo si trae "<")
const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

// Su única responsabilidad: convertir datos en un archivo HTML
export class HtmlReportGenerator {
  constructor(outputDir = 'reports') {
    this.outputDir = outputDir;
  }

  // sections = [{ heading?, rows }]  |  columns = [{ key, label }]
  generate({ fileName, title, columns, sections }) {
    fs.mkdirSync(this.outputDir, { recursive: true });

    const body = sections
      .map((s) => `${s.heading ? `<h2>${escapeHtml(s.heading)}</h2>` : ''}${this.buildTable(columns, s.rows)}`)
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; color: #222; }
    h1 { color: #1e5aa8; }
    h2 { margin-top: 2rem; color: #333; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #1e5aa8; color: #fff; }
    tr:nth-child(even) { background: #f3f6fb; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Generado: ${new Date().toLocaleString()}</p>
  ${body}
</body>
</html>`;

    const filePath = path.join(this.outputDir, `${fileName}_${Date.now()}.html`);
    fs.writeFileSync(filePath, html);
    return filePath;
  }

  buildTable(columns, rows) {
    if (rows.length === 0) return '<p><em>Sin registros.</em></p>';
    const head = columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('');
    const bodyRows = rows
      .map((r) => `<tr>${columns.map((c) => `<td>${escapeHtml(r[c.key])}</td>`).join('')}</tr>`)
      .join('');
    return `<table><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  }
}
