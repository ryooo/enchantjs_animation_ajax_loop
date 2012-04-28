# -----------------------------------------
# アニメーション設定
class He.MyPage extends He.Animation
  constructor : () ->
    He.d('MyPage', 'constructor')
    @cls = He.MyPage
    @conf = He.animations.mypage
    @cls.images = [
      './images/bf_sky.png',
      './images/bf1_32.png',
      './images/BG_glow.png',
      './images/obj2_grp.png',
      './images/ground_shadow.png',
      './images/type_color_green.png',
      './images/touch_touch.png',
      './images/dust_anim.png',
      './images/obj4.png',
      './images/s01.png',
      './images/s02.png',
      './images/s03.png',
      './images/s04.png',
      './images/s05.png',
      './images/s06.png',
      './images/bg_gradient_g1.png',
      './images/bg_gradient_g2.png',
      './images/window.png',
      './images/skip.png',
      './images/card_num_back.png'
      ]
    super
  
  startCore: ->
    He.d('MyPage', 'startCore')
    @root = new BackScene(He.game.width, He.game.height)
    @root._element.id = 'myPageRoot'
    He.game.pushScene(@root)
    $('#enchant-stage').append(@conf.api.response.vars.html)
    He.Com.flipDiv('myPageRoot', 'status', 'btn_3')
    
    $('#friend_manage').bind('click', =>
      message = '仲間はいません'
      opt = {
        w: 320,
        h: 100,
        x: 0,
        y: 25,
        effect: 'appear',
        type: 'console',
        ms: 2000
      }
      He.Com.sysMessage(message, opt)
      return false
    )
    
    $('#btn_1').bind('click', =>
      He.Animation.setStatus(He.status.waitingForLoad)
      # クエスト結果取得API
      $.post '/api/tests/do_quest/hoge.json',
        foo: 'bar'
        hoge: 'fuga',
        (json) =>
          He.d('MyPage', 'api respond', json)
          if json.status is 200
            He.game.attachApiResult(json)
            He.game.doAnimation(json.exec)
          
        'json'
      
      # ループ開始
      @root.i = 0
      @root.addEventListener 'enterframe', @root.charLoop
    )
    
    # カードリンククリック時
    $('#card_manage').bind('click', =>
      @root.expandMainDiv()
      images = ['/images/cards/smart/large/1.jpg',
                '/images/cards/smart/large/2.jpg',
                '/images/cards/smart/large/3.jpg',
                ]
      @addAssets(images)
      @root = new CardScene(He.game.width, He.game.height - 40)
      for image in images
        @root.addCard(image)
      
      He.game.pushScene(@root)
      return false
    )

# クラスを登録
He.classes.mypage = He.MyPage


# -----------------------------------------
# 要素 - Scene
class BackScene extends He.Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h, x, y
    BackScene::me = @
    @children = []
    center_x =
      He.game.width / 2
    @addChild new BackSky(0, -190)
    @shine = new Shine(60, 40)
    @addChild @shine
    @addChild new DustB(0, 20)
    @addChild new BackCrowd(0, 110)
    @addChild new Ground(0, 160)
    
  
  charLoop: ->
    @i = 0 if @i >= 12
    if @i % 6 == 0
      @addChild new Charactor(@i / 6 + 1)
    @i++
    # 終了判定
    if He.Animation.getStatus() >= He.status.startedMainAnimation
      @removeEventListener 'enterframe', @charLoop
    if He.Animation.getStatus() >= He.status.startedMainAnimation
      @shine.addEventListener 'enterframe', @shine.loopFrame
  
  expandMainDiv: ->
    page = document.getElementById('page');
    page.style.webkitTransition = "-webkit-Transform 400ms ease-in";
    page.style.webkitTransform = "translateY(130px)";
    #status = document.getElementById('my_status');
    #status.style.webkitTransition = "-webkit-Transform 300ms ease-in";
    #status.style.webkitTransitionProperty = "opacity";
    #status.style.opacity = "0";
    
  

# -----------------------------------------
# ベース - Sprite
class MySprite extends Sprite
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
# 要素 - Scene
class CardScene extends He.Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h, x, y
    CardScene::me = @
    @backgroundColor = 'black'
  
  addCard: (asset) ->
    elem = new Card2(asset)
    console.log(elem)
    @addChild elem

