const captureButtonClick = (id, handler, init) => {
  const btn = document.getElementById(id);
  if (btn) {
      btn.onclick = (e) => handler(e, btn);
      if (init) init(btn);
  }
}

const setInnerHtml = (id, val) => {
  const div = document.getElementById(id);
  if (div) {
      div.innerHTML = val;
  }
}

const setEleValue = (id, val) => {
  const ele = document.getElementById(id);
  if (ele) {
      ele.value = val;
  }
}

const getEleValue = (id) => {
  const ele = document.getElementById(id);
  if (ele) {
      return ele.value;
  }
}

const captureSelect = (id, opts, init, onchange) => {
  const sel = document.getElementById(id);
  if (sel) {
    const color = sel.classList.contains('select-color');
    for (let i = 0; i < opts.length; i++) {
      const option = document.createElement('option');
      option.value = `${i}`;
      if (color)
        option.style.backgroundColor = opts[i];
      else
        option.text = opts[i];
      if (init === i) {
        option.defaultSelected = true;
        if (color)
          sel.style.backgroundColor = opts[i];
      } 
      sel.appendChild(option);
    }
    sel.onchange = (e) => {
      const idx = sel.selectedIndex
      if (color)
        sel.style.backgroundColor = opts[idx];
      onchange(e, idx);
    }
  }
}

const captureNumericInputs = (inputs) => {
  for (let inp of inputs) {
    captureNumericInput(inp, parameters[inp], (e, n) => {
      parameters[inp] = n;
      saveParams();
    })
  }
}

const captureNumericInput = (id, init, handler) => {
  const inp = document.getElementById(id);
  if (inp) {
      inp.value = `${init}`;
      inp.oninput = (e) => {
        const n = Number(inp.value);
        if (!isNaN(n))
          handler(e, n);
      }
  }
}

function hexColor(col) {
  const hex = (col[0] << 16) | (col[1] << 8) | col[2];
  return '#' + (hex | 0x1000000).toString(16).substr(1);
}

function fromHexColor(hex) {
  const red = parseInt(hex.substring(1, 3), 16);
  const green = parseInt(hex.substring(3, 5), 16);
  const blue = parseInt(hex.substring(5, 7), 16);
  return [red, green, blue];
}

const captureRgbColor = (id, init, handler) => {
  const inp = document.getElementById(id);
  if (inp) {
      inp.value = hexColor(init);
      inp.onchange = (e) => {
        const c = fromHexColor(inp.value);
        handler(e, c);
      }
  }
}

