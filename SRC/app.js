import Calculadora from "./functions.js";

//BUsca inputs que tenga el nombre calc-option
const calcOptions = document.querySelectorAll('input[name="calc-option"]');

//Buscar por selector las los li dentro de form
const formInputs = document.querySelectorAll('.li-variable')
const calcButton = document.querySelector('#resultBtn');
const resultLabel = document.querySelector('#result');
const clearButton = document.querySelector('#clearBtn'); 

let selected = null;
let calculatedSpan = null;
let measuredVar = null;
let calculatedCurrent = null;
let calcSalInst = null;
let calcVartoSalInst = null;

const handleOptionChange = (op) =>{
  formInputs.forEach((input) =>{
    input.classList.add('hidden');
  });

  selected = op.target.id;
  let visibleLis = [];

  switch (selected) {
    case 'calcSpan':
      resultLabel.value = null;
      visibleLis = document.querySelectorAll(".li-calcSpan");
      break;
    case 'sal-var':
      resultLabel.value = null;
      visibleLis = document.querySelectorAll(".li-salmA");
      if(calculatedSpan !== null){
        document.getElementById('span').value = calculatedSpan;
      }
      if(calculatedCurrent !== null){
        document.getElementById('current').value = calculatedCurrent;
      }
      break;
    case 'var-sal' :
      resultLabel.value = null;

      visibleLis = document.querySelectorAll(".li-var-sal");
      if(calculatedSpan !== null){
        document.getElementById('span').value = calculatedSpan;
      }
      if(measuredVar !== null){
        document.getElementById('measured-var').value = measuredVar;
      }
      break;
    case 'sal-inst':
      resultLabel.value = null;
      visibleLis = document.querySelectorAll(".li-sal-inst");
      if(calcVartoSalInst !== null){
        document.getElementById('salidaInst').value = calcVartoSalInst;
      }
      break;
    case 'var-sal-psi':
      resultLabel.value = null;
      visibleLis = document.querySelectorAll(".li-var-sal-psi");
      if(calcSalInst !== null){
        document.getElementById('variable').value = calcSalInst;
      }
      break;
    default:
      break;
  }
  visibleLis.forEach( (li) =>{
    li.classList.remove('hidden');
  });
}


const calculate = () =>{
  if(!selected){
    alert("Debe seleccionar un modo de cálculo");
  }
  const limInf = Number(document.getElementById("lim-inf-range").value);
  const limSup = Number(document.getElementById("lim-sup-range").value);
  const span = Number(document.getElementById("span").value);
  const corrMa = Number(document.getElementById("current").value);
  const measuredVarField = Number(document.getElementById("measured-var").value);
  const salInst = Number(document.getElementById("salidaInst").value);
  const varSalInst = Number(document.getElementById("variable").value);
  let result = null;

  switch (selected) {
    case 'calcSpan':
      result = Calculadora.calcularSpan(limInf, limSup);
      calculatedSpan = result;
      break;
    case 'sal-var':
      result = Calculadora.corrienteToVar(limInf, span, corrMa);
      measuredVar = result;
      break;
    case 'var-sal' :
      result = Calculadora.varToCorrienteMa(limInf, span, measuredVarField);
      calculatedCurrent = result;
      break;
    case 'sal-inst':
      result = Calculadora.psiToVar(limInf, span, salInst);
      calcSalInst = result;
      break;
    case 'var-sal-psi':
      result = Calculadora.varToPsi(limInf, span, varSalInst);
      calcVartoSalInst = result;
      break;
    default:
      break;
  }
  if(typeof result === 'number' && result % 1 === 0){
    resultLabel.value = result;
  }
  else{
    resultLabel.value = result.toFixed(3);
  }
}

//Cada change se crea un evento y ese evento se pasa a handelOptionChange
calcOptions.forEach(Option => {
  Option.addEventListener("change", handleOptionChange);
});

calcButton.addEventListener("click", calculate)

clearButton.addEventListener("click", () =>{
  console.log("clear");
  const inputs = document.querySelectorAll(".form input");
  console.log(inputs);
  inputs.forEach(input => {
    input.value = null;
    selected = null;
    calculatedSpan = null;
    measuredVar = null;
    calculatedCurrent = null;
    calcSalInst = null;
    calcVartoSalInst = null;

  });
});
