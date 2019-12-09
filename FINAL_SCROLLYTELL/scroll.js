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
    // .addIndicators()
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
    // .addIndicators()
    .addTo(controller);

  ageByDisType3.on('start', () => {
    changeView_2(true, 'none');
  });

  let ageByDisType4 = new ScrollMagic.Scene({
      triggerElement: '#eco-data-title',
      triggerHook: 1
    })
    // .addIndicators()
    .addTo(controller);

  ageByDisType4.setClassToggle('#main', 'fade-out');

  let bucketView = new ScrollMagic.Scene({
      triggerElement: '#earningBucketSection',
      triggerHook: 0
    })
    // .addIndicators()
    .addTo(controller);

  bucketView.on('start', () => {
    erStart();
  });

  let bucketView2 = new ScrollMagic.Scene({
      triggerElement: '#bucket3',
      triggerHook: 0.5
    })
    // .addIndicators()
    .addTo(controller);

  bucketView2.on('start', () => {
    er_dataChange();
    er_drawPieCharts(er_buckets, d3.select('#earningBucketSection'));
  });


  let bucketView3 = new ScrollMagic.Scene({
      triggerElement: '#bucket4',
      triggerHook: 0
    })
    // .addIndicators()
    .addTo(controller);

  bucketView3.setClassToggle('#earningBucketSection', 'fade-out');

  let bucketViewP = new ScrollMagic.Scene({
      triggerElement: '#bucketP',
      triggerHook: 0.3
    })
    // .addIndicators()
    .addTo(controller);

  bucketViewP.on('start', () => {
    pStart();
  });

  let bucketViewEdu = new ScrollMagic.Scene({
      triggerElement: '#bucketEdu',
      triggerHook: 0
    })
    // .addIndicators()
    .addTo(controller);

  bucketViewEdu.setClassToggle('#povertyBucketSection', 'fade-out');

  let bucketViewEdu2 = new ScrollMagic.Scene({
      triggerElement: '#bucketEdu',
      triggerHook: 0
    })
    // .addIndicators()
    .addTo(controller);

  bucketViewEdu2.on('start', () => {
    eduStart();
  })

  let endBucket = new ScrollMagic.Scene({
      triggerElement: '#end-bucket',
      triggerHook: 0
    })
    // .addIndicators()
    .addTo(controller);

  endBucket.setClassToggle('#educationBucketSection', 'fade-out');

  let startSun = new ScrollMagic.Scene({
      triggerElement: '#start-wheel',
      triggerHook: 0.5
    })
    // .addIndicators()
    .addTo(controller);

  startSun.on('start', () => empMainStart());
  let startSun2 = new ScrollMagic.Scene({
      triggerElement: '#start-wheel2',
      triggerHook: 0.5
    })
    // .addIndicators()
    .addTo(controller);

  startSun2.on('start', () => {
    console.log('in');
    cowMainStart()
  });
}