export const Calculadora = {
  calcularSpan(limInf, limSup) {
    return limSup - limInf;
  },

  corrienteToVar(limInf, span, corrMa) {
    const BIAS = 4;
    const AMP = 16;
    return limInf + (span / AMP) * (corrMa - BIAS);
  },

  varToCorrienteMa(limInf, span, variableMedida) {
    const BIAS = 4;
    const AMP = 16;
    return BIAS + (AMP / span) * (variableMedida - limInf);
  },

  psiToVar(limInf, span, presPsi) {
    const BIAS = 3;
    const AMP = 12;
    return limInf + (span / AMP) * (presPsi - BIAS);
  },

  varToPsi(limInf, span, variable) {
    const BIAS = 3;
    const AMP = 12;
    return BIAS + (AMP / span) * (variable - limInf);
  },
  
  porcentajePV(limInf, span, variable) {
  if (span === 0) return null; // evitar división por cero
  return ((variable - limInf) / span) * 100;
  }

  
};

export default Calculadora;
