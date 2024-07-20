var Example = Example || {};

// 加载./example下的所有js文件
function loadJS(url, then = '') {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (typeof then === 'string') {
    then = console.log(url, then);
  }
  script.onload = then;

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

loadJS('./src/examples/basic.js');
loadJS('./src/examples/pan.js');

loadJS('./src/demo.js');