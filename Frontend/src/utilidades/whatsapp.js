/** Normaliza teléfono a solo dígitos (código de país incluido). */
export function normalizarTelefono(telefono) {
  if (!telefono) return '';
  return String(telefono).replace(/\D/g, '');
}

/** URL wa.me con mensaje opcional prellenado. */
export function buildWhatsAppUrl(telefono, mensaje = '') {
  const digitos = normalizarTelefono(telefono);
  if (!digitos) return null;
  const base = `https://wa.me/${digitos}`;
  const texto = mensaje?.trim();
  if (!texto) return base;
  return `${base}?text=${encodeURIComponent(texto)}`;
}

export const WHATSAPP_SOPORTE = import.meta.env.VITE_WHATSAPP_SUPPORT || '';

export function buildSessionWhatsAppMessage({ senderName, recipientName, subjectName, scheduledAt }) {
  const fecha = scheduledAt
    ? new Date(scheduledAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
    : '';
  return `Hola ${recipientName}, soy ${senderName}. Te escribo por la sesión de ${subjectName || 'tutoría'}${fecha ? ` programada para ${fecha}` : ''}. ¿Podemos coordinar?`;
}

export function buildTutorWhatsAppMessage({ studentName, tutorName, subjectName }) {
  const quien = studentName || 'un estudiante';
  const materia = subjectName ? ` en ${subjectName}` : '';
  return `Hola ${tutorName}, soy ${quien}. Me interesa una tutoría${materia} en la plataforma. ¿Tienes disponibilidad?`;
}
