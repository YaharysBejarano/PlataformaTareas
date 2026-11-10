/** Indicativos telefónicos para WhatsApp (código sin +). */
export const INDICATIVOS_PAISES = [
  { codigo: '57', pais: 'Colombia', bandera: '🇨🇴' },
  { codigo: '52', pais: 'México', bandera: '🇲🇽' },
  { codigo: '54', pais: 'Argentina', bandera: '🇦🇷' },
  { codigo: '56', pais: 'Chile', bandera: '🇨🇱' },
  { codigo: '51', pais: 'Perú', bandera: '🇵🇪' },
  { codigo: '593', pais: 'Ecuador', bandera: '🇪🇨' },
  { codigo: '58', pais: 'Venezuela', bandera: '🇻🇪' },
  { codigo: '591', pais: 'Bolivia', bandera: '🇧🇴' },
  { codigo: '595', pais: 'Paraguay', bandera: '🇵🇾' },
  { codigo: '598', pais: 'Uruguay', bandera: '🇺🇾' },
  { codigo: '506', pais: 'Costa Rica', bandera: '🇨🇷' },
  { codigo: '507', pais: 'Panamá', bandera: '🇵🇦' },
  { codigo: '503', pais: 'El Salvador', bandera: '🇸🇻' },
  { codigo: '502', pais: 'Guatemala', bandera: '🇬🇹' },
  { codigo: '504', pais: 'Honduras', bandera: '🇭🇳' },
  { codigo: '505', pais: 'Nicaragua', bandera: '🇳🇮' },
  { codigo: '34', pais: 'España', bandera: '🇪🇸' },
  { codigo: '1', pais: 'Estados Unidos', bandera: '🇺🇸' },
  { codigo: '55', pais: 'Brasil', bandera: '🇧🇷' },
];

export const INDICATIVO_POR_DEFECTO = '57';

/** Solo dígitos del número local (sin indicativo). */
export function limpiarNumeroLocal(valor) {
  return String(valor || '').replace(/\D/g, '');
}

/** Indicativo + número local → teléfono completo para wa.me. */
export function combinarTelefono(indicativo, numeroLocal) {
  const codigo = limpiarNumeroLocal(indicativo);
  const numero = limpiarNumeroLocal(numeroLocal);
  if (!codigo || !numero) return '';
  return `${codigo}${numero}`;
}

/** Separa un teléfono guardado en indicativo y número local. */
export function separarTelefono(telefonoCompleto) {
  const digitos = String(telefonoCompleto || '').replace(/\D/g, '');
  if (!digitos) {
    return { indicativo: INDICATIVO_POR_DEFECTO, numero: '' };
  }

  const ordenados = [...INDICATIVOS_PAISES].sort((a, b) => b.codigo.length - a.codigo.length);
  for (const { codigo } of ordenados) {
    if (digitos.startsWith(codigo) && digitos.length > codigo.length) {
      return { indicativo: codigo, numero: digitos.slice(codigo.length) };
    }
  }

  return { indicativo: INDICATIVO_POR_DEFECTO, numero: digitos };
}
