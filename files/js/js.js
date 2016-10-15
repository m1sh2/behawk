'use strict';

jQuery(window).on('load',  function() {
  new JCaption('img.caption');
});

jQuery(document).ready(function($){
  $('[class*="icon-"]').each(function(){
    if($(this).html()=='.'){
      $(this).html('');
    }
  });
  $('#system-message-container #system-message .alert .close').click(function(){
    $('#system-message-container #system-message .alert').stop().animate({top:'+=10px'},200).animate({top:'-500px'},500,function(){
      $('#system-message-container #system-message').remove();
    });
  });
  // $('.preloader').hide();
  //$("#slider").DatskoSlider({
  //	timer:20,
  //	content:'.main',
  //	height:300
  //});
  // $('.left .mobilemenu').click(function(){
    // if ($('.left').height()==80) {
      // $('.left').css({'height':'100%'});
      //$('.left .mobilemenu').animate({'left':'0px'},250,function(){
      //	$('.left .mobilemenu').html('&rarr;');
      //});
    // }
    // else{
      // $('.left').css({'height':'80px'});
      //$('.left .mobilemenu').animate({'left':'170px'},250,function(){
      //	$('.left .mobilemenu').html('&larr;');
      //});
    // }
  // });
});












Array.max = function( array ){
  return Math.max.apply( Math, array );
};
Array.min = function( array ){
   return Math.min.apply( Math, array );
};

