/*globals jQuery, document */
(function ($) {
  "use strict";

  $(document).ready(function(){

    // Tooltip init
    tooltipInit();

    // Init the posts
    postInit();

    // Waypoints
    waypointsInit();

    $(".time").text(function(a,b){
      return Math.round(parseFloat(b))
    });

    /*      Slides       */

    $("a#slide").click(function(){
        $("#sidebar,body,a#slide,#fade").addClass("slide")
    });

    $("#fade,#header,#posts-container").click(function(){
        $("#sidebar,body,a#slide,#fade").removeClass("slide")
    });

    $("a#click-filter").click(function(){
        $("#slide-filter").slideToggle("medium");
        $("#slide-pages").slideOut("medium");
    });

    $("a#click-pages").click(function(){
        $("#slide-pages").slideToggle("medium");
        $("#slide-filter").slideOut("medium");
    });

    /*      End-Slides      */
    /* Jekyll Simple Search option */
    $('.search-field').simpleJekyllSearch({
      jsonFile : '/search.json',
      searchResults : '.search-results',
      template : '<li><article><a href="{url}">{title} <span class="entry-date"><time datetime="{date}">{shortdate}</time></span></a></article></li>',
      noResults: '<p>Nothing found.</p>'
    });
  });

  // Init waypoints for header and footer animations
  function waypointsInit() {
    $('#masthead').waypoint(function(direction) {
      $(this).addClass('animation-on');
    });

    $('#main').waypoint(function(direction) {
      $('#masthead').toggleClass('animation-on');
    });

    $('#footer').waypoint(function(direction) {
      $(this).toggleClass('animation-on');
    } , { offset: 'bottom-in-view' });
  }

  // Init bootstrap tooltip
  function tooltipInit() {
    $('[data-toggle]').tooltip();
  }

  function postInit() {
    // Set lead paragraphs
    $('.post-body p:first-child').addClass('lead');

    // Set feature image
    var featured = $('.featured-image').find('img').attr('src');
    if (featured) {
      $('#masthead').css('backgroundImage','url('+featured+')');
      $('#footer').css('backgroundImage','url('+featured+')');
    };
  }

  (function( $, window, undefined ) {
    var bs = {
        close: $(".icon-remove-sign"),
        searchform: $(".search-form"),
        canvas: $("body"),
        dothis: $('.dosearch')
    };
    bs.dothis.on('click', function() {
      $('.search-wrapper').css({ display: "block" });
      bs.searchform.toggleClass('active');
      bs.searchform.find('input').focus();
      bs.canvas.toggleClass('search-overlay');
    });
    bs.close.on('click', function() {
      $('.search-wrapper').removeAttr( 'style' );
      bs.searchform.toggleClass('active');
      bs.canvas.removeClass('search-overlay');
    });
  })( jQuery, window );
}(jQuery));
