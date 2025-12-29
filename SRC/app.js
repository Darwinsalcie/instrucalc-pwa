import Calculadora from "./functions.js";

// Busca inputs que tenga el nombre calc-option
const calcOptions = document.querySelectorAll('input[name="calc-option"]');

// Buscar por selector los li dentro de form
const formInputs = document.querySelectorAll('.li-variable');
const calcButton = document.querySelector('#resultBtn');
const resultLabel = document.querySelector('#result');
const clearButton = document.querySelector('#clearBtn'); 
const resultText = document.querySelector("#result-lbl");
const percentLabel = document.querySelector('#percent');

let selected = null;
let calculatedSpan = null;
let measuredVar = null;
let calculatedCurrent = null;
let calcSalInst = null;
let calcVartoSalInst = null;
let percent = null;

const handleOptionChange = (op) => {
  formInputs.forEach((input) => {
    input.classList.add('hidden');
  });

  // Remover required de todos los inputs que no son el límite inferior
  const allInputs = document.querySelectorAll('.form input[type="number"]:not(#lim-inf-range)');
  allInputs.forEach(input => input.removeAttribute('required'));

  selected = op.target.id;
  let visibleLis = [];

  switch (selected) {
    case 'calcSpan':
      resultLabel.value = null;
      percentLabel.value = "";
      resultText.textContent = "Span";
      visibleLis = document.querySelectorAll(".li-calcSpan");
      // Agregar required a los campos visibles
      document.getElementById('lim-sup-range').setAttribute('required', 'required');
      break;

    case 'sal-var':
      resultText.textContent = "Variable de proceso (PV)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-salmA");

      if (calculatedSpan !== null) {
        document.getElementById('span').value = calculatedSpan;
      }
      if (calculatedCurrent !== null) {
        document.getElementById('current').value = calculatedCurrent;
      }
      // Agregar required a los campos visibles
      document.getElementById('span').setAttribute('required', 'required');
      document.getElementById('current').setAttribute('required', 'required');
      break;

    case 'var-sal':
      resultText.textContent = "Corriente de salida (mA)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-var-sal");

      if (calculatedSpan !== null) {
        document.getElementById('span').value = calculatedSpan;
      }
      if (measuredVar !== null) {
        document.getElementById('measured-var').value = measuredVar;
      }
      // Agregar required a los campos visibles
      document.getElementById('span').setAttribute('required', 'required');
      document.getElementById('measured-var').setAttribute('required', 'required');
      break;

    case 'sal-inst':
      resultText.textContent = "Variable de proceso (PV)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-sal-inst");

      if (calcVartoSalInst !== null) {
        document.getElementById('salidaInst').value = calcVartoSalInst;
      }
      // Agregar required a los campos visibles
      document.getElementById('span').setAttribute('required', 'required');
      document.getElementById('salidaInst').setAttribute('required', 'required');
      break;

    case 'var-sal-psi':
      resultText.textContent = "Presión de salida (psi)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-var-sal-psi");

      if (calcSalInst !== null) {
        document.getElementById('variable').value = calcSalInst;
      }
      // Agregar required a los campos visibles
      document.getElementById('span').setAttribute('required', 'required');
      document.getElementById('variable').setAttribute('required', 'required');
      break;
  }

  visibleLis.forEach((li) => {
    li.classList.remove('hidden');
  });
};

const isValidNumber = (value) => {
  return value !== "" && !Number.isNaN(value) && Number.isFinite(value);
};


