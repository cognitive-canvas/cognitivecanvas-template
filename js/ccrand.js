function ccCreateRand(seed) {
  let mod = BigInt(4294967295);
  let bigInt = BigInt(seed);
  let randomNumber = Number(bigInt % mod);
  //console.log('randomNumber', randomNumber)
  function customRandom() {
    let x = randomNumber;
    return function () {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  }
  return customRandom();
}
console.log('ccrand seed', seed)
var ccrand = ccCreateRand(seed);

