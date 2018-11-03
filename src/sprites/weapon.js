import sprite from "./sprite"
import * as PIXI from '../../src/libs/pixi.js'

export default class weapon extends sprite {
  constructor(name, position, parent, monster) {
    super(position, parent)
    this.name = name
    this.monster = monster || null
    this.PIXIObject =  this.initPIXI()
    return this
  }

  initPIXI() {
    let weapon = PIXI.Sprite.fromImage(`assets/images/weapon/${this.name}.png`)
    weapon.x = 12 + 88, weapon.y = 16 + 80
    weapon.x = this.position.x, weapon.y = this.position.y
    weapon.transform.pivot.y = 80
    weapon.transform.pivot.x = 88
    return weapon
  }

  setAssociateMonster(monster) {
    this.monster = monster
  }

  getAssociateMonster(monster) {
    return this.monster
  }
}