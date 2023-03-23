async function ccFetchBlobFromParams(fname, mime) {
  const message = { type: "load_params_file_as_blob", fname, mime };
  const promise = new Promise((resolve) => {
    function listener(event) {
      if (event.data.type === "loaded_params_file_as_blob") {
        window.removeEventListener("message", listener);
        resolve(event.data.blob);
      }
    }
    window.addEventListener("message", listener);
  });
  window.top.postMessage(message, "*");
  return promise;
}

async function ccFetchUrlFromParams(fname, mime) {
  if (isCClive) {
    try {
      const blob = await ccFetchBlobFromParams(fname, mime);
      return URL.createObjectURL(blob);
    } catch (e) {
      const blob = new Blob([JSON.stringify(parameters)], { type: "application/json" });
      return URL.createObjectURL(blob);
    }
  } else if (isCCordinal) {
    const blob = new Blob([JSON.stringify(parameters)], { type: "application/json" });
    return URL.createObjectURL(blob);
  } else {
    return `./params/${fname}`;
  }
}
