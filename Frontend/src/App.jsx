import { Routes, Route } from 'react-router-dom';
import BarraNavegacion from './componentes/BarraNavegacion';
import PiePagina from './componentes/PiePagina';
import RutaProtegida from './componentes/RutaProtegida';
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';
import Tareas from './paginas/Tareas';
import Perfil from './paginas/Perfil';

function App() {
  return (
    <div className="app-shell">
      <BarraNavegacion />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/register" element={<Registro />} />
          <Route
            path="/tasks"
            element={
              <RutaProtegida>
                <Tareas />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>
      <PiePagina />
    </div>
  );
}

export default App;
