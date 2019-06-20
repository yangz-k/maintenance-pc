
export function MP(ak) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
      script.onerror = reject;
      script.onload = resolve;
      document.head.appendChild(script);
    })
}
