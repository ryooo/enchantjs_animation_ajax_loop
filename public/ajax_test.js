(function() {
  var BackCrowd, BackSky, Beam, BeamArrow, BeamLine, Card, CardScene, Charactor, Dust, DustA, DustB, DustC, GreenFire, Ground, HeSprite, MainScene, Shine, TouchStr, TouchStrMask, Whiteout,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MainScene = (function(_super) {

    __extends(MainScene, _super);

    function MainScene(w, h) {
      var center_x,
        _this = this;
      MainScene.__super__.constructor.call(this, w, h);
      this.i = 0;
      MainScene.prototype.me = this;
      this.status = null;
      this.children = [];
      center_x = CardGet.prototype.game.width / 2;
      this.addChild(new BackSky(0, -190));
      this.addChild(new Shine(60, 40));
      this.addChild(new Whiteout(0, 0));
      this.addChild(new DustB(0, 20));
      this.addChild(new BackCrowd(0, 110));
      this.addChild(new Ground(0, 160));
      $('#btn_3').click(function() {
        return flip();
      });
      $('#btn_1').click(function() {
        if ($('#enchant-stage').css('display') === 'none') flip();
        _this.status = 'api_start';
        _this.sweepChildrenAtInit();
        if (CardGet.prototype.game.currentScene instanceof CardScene) {
          CardGet.prototype.game.popScene();
        }
        $.post('/api/tests/start_quest/hoge.json', {
          foo: 'bar',
          hoge: 'fuga'
        }, function(json) {
          var diff;
          _this.status = 'api_fin';
          switch (json.result.anim) {
            case 'level_up':
              _this.removeEventListener('enterframe', _this.charLoop);
              _this.addEventListener('enterframe', _this.showLady);
              diff = json.me.st - $('#st').text();
              $('#lv').text(parseInt($('#lv').text()) + 1).addClass('status_up');
              break;
            case 'card_get':
              _this.removeEventListener('enterframe', _this.charLoop);
              _this.status = 'waitForUser';
              _this.sweepChildren();
              $('#cc').text(parseInt($('#cc').text()) + 1).addClass('status_up');
              CardGet.prototype.game.pushScene(new CardScene());
          }
          return _this.updateTxt(json);
        }, 'json');
        return _this.addEventListener('enterframe', _this.charLoop);
      });
      this.addEventListener('enterframe', this.sweepChildren);
    }

    MainScene.prototype.charLoop = function() {
      if (this.i >= 12) this.i = 0;
      if (this.i % 6 === 0) {
        console.log(this.i);
        this.addChild(new Charactor(this.i / 6 + 1));
      }
      return this.i++;
    };

    MainScene.prototype.showLady = function() {
      if (this.i % 6 === 0) {
        this.addChild(new Charactor(4));
        this.removeEventListener('enterframe', arguments.callee);
        this.sweepChildren();
      }
      return this.i++;
    };

    MainScene.prototype.sweepChildren = function() {
      var child, i, _len, _ref, _results;
      if (this.status === 'waitForUser') {
        _ref = this.children;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          child = _ref[i];
          if (child.remove_at === 'sweep') this.removeChild(child);
          this.children.slice(i, 1);
          _results.push(child.afterSweep());
        }
        return _results;
      }
    };

    MainScene.prototype.sweepChildrenAtInit = function() {
      var child, i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        child = _ref[i];
        if (child.remove_at === 'api_init') this.removeChild(child);
        this.children.slice(i, 1);
        child.afterSweep();
        _results.push(child.beforeApiCall());
      }
      return _results;
    };

    MainScene.prototype.addChild = function(child) {
      MainScene.__super__.addChild.call(this, child);
      return this.children.push(child);
    };

    MainScene.prototype.setStatus = function(status) {
      return this.status = status;
    };

    MainScene.prototype.updateTxt = function(json) {
      var cls, diff;
      switch (json.result.anim) {
        case 'level_up':
          diff = json.me.st - $('#st').text();
          $('#lv').text(parseInt($('#lv').text()) + 1).addClass('status_up');
          break;
        case 'card_get':
          $('#cc').text(parseInt($('#cc').text()) + 1).addClass('status_up');
      }
      diff = json.me.st - $('#st').text();
      cls = diff > 0 ? 'status_up' : 'status_down';
      $('#st').text(json.me.st).addClass(cls);
      diff = json.me.om - $('#om').text();
      cls = diff > 0 ? 'status_up' : 'status_down';
      $('#om').text(json.me.om).addClass(cls);
      diff = json.me.dm - $('#dm').text();
      cls = diff > 0 ? 'status_up' : 'status_down';
      $('#dm').text(json.me.dm).addClass(cls);
      return setTimeout(function() {
        $('#st').removeClass();
        $('#om').removeClass();
        $('#dm').removeClass();
        $('#lv').removeClass();
        return $('#cc').removeClass();
      }, 2000);
    };

    return MainScene;

  })(Scene);

  HeSprite = (function(_super) {

    __extends(HeSprite, _super);

    function HeSprite(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      HeSprite.__super__.constructor.call(this, w, h);
      this.remove_at = 'sweep';
      this.x = x;
      this.y = y;
      this.i = 0;
      this.addEventListener('enterframe', function() {
        return this.i++;
      });
    }

    HeSprite.prototype.fimageFit2Sprite = function() {
      return this._element.style.WebkitBackgroundSize = this.width + 'px, ' + this.height + 'px';
    };

    HeSprite.prototype.beforeApiCall = function() {};

    HeSprite.prototype.afterSweep = function() {};

    return HeSprite;

  })(Sprite);

  BackSky = (function(_super) {

    __extends(BackSky, _super);

    function BackSky(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackSky.__super__.constructor.call(this, 320, 400, x, y);
      this.remove_at = 'none';
      this.image = CardGet.prototype.game.getAsset('sky');
      this.fimageFit2Sprite();
    }

    return BackSky;

  })(HeSprite);

  BackCrowd = (function(_super) {

    __extends(BackCrowd, _super);

    function BackCrowd(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackCrowd.__super__.constructor.call(this, 330, 65, x, y);
      this.remove_at = 'none';
      this.image = CardGet.prototype.game.getAsset('crowd');
      this.opacity = 0.8;
      this.fimageFit2Sprite();
    }

    return BackCrowd;

  })(HeSprite);

  Ground = (function(_super) {

    __extends(Ground, _super);

    function Ground(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Ground.__super__.constructor.call(this, 330, 200, x, y);
      this.remove_at = 'none';
      this.image = CardGet.prototype.game.getAsset('ground');
      this.fimageFit2Sprite();
    }

    return Ground;

  })(HeSprite);

  Shine = (function(_super) {

    __extends(Shine, _super);

    function Shine(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Shine.__super__.constructor.call(this, 217, 217, x, y);
      this.image = CardGet.prototype.game.getAsset('shine');
      this._element.style.webkitTransformOrigin = '50% 50%';
      this.opacity = 0;
      this.scale(1.6);
      this.remove_at = 'none';
      this.addEventListener('enterframe', this.loopFrame);
      this.atached = true;
    }

    Shine.prototype.beforeApiCall = function() {
      if (this.atached === false) {
        return this.addEventListener('enterframe', this.loopFrame);
      }
    };

    Shine.prototype.loopFrame = function() {
      switch (MainScene.prototype.me.status) {
        case 'lightOn':
          if (this.opacity < 1) this.opacity += 0.1;
          return this.scale(1.012);
        case 'shine':
          this.opacity = 0;
          this.removeEventListener('enterframe', this.loopFrame);
          return this.atached = false;
      }
    };

    return Shine;

  })(HeSprite);

  Dust = (function(_super) {

    __extends(Dust, _super);

    function Dust(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Dust.__super__.constructor.call(this, 290, 181, x, y);
      this.remove_at = 'none';
      this.y_org = y;
      this.image = CardGet.prototype.game.getAsset('dust');
      this.fimageFit2Sprite();
      this.typeFirstAction();
      this.addEventListener('enterframe', this.showDust);
    }

    Dust.prototype.showDust = function() {
      this.typeFrameAction();
      if (MainScene.prototype.me.status === 'shine') {
        this.opacity = 0;
        return this.removeEventListener('enterframe', arguments.callee);
      }
    };

    Dust.prototype.typeFirstAction = function() {};

    Dust.prototype.typeAnimation = function() {};

    Dust.prototype.afterSweep = function() {
      this.opacity = 1;
      return this.addEventListener('enterframe', this.showDust);
    };

    return Dust;

  })(HeSprite);

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
      },
      4: {
        init: {
          x: 95,
          y: 60
        },
        origin: '50% 95%',
        scale: {
          init: 0.035,
          speed: 1.72,
          speed_v: -0.068,
          speed_bottom: 1.09
        },
        move: {
          x: 0,
          y: 0
        },
        char: 2,
        last: null,
        lightOn: 14,
        shine: 29,
        waitForUser: 55
      }
    };

    function Charactor(num) {
      var char, sp;
      if (num == null) num = 1;
      this.opt = this.conf[num];
      Charactor.__super__.constructor.call(this, 104, 122, this.opt.init.x, this.opt.init.y);
      char = this.opt.char === null ? Math.floor(Math.random() * 6) + 1 : this.opt.char;
      this.image = CardGet.prototype.game.getAsset('char_' + char);
      this._element.style.webkitTransformOrigin = this.opt.origin;
      this.scale(this.opt.scale.init);
      this.fimageFit2Sprite();
      sp = this.opt.scale.speed;
      if (num === 4) this.remove_at = 'api_init';
      this.i = 0;
      this.addEventListener('enterframe', function() {
        var image;
        if (this.i === this.opt.last) {
          this.opacity = 0;
          return this.removeEventListener('enterframe', arguments.callee);
        } else if (this.i >= this.opt.waitForUser) {
          this.alpha = 0;
          this.overlayCard();
          return MainScene.prototype.me.setStatus('waitForUser');
        } else if (this.i >= this.opt.shine) {
          if (this.i === this.opt.shine) {
            Whiteout.prototype.me.show();
            MainScene.prototype.me.setStatus('shine');
            this.org_image = this.image;
            this.alpha = 0.5;
            this.cardY = 0;
            image = this.colorImg = CardGet.prototype.game.getAsset('layer_gr');
          }
          return this.overlayCard();
        } else if (this.i >= this.opt.lightOn) {
          if (this.i === this.opt.lightOn) {
            MainScene.prototype.me.setStatus('lightOn');
          }
          return this.scale(1.002);
        } else {
          this.scale(sp);
          if (sp > this.opt.scale.speed_bottom) sp += this.opt.scale.speed_v;
          return this.moveBy(this.opt.move.x, this.opt.move.y);
        }
      });
    }

    Charactor.prototype.overlayCard = function() {
      var card, ctx, image;
      image = new Surface(this.width, this.height);
      ctx = image.context;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(this.org_image._element, 0, 0, this.width, this.height);
      this.alpha -= 0.015;
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.globalCompositeOperation = 'source-atop';
      card = CardGet.prototype.game.getAsset('card');
      this.cardY -= 1;
      ctx.drawImage(card._element, 0, this.cardY, this.width, this.height);
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.drawImage(this.colorImg._element, 0, 0, this.width, this.height);
      return this.image = image;
    };

    return Charactor;

  })(HeSprite);

  TouchStr = (function(_super) {

    __extends(TouchStr, _super);

    function TouchStr(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      TouchStr.__super__.constructor.call(this, 72, 20, x, y);
      this.image = CardGet.prototype.game.getAsset('touch');
    }

    return TouchStr;

  })(HeSprite);

  TouchStrMask = (function(_super) {

    __extends(TouchStrMask, _super);

    function TouchStrMask(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      TouchStrMask.__super__.constructor.call(this, 320, 28, x, y);
      this.org_x = x;
      this._element.style.background = '-webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 1)), color-stop(0.3, rgba(0, 0, 0, 1)), color-stop(0.5, transparent), color-stop(0.7, rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 1)))';
      this.addEventListener('enterframe', function() {
        if (this.i % 35 === 0) this.x = this.org_x;
        return this.x += 6;
      });
    }

    return TouchStrMask;

  })(HeSprite);

  Whiteout = (function(_super) {

    __extends(Whiteout, _super);

    function Whiteout(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Whiteout.prototype.me = this;
      Whiteout.__super__.constructor.call(this, CardGet.prototype.game.width, CardGet.prototype.game.height, x, y);
      this.backgroundColor = 'white';
      this.opacity = 0;
      this.remove_at = 'none';
      this.addEventListener('enterframe', function() {
        switch (MainScene.prototype.me.status) {
          case 'shine':
            return this.opacity -= 0.03;
          case 'waitForUser':
            return this.opacity -= 0.1;
        }
      });
    }

    Whiteout.prototype.show = function() {
      return this.opacity = 1;
    };

    return Whiteout;

  })(HeSprite);

  CardScene = (function(_super) {

    __extends(CardScene, _super);

    function CardScene(w, h) {
      CardScene.__super__.constructor.call(this, w, h);
      this.i = 0;
      CardScene.prototype.me = this;
      this.status = null;
      this.addChild(new GreenFire());
      this.addChild(new Beam(80, -120));
      this.addChild(new BeamArrow(260, -110));
      this.addChild(new BeamLine(130, -160));
      this.addEventListener('enterframe', function() {
        return this.i++;
      });
    }

    CardScene.prototype.setStatus = function(status) {
      return this.status = status;
    };

    return CardScene;

  })(Scene);

  Beam = (function(_super) {

    __extends(Beam, _super);

    function Beam(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Beam.__super__.constructor.call(this, CardGet.prototype.game.width, CardGet.prototype.game.height, x, y);
      this.image = CardGet.prototype.game.getAsset('beam');
      this.fimageFit2Sprite();
      this.addEventListener('enterframe', function() {
        this.scale(1.2);
        this.moveBy(-40, 40);
        if (this.i === 3) {
          this.opacity = 0;
          return this.removeEventListener('enterframe', arguments.callee);
        }
      });
    }

    return Beam;

  })(HeSprite);

  BeamArrow = (function(_super) {

    __extends(BeamArrow, _super);

    function BeamArrow(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BeamArrow.__super__.constructor.call(this, 131, 165, x, y);
      this.image = CardGet.prototype.game.getAsset('beam->');
      this.scale(2);
      this.addEventListener('enterframe', function() {
        this.scale(1.15);
        this.moveBy(-40, 40);
        if (this.i === 3) {
          this.opacity = 0;
          return this.removeEventListener('enterframe', arguments.callee);
        }
      });
    }

    return BeamArrow;

  })(HeSprite);

  BeamLine = (function(_super) {

    __extends(BeamLine, _super);

    function BeamLine(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BeamLine.__super__.constructor.call(this, 84, 513, x, y);
      this.image = CardGet.prototype.game.getAsset('beam-->');
      this.scale(4, 8);
      this.rotate(41.4);
      this.opacity = 0;
      this.addEventListener('enterframe', function() {
        if (this.i === 3) this.opacity = 1;
        if (this.i > 10) {
          this.opacity -= 0.2;
          if (this.opacity <= 0.2) {
            this.opacity = 0;
            CardScene.prototype.me.addChild(new Card());
            return this.removeEventListener('enterframe', arguments.callee);
          }
        } else if (this.i > 3) {
          this.scale(2);
          return this.moveBy(-20, 20);
        }
      });
    }

    return BeamLine;

  })(HeSprite);

  GreenFire = (function(_super) {

    __extends(GreenFire, _super);

    function GreenFire(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      GreenFire.__super__.constructor.call(this, 320, 420, x, y);
      this.org_y = y;
      this.greenA = CardGet.prototype.game.getAsset('green_A');
      this.greenB = CardGet.prototype.game.getAsset('green_B');
      this.image = this.greenA;
      this.fimageFit2Sprite();
      this.addEventListener('enterframe', function() {
        if (this.i % 4 < 2) {
          this.image = this.greenA;
          return this.y = this.org_y;
        } else {
          this.image = this.greenB;
          return this.y -= 8;
        }
      });
    }

    return GreenFire;

  })(HeSprite);

  Card = (function(_super) {

    __extends(Card, _super);

    function Card(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Card.__super__.constructor.call(this, 320, 420, x, y);
      this.image = CardGet.prototype.game.getAsset('card');
      this._element.style.webkitTransformOrigin = '50% 80%';
      this.scale(1.5);
      this.fimageFit2Sprite();
      this.addEventListener('enterframe', function() {
        if (this.i < 2) {
          return this.scale(0.72);
        } else if (this.i < 4) {
          this.scale(0.67);
          return this.moveBy(0, -93);
        } else if (this.i < 6) {
          return this.scale(1.05);
        } else if (this.i === 7) {
          return this.removeEventListener('enterframe', arguments.callee);
        }
      });
    }

    return Card;

  })(HeSprite);

}).call(this);
