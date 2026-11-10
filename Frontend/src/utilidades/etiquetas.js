export const ETIQUETAS_ROL = {
  STUDENT: 'Estudiante',
  TUTOR: 'Tutor',
  ADMIN: 'Administrador',
};

export const ETIQUETAS_ESTADO = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export function claseBadgeEstado(estado) {
  const mapa = {
    PENDING: 'badge-pending',
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
  };
  return `badge ${mapa[estado] || 'badge-pending'}`;
}
