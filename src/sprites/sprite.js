import position from '../other/position'
export default class sprite{
  constructor(position, parent){
    this.position = position
    this.parent = parent || null
  }
} 