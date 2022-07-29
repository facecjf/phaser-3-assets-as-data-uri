//---------------------- // TWEENS //////////////////////////////////////////////////////////////////////////////

// FADE ////////////////////////////////////
 // attack btn glow
 btnGlow = this.add.sprite(512, 800, 'btnGlow').setBlendMode(Phaser.BlendModes.ADD)
 btnGlow.setOrigin(0.5)
 btnGlow.setScale(0.8)
 btnGlow.setDepth(5)
 btnGlow.setAlpha(0.75)
 btnGlow.visible = false

// fade button out
btnGlowFading = this.tweens.add({
    targets: btnGlow,
    duration: 500,
    ease: 'Sine.easeInOut',
    alpha: 0,
    delay: 0,
    yoyo: true,
    paused: false,
    repeat: -1
})
// FADE ////////////////////////////////////

// SCALE ///////////////////////////////////
// fade button out
popUpTween = this.tweens.createTimeline()
popUpTween.add({
    targets: popUp,
    scaleX: '+=.8',
    scaleY: '+=.8',
    alpha: 1,
    duration: 200,
    ease: 'Sine.easeInOut',
    delay: 0,
    yoyo: false,
    paused: true,
    onComplete: function () {
        intro.visible = true
    },
    repeat: 0
})
// SCALE ///////////////////////////////////

// MOVEMENT ////////////////////////////////
// dragon flap tween
var flapTween = this.tweens.createTimeline()
flapTween.add({
    targets: dragonFlap,
    y: '+=30',
    duration: 500,
    ease: 'Sine.easeInOut',
    delay: 0,
    yoyo: true,
    repeat: -1
})
flapTween.play()
// MOVEMENT ////////////////////////////////


//---------------------- // TWEENS //////////////////////////////////////////////////////////////////////////////


//---------------------- // PARTICLES //////////////////////////////////////////////////////////////////////////

// FIRE BREATH //////////////////////////////
    // Dragon breath fire
    dragonFire = this.add.particles('flame', {
        x: 32,
        y: -36,
        lifespan: 400,
        alpha: { start: 1, end: 0.25 },
        speed: { min: 480, max: 600 },
        angle: { min: 45, max: 60 },
        gravityY: -900,
        gravityX: 600,
        scale: { start: 0.15, end: 0.6 },
        //quantity: 1,
        accelerationX: 300,
        rotate: { min: -180, max: 360 },
        blendMode: 'ADD',
        maxParticles: 24,
        tint: 0xff9933
    })
    dragonFire.visible = false
    dragonFire.setDepth(4)
// FIRE BREATH //////////////////////////////

//---------------------- // PARTICLES //////////////////////////////////////////////////////////////////////////


//---------------------- // ANIMATIONS ////////////////////////////////////////////////////////////////////////

// FRAMES ///////////////////////////////////
// defined in createGameObjects ()
explode = {
    key: 'explodeAnim',
    frames: [
        { key: 'ef0' },
        { key: 'ef1' },
        { key: 'ef2' },
        { key: 'ef3' },
        { key: 'ef4' },
        { key: 'ef5' },
        { key: 'ef6' },
        { key: 'ef7' },
        { key: 'ef8' },
        { key: 'ef9' },
        { key: 'ef10' },
        { key: 'ef11' },
        { key: 'ef0' }
    ],
    frameRate: 14,
    repeat: 0,
    loop: false
}
// called in createGameObjects ()
this.anims.create(explode)
explode = this.add.sprite(0, 0, 'explodeAnim').setDepth(4)
explode.setOrigin(0.5)
explode.setScale(1.2)
explode.anims.play('explodeAnim')
explode.visible = false 
// FRAMES ///////////////////////////////////


// SPRITESHEET //////////////////////////////
// defined in preload / create (for D URI)
var dFlapImg = new Image()
dFlapImg.onload = () => {
    this.textures.addSpriteSheet('dFlap', dFlapImg, { frameWidth: 330, frameHeight: 295 })
    // check if assets are ready then call actual phaser create function
    nLoaded++
    if (nLoaded >= nAssets) {
        var actualCreate = createGameObjects.bind(this)
        actualCreate()
    }
}
dFlapImg.src = dFlapSrc

// config created in the function createGameObjects ()
// Dragon Flap
this.anims.create({
    key: 'dragFlapAnim',
    frames: this.anims.generateFrameNumbers('dFlap', {start: 0, end: 29}),
    frameRate: 15,
    repeat: -1
})
// called animation
dragonFlap = this.add.sprite(300, 500, 'dFlap').play('dragFlapAnim').setDepth(5).setScale(1.5)

// SPRITESHEET //////////////////////////////

//---------------------- // ANIMATIONS ////////////////////////////////////////////////////////////////////////


//---------------------- // CHECK FOR OVERLAP ////////////////////////////////////////////////////////////////
// Define the overlap - resides in function createGameObjects ()
this.physics.add.overlap(item1, item2)

// Checks for overlap - resides in function update()
this.physics.world.collide(item1, item2, function () {
    console.log('overlap')
})
//---------------------- // CHECK FOR OVERLAP ////////////////////////////////////////////////////////////////


//---------------------- // TIMED EVENTS /////////////////////////////////////////////////////////////////////

// Define timed event - in create
gameLength = this.time.addEvent({ delay: 1000, callback: gameTimeCounter, callbackScope: this, loop: false, repeat: 30, paused: true}) 

// Callback Function of timed event - outside update
function gameTimeCounter () {
    // do some shit
} 
//---------------------- // TIMED EVENTS /////////////////////////////////////////////////////////////////////


//---------------------- // INTERACTIONS /////////////////////////////////////////////////////////////////////
// works with images / sprites
interactiveObject = this.add.image(512, 512, 'interactiveObject').setInteractive()

// defined in create
interactiveObject.on('pointerdown', function () {
    // code to execute
    console.log('click / touch works')
}, this) 
//---------------------- // INTERACTIONS /////////////////////////////////////////////////////////////////////


//---------------------- // MOVEMENT /////////////////////////////////////////////////////////////////////////
// Flappy Movement Template (player) - in createGameObjects ()
player = this.physics.add.sprite(100, 450, 'dude')
player.setBounce(0.2)
player.setCollideWorldBounds(true)
    
// flappy movement - in update ()
this.input.on('pointerdown', function (pointer) {
    player.setVelocityY(-100)
}, this)
//---------------------- // MOVEMENT /////////////////////////////////////////////////////////////////////////


//---------------------- // CAMERA ///////////////////////////////////////////////////////////////////////////

// FADE //////////////////////////////
// camera fade in - createGameObjects ()
this.cameras.main.fadeIn(1000)

// on camera fade complete - createGameObjects ()
this.cameras.main.once('camerafadeincomplete', function () {
    // do shit
    console.log('fade in done')
    
})
// FADE //////////////////////////////

// CAM FOLLOW ////////////////////////
//  Set the camera and physics bounds to be the size of 4x4 bg images - createGameObjects ()
this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2)

// set camera to player position w/ lerp - createGameObjects ()
this.cameras.main.startFollow(player, true, 0.05, 0.05)
// CAM FOLLOW ////////////////////////

//---------------------- // CAMERA ///////////////////////////////////////////////////////////////////////////