jQuery(function ($) {
  $.fn.DatskoBox = function(){
    var item = this;
    this.unbind('click');
    this.click(function(){
      var href = item.prop('href');
      var options = {
        height:300,
        width:400,
        iframe:false,
        top:item.offset().top<120?20:item.offset().top-100,
        type:'html'
      };
      event.preventDefault();
      options.top = $(window).scrollTop()+20;
      //console.info($(window).scrollTop());
      if (typeof item.data('options')!='undefined'){
        //console.info(item.data('options'));
        
        var tmp = item.data('options');
        var tmp2 = [];
        var itemoptions = {};
        tmp = tmp.split(',');
        for(var i=0;i<tmp.length;i++){
          tmp2 = tmp[i].split(':');
          itemoptions[tmp2[0]] = tmp2[1];
        }
        for(var option in itemoptions){
          options[option] = itemoptions[option];
        }
        //console.info(options);
      }
      
      var txt = {
        loading:'Loading'
      };
      var win = '<div id="dbox-container" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 1000000;">'
        +'	<div id="dbox-overlay" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.4);" onclick="jQuery(this).parent().remove();"></div>'
        +'	<div id="dbox-wrapper">'
        +'		<div id="dbox-title">'
        +'			<div id="dbox-title-inner"></div>'
        +'		</div>'
        +'		<div id="dbox-wrapper-inner" style="display: block;width:'+options.width+'px;margin: 0 auto;background: #fff;z-index: 1;position: relative;padding: 20px;top: '+options.top+'px;">'
        +'			<a id="dbox-nav-close" title="" onclick="jQuery(this).parent().parent().parent().remove();" style="display: block;position: absolute;right: 0;top: 0;width: 30px;height: 30px;background: #55C95D;font-size: 16px;text-align: center;line-height: 30px;color: #fff;cursor: pointer;z-index: 9;">&#10005</a>'
        +'			<div id="dbox-body">'
        +'				<div id="dbox-body-inner" style="display: block;height:'+options.height+'px;">{content}</div>'
        +'				<div id="dbox-loading">'
        +'					<div id="dbox-loading-inner">'
        +'						<span></span>'
        +'					</div>'
        +'				</div>'
        +'				<div id="dbox-info">'
        +'					<div id="dbox-info-inner">'
        +'						<div id="dbox-counter"></div>'
        +'						<div id="dbox-nav">'
        +'							<a id="dbox-nav-next" title="{next}" onclick="Shadowbox.next()"></a>'
        +'							<a id="dbox-nav-play" title="{play}" onclick="Shadowbox.play()"></a>'
        +'							<a id="dbox-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a>'
        +'							<a id="dbox-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a>'
        +'						</div>'
        +'					</div>'
        +'				</div>'
        +'			</div>'
        +'		</div>'
        +'	</div>'
        +'</div>';
      switch(options.type){
        case'iframe':
          win = win.replace('{content}','<iframe src="'+href+'" style="border:0;width:100%;height:100%;"></iframe>');
          $('body').append(win);
          break;
        default:
          $.ajax(href).done(function(data){
            //console.info(data);
            win = win.replace('{content}',data);
            $('body').append(win);
          });
          break;
      }
      
      return false
    });
    };
  $.fn.DatskoSlider = function(settings){
    var slider = this;
    //slider.find('li').hide().each(function(){
    //	var slide = $(this);
    //});
    if (slider.length>0){
      slider.find('img').width(0);
      
      var width = slider.parent()[0].offsetWidth;
      var height = settings.height;
      console.info(width);
      slider.find('img').width('auto').css({
        'max-height':height,
        'max-width':width
      });
      var t;
      var li;
      var img;
      slider
        .height(slider.find('li:first-child img').height())
        .find('ul').css({
          'height':slider.find('li:first-child img').height()
        })
        .before('<div class="DatskoSliderPreload"><span class="DatskoSliderLoader"></span></div>')
        .after('<span class="DatskoSliderLeft">&larr;</span><span class="DatskoSliderRight">&rarr;</span>')
        .find('li').each(function(){
          li = $(this);
          img = li.find('img');
          
          li.css({
            'background-image':'url('+img.attr('src')+')',
            'height':height,
            'width':width,
            'position':'absolute'
          });
          img.remove();
        });
      $('.DatskoSliderLeft,.DatskoSliderRight')
        .css({
          'line-height': height+'px'
        });
      var slide = function(start){
        if (start==2) {
          clearTimeout(t);
        }
        else if (start==1) {
          slider.find('li').hide();
          slider.find('li:first-child').show();
          loader();
        }
        else{
          clearTimeout(t);
          t = setTimeout(function(){
            next();
            slide(0);
            loader();
          },(settings.timer*1000));
        }
      };
      var loader = function(state){
        if (state==0) {
          $('.DatskoSliderLoader').stop().width(0);
        }
        else{
          $('.DatskoSliderLoader').css('width','0').stop().animate({
              width:'100%'
            },{
            duration: settings.timer*1000,
            specialEasing: {
              width: "linear",
              height: "easeOutBounce"
            },
            complete: function() {
              $( this ).width(0);
            }
          });
        }
        
      };
      var next = function(){
        var next,current;
        //slider.find('li').hide();
        if(slider.find('li:first-child').is(':visible')&&slider.find('li:last-child').is(':visible')){
          slider.find('li').hide();
          current = slider.find('li:last-child');
          next = slider.find('li:first-child');
        }
        else if (slider.find('li:last-child').is(':visible')){
          current = slider.find('li:last-child');
          next = slider.find('li:first-child');
        }
        else{
          current = slider.find('li:visible');
          next = slider.find('li:visible').next();
        }
        current.css('left','0px').stop().animate({
            left:width*-1+'px'
          }, {
          duration: 500,
          specialEasing: {
            width: "linear",
            height: "easeOutBounce"
          },
          complete: function() {
            $( this ).hide();
          }
        });
        next.css('left',width+'px').show().stop().animate({
            left:'0px'
          }, {
          duration: 500,
          specialEasing: {
            width: "linear",
            height: "easeOutBounce"
          },
          complete: function() {
            //$( this ).hide();
          }
        });
      };
      var prev = function(){
        var prev,current;
        //slider.find('li').hide();
        if (slider.find('li:first-child').is(':visible')){
          current = slider.find('li:first-child');
          prev = slider.find('li:last-child');
        }
        else{
          current = slider.find('li:visible');
          prev = slider.find('li:visible').prev();
        }
        current.css('left','0px').stop().animate({
            left:width+'px'
          }, {
          duration: 500,
          specialEasing: {
            width: "linear",
            height: "easeOutBounce"
          },
          complete: function() {
            $( this ).hide();
          }
        });
        prev.css('left',width*-1+'px').show().stop().animate({
            left:'0px'
          }, {
          duration: 500,
          specialEasing: {
            width: "linear",
            height: "easeOutBounce"
          },
          complete: function() {
            //$( this ).hide();
          }
        });
      };
      slide(1);
      slider.hover(function(){
          slide(2);
          loader(0);
        },function(){
          slide(0);
          loader();
        }
      );
      slider.find('li').hover(function(){
          slide(2);
          loader(0);
        },function(){
          slide(0);
          loader();
        }
      );
      $('.DatskoSliderLeft').click(function(){
        prev();
      }).hover(function(){
          slide(2);
          loader(0);
        },function(){
          slide(0);
          loader();
        }
      );
      $('.DatskoSliderRight').click(function(){
        next();
      }).hover(function(){
          slide(2);
          loader(0);
        },function(){
          slide(0);
          loader();
        }
      );
    }
    };
  $('[rel=dbox]').each(function(){
    $(this).DatskoBox();
  });
  //$(document).on("click", '[rel=dbox]', function(event) {
  //	event.preventDefault();
  //	$(this).DatskoBox();
  //});
});



