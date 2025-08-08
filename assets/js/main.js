(function ($) {

  "use strict";

  /*
  |--------------------------------------------------------------------------
  |  Name: Binit
  | Author: BinitJha
  | Version: 1.0.0
  |--------------------------------------------------------------------------
  |--------------------------------------------------------------------------
  | TABLE OF CONTENTS:
  |--------------------------------------------------------------------------
  |
  | 1. Placeholder
  | 2. Dynamic Background
  | 3. Menu
  | 4. Sticky Header
  | 5. One Page Navigation
  | 6. Progress Bar
  | 7. Ajax Contact Form And Appointment
  | 8. Light Gallery
  | 9. Social Button Hover
  | 10. Slick Slider
  | 11. particles
  | 12. Ripple
  | 13. Parallax Effect
  */

  /*--------------------------------------------------------------
    Scripts initialization
  --------------------------------------------------------------*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on("load", function () {
    $(window).trigger("scroll");
    $(window).trigger("resize");
    preloaderSetup();
  });

  $(document).on("ready", function () {
    $(window).trigger("resize");
    dynamicBackground();
    formValidation();
    progressBarInit();
    stickyHeader();
    onePageNavigation();
    mainMenu();
    lightGallery();
    socialBtnHover();
    slickInit();
    particles();
    parallaxEffect();
    rippleInit();
    new WOW().init();
  populateProfileData();
  loadMediumFeed();
  themeToggleInit();

  });

  $(window).on("scroll", function () {
    stickyHeader();
    parallaxEffect();
  });

  /*--------------------------------------------------------------
    1. Placeholder
  --------------------------------------------------------------*/
  function preloaderSetup() {
    $(".st-perloader").fadeOut();
    $("st-perloader-in").delay(150).fadeOut("slow");
  }

  /*--------------------------------------------------------------
    2. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    // Background images
    $('.st-dynamic-bg').each(function () {
      var src = $(this).attr('data-src');
      $(this).css({
        'background-image': 'url(' + src + ')'
      });
    });
  }

  /*--------------------------------------------------------------
    3. Menu
  --------------------------------------------------------------*/
  function mainMenu() {
    $('.st-nav').append('<span class="st-munu-toggle"><span></span></span>');
    $('.menu-item-has-children').append('<span class="st-munu-dropdown-toggle"></span>');
    $('.st-munu-toggle').on('click', function () {
      $(this).toggleClass("st-toggle-active").siblings('.st-nav-list').slideToggle();;
    });
    $('.st-munu-dropdown-toggle').on('click', function () {
      $(this).toggleClass('active').siblings('ul').slideToggle();
    });
  }

  /*--------------------------------------------------------------
    4. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $('.st-sticky-header').addClass('st-sticky-active');
    } else {
      $('.st-sticky-header').removeClass('st-sticky-active');
    }
  }

  /*--------------------------------------------------------------
    5. One Page Navigation
  --------------------------------------------------------------*/
  function onePageNavigation() {
    // Click To Go Top
    $('.st-smooth-move').on('click', function () {
      var thisAttr = $(this).attr('href');
      if ($(thisAttr).length) {
        var scrollPoint = $(thisAttr).offset().top - 10;
        $('body,html').animate({
          scrollTop: scrollPoint
        }, 800);
      }
      return false;
    });

    // One Page Active Class
    var topLimit = 300,
      ultimateOffset = 200;

    $('.st-onepage-nav').each(function () {
      var $this = $(this),
        $parent = $this.parent(),
        current = null,
        $findLinks = $this.find("a");

      function getHeader(top) {
        var last = $findLinks.first();
        if (top < topLimit) {
          return last;
        }
        for (var i = 0; i < $findLinks.length; i++) {
          var $link = $findLinks.eq(i),
            href = $link.attr("href");

          if (href.charAt(0) === "#" && href.length > 1) {
            var $anchor = $(href).first();
            if ($anchor.length > 0) {
              var offset = $anchor.offset();
              if (top < offset.top - ultimateOffset) {
                return last;
              }
              last = $link;
            }
          }
        }
        return last;
      }

      $(window).on("scroll", function () {
        var top = window.scrollY,
          height = $this.outerHeight(),
          max_bottom = $parent.offset().top + $parent.outerHeight(),
          bottom = top + height + ultimateOffset;

        var $current = getHeader(top);

        if (current !== $current) {
          $this.find(".active").removeClass("active");
          $current.addClass("active");
          current = $current;
        }
      });
    });
  }


  /*--------------------------------------------------------------
    6. Progress Bar
  --------------------------------------------------------------*/
  function progressBarInit() {
    $('.st-progressbar').each(function () {
      var progressPercentage = $(this).data('progress') + "%";
      $(this).find('.st-progressbar-in').css('width', progressPercentage);
    });
  }


  /*--------------------------------------------------------------
    7. Ajax Contact Form And Appointment
  --------------------------------------------------------------*/
  // Contact Form
  function formValidation() {
    if ($.exists('#contact-form #submit')) {
      $('#st-alert').hide();
  $('#contact-form #submit').on('click', function () {
        var name = $('#name').val();
        var subject = $('#subject').val();
        var phone = $('#phone').val();
        var email = $('#email').val();
        var msg = $('#msg').val();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email)) {
          $('#st-alert').fadeIn().html('<div class="alert alert-danger"><strong>Warning!</strong> Please Enter Valid Email.</div>');
          return false;
        }

        name = $.trim(name);
        subject = $.trim(subject);
        phone = $.trim(phone);
        email = $.trim(email);
        msg = $.trim(msg);

        if (name != '' && email != '' && msg != '') {
          // disable submit to prevent duplicate clicks
          var $btn = $('#contact-form #submit');
          $btn.prop('disabled', true);
          var values = "name=" + name +
            "&subject=" + subject +
            "&phone=" + phone +
            "&email=" + email +
            "&msg=" + msg;
          $.ajax({
            type: "POST",
            url: "assets/php/mail.php",
            data: values,
            success: function () {
              $('#name').val('');
              $('#subject').val('');
              $('#phone').val('');
              $('#email').val('');
              $('#msg').val('');

              $('#st-alert').fadeIn().html('<div class="alert alert-success"><strong>Success!</strong> Email has been sent successfully.</div>');
              setTimeout(function () {
                $('#st-alert').fadeOut('slow');
              }, 4000);
              $btn.prop('disabled', false);
            },
            error: function () {
              // fallback to mailto when server isn't available (e.g., GitHub Pages)
              var mailto = 'mailto:binitjha2000@gmail.com'
                + '?subject=' + encodeURIComponent(subject || 'New message from portfolio')
                + '&body=' + encodeURIComponent('Name: ' + name + (phone ? ('\nPhone: ' + phone) : '') + '\n\n' + msg);
              window.location.href = mailto;
              $btn.prop('disabled', false);
            }
          });
        } else {
          $('#st-alert').fadeIn().html('<div class="alert alert-danger"><strong>Warning!</strong> All fields are required.</div>');
        }
        return false;
      });
    }
  }


  /*--------------------------------------------------------------
    8. Light Gallery
  --------------------------------------------------------------*/
  function lightGallery() {
    $('.st-lightgallery').each(function () {
      $(this).lightGallery({
        selector: '.st-lightbox-item',
        subHtmlSelectorRelative: false,
        thumbnail: false,
        mousewheel: true
      });
    });
  }

  /*--------------------------------------------------------------
    9. Social Button Hover
  --------------------------------------------------------------*/
  function socialBtnHover() {
    $(".st-social-btn").hover(
      function () {
        $(this).addClass("active").siblings().removeClass('active');
      }
    )
  }

  /*--------------------------------------------------------------
    10. Slick Slider
  --------------------------------------------------------------*/ 
  function slickInit() {
    $('.st-slider').each(function () {
      // Slick Variable
      var $ts = $(this).find('.slick-container');
      var $slickActive = $(this).find('.slick-wrapper');
      var $sliderNumber = $(this).siblings('.slider-number');

      // Auto Play
      var autoPlayVar = parseInt($ts.attr('data-autoplay'), 10);
      // Auto Play Time Out
      var autoplaySpdVar = 3000;
      if (autoPlayVar > 1) {
        autoplaySpdVar = autoPlayVar;
        autoPlayVar = 1;
      }
      // Slide Change Speed
      var speedVar = parseInt($ts.attr('data-speed'), 10);
      // Slider Loop
      var loopVar = Boolean(parseInt($ts.attr('data-loop'), 10));
      // Slider Center
      var centerVar = Boolean(parseInt($ts.attr('data-center'), 10));
      // Pagination
      var paginaiton = $(this).children().hasClass('pagination');
      // Slide Per View
      var slidesPerView = $ts.attr('data-slides-per-view');
      if (slidesPerView == 1) {
        slidesPerView = 1;
      }
      if (slidesPerView == 'responsive') {
        var slidesPerView = parseInt($ts.attr('data-add-slides'), 10);
        var lgPoint = parseInt($ts.attr('data-lg-slides'), 10);
        var mdPoint = parseInt($ts.attr('data-md-slides'), 10);
        var smPoint = parseInt($ts.attr('data-sm-slides'), 10);
        var xsPoing = parseInt($ts.attr('data-xs-slides'), 10);
      }
      // Fade Slider
      var fadeVar = parseInt($($ts).attr('data-fade-slide'));
      (fadeVar === 1) ? (fadeVar = true) : (fadeVar = false);

      // Slick Active Code
      $slickActive.slick({
        infinite: true,
        autoplay: autoPlayVar,
        dots: paginaiton,
        centerPadding: '0',
        speed: speedVar,
        infinite: loopVar,
        autoplaySpeed: autoplaySpdVar,
        centerMode: centerVar,
        fade: fadeVar,
        prevArrow: $(this).find('.slick-arrow-left'),
        nextArrow: $(this).find('.slick-arrow-right'),
        appendDots: $(this).find('.pagination'),
        slidesToShow: slidesPerView,
        responsive: [{
          breakpoint: 1600,
          settings: {
            slidesToShow: lgPoint
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: mdPoint
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: smPoint
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: xsPoing
          }
        }
        ]
      });
    })
  }
  /*--------------------------------------------------------------
    11. particles
  --------------------------------------------------------------*/ 
  function particles() {
    if ($.exists('#particles-js')) {
      particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 355,
            "density": {
              "enable": true,
              "value_area": 789.1476416322727
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.48927153781200905,
            "random": false,
            "anim": {
              "enable": true,
              "speed": 0.6,
              "opacity_min": 0,
              "sync": false
            }
          },
          "size": {
            "value": 2,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 5,
              "size_min": 0,
              "sync": false
            }
          },
          "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 0.2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "bubble"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 83.91608391608392,
              "size": 1,
              "duration": 3,
              "opacity": 1,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  }
  /*--------------------------------------------------------------
    12. Ripple
  --------------------------------------------------------------*/
  function rippleInit() {
    if ($.exists('.st-ripple-version')) {
      $('.st-ripple-version').each(function () {
        $('.st-ripple-version').ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
        });
      });
    }
  }

  /*--------------------------------------------------------------
    13. Parallax Effect
  --------------------------------------------------------------*/
  function parallaxEffect() {
    $('.st-parallax').each(function() {
      var windowScroll = $(document).scrollTop(),
        windowHeight = $(window).height(),
        barOffset = $(this).offset().top,
        barHeight = $(this).height(),
        barScrollAtZero = windowScroll - barOffset + windowHeight,
        barHeightWindowHeight = windowScroll + windowHeight,
        barScrollUp = barOffset <= (windowScroll + windowHeight),
        barSctollDown = barOffset + barHeight >= windowScroll;

      if (barSctollDown && barScrollUp) {
        var calculadedHeight = barHeightWindowHeight - barOffset;
        var largeEffectPixel = ((calculadedHeight / 5));
        var mediumEffectPixel = ((calculadedHeight / 20));
        var miniEffectPixel = ((calculadedHeight / 10));

        $(this).find('.st-to-left').css('transform', `translateX(-${miniEffectPixel}px)`);
        $(this).find('.st-to-right').css('transform', `translateX(${miniEffectPixel}px)`);
        $(this).css('background-position', `center -${largeEffectPixel}px`);
      }
    });
  }
})(jQuery); // End of use strict