# -----------------------------------------
# 要素 - 空
class Card2 extends MySprite
  constructor: (asset, x = 0, y = 0) ->
    super 320, 400, x, y
    @image = He.game.getAsset(asset)
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 空
class BackSky extends MySprite
  constructor: (x = 0, y = 0) ->
    super 320, 400, x, y
    @image = He.game.getAsset('./images/bf1_32.png')
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 群衆
class BackCrowd extends MySprite
  constructor: (x = 0, y = 0) ->
    super 330, 65, x, y
    @image = He.game.getAsset('./images/obj2_grp.png')
    @opacity = 0.8
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 地面
class Ground extends MySprite
  constructor: (x = 0, y = 0) ->
    super 330, 200, x, y
    @image = He.game.getAsset('./images/ground_shadow.png')
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 光
class Shine extends MySprite
  constructor: (x = 0, y = 0) ->
    super 217, 217, x, y
    @image = He.game.getAsset('./images/BG_glow.png')
    @_element.style.webkitTransformOrigin = '50% 50%';
    @opacity = 0
    @scale(1.6)
    @stopFrame = null
    @shrinkFrame = null
    @removeFrame = null
  loopFrame: ->
    @visible = true
    if He.Animation.getStatus() >= He.status.startedMainAnimation
      if !@stopFrame? or @stopFrame >= @i
        @opacity += 0.1 if @opacity < 1
        @scale(1.012)
      unless @removeFrame?
        @shrinkFrame = @i + 25
        @shrinkFrame = @i + 60
        @removeFrame = @i + 110
    if @shrinkFrame? and @shrinkFrame <= @i
      @opacity -= 0.13 if @opacity > 0
      @scale(0.98)
    if @removeFrame? and @removeFrame is @i
      @opacity = 0
      @removeEventListener 'enterframe', @loopFrame
      @visible = false
      @stopFrame = null
      @shrinkFrame = null
      @removeFrame = null
    @i++


# -----------------------------------------
# 要素 - 塵(3タイプ)
class Dust extends MySprite
  constructor: (x = 0, y = 0) ->
    super 290, 181, x, y
    @y_org = y
    @image = He.game.getAsset('./images/dust_anim.png')
    @fimageFit2Sprite()
    @typeFirstAction()
    @addEventListener 'enterframe', @showDust
  showDust: ->
    @typeFrameAction()
    if BackScene::me.status is 'shine'
      @opacity = 0
      @removeEventListener 'enterframe', arguments.callee 
    @i++
  typeFirstAction: ->
  typeAnimation: ->
  afterSweep: ->
    @opacity = 1
    @addEventListener 'enterframe', @showDust

class DustA extends Dust
  typeFirstAction: ->
    @rotate(180)
    
  typeFrameAction: ->
    frame = @i % 12
    if frame is 0
      @scaleX = @scaleY = 1
      @y = @y_org
    else
      @scale(1.03)
      @moveBy(0, -7)
      @opacity -= 0.03

class DustB extends Dust
  typeFrameAction: ->
    frame = @i % 27
    if frame is 0
      @scaleX = @scaleY = 1
      @y = @y_org
    else
      @scale(1.01)
      @moveBy(0, -2)

class DustC extends Dust
  typeFirstAction: ->
    @rotate(180)
    
  typeFrameAction: ->
    frame = @i % 35
    if frame is 0
      @scaleX = @scaleY = 1
      @opacity = 0.6
      @y = @y_org
    else if frame is 19
      @scale(2)
      @y -= 5
    else if frame > 19
      @scale(1.005)
      @moveBy(0, -3.5)
      @opacity -= 0.03

# -----------------------------------------
# 要素 - キャラ
class Charactor extends MySprite
  conf:
    1:
      init: 
        x: 150
        y: 60
      origin: '-15% 100%'
      scale: 
        init: 0.038
        speed: 1.84
        speed_v: -0.074
        speed_bottom: 1.12
      move:
        x: 1
        y: -0.5
      char: null
      last: 23
    2:
      init: 
        x: 80
        y: 60
      origin: '120% 100%'
      scale: 
        init: 0.035
        speed: 1.87
        speed_v: -0.1
        speed_bottom: 1.13
      move:
        x: -5
        y: -0.5
      char: null
      last: 23
    3:
      init: 
        x: 130
        y: 60
      origin: '-5% 100%'
      scale: 
        init: 0.04
        speed: 1.67
        speed_v: -0.065
        speed_bottom: 1.09
      move:
        x: 5
        y: -0.5
      char: null
      last: 23
      
  
  constructor: (num = 1) ->
    @opt = @conf[num]
    super 104, 122, @opt.init.x, @opt.init.y
    char = if @opt.char is null then Math.floor(Math.random() * 6) + 1 else @opt.char
    @image = He.game.getAsset('./images/s0' + char + '.png')
    @_element.style.webkitTransformOrigin = @opt.origin;
    @scale(@opt.scale.init)
    @fimageFit2Sprite()
    sp = @opt.scale.speed
    @i = 0
    @addEventListener 'enterframe', ->
      if @i is @opt.last
        @opacity = 0
        @removeEventListener 'enterframe', arguments.callee
        BackScene::me.removeChild(@)
      else if @i >= @opt.shine
        if @i is @opt.shine
          @org_image = @image
          @alpha = 0.5
          @cardY = 0
          @colorImg = He.game.getAsset('./images/type_color_green.png')
        @overlayCard()
      else if @i >= @opt.lightOn
        @scale(1.002)
      else
        @scale(sp)
        sp += @opt.scale.speed_v if sp > @opt.scale.speed_bottom
        @moveBy(@opt.move.x, @opt.move.y)
      @i++
