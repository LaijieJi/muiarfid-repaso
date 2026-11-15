// Aparta las fórmulas antes de pasar el Markdown por marked, que convertiría x_i o a*b en cursiva.

// El primer grupo se deja intacto (código y \$), el segundo es una fórmula.
const PATRON = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|\\\$)|(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;

export function proteger(md) {
  const formulas = [];
  const texto = md.replace(PATRON, (trozo, literal) => (literal ? trozo : `@@F${formulas.push(trozo) - 1}@@`));
  return { texto, formulas };
}

const escapar = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function restaurar(html, formulas) {
  return html.replace(/@@F(\d+)@@/g, (_, i) => escapar(formulas[Number(i)]));
}
