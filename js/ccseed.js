let params = new URLSearchParams(window.location.search);
var seed = params.get("seed");
if (!seed) seed = Math.floor(Math.random() * 1000000000).toString();
console.log('seedjs', seed)
// true if live mode
var isCClive = params.get("preview") === "1" || params.get("live") === "1";
var isCCordinal = false;
