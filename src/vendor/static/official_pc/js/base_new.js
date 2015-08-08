$(function(){
	if($('.wrap_nav_bg').css('padding-bottom') == '60px') return;
	var sTop=$(window).scrollTop();
	isTop(sTop);
	$(window).scroll(function(){
		var sTop=$(window).scrollTop();
		isTop(sTop);
	});
	function isTop(sTop){
		if (sTop>0){
			$('.wrap_nav_bg').css({
				'padding': '0 0',
				'opacity': '0.8',
				'filter': 'alpha(opacity=80)'
			});
			// $('.wrap_nav_bg').addClass('up');
			$('.wrap_nav').css({
				'padding': '0 0'
			});
			$('.wrap_nav .container a.logo img').css({
				'height': '70%',
				'*height': '40px',
				'padding-top': '12px'
			});
		}
		else{
			$('.wrap_nav_bg').css({
				'padding': '13px 0',
				'opacity': '0.2',
				'filter': 'alpha(opacity=20)'
			});
			$('.wrap_nav').css({
				'padding': '13px 0'
			});
			$('.wrap_nav .container a.logo img').css({
				'height': '100%',
				'*height': 'auto',
				'padding-top': '0'
			});
			// $('.wrap_nav_bg').removeClass('up');
		}
	}
	});