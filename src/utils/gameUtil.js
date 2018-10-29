/**
 * 自动播放音频
 * @param {string} src 音频地址 
 */
let playAudioAuto = function(src,loop = false) {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.src = src
  innerAudioContext.autoplay = true
  innerAudioContext.loop = false
  innerAudioContext.volume = 1
  innerAudioContext.onPlay(() => {
    console.log(`开始播放${src}音频`)
  })
  innerAudioContext.onError((res) => {
    console.log(`播放音频${src}出现${res.errMsg}错误`)
  })
}

let playAnimation = function (animate, postion, callback) {
  let texture = PIXI.Texture.fromImage("../img/walk.png");
	let cutnum = 8;
	//将图片拆分为8帧
	let width = parseInt(texture.width / cutnum);
	let height = parseInt(texture.height);
	let frameArray = [];
	for(let i = 0; i < cutnum; i++) {
		let rectangle = new PIXI.Rectangle(i * width, 0, width, height);
		let frame = new PIXI.Texture(texture, rectangle);
		frameArray.push(frame);
	}
	//播放动画
	movieClip = new PIXI.extras.AnimatedSprite(frameArray);
	movieClip.position.x = 100;
	movieClip.position.y = 100;
	movieClip.animationSpeed = parseFloat((20 / 120).toFixed(2));
	movieClip.play();
  app.stage.addChild(movieClip);
  callback()
}
export default {playAudioAuto, playAnimation}