var action;
var ctStr = 1;
var autoTimer;

window.onload = init;

//init
function init(){
	touch();
	
	if(debug == 0){
		document.getElementById('contents').addEventListener(action, function(e){
			e.preventDefault();
		}, false);
	}
	
	var ua = navigator.userAgent;
	if (ua.indexOf('Android') > 0) {
		var onresize = function(){
			//レイアウト再計算を誘発させる
			document.body.style.paddingLeft = '1px';
			setTimeout(function(){
				document.body.style.paddingLeft = 0;
			},0);
		};
		window.addEventListener("resize",onresize,false);
		//GalaxyS2でresizeが発生しない対策
		if (/SC-02C|SC-03D/.test(ua)) {
			var w = screen.width;
			setInterval(function(){
				if (w != screen.width){
					w = screen.width;
					onresize();
				}
			},500);
		}
	}

  switch(colorType){
    case 1:
      document.getElementById('weapon_eff_1').src = image_base_path+"/weapon_eff_r1.png";
      document.getElementById('weapon_eff_2').src = image_base_path+"/weapon_eff_r2.png";
      document.getElementById('bg_gradient1').src = image_base_path+"/bg_gradient_r1.png";
      document.getElementById('bg_gradient2').src = image_base_path+"/bg_gradient_r2.png";
      document.getElementById('masked_type').src = image_base_path+"/type_color_red.png";
      break;
    case 2:
      document.getElementById('weapon_eff_1').src = image_base_path+"/weapon_eff_g1.png";
      document.getElementById('weapon_eff_2').src = image_base_path+"/weapon_eff_g2.png";
      document.getElementById('bg_gradient1').src = image_base_path+"/bg_gradient_g1.png";
      document.getElementById('bg_gradient2').src = image_base_path+"/bg_gradient_g2.png";
      document.getElementById('masked_type').src = image_base_path+"/type_color_green.png";
      break;
    case 3:
      document.getElementById('weapon_eff_1').src = image_base_path+"/weapon_eff_b1.png";
      document.getElementById('weapon_eff_2').src = image_base_path+"/weapon_eff_b2.png";
      document.getElementById('bg_gradient1').src = image_base_path+"/bg_gradient_b1.png";
      document.getElementById('bg_gradient2').src = image_base_path+"/bg_gradient_b2.png";
      document.getElementById('masked_type').src = image_base_path+"/type_color_blue.png";
      break;
  }
  if(card_max - card_now < 10) document.getElementById('card_now').className = 'red';
  document.getElementById('card_now').innerHTML = String(card_now);
  document.getElementById('card_max').innerHTML = " / "+String(card_max);
  document.getElementById('masked_box').style.WebkitMaskBoxImage = "url("+image_base_path+"/s"+("0"+chara).substr(-2)+".png)";
  document.getElementById('chara_main_img').src = image_base_path+"/s"+("0"+chara).substr(-2)+".png";
  document.getElementById('chara_main_img').className = "chara_img"+chara;
  document.getElementById('card_img').src = card_img;
  document.getElementById('masked_card').src = card_img;

  for(var i=1;i<7;i++){
    var rand = Math.floor(Math.random() * 6) + 1;
    var elem = document.getElementById('chara'+i).firstChild;
    elem.src = image_base_path+"/s"+("0"+rand).substr(-2)+".png";
    elem.className = "chara_img"+rand;
  }

	setImg();
	setPreload();
	
	//GREE用
	greepf.requestScrollTo(0, 0);
}

//スマフォ判定
function touch(){
	var touchFlg = false;
	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
		touchFlg = true;
	}
	if (touchFlg == false) {
		action = 'click';
	} else {
		action = 'touchstart';
	}
}

