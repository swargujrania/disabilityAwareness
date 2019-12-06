let readyFunction = () => {
  let controller = new ScrollMagic.Controller();

  let cards = document.getElementsByClassName('content-card-row');

  $('.content-card-row').each(function () {
    let ourScene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: '75%',
        triggerHook: 0.75
      })
      //.addIndicators()
      .addTo(controller)

    ourScene
      .setClassToggle(ourScene.triggerElement(), 'fade-in');
  });

  let bucketViz = new ScrollMagic.Scene({
      triggerElement: '#bucket-viz-one-row',
      triggerHook: 0.2
    })
    //.addIndicators()
    .addTo(controller)

  bucketViz
    .setClassToggle('.title-row', 'fade-out');

  bucketViz.on('start', () => {
    start();
  });
}