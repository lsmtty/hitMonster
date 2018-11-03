import './src/libs/weapp-adapter'
import * as PIXI from './src/libs/pixi.js'
import * as Tween from './src/libs/Tween.js'
import gameUtil from './src/utils/gameUtil'
import mathUtil from './src/utils/mathUtil'
import Monster from './src/sprites/monster'
import Bow from './src/sprites/bow'
import monsterConfig from './src/config/monster_config'
import Position from './src/other/position'
import Weapon from './src/sprites/weapon'


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
let weapon = ''
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

let createMonster = function(scene, oldMonster) {
  if (oldMonster) {
    app.stage.removeChild(oldMonster.PIXIObject)
  }
  let randomNum = mathUtil.getRandomNum(1, 8)
  let monster = new Monster(100, '比卡丘', 1, randomNum, null , weapon)
  app.stage.addChild(monster.PIXIObject)
  return monster
}

// createWeapon

let weapon_wrap = new PIXI.Container()
weapon_wrap.width = 200
weapon_wrap.height = 200
weapon_wrap.x = 275, weapon_wrap.y = 1334 - 480
app.stage.addChild(weapon_wrap)
let weapon_bg = PIXI.Sprite.fromImage('assets/images/weapon_bg.png')
weapon_wrap.addChild(weapon_bg)
weapon = new Bow(new Position(16 + 88, 16 + 80), app.stage)
weapon_wrap.addChild(weapon.PIXIObject)

monster = createMonster(1)
weapon.setAssociateMonster(monster)

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

