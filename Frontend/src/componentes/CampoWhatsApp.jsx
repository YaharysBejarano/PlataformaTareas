import { INDICATIVOS_PAISES, limpiarNumeroLocal } from '../utilidades/indicativos';

export default function CampoWhatsApp({
  indicativo,
  numero,
  onIndicativoChange,
  onNumeroChange,
  required = false,
  idPrefix = 'telefono',
}) {
  return (
    <div className="campo-telefono">
      <div className="form-group campo-telefono-indicativo">
        <label htmlFor={`${idPrefix}-indicativo`}>Indicativo país</label>
        <select
          id={`${idPrefix}-indicativo`}
          className="select"
          value={indicativo}
          onChange={(e) => onIndicativoChange(e.target.value)}
          required={required}
        >
          {INDICATIVOS_PAISES.map(({ codigo, pais, bandera }) => (
            <option key={codigo} value={codigo}>
              {bandera} +{codigo} {pais}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group campo-telefono-numero">
        <label htmlFor={`${idPrefix}-numero`}>Número WhatsApp</label>
        <input
          id={`${idPrefix}-numero`}
          className="input"
          type="tel"
          inputMode="numeric"
          value={numero}
          onChange={(e) => onNumeroChange(limpiarNumeroLocal(e.target.value))}
          required={required}
          placeholder="3001234567"
          autoComplete="tel-national"
        />
      </div>
    </div>
  );
}
