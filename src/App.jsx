import React, { useEffect, useMemo, useState } from "react";

function DismissibleAlert({ type = "danger", message = "", onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [max, setMax] = useState(""); 
  const [alert, setAlert] = useState({ type: "danger", message: "" });

  useEffect(() => {
    const saved = localStorage.getItem("contador_actual");
    const savedMax = localStorage.getItem("contador_max");
    if (saved !== null) setCount(Number(saved));
    if (savedMax !== null && savedMax !== "") setMax(Number(savedMax));
  }, []);

  useEffect(() => {
    localStorage.setItem("contador_actual", String(count));
  }, [count]);

  useEffect(() => {
    if (max === "") {
      localStorage.setItem("contador_max", "");
    } else {
      localStorage.setItem("contador_max", String(max));
    }
  }, [max]);

  const resetAlert = () => setAlert((a) => ({ ...a, message: "" }));

  const validateMaxField = (value) => {
    if (value === "" || value === null) return "";
    const n = Number(value);
    if (Number.isNaN(n) || !Number.isFinite(n)) return "El máximo debe ser un número válido.";
    if (n < 0) return "El máximo no puede ser negativo.";
    if (n < count) return "El máximo no puede ser menor que el conteo actual.";
    return "";
  };

  const handleChangeMax = (e) => {
    resetAlert();
    const err = validateMaxField(e.target.value);
    if (err) {
      setAlert({ type: "warning", message: err });
    } else {
      setAlert({ type: "info", message: e.target.value === "" ? "Límite máximo desactivado." : "Límite máximo actualizado." });
    }
    setMax(e.target.value === "" ? "" : Number(e.target.value));
  };

  const canDecrement = useMemo(() => count > 0, [count]);
  const canIncrement = useMemo(
    () => max === "" || count < Number(max),
    [count, max]
  );

  const inc = () => {
    resetAlert();
    if (!canIncrement) {
      setAlert({ type: "warning", message: "No puedes superar el máximo establecido." });
      return;
    }
    setCount((c) => c + 1);
  };

  const dec = () => {
    resetAlert();
    if (!canDecrement) {
      setAlert({ type: "warning", message: "El conteo no puede ser negativo." });
      return;
    }
    setCount((c) => c - 1);
  };

  const reset = () => {
    resetAlert();
    setCount(0);
    setAlert({ type: "success", message: "Conteo reiniciado a 0." });
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 text-center mb-3">Contador de Eventos</h1>

              <DismissibleAlert
                type={alert.type}
                message={alert.message}
                onClose={resetAlert}
              />

              {/* El Panel principal */}
              <div className="text-center my-3">
                <div
                  className="display-3 fw-bold"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {count}
                </div>
                {max !== "" && (
                  <div className="text-muted">Máximo: <strong>{max}</strong></div>
                )}
              </div>

              {/* Los controles */}
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={dec}
                  disabled={!canDecrement}
                >
                  −1
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={inc}
                  disabled={!canIncrement}
                >
                  +1
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={reset}
                >
                  Reiniciar
                </button>
              </div>

              <hr className="my-4" />

              {/* Inicio de config */}
              <form className="row g-3" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="col-12 col-md-8">
                  <label htmlFor="max" className="form-label">
                    Límite máximo (opcional)
                  </label>
                  <input
                    id="max"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Ej. 100 (deja vacío para sin límite)"
                    value={max}
                    onChange={handleChangeMax}
                  />
                  <div className="form-text">
                    Deja vacío si no quieres tope. El mínimo del contador siempre es 0.
                  </div>
                </div>
                <div className="col-12 col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setMax("");
                      setAlert({ type: "info", message: "Límite máximo desactivado." });
                    }}
                  >
                    Quitar límite
                  </button>
                </div>
              </form>

              {/* Sugerencia de Ayuda */}
              <div className="mt-4 small text-muted">
                Sugerencia: usa este contador para registrar ocurrencias (p. ej., eventos detectados, clics observados, errores, etc.).  
                Atajos: no incluidos por defecto, pero puedo agregar soporte de teclado (↑, ↓, 0) si lo necesitas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
