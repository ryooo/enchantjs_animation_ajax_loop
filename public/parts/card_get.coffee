# -----------------------------------------
# アニメーション設定
class He.MyPage extends He.Animation
  constructor : (response = {}) ->
    He.debug('MyPage', 'constructor')
    @cls = He.MyPage
    @apiResponse = response
    @cls.images = [
      './images/bf_sky.png',
      './images/bf1_32.png',
      './images/12000801.jpg',
      './images/BG_glow.png',
      './images/obj2_grp.png',
      './images/weapon_eff_g1.png',
      './images/weapon_eff_arrow.png',
      './images/weapon_eff_g2.png',
      './images/ground_shadow.png',
      './images/black_lines_A1.png',
      './images/black_lines_A2.png',
      './images/black_lines_A3.png',
      './images/black_lines_A4.png',
      './images/black_lines_B1.png',
      './images/black_lines_B2.png',
      './images/black_lines_B3.png',
      './images/black_lines_B4.png',
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
    He.debug('MyPage', 'startCore')
    @root = new BackScene(He.game.width, He.game.height)
    @root._element.id = 'myPageRoot'
    He.game.pushScene(@root)
    $('#enchant-stage').append(@apiResponse.result.html)
    He.Com.flipDiv('myPageRoot', 'status', 'btn_3')
    
    $('#btn_1').click(=>
      @root.status = 'api_start'
      @root.sweepChildrenAtInit()
      # クエスト結果取得API
      $.post '/api/tests/do_quest/hoge.json',
        foo: 'bar'
        hoge: 'fuga',
        (json) =>
          @root.status = 'api_fin'
          switch json.result.anim
            when 'level_up'
              @root.removeEventListener 'enterframe', @root.charLoop
              @root.addEventListener 'enterframe', @root.showLady
              diff = json.me.st - $('#st').text()
              $('#lv').text(parseInt($('#lv').text()) + 1).addClass('status_up')
              
            when 'card_get'
              @root.removeEventListener 'enterframe', @root.charLoop
              @root.status = 'waitForUser'
              @root.sweepChildren()
              $('#cc').text(parseInt($('#cc').text()) + 1).addClass('status_up')
              He.game.pushScene(new CardScene())
              
          @root.updateTxt(json)
          
        'json'
      
      # ループ開始
      @root.addEventListener 'enterframe', @root.charLoop
    )
  

# クラスを登録
He.animations.mypage.cls = He.MyPage

# -----------------------------------------
# 要素 - Scene
class BackScene extends He.Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h, x, y
    MainScene::me = @
    @status = null
    @children = []
    center_x =
      He.game.width / 2
    @addChild new BackSky(0, -190)
    @addChild new Shine(60, 40)
    @addChild new Whiteout(0, 0)
    @addChild new DustB(0, 20)
    @addChild new BackCrowd(0, 110)
    @addChild new Ground(0, 160)
    
  
  charLoop: ->
    @i = 0 if @i >= 12
    if @i % 6 == 0
      @addChild new Charactor(@i / 6 + 1)
    @i++
  
  showLady: ->
    if @i % 6 == 0
      @addChild new Charactor(4)
      @removeEventListener 'enterframe', arguments.callee
      @sweepChildren()
    @i++
  
  sweepChildren: ->
    if @status is 'waitForUser'
      for child, i in @children
        @removeChild child if child.remove_at is 'sweep'
        @children.slice(i, 1)
        child.afterSweep()
  
  sweepChildrenAtInit: ->
    for child, i in @children
      @removeChild child if child.remove_at is 'api_init'
      @children.slice(i, 1)
      child.afterSweep()
      child.beforeApiCall()
  
  addChild: (child) ->
    super child
    @children.push(child)
  
  setStatus: (status)->
    @status = status
  

# -----------------------------------------
# ベース - Sprite
class HeSprite extends Sprite
  constructor: (w, h, x = 0, y = 0) ->
    super w, h
    @remove_at = 'sweep'
    @x = x
    @y = y
    @i = 0
    @addEventListener 'enterframe', ->
      @i++

  # 画像サイズをspriteサイズに調整
  fimageFit2Sprite: ->
    @_element.style.WebkitBackgroundSize =
      @width + 'px, ' + @height + 'px';
  beforeApiCall: ->
  afterSweep: ->

# -----------------------------------------
# 要素 - 空
class BackSky extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 320, 400, x, y
    @remove_at = 'none'
    @image = He.game.getAsset('./images/bf1_32.png')
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 群衆
class BackCrowd extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 330, 65, x, y
    @remove_at = 'none'
    @image = He.game.getAsset('./images/obj2_grp.png')
    @opacity = 0.8
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 地面
class Ground extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 330, 200, x, y
    @remove_at = 'none'
    @image = He.game.getAsset('./images/ground_shadow.png')
    @fimageFit2Sprite()

# -----------------------------------------
# 要素 - 光
class Shine extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 217, 217, x, y
    @image = He.game.getAsset('./images/BG_glow.png')
    @_element.style.webkitTransformOrigin = '50% 50%';
    @opacity = 0
    @scale(1.6)
    @remove_at = 'none'
    @addEventListener 'enterframe', @loopFrame
    @atached = true
  beforeApiCall: ->
    @addEventListener 'enterframe', @loopFrame if @atached is false
  loopFrame: ->
    switch MainScene::me.status
      when 'lightOn'
        @opacity += 0.1 if @opacity < 1
        @scale(1.012)
      when 'shine'
        @opacity = 0
        @removeEventListener 'enterframe', @loopFrame
        @atached = false


# -----------------------------------------
# 要素 - 塵(3タイプ)
class Dust extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 290, 181, x, y
    @remove_at = 'none'
    @y_org = y
    @image = He.game.getAsset('./images/dust_anim.png')
    @fimageFit2Sprite()
    @typeFirstAction()
    @addEventListener 'enterframe', @showDust
  showDust: ->
    @typeFrameAction()
    if MainScene::me.status is 'shine'
      @opacity = 0
      @removeEventListener 'enterframe', arguments.callee 
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
class Charactor extends HeSprite
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
      
    4:
      init: 
        x: 95
        y: 60
      origin: '50% 95%'
      scale: 
        init: 0.035
        speed: 1.72
        speed_v: -0.068
        speed_bottom: 1.09
      move:
        x: 0
        y: 0
      char: 2
      last: null
      lightOn: 14
      shine: 29
      waitForUser: 55
      
  
  constructor: (num = 1) ->
    @opt = @conf[num]
    super 104, 122, @opt.init.x, @opt.init.y
    char = if @opt.char is null then Math.floor(Math.random() * 6) + 1 else @opt.char
    @image = He.game.getAsset('/images/s0' + char + '.png')
    @_element.style.webkitTransformOrigin = @opt.origin;
    @scale(@opt.scale.init)
    @fimageFit2Sprite()
    sp = @opt.scale.speed
    @remove_at = 'api_init' if num is 4
    @i = 0
    @addEventListener 'enterframe', ->
      if @i is @opt.last
        @opacity = 0
        @removeEventListener 'enterframe', arguments.callee
      else if @i >= @opt.waitForUser
        @alpha = 0
        @overlayCard()
        MainScene::me.setStatus('waitForUser')
      else if @i >= @opt.shine
        if @i is @opt.shine
          Whiteout::me.show()
          MainScene::me.setStatus('shine')
          @org_image = @image
          @alpha = 0.5
          @cardY = 0
          image = 
          @colorImg = He.game.getAsset('./images/type_color_green.png')
        @overlayCard()
      else if @i >= @opt.lightOn
        MainScene::me.setStatus('lightOn') if @i is @opt.lightOn
        @scale(1.002)
      else
        @scale(sp)
        sp += @opt.scale.speed_v if sp > @opt.scale.speed_bottom
        @moveBy(@opt.move.x, @opt.move.y)
      
  overlayCard: ->
    image = new Surface(@width, @height)
    ctx = image.context
    ctx.clearRect(0, 0, @width, @height)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(@org_image._element, 0, 0, @width, @height)
    @alpha -= 0.015
    ctx.globalAlpha = Math.max(@alpha, 0)
    ctx.globalCompositeOperation = 'source-atop'
    card = He.game.getAsset('./images/12000801.jpg')
    @cardY -= 1
    ctx.drawImage(card._element,  0, @cardY, @width, @height)
    ctx.globalAlpha = Math.max(@alpha, 0)
    ctx.globalCompositeOperation = 'source-atop'
    ctx.drawImage(@colorImg._element, 0, 0, @width, @height)
    @image = image

# -----------------------------------------
# 要素 - Touch文字
class TouchStr extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 72, 20, x, y
    @image = He.game.getAsset('./images/touch_touch.png')

# -----------------------------------------
# 要素 - Touch文字マスク
class TouchStrMask extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 320, 28, x, y
    @org_x = x
    @_element.style.background = '-webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 1)), color-stop(0.3, rgba(0, 0, 0, 1)), color-stop(0.5, transparent), color-stop(0.7, rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 1)))'
    @addEventListener 'enterframe', ->
      @x = @org_x if @i % 35 is 0
      @x += 6

# -----------------------------------------
# 要素 - 全画面白
class Whiteout extends HeSprite
  constructor: (x = 0, y = 0) ->
    Whiteout::me = @
    super He.game.width, He.game.height, x, y
    @backgroundColor = 'white'
    @opacity = 0
    @remove_at = 'none'
    @addEventListener 'enterframe', ->
      
      switch MainScene::me.status
        when 'shine'
          @opacity -= 0.03
        when 'waitForUser'
          @opacity -= 0.1
          
  show: ->
    @opacity = 1

# -----------------------------------------
# 要素 - Scene
class CardScene extends He.Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h, x, y
    @i = 0
    CardScene::me = @
    @status = null
    @addChild new GreenFire()
    @addChild new Beam(80, -120)
    @addChild new BeamArrow(260, -110)
    @addChild new BeamLine(130, -160)
    
    @addEventListener 'enterframe', ->
      @i++
      
  setStatus: (status)->
    @status = status

# -----------------------------------------
# 要素 - クリック時の緑の光線
class Beam extends HeSprite
  constructor: (x = 0, y = 0) ->
    super He.game.width, He.game.height, x, y
    @image = He.game.getAsset('./images/weapon_eff_g1.png')
    @fimageFit2Sprite()
    @addEventListener 'enterframe', ->
      @scale(1.2)
      @moveBy(-40, 40)
      if @i is 3
        @opacity = 0
        @removeEventListener 'enterframe', arguments.callee

# -----------------------------------------
# 要素 - クリック時の白の矢
class BeamArrow extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 131, 165, x, y
    @image = He.game.getAsset('./images/weapon_eff_arrow.png')
    @scale(2)
    @addEventListener 'enterframe', ->
      @scale(1.15)
      @moveBy(-40, 40)
      if @i is 3
        @opacity = 0
        @removeEventListener 'enterframe', arguments.callee

# -----------------------------------------
# 要素 - クリック時の白の線
class BeamLine extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 84, 513, x, y
    @image = He.game.getAsset('./images/weapon_eff_g2.png')
    @scale(4, 8)
    @rotate(41.4)
    @opacity = 0
    @addEventListener 'enterframe', ->
      @opacity = 1 if @i is 3
      if @i > 10
        @opacity -= 0.2
        if @opacity <= 0.2
          @opacity = 0
          CardScene::me.addChild new Card()
          @removeEventListener 'enterframe', arguments.callee
      else if @i > 3
        @scale(2)
        @moveBy(-20, 20)
      

# -----------------------------------------
# 要素 - 緑背景
class GreenFire extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 320, 420, x, y
    @org_y = y
    @greenA = He.game.getAsset('./images/bg_gradient_g1.png')
    @greenB = He.game.getAsset('./images/bg_gradient_g2.png')
    @image = @greenA
    @fimageFit2Sprite()
    @addEventListener 'enterframe', ->
      if @i % 4 < 2
        @image = @greenA
        @y = @org_y
      else
        @image = @greenB
        @y -= 8

# -----------------------------------------
# 要素 - カード
class Card extends HeSprite
  constructor: (x = 0, y = 0) ->
    super 320, 420, x, y
    @image = He.game.getAsset('./images/12000801.jpg')
    @_element.style.webkitTransformOrigin = '50% 80%';
    @scale(1.5)
    @fimageFit2Sprite()
    @addEventListener 'enterframe', ->
      if @i < 2
        @scale(0.72)
      else if @i < 4
        @scale(0.67)
        @moveBy(0, -93)
      else if @i < 6
        @scale(1.05)
      else if @i is 7
        @removeEventListener 'enterframe', arguments.callee
