(function() {
  var BackCrowd, BackScene, BackSky, Card2, CardScene, Charactor, Dust, DustA, DustB, DustC, Ground, MySprite, Shine,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  He.MyPage = (function(_super) {

    __extends(MyPage, _super);

    function MyPage() {
      He.d('MyPage', 'constructor');
      this.cls = He.MyPage;
      this.conf = He.animations.mypage;
      this.cls.images = ['./images/bf_sky.png', './images/bf1_32.png', './images/BG_glow.png', './images/obj2_grp.png', './images/ground_shadow.png', './images/type_color_green.png', './images/touch_touch.png', './images/dust_anim.png', './images/obj4.png', './images/s01.png', './images/s02.png', './images/s03.png', './images/s04.png', './images/s05.png', './images/s06.png', './images/bg_gradient_g1.png', './images/bg_gradient_g2.png', './images/window.png', './images/skip.png', './images/card_num_back.png'];
      MyPage.__super__.constructor.apply(this, arguments);
    }

    MyPage.prototype.startCore = function() {
      var _this = this;
      He.d('MyPage', 'startCore');
      this.root = new BackScene(He.game.width, He.game.height);
      this.root._element.id = 'myPageRoot';
      He.game.pushScene(this.root);
      $('#enchant-stage').append(this.conf.api.response.vars.html);
      He.Com.flipDiv('myPageRoot', 'status', 'btn_3');
      $('#friend_manage').bind('click', function() {
        var message, opt;
        message = '仲間はいません';
        opt = {
          w: 320,
          h: 100,
          x: 0,
          y: 25,
          effect: 'appear',
          type: 'console',
          ms: 2000
        };
        He.Com.sysMessage(message, opt);
        return false;
      });
      $('#btn_1').bind('click', function() {
        He.Animation.setStatus(He.status.waitingForLoad);
        $.post('/api/tests/do_quest/hoge.json', {
          foo: 'bar',
          hoge: 'fuga'
        }, function(json) {
          He.d('MyPage', 'api respond', json);
          if (json.status === 200) {
            He.game.attachApiResult(json);
            return He.game.doAnimation(json.exec);
          }
        }, 'json');
        _this.root.i = 0;
        return _this.root.addEventListener('enterframe', _this.root.charLoop);
      });
      return $('#card_manage').bind('click', function() {
        var image, images, _i, _len;
        _this.root.expandMainDiv();
        images = ['/images/cards/smart/large/1.jpg', '/images/cards/smart/large/2.jpg', '/images/cards/smart/large/3.jpg'];
        _this.addAssets(images);
        _this.root = new CardScene(He.game.width, He.game.height - 40);
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          _this.root.addCard(image);
        }
        He.game.pushScene(_this.root);
        return false;
      });
    };

    return MyPage;

  })(He.Animation);

  He.classes.mypage = He.MyPage;

  BackScene = (function(_super) {

    __extends(BackScene, _super);

    function BackScene(w, h, x, y) {
      var center_x;
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackScene.__super__.constructor.call(this, w, h, x, y);
      BackScene.prototype.me = this;
      this.children = [];
      center_x = He.game.width / 2;
      this.addChild(new BackSky(0, -190));
      this.shine = new Shine(60, 40);
      this.addChild(this.shine);
      this.addChild(new DustB(0, 20));
      this.addChild(new BackCrowd(0, 110));
      this.addChild(new Ground(0, 160));
    }

    BackScene.prototype.charLoop = function() {
      if (this.i >= 12) this.i = 0;
      if (this.i % 6 === 0) this.addChild(new Charactor(this.i / 6 + 1));
      this.i++;
      if (He.Animation.getStatus() >= He.status.startedMainAnimation) {
        this.removeEventListener('enterframe', this.charLoop);
      }
      if (He.Animation.getStatus() >= He.status.startedMainAnimation) {
        return this.shine.addEventListener('enterframe', this.shine.loopFrame);
      }
    };

    BackScene.prototype.expandMainDiv = function() {
      var page;
      page = document.getElementById('page');
      page.style.webkitTransition = "-webkit-Transform 400ms ease-in";
      return page.style.webkitTransform = "translateY(130px)";
    };

    return BackScene;

  })(He.Scene);

  MySprite = (function(_super) {

    __extends(MySprite, _super);

    function MySprite(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      MySprite.__super__.constructor.call(this, w, h);
      this.x = x;
      this.y = y;
      this.i = 0;
    }

    MySprite.prototype.fimageFit2Sprite = function() {
      return this._element.style.WebkitBackgroundSize = this.width + 'px, ' + this.height + 'px';
    };

    return MySprite;

  })(Sprite);

  CardScene = (function(_super) {

    __extends(CardScene, _super);

    function CardScene(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      CardScene.__super__.constructor.call(this, w, h, x, y);
      CardScene.prototype.me = this;
      this.backgroundColor = 'black';
    }

    CardScene.prototype.addCard = function(asset) {
      var elem;
      elem = new Card2(asset);
      console.log(elem);
      return this.addChild(elem);
    };

    return CardScene;

  })(He.Scene);

  Card2 = (function(_super) {

    __extends(Card2, _super);

    function Card2(asset, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Card2.__super__.constructor.call(this, 320, 400, x, y);
      this.image = He.game.getAsset(asset);
      this.fimageFit2Sprite();
    }

    return Card2;

  })(MySprite);

  BackSky = (function(_super) {

    __extends(BackSky, _super);

    function BackSky(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackSky.__super__.constructor.call(this, 320, 400, x, y);
      this.image = He.game.getAsset('./images/bf1_32.png');
      this.fimageFit2Sprite();
    }

    return BackSky;

  })(MySprite);

  BackCrowd = (function(_super) {

    __extends(BackCrowd, _super);

    function BackCrowd(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackCrowd.__super__.constructor.call(this, 330, 65, x, y);
      this.image = He.game.getAsset('./images/obj2_grp.png');
      this.opacity = 0.8;
      this.fimageFit2Sprite();
    }

    return BackCrowd;

  })(MySprite);

  Ground = (function(_super) {

    __extends(Ground, _super);

    function Ground(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Ground.__super__.constructor.call(this, 330, 200, x, y);
      this.image = He.game.getAsset('./images/ground_shadow.png');
      this.fimageFit2Sprite();
    }

    return Ground;

  })(MySprite);

  Shine = (function(_super) {

    __extends(Shine, _super);

    function Shine(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Shine.__super__.constructor.call(this, 217, 217, x, y);
      this.image = He.game.getAsset('./images/BG_glow.png');
      this._element.style.webkitTransformOrigin = '50% 50%';
      this.opacity = 0;
      this.scale(1.6);
      this.stopFrame = null;
      this.shrinkFrame = null;
      this.removeFrame = null;
    }

    Shine.prototype.loopFrame = function() {
      this.visible = true;
      if (He.Animation.getStatus() >= He.status.startedMainAnimation) {
        if (!(this.stopFrame != null) || this.stopFrame >= this.i) {
          if (this.opacity < 1) this.opacity += 0.1;
          this.scale(1.012);
        }
        if (this.removeFrame == null) {
          this.shrinkFrame = this.i + 25;
          this.shrinkFrame = this.i + 60;
          this.removeFrame = this.i + 110;
        }
      }
      if ((this.shrinkFrame != null) && this.shrinkFrame <= this.i) {
        if (this.opacity > 0) this.opacity -= 0.13;
        this.scale(0.98);
      }
      if ((this.removeFrame != null) && this.removeFrame === this.i) {
        this.opacity = 0;
        this.removeEventListener('enterframe', this.loopFrame);
        this.visible = false;
        this.stopFrame = null;
        this.shrinkFrame = null;
        this.removeFrame = null;
      }
      return this.i++;
    };

    return Shine;

  })(MySprite);

  Dust = (function(_super) {

    __extends(Dust, _super);

    function Dust(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Dust.__super__.constructor.call(this, 290, 181, x, y);
      this.y_org = y;
      this.image = He.game.getAsset('./images/dust_anim.png');
      this.fimageFit2Sprite();
      this.typeFirstAction();
      this.addEventListener('enterframe', this.showDust);
    }

    Dust.prototype.showDust = function() {
      this.typeFrameAction();
      if (BackScene.prototype.me.status === 'shine') {
        this.opacity = 0;
        this.removeEventListener('enterframe', arguments.callee);
      }
      return this.i++;
    };

    Dust.prototype.typeFirstAction = function() {};

    Dust.prototype.typeAnimation = function() {};

    Dust.prototype.afterSweep = function() {
      this.opacity = 1;
      return this.addEventListener('enterframe', this.showDust);
    };

    return Dust;

  })(MySprite);

  DustA = (function(_super) {

    __extends(DustA, _super);

    function DustA() {
      DustA.__super__.constructor.apply(this, arguments);
    }

    DustA.prototype.typeFirstAction = function() {
      return this.rotate(180);
    };

    DustA.prototype.typeFrameAction = function() {
      var frame;
      frame = this.i % 12;
      if (frame === 0) {
        this.scaleX = this.scaleY = 1;
        return this.y = this.y_org;
      } else {
        this.scale(1.03);
        this.moveBy(0, -7);
        return this.opacity -= 0.03;
      }
    };

    return DustA;

  })(Dust);

  DustB = (function(_super) {

    __extends(DustB, _super);

    function DustB() {
      DustB.__super__.constructor.apply(this, arguments);
    }

    DustB.prototype.typeFrameAction = function() {
      var frame;
      frame = this.i % 27;
      if (frame === 0) {
        this.scaleX = this.scaleY = 1;
        return this.y = this.y_org;
      } else {
        this.scale(1.01);
        return this.moveBy(0, -2);
      }
    };

    return DustB;

  })(Dust);

  DustC = (function(_super) {

    __extends(DustC, _super);

    function DustC() {
      DustC.__super__.constructor.apply(this, arguments);
    }

    DustC.prototype.typeFirstAction = function() {
      return this.rotate(180);
    };

    DustC.prototype.typeFrameAction = function() {
      var frame;
      frame = this.i % 35;
      if (frame === 0) {
        this.scaleX = this.scaleY = 1;
        this.opacity = 0.6;
        return this.y = this.y_org;
      } else if (frame === 19) {
        this.scale(2);
        return this.y -= 5;
      } else if (frame > 19) {
        this.scale(1.005);
        this.moveBy(0, -3.5);
        return this.opacity -= 0.03;
      }
    };

    return DustC;

  })(Dust);

  Charactor = (function(_super) {

    __extends(Charactor, _super);

    Charactor.prototype.conf = {
      1: {
        init: {
          x: 150,
          y: 60
        },
        origin: '-15% 100%',
        scale: {
          init: 0.038,
          speed: 1.84,
          speed_v: -0.074,
          speed_bottom: 1.12
        },
        move: {
          x: 1,
          y: -0.5
        },
        char: null,
        last: 23
      },
      2: {
        init: {
          x: 80,
          y: 60
        },
        origin: '120% 100%',
        scale: {
          init: 0.035,
          speed: 1.87,
          speed_v: -0.1,
          speed_bottom: 1.13
        },
        move: {
          x: -5,
          y: -0.5
        },
        char: null,
        last: 23
      },
      3: {
        init: {
          x: 130,
          y: 60
        },
        origin: '-5% 100%',
        scale: {
          init: 0.04,
          speed: 1.67,
          speed_v: -0.065,
          speed_bottom: 1.09
        },
        move: {
          x: 5,
          y: -0.5
        },
        char: null,
        last: 23
      }
    };

    function Charactor(num) {
      var char, sp;
      if (num == null) num = 1;
      this.opt = this.conf[num];
      Charactor.__super__.constructor.call(this, 104, 122, this.opt.init.x, this.opt.init.y);
      char = this.opt.char === null ? Math.floor(Math.random() * 6) + 1 : this.opt.char;
      this.image = He.game.getAsset('./images/s0' + char + '.png');
      this._element.style.webkitTransformOrigin = this.opt.origin;
      this.scale(this.opt.scale.init);
      this.fimageFit2Sprite();
      sp = this.opt.scale.speed;
      this.i = 0;
      this.addEventListener('enterframe', function() {
        if (this.i === this.opt.last) {
          this.opacity = 0;
          this.removeEventListener('enterframe', arguments.callee);
          BackScene.prototype.me.removeChild(this);
        } else if (this.i >= this.opt.shine) {
          if (this.i === this.opt.shine) {
            this.org_image = this.image;
            this.alpha = 0.5;
            this.cardY = 0;
            this.colorImg = He.game.getAsset('./images/type_color_green.png');
          }
          this.overlayCard();
        } else if (this.i >= this.opt.lightOn) {
          this.scale(1.002);
        } else {
          this.scale(sp);
          if (sp > this.opt.scale.speed_bottom) sp += this.opt.scale.speed_v;
          this.moveBy(this.opt.move.x, this.opt.move.y);
        }
        return this.i++;
      });
    }

    return Charactor;

  })(MySprite);

}).call(this);
