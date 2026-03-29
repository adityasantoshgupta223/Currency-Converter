
const url = "https://api.frankfurter.app/currencies";


export default async function loadCurrencies() {
  const res = await fetch(url);
  return res.json();
}

export async function getValues(currencyCode){
let currencyFactor = {};

  for(let i=0;i<currencyCode.length;i++){

    let base = currencyCode[i];
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=${base}`)
   const resultArr = await response.json()

   currencyFactor[base] = {}

   resultArr.forEach(obj => {
    currencyFactor[base][obj.quote] = obj.rate;
   })
  }
  return currencyFactor;
}

