import './src/libs/weapp-adapter'
import * as PIXI from './src/libs/pixi.js'
import * as Tween from './src/libs/Tween.js'
import gameUtil from './src/utils/gameUtil'
import mathUtil from './src/utils/mathUtil'
import Monster from './src/sprites/monster'
import monsterConfig from './src/config/monster_config'

const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync()
const w = windowWidth * pixelRatio 
const h = windowHeight * pixelRatio
const app = new PIXI.Application({
  width: 750,
  height: 1334,
  forceCanvas: true,
  view: canvas
})
const ticker = new PIXI.ticker.Ticker();
ticker.add((deltaTime) => {
  Tween.update();
});
ticker.start();
let monster = ''
let monsterCard = ''
app.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
  point.x = x * 750 / windowWidth
  point.y = y * 1334 / windowHeight
}
// this.showMonsterCard = this.showMonsterCard.bind(this)

const bkg = PIXI.Sprite.fromImage('assets/images/bg.png')
bkg.width = 750
bkg.height = 1334
app.stage.addChild(bkg)
gameUtil.playAudioAuto('/assets/audio/bg_audio.mp3', true)

let refreshHP = function(monster) {
  let monsterHP = new PIXI.Graphics()
  let monsterMain = monster.getChildAt(0)
  monsterHP.lineStyle(2, 0xFFFFFF)
  monsterHP.beginFill(0xD8D8D8, 1)
  monsterHP.drawRoundedRect(-120, -290, 240, 30, 15)
  monsterHP.endFill()

  monsterHP.beginFill(0xFF5555, 1)
  monsterHP.drawRoundedRect(-115, -285, 230 * (monsterMain.blood / 100), 20, 10)
  monsterHP.endFill()
  monster.addChild(monsterHP)
}

let createMonster = function(scene, oldMonster) {
  let lastMonster = {}
  if (oldMonster) {
    lastMonster.x = oldMonster.x
    lastMonster.y = oldMonster.y
    app.stage.removeChild(oldMonster)
  }
  let monster_container = new PIXI.Container()
  let randomNum = mathUtil.getRandomNum(1, 8)
  let monsterSrc = monsterSrc = 'assets/images/monsters/scene' + scene + '/monster' + randomNum + '_shadow.png'
  let monster = PIXI.Sprite.fromImage(monsterSrc)
  Object.assign(monster, {scene, blood: 100, randomNum})
  monster_container.addChild(monster)
  monster_container.x = lastMonster.x || 200
  monster_container.y = lastMonster.y || 200
  monster.transform.pivot.x = 120
  monster.transform.pivot.y = 240
  refreshHP(monster_container)
  app.stage.addChild(monster_container)
  return monster_container
}

monster = createMonster(1)

/**
 *  怪物随机移动
 */
let randomRun = () => {
  let minX = Math.max(0, monster.x - 50),
      maxX = Math.min(500, monster.x + 50),
      minY = Math.max(200 + 240, monster.y - 50),
      maxY = Math.min(400 + 240, monster.y + 50)
  let x = mathUtil.getRandom(minX, maxX), y = mathUtil.getRandom(minY, maxY);
  let monsterMain = monster.getChildAt(0)
  let t = new Tween.Tween(monster)
          .to({x, y}, 500)
          .easing(Tween.Easing.Linear.None)
          .start()
          .onComplete(randomRun)
  let s = new Tween.Tween(monsterMain.transform.scale)
    .to({ y: 0.9 }, 250)
    .easing(Tween.Easing.Linear.None)
    .start().onComplete(function(){
      let s2 = new Tween.Tween(monsterMain.transform.scale)
        .to({ y: 1 }, 250)
        .easing(Tween.Easing.Linear.None)
        .start()
    })
  let r = mathUtil.getRotation({ x: 320, y: 1334 - 400 }, { x: monster.x + 50, y: monster.y - 200 })
  new Tween.Tween(bow.transform)
    .to({ rotation: (r - 90) / 180 * Math.PI}, 500)
    .easing(Tween.Easing.Linear.None)
    .start()
}

// init weapon 
let weapon_wrap = new PIXI.Container()
weapon_wrap.width = 200
weapon_wrap.height = 200
weapon_wrap.x = 275, weapon_wrap.y = 1334 - 480
app.stage.addChild(weapon_wrap)
let weapon_bg = PIXI.Sprite.fromImage('assets/images/weapon_bg.png')
weapon_wrap.addChild(weapon_bg)
let bow = PIXI.Sprite.fromImage('assets/images/bow.png')
bow.x = 12 + 88, bow.y = 16 + 80;
bow.transform.pivot.y = 80
bow.transform.pivot.x = 88
weapon_wrap.addChild(bow)

