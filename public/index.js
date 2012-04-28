(function() {
  var He, MsgConsoleScene,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  enchant();

  He = {
    game: null,
    animations: {
      mypage: {
        js: '/20120406/parts/mypage.js',
        css: ['/stylesheets/mypage.css'],
        api: {
          url: '/api/tests/mypage/index.json',
          type: 'json'
        }
      }
    },
    classes: {},
    userinfo: {},
    status: {
      now: 100,
      started: 100,
      waitingForUser: 200,
      waitingForLoad: 300,
      startedMainAnimation: 400
    }
  };

  He.d = function() {
    var cls, title, v, vars, _i, _len, _results;
    cls = arguments[0], title = arguments[1], vars = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    console.log('>>[' + cls + ']' + title + '(' + He.status.now + ')');
    _results = [];
    for (_i = 0, _len = vars.length; _i < _len; _i++) {
      v = vars[_i];
      _results.push(console.log(v));
    }
    return _results;
  };

  He.BaseGame = (function(_super) {
    var allAnimations;

    __extends(BaseGame, _super);

    allAnimations = [];

    function BaseGame(w, h) {
      He.d('BaseGame', 'constructor');
      BaseGame.__super__.constructor.call(this, w, h);
      this.fps = 20;
    }

    BaseGame.prototype.start = function() {
      He.d('BaseGame', 'start');
      return this.doAnimation('mypage');
    };

    BaseGame.prototype.getAsset = function(key) {
      return this.assets[key];
    };

    BaseGame.prototype.attachApiResult = function(json) {
      var temp;
      He.d('BaseGame', 'attachAnimation', json);
      temp = {
        animation: {},
        userinfo: {}
      };
      json = $.extend(temp, json);
      He.animations = $.extend(He.animations, json.animation);
      He.userinfo = $.extend(He.userinfo, json.userinfo);
      return this;
    };

    BaseGame.prototype.doAnimation = function(key) {
      var conf, path, waitForLoad, _i, _len, _ref;
      He.d('BaseGame', 'doAnimation', He.animations, key);
      if (typeof He.animations[key] === 'undefined') return false;
      He.Animation.setStatus(He.status.waitingForLoad);
      conf = He.animations[key];
      if (typeof conf.css !== 'undefined') {
        _ref = conf.css;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          this.loadCss(path);
        }
      }
      if (typeof He.classes[key] === 'undefined') this.loadJs(conf.js);
      if (typeof conf.api !== 'undefined') {
        conf.api.loaded = false;
        this.callApi(conf.api);
      }
      waitForLoad = function(self, conf, key) {
        var ticker;
        return ticker = setInterval(function() {
          if (typeof He.classes[key] !== 'undefined') {
            if (typeof conf.api === 'undefined' || conf.api.loaded === true) {
              He.Animation.setStatus(He.status.startedMainAnimation);
              new He.classes[key]();
              clearInterval(ticker);
              return ticker = null;
            }
          }
        }, 20);
      };
      waitForLoad(this, conf, key);
      return this;
    };

    BaseGame.prototype.loadJs = function(path) {
      var script;
      if ($('body script[src="' + path + '"]').length) return this;
      He.d('BaseGame', 'loadJs', path);
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = path;
      document.body.appendChild(script);
      return this;
    };

    BaseGame.prototype.loadCss = function(path) {
      var css;
      if ($('head link[href="' + path + '"]').length) return this;
      He.d('BaseGame', 'loadCss', path);
      css = document.createElement('link');
      css.type = 'text/css';
      css.rel = 'stylesheet';
      css.href = path;
      document.head.appendChild(css);
      return this;
    };

    BaseGame.prototype.addAssets = function(assets) {
      this.preload(assets);
      this.loadAsset();
      return this;
    };

    BaseGame.prototype.callApi = function(confApi) {
      var _this = this;
      He.d('BaseGame', 'callApi', confApi);
      confApi.request = typeof confApi.request === 'undefined' ? {} : confApi.request;
      $.post(confApi.url, $.extend({}, confApi.request), function(json) {
        He.d('BaseGame', 'api respond', json);
        He.game.attachApiResult(json);
        confApi.response = json;
        return confApi.loaded = true;
      }, confApi.type);
      return this;
    };

    BaseGame.prototype.loadAsset = function() {
      var asset, assets, len, loaded, o, _i, _len, _results,
        _this = this;
      o = {};
      assets = this._assets.filter(function(asset) {
        if (__indexOf.call(o, asset) >= 0) {
          return false;
        } else {
          return o[asset] = true;
        }
      });
      if (typeof this.assets === 'undefined') this.assets = {};
      assets = assets.filter(function(asset) {
        if (typeof _this.assets[asset] === 'undefined') {
          return true;
        } else {
          return false;
        }
      });
      He.d('BaseGame', 'loadAsset', assets);
      len = assets.length;
      loaded = 0;
      _results = [];
      for (_i = 0, _len = assets.length; _i < _len; _i++) {
        asset = assets[_i];
        _results.push(this.load(asset, function() {
          loaded++;
          if (loaded === len) {
            return He.game.dispatchEvent(new enchant.Event('load'));
          }
        }));
      }
      return _results;
    };

    BaseGame.prototype.startFrame = function() {
      var _this = this;
      He.d('BaseGame', 'startFrame');
      clearInterval(this._intervalID);
      this.currentTime = Date.now();
      return this._intervalID = window.setInterval(function() {
        return _this._tick();
      }, 1000 / this.fps);
    };

    BaseGame.prototype._tick = function() {
      var e, node, nodes, now, push, scene, _i, _j, _len, _len2, _ref, _ref2;
      now = Date.now();
      e = new enchant.Event('enterframe');
      e.elapsed = now - this.currentTime;
      this.currentTime = now;
      nodes = [];
      _ref = this._scenes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scene = _ref[_i];
        nodes = nodes.concat(scene.childNodes.slice());
      }
      push = Array.prototype.push;
      while (nodes.length) {
        node = nodes.pop();
        node.dispatchEvent(e);
        if (node.childNodes) push.apply(nodes, node.childNodes);
      }
      _ref2 = this._scenes;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        scene = _ref2[_j];
        scene.dispatchEvent(e);
      }
      this.dispatchEvent(e);
      this.dispatchEvent(new enchant.Event('exitframe'));
      return this.frame++;
    };

    return BaseGame;

  })(Game);

  He.Animation = (function() {

    Animation.prepared = false;

    Animation.loaded = false;

    Animation.images = [];

    Animation.css = [];

    Animation.instances = [];

    Animation.prototype.root = null;

    Animation.prototype.apiResponse = {};

    Animation.prototype.started = false;

    Animation.prototype.phase = '';

    Animation.prototype.cls = null;

    function Animation() {
      He.d('Animation', 'constructor', this);
      this.cls.instances.push(this);
      this.prepare();
      this.start();
    }

    Animation.prototype.prepare = function() {
      var path, _i, _len, _ref;
      He.d('Animation', 'prepare', this);
      if (this.cls.prepared === true) return;
      this.cls.prepared = true;
      _ref = this.cls.css;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        He.game.loadCss(path);
      }
      this.addAssets(this.cls.images);
      return He.game.startFrame();
    };

    Animation.prototype.addAssets = function(assets) {
      var _this = this;
      He.game.onload = function() {
        return _this.cls.loaded = true;
      };
      return He.game.addAssets(assets);
    };

    Animation.prototype.start = function() {
      var waitForLoad;
      He.d('Animation', 'start', this);
      waitForLoad = function(self) {
        var ticker;
        return ticker = setInterval(function() {
          if (self.cls.loaded === true) {
            self.started = true;
            self.phase = 'started';
            self.startCore();
            clearInterval(ticker);
            return ticker = null;
          }
        }, 20);
      };
      return waitForLoad(this);
    };

    Animation.prototype.startCore = function() {};

    Animation.getStatus = function() {
      return He.status.now;
    };

    Animation.setStatus = function(val) {
      return He.status.now = val;
    };

    return Animation;

  })();

  He.Scene = (function(_super) {

    __extends(Scene, _super);

    function Scene(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Scene.__super__.constructor.call(this, w, h);
      this.i = 0;
      this._element.style.left = x + 'px';
      this._element.style.top = y + 'px';
    }

    return Scene;

  })(Scene);

  He.Sprite = (function(_super) {

    __extends(Sprite, _super);

    function Sprite(w, h, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      Sprite.__super__.constructor.call(this, w, h);
      this.x = x;
      this.y = y;
      this.i = 0;
    }

    Sprite.prototype.fimageFit2Sprite = function() {
      return this._element.style.WebkitBackgroundSize = this.width + 'px, ' + this.height + 'px';
    };

    return Sprite;

  })(Sprite);

  He.Com = (function() {

    function Com() {}

    Com.sysMessage = function(message, opt) {
      var images,
        _this = this;
      if (opt == null) opt = {};
      He.d('He.Com', 'sysMessage', message, opt);
      opt = $.extend({
        w: 320,
        h: 100,
        x: 0,
        y: 0,
        effect: 'appear',
        type: 'console',
        ms: 1000
      }, opt);
      switch (opt.type) {
        case 'console':
          images = ['/images/animations/level_up/20120330/message_box.png', '/images/animations/level_up/20120330/icon-tri.gif'];
          He.game.addAssets(images);
          return He.game.onload = function() {
            var remove, scene;
            scene = new MsgConsoleScene(message, opt);
            He.game.pushScene(scene);
            remove = function(scene, ms) {
              return setTimeout(function() {
                return He.game.removeScene(scene);
              }, ms);
            };
            return remove(scene, opt.ms);
          };
      }
    };

    Com.flipDiv = function(frontId, backId, btnId) {
      var back, busy, flip, front, orgBackStyle, orgFrontStyle, tEnd;
      busy = false;
      front = document.getElementById(frontId);
      back = document.getElementById(backId);
      orgFrontStyle = front.style;
      orgBackStyle = back.style;
      flip = function() {
        if (busy) return;
        busy = true;
        back.style.webkitTransition = "none";
        back.style.webkitTransformOrigin = "50% 0";
        back.style.webkitTransform = "perspective(500) rotateY(-90deg)";
        front.style.webkitTransformOrigin = "50% 0";
        front.style.webkitTransition = "-webkit-Transform 300ms ease-in";
        return front.style.webkitTransform = "perspective(500) rotateY(90deg)";
      };
      tEnd = function(e) {
        var swap;
        if (e.target === front) {
          front.style.display = "none";
          back.style.display = "block";
          back.style.webkitTransition = "-webkit-Transform 300ms ease-out";
          return setTimeout(function() {
            return back.style.webkitTransform = "perspective(500) rotate(0deg)";
          }, 0);
        } else if (e.target === back) {
          swap = front;
          front = back;
          back = swap;
          return busy = false;
        }
      };
      front.addEventListener('webkitTransitionEnd', tEnd);
      back.addEventListener('webkitTransitionEnd', tEnd);
      return $('#' + btnId).bind('click', function() {
        return flip();
      });
    };

    return Com;

  })();

  MsgConsoleScene = (function(_super) {

    __extends(MsgConsoleScene, _super);

    function MsgConsoleScene(message, opt) {
      if (opt == null) opt = {};
      MsgConsoleScene.__super__.constructor.call(this, opt.w, opt.h, opt.x, opt.y);
      this.messageBox = new He.Sprite(opt.w, opt.h);
      this.messageBox.image = He.game.getAsset('/images/animations/level_up/20120330/message_box.png');
      this.messageBox.addEventListener('enterframe', function() {
        if (this.i > 0) {
          this.frame++;
          if (this.frame % 3 === 2) this.i -= 10 * He.game.fps;
        }
        return this.i++;
      });
      this.label = new Label();
      this.label.text = message;
      this.label.color = 'white';
      this.label.x = opt.x + 30;
      this.label.y = opt.y + 15;
      this.triangle = new He.Sprite(10, 8);
      this.triangle.x = opt.x + opt.w - 30;
      this.triangle.y = opt.y + opt.h - 15;
      this.triangle.image = He.game.getAsset('/images/animations/level_up/20120330/icon-tri.gif');
      this.triangle.addEventListener('enterframe', function() {
        if (this.i % 15 === 0) this.visible = this.visible === false;
        return this.i++;
      });
      this.addChild(this.messageBox);
      this.addChild(this.label);
      this.addChild(this.triangle);
    }

    return MsgConsoleScene;

  })(He.Scene);

  this.He = He;

  this.onload = function() {
    He.game = new He.BaseGame(320, 420);
    return He.game.start();
  };

}).call(this);
