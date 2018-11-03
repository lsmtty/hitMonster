import weapon from './weapon'
import gameUtil from '../utils/gameUtil'
import mathUtil from '../utils/mathUtil'
import * as PIXI from '../../src/libs/pixi.js'
import * as Tween from '../../src/libs/Tween.js'
export default class bow extends weapon{
  constructor(position, parent, monster){
    super('bow', position, parent, monster)
    this.initBow()
    this.createArrows()
  }

  initBow() {
    this.PIXIObject.interactive = true
    this.timer = null, this.arrowNum = 0
    this.PIXIObject.on("tap", this.handleTap.bind(this))
  }

  createArrows() {
    this.arrows = []
    this.arrowNum = -1
    for (let i = 0; i < 5; i++) {
      let temp = new PIXI.Sprite.fromImage('assets/images/arrow.png') //110x170
      temp.transform.pivot.x = 55 //pivot 旋转中心
      temp.transform.pivot.y = 85
      temp.alpha = 0;
      this.parent.addChild(temp)
      this.arrows.push(temp)
    }
  }

  handleTap () {
    if (!this.monster) {
      return
    }
    if(this.timer){
      Tween.remove(this.timer)
      this.PIXIObject.transform.scale.y = 1
    }
    this.timer = new Tween.Tween(this.PIXIObject.transform.scale).to({y: 0.8},250)
    .easing(Tween.Easing.Linear.None).start().yoyo(true).repeat(1)
    this.arrowNum = this.arrowNum + 1 > 4 ? 0 : this.arrowNum + 1
    let arrow = this.arrows[this.arrowNum]
    arrow.x = 320 + 55,
    arrow.y = 1334 - 400 + 60
    arrow.alpha = 1
    let r = mathUtil.getRotation({x: 320, y: 1334 - 400},{x: this.monster.position.x + 50,y: this.monster.position.y - 200})
    arrow.transform.rotation = (r - 90) / 180 * Math.PI
    new Tween.Tween(arrow).to({ x: this.monster.position.x + 50, y: this.monster.position.y - 200 }, 300).easing(Tween.Easing.Quintic.In).
      start()
    new Tween.Tween(arrow).to({ alpha: 0}, 100).delay(200).easing(Tween.Easing.Quintic.In).
      start()
    this.monster.hurt(5, () => {}, function () {
      this.parent.removeChild(this.monster.PIXIObject)
    })
    

    // 创建射中的音频
    gameUtil.playAudioAuto('/assets/audio/hit_audio.mp3')
  }
}