//画像先読み登録
function setPreload(){

	var imgList = [];	
	imgList = document.getElementsByTagName('img');
	
	var checkStatus = function(){
		var ct = 0;
		for(var i=0; i<imgList.length; i++){
			if(imgList[i].complete){
				ct++;
			}
		}
		if(ct == imgList.length){
			setTimeout(gameStart, 300);
		}
		if(ct < imgList.length){
			setTimeout(checkStatus, 100);
		}
	}
	checkStatus();
}

//set img
function setImg(){
	if(debug == 1){
		var path;
		var imgList = document.getElementsByTagName('img');
		for(var i=0; i<imgList.length; i++){
			path = decodeURI(imgList[i].src); 
			path = path.replace('{{image_base_path}}', '.');  
			imgList[i].src = path;
		}
    path = decodeURI(document.getElementById('masked_box').style.WebkitMaskBoxImage);
    path = path.replace('{{image_base_path}}', '.');
    document.getElementById('masked_box').style.WebkitMaskBoxImage = path;
    path = decodeURI(document.getElementById('star1').style.backgroundImage);
    path = path.replace('{{image_base_path}}', '.');
    document.getElementById('star1').style.backgroundImage = path;
    path = decodeURI(document.getElementById('star2').style.backgroundImage);
    path = path.replace('{{image_base_path}}', '.');
    document.getElementById('star2').style.backgroundImage = path;
	}
}

//gameStart
function gameStart(){
	//setMsg();
  scene1();
	
	document.getElementById('field').style.display = "block";
}

//message
function setMsg(){
	var con = document.getElementById('contents');
  con.removeEventListener(action, setMsg, false);
	
	document.getElementById('msg_box').style.display = "block";
	setTimeout(function(){
		document.getElementById('msg_skip').style.opacity = 1;
	},200);
	
	var msg_txt = document.getElementById('msg_txt');
	msg_txt.innerHTML = "";
	
	var msg;
	var i = 1;
	while(typeof window["str"+ ctStr + "_" + i] != "undefined"){
		msg = document.createElement('div');
		msg.className = 'str';
		msg.innerHTML = window["str"+ ctStr + "_" + i];
		msg_txt.appendChild(msg);
		i++;
    msg_txt.style.display = 'none';
    setTimeout(function(){ msg_txt.style.display = 'block'; }, 0);
	}
	ctStr++;
	
	if(typeof window["str"+ ctStr + "_1"] != "undefined"){
		con.addEventListener(action, setMsg, false);
	}else{
		con.removeEventListener(action, setMsg, false);
		con.addEventListener(action, getUrl, false);
	}
	
	skipDef();
}

//message skip
function skipDef(){
	document.getElementById('msg_skip').style.webkitAnimation = "skip1 0.6s ease-out 0 infinite";
	document.getElementById('skip').style.webkitAnimation = "";
}

function skipLoad(){
	document.getElementById('msg_skip').style.webkitAnimation = "";
	document.getElementById('skip').style.webkitAnimation = "skip2 0.6s linear 0 infinite";
}

function getUrl(){
	clearTimeout(autoTimer);
	
	var con = document.getElementById('contents');
	con.removeEventListener(action, getUrl, false);
	skipLoad();
	
	setTimeout(function(){
		con.addEventListener(action, getUrl, false);
		skipDef();
	},10000);
	
	location.href = next_url;
}

