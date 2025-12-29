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

  selected = op.target.id;
  let visibleLis = [];

  switch (selected) {
    case 'calcSpan':
      resultLabel.value = null;
      percentLabel.value = "";
      resultText.textContent = "Span";
      visibleLis = document.querySelectorAll(".li-calcSpan");
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
      break;

    case 'sal-inst':
      resultText.textContent = "Variable de proceso (PV)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-sal-inst");

      if (calcVartoSalInst !== null) {
        document.getElementById('salidaInst').value = calcVartoSalInst;
      }
      break;

    case 'var-sal-psi':
      resultText.textContent = "Presión de salida (psi)";
      resultLabel.value = null;
      percentLabel.value = "";
      visibleLis = document.querySelectorAll(".li-percent, .li-var-sal-psi");

      if (calcSalInst !== null) {
        document.getElementById('variable').value = calcSalInst;
      }
      break;
  }

  visibleLis.forEach((li) => {
    li.classList.remove('hidden');
  });
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

  switch (selected) {
    case 'calcSpan':
      result = Calculadora.calcularSpan(limInf, limSup);
      calculatedSpan = result;
      break;

    case 'sal-var':
      result = Calculadora.corrienteToVar(limInf, span, corrMa);
      measuredVar = result;
      percent = Calculadora.porcentajePV(limInf, span, measuredVar);
      break;

    case 'var-sal':
      result = Calculadora.varToCorrienteMa(limInf, span, measuredVarField);
      calculatedCurrent = result;
      percent = Calculadora.porcentajePV(limInf, span, measuredVarField);
      break;

    case 'sal-inst':
      result = Calculadora.psiToVar(limInf, span, salInst);
      calcSalInst = result;
      percent = Calculadora.porcentajePV(limInf, span, calcSalInst);
      break;

    case 'var-sal-psi':
      result = Calculadora.varToPsi(limInf, span, varSalInst);
      calcVartoSalInst = result;
      percent = Calculadora.porcentajePV(limInf, span, varSalInst);
      break;
  }

  // Resultado
  if (typeof result === 'number') {
    resultLabel.value = Number.isInteger(result)
      ? result
      : result.toFixed(3);
  }

  // Porcentaje (solo si existe)
  if (typeof percent === 'number') {
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

calcButton.addEventListener("click", calculate);

clearButton.addEventListener("click", () => {
  const inputs = document.querySelectorAll(".form input");
  inputs.forEach(input => input.value = "");

  selected = null;
  calculatedSpan = null;
  measuredVar = null;
  calculatedCurrent = null;
  calcSalInst = null;
  calcVartoSalInst = null;
  percent = null;
  percentLabel.value = "";
});