function initialize() {
  var styles = [
    {
      stylers: [
        { hue: "#ffffff" },
        { saturation: 0 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  var mapOptions = {
    // styles: styles,
    center: { lat: 30, lng: 0},
    zoom: 2,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  map.setTilt(45);
  var markers = [
    {
      title: 'Moscow, Russia',
      lat: 55.755826,
      lng: 37.6173
    },
    {
      title: 'Saint Petersburg, Russia',
      lat: 59.9342802,
      lng: 30.3350986
    },
    {
      title: 'Novosibirsk, Novosibirsk Oblast, Russia',
      lat: 55.00835259999999,
      lng: 82.9357327
    },
    {
      title: 'Voronezh, Voronezh Oblast, Russia',
      lat: 51.6754966,
      lng: 39.2088823
    },
    {
      title: 'Kyiv, Ukraine',
      lat: 50.4501,
      lng: 30.5234
    },
    {
      title: 'Kharkiv, Ukraine',
      lat: 49.9935,
      lng: 36.230383
    },
    {
      title: 'Lviv, Ukraine',
      lat: 49.839683,
      lng: 24.029717
    },
    {
      title: 'Odessa, Ukraine',
      lat: 46.482526,
      lng: 30.7233095
    },
    {
      title: 'Atlanta, GA, USA',
      lat: 33.7489954,
      lng: -84.3879824
    },
    {
      title: 'Chicago, IL, USA',
      lat: 41.8781136,
      lng: -87.6297982
    },
    {
      title: 'Toronto, ON, Canada',
      lat: 43.653226,
      lng: -79.3831843
    },
    {
      title: 'San Diego, CA, USA',
      lat: 32.715738,
      lng: -117.1610838
    },
    {
      title: 'Graz, Austria',
      lat: 47.070714,
      lng: 15.439504
    },
    {
      title: 'Nuremberg, Germany',
      lat: 49.44134289100633,
      lng: 11.08245849609375
    },
    {
      title: 'Oslo, Norway',
      lat: 59.89720326334451,
      lng: 10.777587890625
    },
    {
      title: 'Dehli, India',
      lat: 21.566381,
      lng: 73.2205065
    },
    {
      title: 'Astana, Kazahstan',
      lat: 51.1605227,
      lng: 71.4703558
    },
    {
      title: 'Tashkent, Usbekistan',
      lat: 41.266667,
      lng: 69.216667
    }
  ];

  for(var i=0;i<markers.length;i++){
    var title = markers[i].title;
    var lng = markers[i].lng;
  var lat = markers[i].lat;
  var myLatlng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: title,
        icon: '/images/logo-mini-24.png'
    });
    // jQuery.ajax({
    // 	url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+title,
    // 	dataType: 'json'
    // }).done(function(result){
    // 	var lng = result.results[0].geometry.location.lng;
    // 	var lat = result.results[0].geometry.location.lat;
    // 	console.info(result);
    // 	var myLatlng = new google.maps.LatLng(lat,lng);
     //  var marker = new google.maps.Marker({
     //      position: myLatlng,
     //      map: map,
     //      title: title,
     //      icon: '/images/logo-mini-24.png'
     //  });
    // });
    
    
  }
  
  google.maps.event.addListener(map, "rightclick", function(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    // populate yor box/field with lat, lng
    // console.info("Lat=" + lat + "; Lng=" + lng);
  });
}