function scene1(){
  document.getElementById('contents').addEventListener(action, skipMovie);
  var masked_card_event = function(){
    this.removeEventListener('webkitAnimationEnd');
    this.style.display = 'none';
    touchWait();
    //scene2();
  };
  var bg_glow_event = function(){
    this.removeEventListener('webkitAnimationEnd');
    var chara_main = document.getElementById('chara_main_img');
    var masked_box = document.getElementById('masked_box');
    masked_box.style.left = window.getComputedStyle(chara_main).left;
    masked_box.style.top = window.getComputedStyle(chara_main).top;
    masked_box.style.width = window.getComputedStyle(chara_main).width;
    masked_box.style.height = window.getComputedStyle(chara_main).height;
    masked_box.style.WebkitTransform = window.getComputedStyle(chara_main).WebkitTransform;
    masked_box.style.display = 'block';
    document.getElementById('white_out').style.display = 'block';
    document.getElementById('masked_card').addEventListener('webkitAnimationEnd', masked_card_event);
  };
  document.getElementById('scene1').style.display = 'block';
  document.getElementById('chara_main').addEventListener('webkitAnimationEnd', bg_glow_event);
  for(var i=1;i<7;i++){
    if(i == 5) continue;
    document.getElementById('chara'+i).addEventListener('webkitAnimationEnd', function(){
      this.removeEventListener('webkitAnimationEnd');
      this.style.display = 'none';
    });
  }
  document.getElementById('chara5').addEventListener('webkitAnimationEnd', function(){
    this.removeEventListener('webkitAnimationEnd');
    this.style.display = 'none';
    document.getElementById('dust1').style.display = 'none';
    document.getElementById('dust2').style.display = 'block';
    document.getElementById('obj4L').style.display = 'none';
    document.getElementById('obj4R').style.display = 'none';
  });
}

function touchWait(){
  document.getElementById('touch').style.display = 'block';
  document.getElementById('contents').addEventListener(action, scene2);
}

function scene2(){
  document.getElementById('contents').removeEventListener(action, scene2);
  document.getElementById('touch').style.display = 'none';
  document.getElementById('scene1').style.display = 'none';
  document.getElementById('scene2').style.display = 'block';
  document.getElementById('weapon_eff_arrow').addEventListener('webkitAnimationEnd', function(){
    this.removeEventListener('webkitAnimationEnd');
    this.style.display = 'none';
    document.getElementById('weapon_eff_1').style.display = 'none';
    document.getElementById('weapon_eff_2').style.display = 'block';
    document.getElementById('bg_gradient').style.display = 'block';
    if(rare == 1){
      document.getElementById('star1').style.display = 'block';
      document.getElementById('star2').style.display = 'block';
      try {
        navigator.notification.vibrate(1000);
      } catch(e) {}
    }
    document.getElementById('card').style.display = 'block';
    document.getElementById('card').addEventListener('webkitAnimationEnd', function(){
      document.getElementById('card_num').style.display = 'block';
      setMsg();
    });
  });
}

function skipMovie(){
  document.getElementById('contents').removeEventListener(action, skipMovie);
  document.getElementById('BG_glow').style.display = 'none';
  document.getElementById('obj4L').style.display = 'none';
  document.getElementById('obj4R').style.display = 'none';
  document.getElementById('black_lines_A').style.display = 'none';
  document.getElementById('black_lines_B').style.display = 'none';
  for(var i=1;i<7;i++) document.getElementById('chara'+i).style.display = 'none';
  document.getElementById('dust1').style.display = 'none';
  document.getElementById('dust2').style.display = 'none';
  document.getElementById('obj2').style.WebkitAnimation = 'dummy';
  document.getElementById('BF').style.WebkitAnimation = 'dummy';
  document.getElementById('ground_shadow').style.WebkitAnimation = 'dummy';
  document.getElementById('chara_main').style.WebkitAnimation = 'dummy';
  var chara_main = document.getElementById('chara_main_img');
  var masked_box = document.getElementById('masked_box');
  masked_box.style.left = window.getComputedStyle(chara_main).left;
  masked_box.style.top = window.getComputedStyle(chara_main).top;
  masked_box.style.width = window.getComputedStyle(chara_main).width;
  masked_box.style.height = window.getComputedStyle(chara_main).height;
  masked_box.style.WebkitTransform = window.getComputedStyle(chara_main).WebkitTransform;
  masked_box.style.display = 'block';
  document.getElementById('white_out').style.display = 'block';
  document.getElementById('masked_card').addEventListener('webkitAnimationEnd', function(){
    this.removeEventListener('webkitAnimationEnd');
    this.style.display = 'none';
  });
  touchWait();
}