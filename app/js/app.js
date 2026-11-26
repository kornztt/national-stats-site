// 启动：渲染导航，监听 hash 变化切换栏目。
(function () {
  var nav = document.getElementById("main-nav");
  nav.innerHTML = VIEWS.map(function (v) {
    return '<a href="' + v.hash + '">' + v.name + '</a>';
  }).join("");
  window.addEventListener("hashchange", renderView);
  renderView();
})();
