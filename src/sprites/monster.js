export default class Monster {
  constructor(props) {
    this.blood = props.blood
    this.name = props.name
    this.level = props.level
    this.postion = props.position
  }

  setBlood(newBlood) {
    this.blood = newBlood
  }

  getBlood() {
    return this.blood
  }

  setPostion(newPosition) {
    this.postion = newPosition
  }

  getPostion() {
    return this.postion
  }
}