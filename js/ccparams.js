function setParameters(p) {
    parameters = {
        ...parameters,
        ...p,
    }
}

function setAndSaveParameters(p) {
  setParameters(p);
  saveParams();
}

function newRandSeed() {
    parameters.randSeed = Math.floor(ccrand() * Math.random() * 99999999);
}

console.log('parameters', parameters)

function saveParams() {
  ccSaveParams(parameters);
}

let attributes;
function saveAttributes() {
  ccSaveAttributes(attributes);
};
