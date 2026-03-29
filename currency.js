import loadCurrencies, { getValues } from './conversion.js'


const optionContainer = document.querySelectorAll(".currency");
const result_container = document.querySelector(".Resultbox");
const result_btn = document.getElementById("resultBtn");
const reverse_btn = document.getElementById("reverseBtn");
let currencyCode = [ ];
let currencyFactor = {};

async function init() {
   const data = await loadCurrencies();

   optionContainer.forEach(element => {
    let k = 0;
          Object.keys(data).forEach(code => {
               const option = document.createElement("option");
               option.value = code;
               option.textContent = code;
                element.appendChild(option);
               currencyCode.push(code)
          })
   })
   

  currencyFactor = await getValues(currencyCode);
}

init();

 result_btn.addEventListener('click', async () => {
      result_btn.disabled = true

  const [from, to] = getChoice();

 if(from != null && to != null){
   try {
     const amt = document.getElementById("amount").value;
     
     if(amt == null) return;
     let precision = document.getElementById("precision").value;
      
     let rate = (from === to) ? 1 : currencyFactor[from][to];
     let result = rate*amt;
     result = result.toFixed(precision)

     const resultBox = document.querySelector(".result");
     resultBox.textContent = result;
     result_container.classList.remove("hide");
      
   } finally  {
       result_btn.disabled = false;
   }
 }
    })
    
 reverse_btn.addEventListener('click', () => {
    let [from , to] = getChoice();
    optionContainer[0].value = to;
    optionContainer[1].value = from;
    })


function getChoice(){
  let arr = [];
  optionContainer.forEach(element => {
     arr.push(element.value);
  });
  return arr;
}