// init bow
bow.interactive = true;
let bow_timer = null, arrowNum = 0;
bow.on("tap", () => {
  let monsterMain = monster.getChildAt(0)
  if(bow_timer){
    Tween.remove(bow_timer)
    bow.transform.scale.y = 1
  }
  bow_timer = new Tween.Tween(bow.transform.scale).to({y: 0.8},250)
  .easing(Tween.Easing.Linear.None).start().yoyo(true).repeat(1)
  let arrow = arrows[arrowNum]
  arrow.x = 320 + 55,
  arrow.y = 1334 - 400 + 60
  arrow.alpha = 1
  let r = mathUtil.getRotation({x: 320, y: 1334 - 400},{x: monster.x + 50,y: monster.y - 200})
  arrow.transform.rotation = (r - 90) / 180 * Math.PI
  new Tween.Tween(arrow).to({ x: monster.x + 50, y: monster.y - 200 }, 300).easing(Tween.Easing.Quintic.In).
    start()
  new Tween.Tween(arrow).to({ alpha: 0}, 100).delay(200).easing(Tween.Easing.Quintic.In).
    start()
  monsterMain.blood = monsterMain.blood - 5 < 0 ? 0 : monsterMain.blood - 5
  if (monsterMain.blood == 0) {
    app.stage.removeChild(monster)
    // todo 播放动画
    showMonsterCard(monsterMain.scene, monsterMain.randomNum, true)
    //monster = createMonster(1, monster)
  } else {
    refreshHP(monster)
  }
  arrowNum = arrowNum + 1 > 4 ? 0 : arrowNum + 1

  // 创建射中的音频
  gameUtil.playAudioAuto('/assets/audio/hit_audio.mp3')
})

// initRabbit

let radish_wrap = new PIXI.Container()
let radish_timer = null
radish_wrap.width = 111
radish_wrap.height = 111
radish_wrap.x = 76, radish_wrap.y = 1334 - 434
app.stage.addChild(radish_wrap)
let radish_bg = PIXI.Sprite.fromImage('assets/images/radish_bg.png')
radish_wrap.addChild(radish_bg)
let radish = PIXI.Sprite.fromImage('assets/images/radish.png')
radish.x = 75, radish.y = 54
radish.transform.pivot.y = 50
radish.transform.pivot.x = 50
radish_wrap.addChild(radish)

radish.interactive = true;
radish.on("tap", function() {
  if(radish_timer){
    Tween.remove(radish_timer)
    radish.transform.scale.y = 1
  }
  radish_timer = new Tween.Tween(radish.transform.scale).to({y: 0.8},250)
  .easing(Tween.Easing.Linear.None).start().yoyo(true).repeat(1)
  monster = createMonster(1, monster)
})

let arrows = [];
for (let i = 0; i < 5; i++) {
  let temp = new PIXI.Sprite.fromImage('assets/images/arrow.png') //110x170
  temp.transform.pivot.x = 55 //pivot 旋转中心
  temp.transform.pivot.y = 85
  temp.alpha = 0;
  app.stage.addChild(temp)
  arrows.push(temp)
}

// 创建狩猎图
let monster_dic = new PIXI.Sprite.fromImage('assets/images/monster_dic.png')
monster_dic.x = 320
monster_dic.y = 1145
app.stage.addChild(monster_dic)
let dictText = new PIXI.Text('狩猎图鉴', {
  fontFamily: 'FZCUYSJW--GB1-0',
  fontSize: '28px',
  fill: 'white'
})
dictText.x = 320;
dictText.y = 1272;
app.stage.addChild(dictText)

/**
 * 展示怪物卡片
 * @param {int} monsterScene 怪物场景
 * @param {Int} monsterNum 场景随机怪物值
 * @param {Boolean} saveFlag 是保存还是展示
 */
let showMonsterCard = function(monsterScene, monsterNum, saveFlag = false) {
  let monsterSavedData = JSON.parse(wx.getStorageSync('monster'))
  if (monsterSavedData.sceneId["scene" + monsterScene]["monster" + monsterNum]) {
    console.log("怪物已经捕获")
  } else {
    monsterSavedData.sceneId["scene" + monsterScene]["monster" + monsterNum] = "1"
    wx.setStorageSync('monster', JSON.stringify(monsterSavedData))
    let card_wrap = new PIXI.Container()
    card_wrap.x = 0
    card_wrap.y = 0
    card_wrap.width = 750
    card_wrap.height = 1334
    let card = new PIXI.Container()
    card.x = 80
    card.y = 285
    card.width = 590
    card.height = 786
    card_wrap.addChild(card)
    let cardBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, 590, 786, 20).endFill()
    card.addChild(cardBackground)
    let monsterSrc = monsterSrc = 'assets/images/monsters/scene' + monsterScene + '/monster' + monsterNum + '.png'
    let monster = PIXI.Sprite.fromImage(monsterSrc)
    monster.x = 208
    monster.y = 345
    monster.width = 180
    monster.height = 180
    card.addChild(monster)
    if (saveFlag) {
      let new_icon = PIXI.Sprite.fromImage('assets/images/icon_new.png')
      new_icon.x = 0
      new_icon.y = 0
      new_icon.width = 100
      new_icon.height = 100
      card.addChild(new_icon)
    }
    let orangeButton = PIXI.Sprite.fromImage('assets/images/orange_button.png')
    orangeButton.x = 46
    orangeButton.y = 612
    orangeButton.width = 237
    orangeButton.height = 110
    orangeButton.interactive = true
    orangeButton.on("tap", function() {
      
    })
    card.addChild(orangeButton)
    let greenButton = PIXI.Sprite.fromImage('assets/images/green_button.png')
    greenButton.x = 315
    greenButton.y = 612
    greenButton.width = 237
    greenButton.height = 110
    greenButton.interactive = true
    greenButton.on("tap", function () {
      
    })
    card.addChild(greenButton)
    app.stage.addChild(card_wrap)
  }
}
let saleMonster = function (monsterScene, monsterNum) {
  console.log("卖出成功")
}

let feedMonster = function (monsterScene, monsterNum) {
  console.log("收养成功")
}
if (!wx.getStorageSync('monster')) {
  wx.setStorageSync('monster', monsterConfig)
}
randomRun()

// create arrows