// ------------------ Custom Content Population ------------------
function populateProfileData() {
  try {
    fetch('assets/data/profile.json', { cache: 'no-store' })
      .then(function (r) { 
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json(); 
      })
      .then(function (data) {
        if (!data) throw new Error('No data received');
        populateFromData(data);
      })
      .catch(function(e) {
        console.log('Profile data load failed, using fallback:', e);
        // Load fallback data if fetch fails
        loadFallbackData();
      });
  } catch (e) {
    console.log('Profile data init failed:', e);
    loadFallbackData();
  }
}

function loadFallbackData() {
  // If JSON loading fails, populate with the data directly
  var fallbackData = {
    "summary": [
      "AI/ML Engineer with expertise in developing AI agents, anomaly detection systems, and RAG-based solutions",
      "Experience in orchestrating AI workflows using Google Agentspace and Azure OpenAI for intelligent automation",
      "Proficient in building scalable ML infrastructure on GCP and Azure with automated ETL pipelines",
      "Strong background in deep learning, NLP, and reinforcement learning with hands-on project experience",
      "Certified GCP Machine Learning Professional with proven track record in production ML systems"
    ],
    "skills": [
      "Python", "SQL", "Linux", "TensorFlow", "scikit-learn", "Pandas", "NumPy",
      "NLTK", "spaCy", "LangChain", "Hugging Face Transformers", "FAISS", "Docker"
    ],
    "tools": [
      "Google Cloud Platform (GCP)", "Azure Databricks", "BigQuery", "Dataflow",
      "Kafka", "Azure OpenAI", "Azure Cognitive Search", "Azure Blob Storage",
      "Terraform", "OpenAI Gym" , "MLflow", "AutoKeras"
    ],
    "skillBars": [
      { "title": "Python & ML Libraries", "percentage": 95 },
      { "title": "Deep Learning & Neural Networks", "percentage": 90 },
      { "title": "Generative AI & LLMs", "percentage": 75 },
      { "title": "Machine Learning & AI", "percentage": 80 },
    ],
    "concepts": [
      "Machine Learning (Regression, Classification, Clustering)",
      "Deep Learning (CNNs, RNNs, LSTMs, Transformers)",
      "Reinforcement Learning (DQN)", "Generative AI", "Natural Language Processing",
      "Data Analysis", "Data Visualization", "Feature Engineering", "Model Evaluation",
      "Hyperparameter Tuning", "MLOps", "DevOps", "Time Series Analysis",
      "Anomaly Detection", "Retrieval-Augmented Generation (RAG)"
    ],
    "experience": [
      {
        "title": "Associate",
        "company": "Cognizant Technology Solutions",
        "location": "Bengaluru, India",
        "start": "Sep 2021",
        "end": "Present",
        "bullets": [
          "Orchestrated AI agents via Google Agentspace to proactively detect and prioritize billing discrepancies",
          "Developed automated pipelines on GCP, utilizing BigQuery and Dataflow, to integrate diverse billing, usage, and contract data for AI-driven anomaly detection",
          "Designed and implemented a multi-layered AI/ML detection framework, integrating rule-based systems with unsupervised anomaly detection",
          "Applied Time Series Analysis for pattern recognition and utilized supervised classification models (Logistic Regression, SVM, Gradient Boosting)",
          "Architected Azure infrastructure for a Retrieval-Augmented Generation chatbot, leveraging Azure OpenAI and Azure Cognitive Search",
          "Built Python pipelines for RAG, integrating Azure OpenAI embeddings, Azure Cognitive Search vector capabilities, and contextual data retrieval",
          "Achieved 30-40% manual effort reduction via Python automation for various workflows"
        ]
      }
    ],
    "education": [
      {
        "degree": "M.Tech in Artificial Intelligence and Machine Learning",
        "school": "BITS Pilani",
        "end": "Expected July 2025",
        "details": "Advanced studies in AI/ML focusing on machine learning algorithms and artificial intelligence applications"
      },
      {
        "degree": "B.E in Electronics and Communication",
        "school": "Sir M. Visvesvaraya Institute of Technology",
        "end": "May 2021",
        "details": "CGPA: 7.82/10, Bangalore, India"
      }
    ],
    "portfolio": [
      {
        "title": "AgentAI Support Chatbot",
        "stack": "NLP, RAGs, GENAI, Python, LangChain, Hugging Face",
        "description": "Advanced chatbot system combining intent recognition with retrieval-augmented generation for automated task execution and intelligent user support.",
        "bullets": [
          "Developed an intent-driven chatbot to automate task execution by accurately understanding user requests",
          "Engineered a Retrieval-Augmented Generation (RAG) system using LangChain and FAISS",
          "Leveraged google/flan-t5-large language model for generating accurate responses"
        ],
        "image": "assets/img/portfolio/nlp-project.jpg",
        "repo": "https://github.com/binitjha/agentai-support-chatbot"
      },
      {
        "title": "LoRA Fine-tuning for DistilBERT",
        "stack": "Hugging Face Transformers, PEFT, DistilBERT, PyTorch",
        "description": "Efficient parameter fine-tuning technique achieving comparable performance with significantly reduced computational requirements using LoRA adapters.",
        "bullets": [
          "Implemented LoRA fine-tuning for DistilBERT on SST-2 dataset",
          "Achieved comparable accuracy with only 1.8% of total parameters trained",
          "Applied LoRA adapters across Transformer layers for comprehensive adaptation"
        ],
        "image": "assets/img/portfolio/ai-project.jpg",
        "repo": "https://github.com/binitjha/lora-distilbert-sst2"
      },
      {
        "title": "Real-time Fraud Detection System",
        "stack": "scikit-learn, AutoKeras, MLflow, Python",
        "description": "High-performance fraud detection system with real-time processing capabilities and automated model deployment for financial transaction monitoring.",
        "bullets": [
          "Developed real-time fraud detection using Python and Scikit-learn",
          "Implemented MLflow tracking for experiment management and model versioning",
          "Built automated model deployment pipeline with performance monitoring"
        ],
        "image": "assets/img/portfolio/ml-project.jpg",
        "repo": "https://github.com/binitjha/fraud-detection-system"
      },
      {
        "title": "Predictive Maintenance System",
        "stack": "Python, TensorFlow, LSTM, Pandas, NumPy",
        "description": "Advanced machine learning system for predicting equipment failures using time-series analysis and deep learning techniques for industrial applications.",
        "bullets": [
          "Utilized LSTM networks for analyzing time-series machinery performance data",
          "Implemented failure prediction using NASA's Turbofan Engine Degradation Dataset",
          "Achieved early warning system for potential machinery failures"
        ],
        "image": "assets/img/portfolio/space-project.jpg",
        "repo": "https://github.com/binitjha/predictive-maintenance"
      },
      {
        "title": "Deep RL Spaceship Navigation",
        "stack": "CNN, TensorFlow, OpenAI Gym, Deep Q-Network",
        "description": "Intelligent navigation system using deep reinforcement learning for autonomous spaceship control in complex environments with obstacle avoidance.",
        "bullets": [
          "Developed DQN agent with CNNs for autonomous spaceship navigation",
          "Implemented collision avoidance in simulated asteroid field environment",
          "Demonstrated expertise in deep reinforcement learning principles"
        ],
        "image": "assets/img/portfolio/portfolio1.jpg",
        "repo": "https://github.com/binitjha/spaceship-navigation-drl"
      }
    ]
  };
  populateFromData(fallbackData);
}

