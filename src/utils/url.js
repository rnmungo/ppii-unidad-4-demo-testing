// Lista de protocolos PERMITIDOS (allowlist). Todo lo demás se rechaza:
// javascript:, data:, vbscript:, cadenas que no son URL, etc.
const PROTOCOLOS_PERMITIDOS = ["https:", "http:"];

export function esUrlSegura(valor) {
  try {
    const url = new URL(valor);
    return PROTOCOLOS_PERMITIDOS.includes(url.protocol);
  } catch {
    return false;
  }
}
