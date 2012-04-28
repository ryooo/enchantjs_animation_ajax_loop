enchant()
He = 
  game: null
  animations:
    mypage:
      js: '/20120406/parts/mypage.js',
      css: ['/stylesheets/mypage.css'],
      api:
        url: '/api/tests/mypage/index.json',
        type:'json'
  classes: {}
  userinfo: {}
  status:
    now: 100,
    started:100,
    waitingForUser:200,
    waitingForLoad:300,
    startedMainAnimation:400

# -----------------------------------------
# デバッグ用
He.d = (cls, title, vars...) ->
  console.log('>>[' + cls + ']' + title + '(' + He.status.now + ')')
  for v in vars
    console.log(v)

# -----------------------------------------
# Game
class He.BaseGame extends Game
  allAnimations = []
  constructor : (w, h)->
    He.d('BaseGame', 'constructor')
    super w, h
    @fps = 20
  
  start: ->
    He.d('BaseGame', 'start')
    @doAnimation('mypage')
  
  getAsset: (key) ->
    return @assets[key]
  
  attachApiResult: (json) ->
    He.d('BaseGame', 'attachAnimation', json)
    temp = {
      animation: {},
      userinfo: {}
    }
    json = $.extend(temp, json)
    He.animations = $.extend(He.animations, json.animation)
    He.userinfo = $.extend(He.userinfo, json.userinfo)
    return @
  
  doAnimation: (key) ->
    He.d('BaseGame', 'doAnimation', He.animations, key)
    return false if typeof He.animations[key] is 'undefined'
    He.Animation.setStatus(He.status.waitingForLoad)
    conf = He.animations[key]
    
    # cssをロード
    if typeof conf.css isnt 'undefined'
      for path in conf.css
        @loadCss(path)
    
    # jsをロード
    if typeof He.classes[key] is 'undefined'
      @loadJs(conf.js)
    
    # apiを実行
    if typeof conf.api isnt 'undefined'
      conf.api.loaded = false
      @callApi(conf.api)
    
    # アニメーション開始(jsとapiを待つ)
    waitForLoad = (self, conf, key) ->
      ticker = setInterval ->
        if typeof He.classes[key] isnt 'undefined'
          if typeof conf.api is 'undefined' || conf.api.loaded is true
            He.Animation.setStatus(He.status.startedMainAnimation)
            new He.classes[key]()
            clearInterval(ticker);
            ticker = null;
      , 20
    waitForLoad(@, conf, key)
    return @
  
  loadJs: (path) ->
    return @ if $('body script[src="' + path + '"]').length
    He.d('BaseGame', 'loadJs', path)
    # 未ロードの場合
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    document.body.appendChild(script);
    return @
  
  loadCss: (path) ->
    return @ if $('head link[href="' + path + '"]').length
    He.d('BaseGame', 'loadCss', path)
    # 未ロードの場合
    css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = path;
    document.head.appendChild(css);
    return @
  
  addAssets: (assets) ->
    @preload assets
    @loadAsset()
    return @
  
  # typeは一応設定値として残すが、すべてjsonで扱うことを目指す
  callApi: (confApi) ->
    He.d('BaseGame', 'callApi', confApi)
    confApi.request = if typeof confApi.request is 'undefined' then {} else confApi.request
    $.post confApi.url,
      $.extend({}, confApi.request),
      (json) =>
        He.d('BaseGame', 'api respond', json)
        He.game.attachApiResult(json)
        confApi.response = json
        confApi.loaded = true
        
      confApi.type
    return @
  
  # enchantを改造
  # start()をloadAsset()とstartFrameに分割(loadingを削除)
  # _tick()でcurrentScene以外もframeを回すよう修正
  loadAsset: ->
    o = {}
    assets = @_assets.filter (asset) ->
      return if asset in o then false else o[asset] = true
    @assets = {} if typeof @assets is 'undefined'
    assets = assets.filter (asset) =>
      return if typeof @assets[asset] is 'undefined' then true else false
    He.d('BaseGame', 'loadAsset', assets)
    len = assets.length
    loaded = 0
    for asset in assets
      @load(asset, ->
        loaded++
        if loaded is len
          He.game.dispatchEvent(new enchant.Event('load'))
      )
    
  startFrame: ->
    He.d('BaseGame', 'startFrame')
    clearInterval(@_intervalID);
    @currentTime = Date.now();
    @_intervalID = window.setInterval =>
      @_tick()
    , 1000 / @fps
    
  _tick: ->
      now = Date.now();
      e = new enchant.Event('enterframe');
      e.elapsed = now - @currentTime;
      @currentTime = now;
      
      nodes = []
      for scene in @_scenes
        nodes = nodes.concat(scene.childNodes.slice());
      push = Array.prototype.push;
      
      
      while nodes.length
        node = nodes.pop();
        node.dispatchEvent(e);
        if node.childNodes
          push.apply(nodes, node.childNodes);
      
      for scene in @_scenes
        scene.dispatchEvent(e);
      @dispatchEvent(e);
      
      @dispatchEvent(new enchant.Event('exitframe'));
      @frame++;