function populateFromData(data) {
  try {
        // Hide static content sections first
        jQuery('#experience-static').hide();
        jQuery('#education-static').hide();
        
        var summary = Array.isArray(data.summary) ? data.summary : [];
        var certs = Array.isArray(data.certifications) ? data.certifications : [];
        var skills = Array.isArray(data.skills) ? data.skills : [];
        var tools = Array.isArray(data.tools) ? data.tools : [];
        var skillBars = Array.isArray(data.skillBars) ? data.skillBars : [];
        var concepts = Array.isArray(data.concepts) ? data.concepts : [];
        var experience = Array.isArray(data.experience) ? data.experience : [];
        var education = Array.isArray(data.education) ? data.education : [];
        var portfolio = Array.isArray(data.portfolio) ? data.portfolio : [];

        var $summary = jQuery('#summary-list');
        if ($summary.length && summary.length) {
          $summary.empty();
          summary.forEach(function (item) { $summary.append('<li>' + item + '</li>'); });
        }

        var $certs = jQuery('#certifications-list');
        if ($certs.length && certs.length) {
          $certs.empty();
          certs.forEach(function (c) { $certs.append('<li>' + c + '</li>'); });
        }

        var $skills = jQuery('#skills-chips');
        if ($skills.length && skills.length) {
          $skills.empty();
          skills.forEach(function (s) { $skills.append('<span class="chip">' + s + '</span>'); });
        }
        var $tools = jQuery('#tools-chips');
        if ($tools.length && tools.length) {
          $tools.empty();
          tools.forEach(function (t) { $tools.append('<span class="chip">' + t + '</span>'); });
        }
        var $concepts = jQuery('#concepts-chips');
        if ($concepts.length && concepts.length) {
          $concepts.empty();
          concepts.forEach(function (c) { $concepts.append('<span class="chip">' + c + '</span>'); });
        }

        // Render skill bars
        var $skillBarsContainer = jQuery('.st-progressbar-wrap');
        if ($skillBarsContainer.length && skillBars.length) {
          var skillBarHtml = '';
          skillBars.forEach(function (skill, index) {
            var delay = (index + 1) * 0.2; // Progressive delay for animation
            skillBarHtml += 
              '<div class="st-single-progressbar">\n' +
              '  <div class="st-progressbar-heading">\n' +
              '    <h3 class="st-progressbar-title">' + skill.title + '</h3>\n' +
              '    <div class="st-progressbar-percentage wow fadeInLeft" data-wow-duration="1.5s" data-wow-delay="' + delay + 's">' + skill.percentage + '%</div>\n' +
              '  </div>\n' +
              '  <div class="st-progressbar" data-progress="' + skill.percentage + '">\n' +
              '    <div class="st-progressbar-in wow fadeInLeft"></div>\n' +
              '  </div>\n' +
              '</div>';
            
            // Add spacing between bars except for the last one
            if (index < skillBars.length - 1) {
              skillBarHtml += '<div class="st-height-b30 st-height-lg-b20"></div>\n';
            }
          });
          $skillBarsContainer.html(skillBarHtml);
        }

        // Optional: override portfolio GitHub links if specific URLs provided
        if (data.projects) {
          if (data.projects.predictive) jQuery('#proj-github-predictive').attr('href', data.projects.predictive);
          if (data.projects.drl) jQuery('#proj-github-drl').attr('href', data.projects.drl);
          if (data.projects.nlp) jQuery('#proj-github-nlp').attr('href', data.projects.nlp);
          if (data.projects.churn) jQuery('#proj-github-churn').attr('href', data.projects.churn);
        }

        // Render experience
        var $expList = jQuery('#experience-list');
        if ($expList.length && experience.length) {
          var expHtml = '';
          experience.forEach(function (job) {
            var dates = [job.start, job.end].filter(Boolean).join(' - ');
            var bullets = Array.isArray(job.bullets) ? job.bullets.map(function (b) { return '<p>• ' + b + '</p>'; }).join('') : '';
            expHtml += '\n<div class="st-resume-timeline">\n' +
              '  <h3 class="st-resume-timeline-title">' + (job.title || '') + '</h3>\n' +
              '  <div class="st-resume-timeline-duration">' + dates + '</div>\n' +
              '  <h4 class="st-resume-timeline-subtitle">' + (job.company || '') + (job.location ? (', ' + job.location) : '') + '</h4>\n' +
              '  <div class="st-resume-timeline-text">' + bullets + '</div>\n' +
              '</div>\n<div class="st-height-b50 st-height-lg-b30"></div>';
          });
          $expList.html('<div class="st-resume-timeline-wrap">' + expHtml + '</div>');
        }

        // Render education
        var $eduList = jQuery('#education-list');
        if ($eduList.length && education.length) {
          var eduHtml = '';
          education.forEach(function (ed) {
            eduHtml += '\n<div class="st-resume-timeline">\n' +
              '  <h3 class="st-resume-timeline-title">' + (ed.degree || '') + '</h3>\n' +
              '  <div class="st-resume-timeline-duration">' + (ed.end || '') + '</div>\n' +
              '  <h4 class="st-resume-timeline-subtitle">' + (ed.school || '') + '</h4>\n' +
              '  <div class="st-resume-timeline-text"><p>' + (ed.details || '') + '</p></div>\n' +
              '</div>\n<div class="st-height-b50 st-height-lg-b30"></div>';
          });
          $eduList.html('<div class="st-resume-timeline-wrap">' + eduHtml + '</div>');
        }

        // Render portfolio
        var $pfRow = jQuery('#portfolio-row');
        if ($pfRow.length && portfolio.length) {
          var pfHtml = '';
          portfolio.forEach(function (p) {
            var repoBtn = p.repo ? '<a class="st-btn st-style1 st-color1" href="' + p.repo + '" target="_blank" rel="noopener" aria-label="View ' + (p.title || 'Project') + ' on GitHub"><i class="fab fa-github"></i> GitHub</a>' : '';
            var bullets = Array.isArray(p.bullets) ? p.bullets.slice(0, 3).map(function (b) { return '<li>' + b + '</li>'; }).join('') : '';
            
            pfHtml += 
              '<div class="col-lg-4 col-md-6">\n' +
              '  <div class="st-portfolio-single st-style1">\n' +
              '    <div class="st-portfolio-item">\n' +
              '      <div class="st-portfolio-img">\n' +
              '        <img src="' + (p.image || 'assets/img/portfolio/portfolio1.jpg') + '" alt="' + (p.title || 'Project') + ' thumbnail" loading="lazy">\n' +
              '      </div>\n' +
              '      <div class="st-portfolio-content">\n' +
              '        <h4 class="st-portfolio-title">' + (p.title || '') + '</h4>\n' +
              '        <div class="st-portfolio-tech">' + (p.stack || '') + '</div>\n' +
              '        <div class="st-portfolio-description">' + (p.description || '') + '</div>\n' +
              '        <div class="st-portfolio-features">\n' +
              '          <ul>' + bullets + '</ul>\n' +
              '        </div>\n' +
              '        <div class="st-portfolio-actions">\n' +
              '          ' + repoBtn + '\n' +
              '        </div>\n' +
              '      </div>\n' +
              '    </div>\n' +
              '  </div>\n' +
              '</div>';
          });
          $pfRow.html(pfHtml);
        }
        
        // Reinitialize progress bar animations
        initializeProgressBars();
        
        console.log('Profile data loaded successfully');
  } catch (e) {
    console.log('Profile data processing failed:', e);
  }
}

