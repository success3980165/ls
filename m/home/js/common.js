
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?be321ad69985de46d112e3f1cf2a9f14";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
