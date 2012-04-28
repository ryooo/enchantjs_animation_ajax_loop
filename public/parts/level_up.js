(function() {
  var BackScene, Charactor,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  He.LevelUp = (function(_super) {

    __extends(LevelUp, _super);

    function LevelUp() {
      var card_image;
      He.d('LevelUp', 'constructor');
      this.cls = He.LevelUp;
      this.conf = He.animations.level_up;
      this.cls.images = ['./images/type_color_green.png', './images/s04.png'];
      card_image = './images/' + this.conf.vars.card_id + '.jpg';
      this.cls.images.push(card_image);
      LevelUp.__super__.constructor.apply(this, arguments);
    }

    LevelUp.prototype.startCore = function() {
      He.d('LevelUp', 'startCore');
      this.root = new BackScene(He.game.width, He.game.height);
      He.game.pushScene(this.root);
      He.Animation.setStatus(He.status.startedMainAnimation);
      return this.root.addEventListener('enterframe', this.root.showLady);
    };

    return LevelUp;

  })(He.Animation);

  He.classes.level_up = He.LevelUp;

  BackScene = (function(_super) {

    __extends(BackScene, _super);

    function BackScene(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      BackScene.__super__.constructor.call(this, w, h, x, y);
    }

    BackScene.prototype.showLady = function() {
      if (this.i % 6 === 0) {
        this.addChild(new Charactor(4));
        this.removeEventListener('enterframe', arguments.callee);
      }
      return this.i++;
    };

    return BackScene;

  })(He.Scene);

  Charactor = (function(_super) {

    __extends(Charactor, _super);

    Charactor.prototype.conf = {
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
      this.image = He.game.getAsset('./images/s0' + char + '.png');
      this._element.style.webkitTransformOrigin = this.opt.origin;
      this.scale(this.opt.scale.init);
      this.fimageFit2Sprite();
      sp = this.opt.scale.speed;
      this.i = 0;
      this.addEventListener('enterframe', function() {
        var image, message;
        if (this.i >= this.opt.waitForUser) {
          this.alpha = 0;
          this.overlayCard();
          message = 'Level UP';
          if (this.i === this.opt.waitForUser) {
            He.Com.sysMessage(message, 320, 100, 0, 250);
          }
        } else if (this.i >= this.opt.shine) {
          if (this.i === this.opt.shine) {
            this.org_image = this.image;
            this.alpha = 0.5;
            this.cardY = 0;
            image = this.colorImg = He.game.getAsset('./images/type_color_green.png');
          }
          this.overlayCard();
        } else if (this.i >= this.opt.lightOn) {
          this.scale(1.002);
        } else {
          this.scale(sp);
          if (sp > this.opt.scale.speed_bottom) sp += this.opt.scale.speed_v;
          this.moveBy(this.opt.move.x, this.opt.move.y);
        }
        this.i++;
        if (He.Animation.getStatus() === He.status.waitingForLoad) {
          this.removeEventListener('enterframe', arguments.callee);
          return He.game.popScene();
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
      card = He.game.getAsset('./images/12000801.jpg');
      this.cardY -= 1;
      ctx.drawImage(card._element, 0, this.cardY, this.width, this.height);
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.drawImage(this.colorImg._element, 0, 0, this.width, this.height);
      return this.image = image;
    };

    Charactor.prototype.fimageFit2Sprite = function() {
      return this._element.style.WebkitBackgroundSize = this.width + 'px, ' + this.height + 'px';
    };

    return Charactor;

  })(He.Sprite);

}).call(this);