// Function to initialize progress bar animations
function initializeProgressBars() {
  // Reinitialize WOW animations for new elements
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }
  
  // Initialize progress bar animations with reduced logging
  jQuery('.st-progressbar').each(function() {
    var progress = jQuery(this).attr('data-progress');
    var progressBar = jQuery(this).find('.st-progressbar-in');
    
    // Reset and animate with CSS transitions instead of jQuery animate
    progressBar.css({
      'width': '0%',
      'transition': 'width 1.5s ease-in-out'
    });
    
    // Use CSS transition instead of jQuery animate to reduce console noise
    setTimeout(function() {
      progressBar.css('width', progress + '%');
    }, 200);
  });
}

function loadMediumFeed() {
  var container = document.getElementById('medium-feed');
  if (!container) return;
  // Use the public RSS feed via a CORS-friendly proxy API. If blocked, show a fallback link.
  var username = 'binitjha2000';
  var rss = 'https://medium.com/feed/@' + username;
  var api = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rss);

  fetch(api)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || !data.items) throw new Error('No items');
      var posts = data.items.filter(function (it) { return it.categories && it.categories.length; }).slice(0, 6);
      if (!posts.length) throw new Error('No posts');

      var html = '';
      posts.forEach(function (post) {
        var title = post.title || 'Medium Post';
        var link = post.link;
        var pub = new Date(post.pubDate);
        var day = pub.getDate().toString().padStart(2, '0');
        var mon = pub.toLocaleString('en-US', { month: 'short' });
        var thumb = (post.thumbnail || 'assets/img/blog/blog1.jpg');
        html += '\n<div class="col-lg-4 col-md-6">\n  <div class="st-blog-card st-style1">\n    <div class="st-blog-img">\n      <img src="' + thumb + '" alt="Medium post thumbnail" width="341" height="200" loading="lazy">\n    </div>\n    <div class="st-blog-info">\n      <div class="st-blog-date">\n        <span class="st-blog-date-day">' + day + '</span>\n        <span class="st-blog-date-month">' + mon + '</span>\n      </div>\n      <h3 class="st-blog-title">\n        <a href="' + link + '" target="_blank" rel="noopener">' + title + '</a>\n      </h3>\n      <div class="st-blog-text">' + (post.description ? sanitizeSummary(post.description) : '') + '</div>\n      <div class="st-blog-meta">\n        <div class="st-blog-meta-right">\n          <br>\n          <a href="' + link + '" target="_blank" rel="noopener" class="st-blog-btn"><b>Read More</b></a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="st-height-b30 st-height-lg-b30"></div>\n</div>';
      });
      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML = '\n<div class="col-12 text-center">\n  <p>Unable to load Medium posts right now. Visit my Medium profile for latest articles.</p>\n  <a class="st-btn st-style1" href="https://medium.com/@' + username + '" target="_blank" rel="noopener">View on Medium</a>\n</div>';
    });
}

function sanitizeSummary(html) {
  try {
    // strip tags and truncate
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var text = tmp.textContent || tmp.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 180) text = text.slice(0, 180) + '...';
    return text;
  } catch (e) {
    return '';
  }
}

function themeToggleInit() {
  try {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var key = 'theme-mode';
    var saved = localStorage.getItem(key);
    if (saved === 'dark') document.body.classList.add('theme-dark');
    btn.addEventListener('click', function () {
      document.body.classList.toggle('theme-dark');
      var mode = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
      localStorage.setItem(key, mode);
    });
  } catch (e) { }
}