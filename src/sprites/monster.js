import Position from '../other/position'
import sprite from './sprite'
import mathUtil from '../utils/mathUtil'
import * as PIXI from '../../src/libs/pixi.js'
import * as Tween from '../../src/libs/Tween.js'

export default class Monster extends sprite{
  constructor(blood, name, scene, id, position, weapon) {
    super(position)
    this.init()
    this.blood = blood
    this.name = name
    this.scene = scene
    this.id = id
    this.weapon = weapon || null
    this.position = position || new Position(200, 200)
    this.PIXIObject = this.initPIXI()
    this.refreshHP()
    this.randomRun()
    return this
  }

  init() {
    this.randomRun = this.randomRun.bind(this)
  }

  initPIXI() {
    let monster_container = new PIXI.Container()
    let monsterSrc = monsterSrc = 'assets/images/monsters/scene' + this.scene + '/monster' + this.id + '_shadow.png'
    let monster = PIXI.Sprite.fromImage(monsterSrc)
    monster_container.addChild(monster)
    monster_container.x = this.position.x
    monster_container.y = this.position.y
    monster.transform.pivot.x = 120
    monster.transform.pivot.y = 240
    return monster_container
  }

  refreshHP() {
    let monsterHP = new PIXI.Graphics()
    monsterHP.lineStyle(2, 0xFFFFFF)
    monsterHP.beginFill(0xD8D8D8, 1)
    monsterHP.drawRoundedRect(-120, -290, 240, 30, 15)
    monsterHP.endFill()
    monsterHP.beginFill(0xFF5555, 1)
    monsterHP.drawRoundedRect(-115, -285, 230 * (this.blood / 100), 20, 10)
    monsterHP.endFill()
    this.PIXIObject.addChild(monsterHP)
  }

  hurt(damage, hurtcb, destorycb) {
    let _this = this
    this.blood = (this.blood - damage >= 0) ? this.blood - damage : 0
    // todo 冒血动画 和 血量减少数字
    if(this.blood == 0) {
      if (destorycb && typeof destorycb == 'function') {
        destorycb()
      }
    } else {
      let damageText = new PIXI.Text(`-${damage}`, {
        fontFamily: 'FZCUYSJW--GB1-0',
        fontSize: '40px',
        fill: 'red'
      })
      damageText.x = -20
      damageText.y = - 350
      damageText.alpha = 0.6
      this.PIXIObject.addChild(damageText)
      new Tween.Tween(damageText).to({y: -450}, 500).easing(Tween.Easing.Linear.None).start().onComplete(function () {
        _this.PIXIObject.removeChild(damageText)
      })
      new Tween.Tween(damageText).to({ alpha: 1}, 250).to({ alpha: 0.4}, 250).easing(Tween.Easing.Quintic.In).
      start()
      this.refreshHP()
      if (hurtcb && typeof hurtcb == 'function') {
        hurtcb()
      }
    }
  }

  /**
 *  怪物随机移动
 */
 randomRun(){
    let _this = this
    let minX = Math.max(0, this.position.x - 50),
        maxX = Math.min(500, this.position.x + 50),
        minY = Math.max(200 + 240, this.position.y - 50),
        maxY = Math.min(400 + 240, this.position.y + 50)
    this.position.x = mathUtil.getRandom(minX, maxX), this.position.y = mathUtil.getRandom(minY, maxY);
    let t = new Tween.Tween(this.PIXIObject)
            .to(this.position, 500)
            .easing(Tween.Easing.Linear.None)
            .start()
            .onComplete(this.randomRun)
    let s = new Tween.Tween(_this.PIXIObject.transform.scale)
      .to({ y: 0.9 }, 250)
      .easing(Tween.Easing.Linear.None)
      .start().yoyo(true).repeat(1)
    let r = mathUtil.getRotation({ x: 320, y: 1334 - 400 }, { x: this.position.x + 50, y: this.position.y - 200 })
    if (this.weapon) {
      new Tween.Tween(this.weapon.PIXIObject.transform)
        .to({ rotation: (r - 90) / 180 * Math.PI}, 500)
        .easing(Tween.Easing.Linear.None)
        .start()
    }
  }
}