# -----------------------------------------
# Animation
class He.Animation
  @prepared: false
  @loaded: false
  @images: []
  @css: []
  @instances: []
  root: null
  apiResponse: {}
  started: false
  phase: ''
  cls: null
  
  constructor : () ->
    He.d('Animation', 'constructor', @)
    @cls.instances.push(@)
    @prepare()
    @start()
  
  prepare: ->
    He.d('Animation', 'prepare', @)
    # 準備済みなら準備しない
    return if @cls.prepared is true
    @cls.prepared = true
    # css
    for path in @cls.css
      He.game.loadCss(path)
    # image
    @addAssets(@cls.images)
    He.game.startFrame()
  
  addAssets: (assets) ->
    He.game.onload = =>
      @cls.loaded = true
    He.game.addAssets(assets)
  
  start: ->
    He.d('Animation', 'start', @)
    # imageを待つ
    waitForLoad = (self) ->
      ticker = setInterval ->
        if self.cls.loaded is true
          self.started = true
          self.phase = 'started'
          self.startCore()
          clearInterval(ticker);
          ticker = null;
      , 20
    waitForLoad(@)
  
  startCore: ->
  
  @getStatus: () ->
    return He.status.now
  
  @setStatus: (val) ->
    He.status.now = val
  

# -----------------------------------------
# 各種基底クラス
class He.Scene extends Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h
    @i = 0
    @_element.style.left = x + 'px'
    @_element.style.top = y + 'px'

class He.Sprite extends Sprite
  constructor: (w, h, x = 0, y = 0) ->
    super w, h
    @x = x
    @y = y
    @i = 0

  # 画像サイズをspriteサイズに調整
  fimageFit2Sprite: ->
    @_element.style.WebkitBackgroundSize =
      @width + 'px, ' + @height + 'px';

# -----------------------------------------
# 共通クラス
class He.Com
  @sysMessage: (message, opt = {}) ->
    He.d('He.Com', 'sysMessage', message, opt)
    # type:
    #   navi
    #   full_window
    
    # effect:
    #   cutin
    #   fadein
    opt = $.extend({
      w: 320,
      h: 100,
      x: 0,
      y: 0,
      effect: 'appear',
      type: 'console',
      ms: 1000
    }, opt)
    
    switch opt.type
      when 'console'
        images = ['/images/animations/level_up/20120330/message_box.png',
                  '/images/animations/level_up/20120330/icon-tri.gif',
                  ]
        He.game.addAssets(images)
        
        He.game.onload = =>
          scene = new MsgConsoleScene(message, opt);
          He.game.pushScene(scene);
          
          remove = (scene, ms) ->
            setTimeout ->
              He.game.removeScene(scene)
            , ms
          remove(scene, opt.ms)
    

  @flipDiv: (frontId, backId, btnId) ->
    busy = false
    front = document.getElementById(frontId);
    back = document.getElementById(backId);
    orgFrontStyle = front.style
    orgBackStyle = back.style
    flip = ->
      return if busy
      busy = true
      back.style.webkitTransition = "none";
      back.style.webkitTransformOrigin = "50% 0";
      back.style.webkitTransform = "perspective(500) rotateY(-90deg)";
      front.style.webkitTransformOrigin = "50% 0";
      front.style.webkitTransition = "-webkit-Transform 300ms ease-in";
      front.style.webkitTransform = "perspective(500) rotateY(90deg)";
    
    tEnd = (e)->
      if e.target is front
        front.style.display = "none";
        back.style.display = "block";
        back.style.webkitTransition = "-webkit-Transform 300ms ease-out";
        setTimeout(->
          back.style.webkitTransform = "perspective(500) rotate(0deg)";
        , 0)
      else if e.target is back
        swap = front
        front = back
        back = swap
        busy = false
      
    front.addEventListener('webkitTransitionEnd', tEnd);
    back.addEventListener('webkitTransitionEnd', tEnd);
    $('#' + btnId).bind('click', ->
      flip()
    )

# -----------------------------------------
# 要素 - メッセージ
class MsgConsoleScene extends He.Scene
  constructor: (message, opt = {}) ->
    super opt.w, opt.h, opt.x, opt.y
    
    @messageBox = new He.Sprite(opt.w, opt.h)
    @messageBox.image = He.game.getAsset('/images/animations/level_up/20120330/message_box.png')
    @messageBox.addEventListener 'enterframe', ->
      if @i > 0
        @frame++
        @i -= 10 * He.game.fps if @frame % 3 is 2
      @i++
      
    
    @label = new Label()
    @label.text = message
    @label.color = 'white'
    @label.x = opt.x + 30
    @label.y = opt.y + 15
    @triangle = new He.Sprite(10, 8)
    @triangle.x = opt.x + opt.w - 30
    @triangle.y = opt.y + opt.h - 15
    @triangle.image = He.game.getAsset('/images/animations/level_up/20120330/icon-tri.gif')
    @triangle.addEventListener 'enterframe', ->
      @visible = @visible is false if @i % 15 == 0
      @i++
    
    @addChild(@messageBox)
    @addChild(@label)
    @addChild(@triangle)
    


# -----------------------------------------
# windowへ
@He = He
@onload = ->
  He.game = new He.BaseGame(320, 420)
  He.game.start()