const calculate = () => {

  // 🔧 FIX: detectar radio seleccionado aunque no haya change
  if (!selected) {
    const checked = document.querySelector('input[name="calc-option"]:checked');
    if (checked) {
      selected = checked.id;
    } else {
      alert("Debe seleccionar un modo de cálculo");
      return;
    }
  }

  const limInf = Number(document.getElementById("lim-inf-range").value);
  const limSup = Number(document.getElementById("lim-sup-range").value);
  const span = Number(document.getElementById("span").value);
  const corrMa = Number(document.getElementById("current").value);
  const measuredVarField = Number(document.getElementById("measured-var").value);
  const salInst = Number(document.getElementById("salidaInst").value);
  const varSalInst = Number(document.getElementById("variable").value);

  let result = null;
  percent = null;

  // Validación adicional de lógica de negocio
  switch (selected) {
    case 'calcSpan':
      if (!isValidNumber(limInf)) {
        alert("Por favor ingrese un valor válido para el Límite Inferior (LRV)");
        return;
      }
      if (!isValidNumber(limSup)) {
        alert("Por favor ingrese un valor válido para el Límite Superior (URV)");
        return;
      }
      result = Calculadora.calcularSpan(limInf, limSup);
      if (result <= 0) {
        alert("Error: El URV debe ser mayor que el LRV");
        return;
      }
      calculatedSpan = result;
      break;

    case 'sal-var':
      if (!isValidNumber(limInf)) {
        alert("Por favor ingrese un valor válido para el Límite Inferior (LRV)");
        return;
      }
      if (!isValidNumber(span)) {
        alert("Por favor ingrese un valor válido para el Span");
        return;
      }
      if (span <= 0) {
        alert("Error: El Span debe ser mayor que cero");
        return;
      }
      if (!isValidNumber(corrMa)) {
        alert("Por favor ingrese un valor válido para la Corriente");
        return;
      }
      if (corrMa < 4 || corrMa > 20) {
        alert("Error: La corriente debe estar entre 4 y 20 mA");
        return;
      }
      result = Calculadora.corrienteToVar(limInf, span, corrMa);
      measuredVar = result;
      percent = Calculadora.porcentajePV(limInf, span, measuredVar);
      break;

    case 'var-sal':
      if (!isValidNumber(limInf)) {
        alert("Por favor ingrese un valor válido para el Límite Inferior (LRV)");
        return;
      }
      if (!isValidNumber(span)) {
        alert("Por favor ingrese un valor válido para el Span");
        return;
      }
      if (span <= 0) {
        alert("Error: El Span debe ser mayor que cero");
        return;
      }
      if (!isValidNumber(measuredVarField)) {
        alert("Por favor ingrese un valor válido para la Variable Medida");
        return;
      }
      result = Calculadora.varToCorrienteMa(limInf, span, measuredVarField);
      if (!isValidNumber(result) || result < 4 || result > 20) {
        alert("Advertencia: La corriente calculada está fuera del rango 4-20 mA");
      }
      calculatedCurrent = result;
      percent = Calculadora.porcentajePV(limInf, span, measuredVarField);
      break;

    case 'sal-inst':
      if (!isValidNumber(limInf)) {
        alert("Por favor ingrese un valor válido para el Límite Inferior (LRV)");
        return;
      }
      if (!isValidNumber(span)) {
        alert("Por favor ingrese un valor válido para el Span");
        return;
      }
      if (span <= 0) {
        alert("Error: El Span debe ser mayor que cero");
        return;
      }
      if (!isValidNumber(salInst)) {
        alert("Por favor ingrese un valor válido para la Salida del Instrumento");
        return;
      }
      if (salInst < 3 || salInst > 15) {
        alert("Error: La salida del instrumento debe estar entre 3 y 15 psi");
        return;
      }
      result = Calculadora.psiToVar(limInf, span, salInst);
      calcSalInst = result;
      percent = Calculadora.porcentajePV(limInf, span, calcSalInst);
      break;

    case 'var-sal-psi':
      if (!isValidNumber(limInf)) {
        alert("Por favor ingrese un valor válido para el Límite Inferior (LRV)");
        return;
      }
      if (!isValidNumber(span)) {
        alert("Por favor ingrese un valor válido para el Span");
        return;
      }
      if (span <= 0) {
        alert("Error: El Span debe ser mayor que cero");
        return;
      }
      if (!isValidNumber(varSalInst)) {
        alert("Por favor ingrese un valor válido para la Variable");
        return;
      }
      result = Calculadora.varToPsi(limInf, span, varSalInst);
      if (!isValidNumber(result) || result < 3 || result > 15) {
        alert("Advertencia: La presión calculada está fuera del rango 3-15 psi");
      }
      calcVartoSalInst = result;
      percent = Calculadora.porcentajePV(limInf, span, varSalInst);
      break;
  }

  // Resultado con manejo de errores
  if (!isValidNumber(result)) {
    resultLabel.value = "Error en cálculo";
    return;
  }
  
  if (typeof result === 'number') {
    resultLabel.value = Number.isInteger(result)
      ? result
      : result.toFixed(3);
  }

  // Porcentaje (solo si existe y es válido)
  if (typeof percent === 'number' && isValidNumber(percent)) {
    percentLabel.value = Number.isInteger(percent)
      ? percent + "%"
      : percent.toFixed(3) + "%";
  } else {
    percentLabel.value = "";
  }
};

// Eventos
calcOptions.forEach(option => {
  option.addEventListener("change", handleOptionChange);
});

// Usar el evento submit del form
const form = document.getElementById('calculatorForm');
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evitar que recargue la página
  calculate();
});

// Mantener compatibilidad con el botón directo
calcButton.addEventListener("click", (e) => {
  e.preventDefault();
  calculate();
});

clearButton.addEventListener("click", () => {
  // Solo limpiar los inputs de texto, no los radios
  const inputs = document.querySelectorAll(".form input[type='text']");
  inputs.forEach(input => input.value = "");

  // Limpiar resultados
  resultLabel.value = "";
  percentLabel.value = "";

  // NO resetear selected ni las variables calculadas para mantener el flujo
  calculatedSpan = null;
  measuredVar = null;
  calculatedCurrent = null;
  calcSalInst = null;
  calcVartoSalInst = null;
  percent = null;
});