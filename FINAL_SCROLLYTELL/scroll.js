let readyFunction = () => {
  let controller = new ScrollMagic.Controller();

  // let cards = document.getElementsByClassName('content-card-row');

  $('.content-card-row').each(function () {
    let ourScene = new ScrollMagic.Scene({
        triggerElement: this,
        duration: '75%',
        triggerHook: 0.75
      })
      // .addIndicators()
      .addTo(controller)

    ourScene
      .setClassToggle(ourScene.triggerElement(), 'fade-in');
  });

  let geoViz = new ScrollMagic.Scene({
      triggerElement: '#viz1',
      triggerHook: 0.9
    })
    // .addIndicators()
    .addTo(controller);

  geoViz.setClassToggle(geoViz.triggerElement(), 'fade-in');

  let geoViz2 = new ScrollMagic.Scene({
      triggerElement: '#viz1',
      triggerHook: 0.1
    })
    // .addIndicators()
    .addTo(controller);

  geoViz2.setClassToggle('#viz1', 'stick');

  let geoViz3 = new ScrollMagic.Scene({
      triggerElement: '#viz1',
      triggerHook: 0.1
    })
    // .addIndicators()
    .addTo(controller);

  geoViz3.setClassToggle('#viz2', 'fade-in');

  let ageByDisType = new ScrollMagic.Scene({
      triggerElement: '#age',
      triggerHook: 0.9
    })
    // .addIndicators()
    .addTo(controller);

  ageByDisType.setClassToggle('#geoviz-row', 'fade-out');

  let ageByDisType2 = new ScrollMagic.Scene({
      triggerElement: '#age-last-card',
      triggerHook: 0.5
    })
    .addIndicators()
    .addTo(controller);

  ageByDisType2.on('start', () => {
    selectedVal_2 = "all";
    noneOpacity_2 = 0.8;
    updateChart_2();
  });


  let ageByDisType3 = new ScrollMagic.Scene({
      triggerElement: '#bar-chart-trigger',
      triggerHook: 0
    })
    .addIndicators()
    .addTo(controller);

  ageByDisType3.on('start', () => {
    changeView_2(true, 'none');
  });

  // let bucketViz = new ScrollMagic.Scene({
  //     triggerElement: '#bucket-viz-one-row',
  //     triggerHook: 0.2
  //   })
  //   //.addIndicators()
  //   .addTo(controller)

  // bucketViz
  //   .setClassToggle('.title-row', 'fade-out');

  // bucketViz.on('start', () => {
  //   start();
  // });
}