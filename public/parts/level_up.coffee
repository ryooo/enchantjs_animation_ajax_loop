# -----------------------------------------
# アニメーション設定
class He.LevelUp extends He.Animation
  constructor : () ->
    He.d('LevelUp', 'constructor')
    @cls = He.LevelUp
    @conf = He.animations.level_up
    @cls.images = [
      './images/type_color_green.png',
      './images/s04.png',
      ]
    card_image = './images/' + @conf.vars.card_id + '.jpg'
    @cls.images.push(card_image)
    super
  
  startCore: ->
    He.d('LevelUp', 'startCore')
    @root = new BackScene(He.game.width, He.game.height)
    He.game.pushScene(@root)
    He.Animation.setStatus(He.status.startedMainAnimation)
    @root.addEventListener 'enterframe', @root.showLady
    

# クラスを登録
He.classes.level_up = He.LevelUp

# -----------------------------------------
# 要素 - Scene
class BackScene extends He.Scene
  constructor: (w, h, x = 0, y = 0) ->
    super w, h, x, y
    
  showLady: ->
    if @i % 6 == 0
      @addChild new Charactor(4)
      @removeEventListener 'enterframe', arguments.callee
    @i++
  

# -----------------------------------------
# 要素 - キャラ
class Charactor extends He.Sprite
  conf:
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
    @image = He.game.getAsset('./images/s0' + char + '.png')
    @_element.style.webkitTransformOrigin = @opt.origin;
    @scale(@opt.scale.init)
    @fimageFit2Sprite()
    sp = @opt.scale.speed
    @i = 0
    @addEventListener 'enterframe', ->
      if @i >= @opt.waitForUser
        @alpha = 0
        @overlayCard()
        message = 'Level UP'
        He.Com.sysMessage(message, 320, 100, 0, 250) if @i is @opt.waitForUser
      else if @i >= @opt.shine
        if @i is @opt.shine
          @org_image = @image
          @alpha = 0.5
          @cardY = 0
          image = 
          @colorImg = He.game.getAsset('./images/type_color_green.png')
        @overlayCard()
      else if @i >= @opt.lightOn
        @scale(1.002)
      else
        @scale(sp)
        sp += @opt.scale.speed_v if sp > @opt.scale.speed_bottom
        @moveBy(@opt.move.x, @opt.move.y)
      @i++
      if He.Animation.getStatus() is He.status.waitingForLoad
        @removeEventListener 'enterframe', arguments.callee
        He.game.popScene()
      
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

  # 画像サイズをspriteサイズに調整
  fimageFit2Sprite: ->
    @_element.style.WebkitBackgroundSize =
      @width + 'px, ' + @height + 'px';

