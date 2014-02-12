$(function () {
  $("div.page-header h1 span").textillate({ in: { effect: "flipInY" }});
  $("div.page-header h1 small").fitText(0.4, { maxFontSize: 18 })
  .textillate({
    initialDelay: 1000,
    in: { effect: "bounceInDown", delay: 3, shuffle: true }
  });
})
