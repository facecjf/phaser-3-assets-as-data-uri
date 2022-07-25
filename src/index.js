import 'phaser'

// ASSETS /////////////////////////////////////////////////////////////////////////
import bgSrc from '../assets/bgPort.png'
import shardsSrc from '../assets/shards.png'

// the json file can be loaded by webpack. url-loader doesn't apply here
//import sfxJson from '../assets/sfx.json'

// CONFIG /////////////////////////////////////////////////////////////////////////
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)

// VARIABLES /////////////////////////////////////////////////////////////////////////
// Assets
var bg
var shards

// Emitters
var emitter

// Booleans
var startGame = false

// Numbers

// Tweens

// Timed events
var timedEvent

// PRELOAD (unused for DATA URI METHOD) // VARIABLES /////////////////////////////////
function preload ()
{
    // original loading methods for web (with xhr requests)
    // this.load.image('bg', 'assets/blue.png');
}

// CREATE ///////////////////////////////////////////////////////////////////////////
function create ()
{

    // ASSET TRACKING /////////////////// 
    var nAssets = 2
    var nLoaded = 0 // keep track

    // ASSETS TO LOAD /////////////////// 
    this.textures.addBase64('bg', bgSrc)
    nLoaded++

    // SPRITESHEET //////////////////////
    var shardsImg = new Image()
    shardsImg.onload = () => {
        this.textures.addSpriteSheet('shards', shardsImg, { frameWidth: 16, frameHeight: 16 })
        // check if assets are ready then call actual phaser create function
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = createGameObjects.bind(this)
            actualCreate()
        }
    }
    shardsImg.src = shardsSrc

} // END CREATE //////////////////////////////////////////////////////////////////////

// ACTUAL CREATE /////////////////////////////////////////////////////////////////////
function createGameObjects ()
{
    // camera fade in
    this.cameras.main.fadeIn(1000)

    // on camera fade complete
    this.cameras.main.once('camerafadeincomplete', function () {
        // do shit
        startGame = true
        console.log('fade in done')
        
    })

    //  Set the camera and physics bounds to be the size of 4x4 bg images
    //this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
    //this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
  

    // create assets
    bg = this.add.image(360, 640, 'bg')
    bg.setOrigin(0.5)

    // set camera to player position w/ lerp
    //this.cameras.main.startFollow(player, true, 0.05, 0.05);

    shards = this.add.particles('shards')
    
    emitter = shards.createEmitter({
        frame: [0, 1, 2, 3],
        x: 360,
        y: 640,
        lifespan: 600,
        alpha: { start: 1, end: 0 },
        speed: { min: 2, max: 20 },
        angle: { min: 270, max: 270 },
        gravityY: -3200,
        gravityX: 0,
        scale: { start: 2, end: 4 },
        //quantity: 1,
        accelerationY: 2000,
        rotate: { min: 0, max: 360 },
        blendMode: 'ADD',
        //maxParticles: 32,
        tint: 0x6600cc
    })

    // timed events
    timedEvent = this.time.addEvent({ delay: 0, callback: onEvent, callbackScope: this, loop: true, repeat: 0 })

} // END ACTUAL CREATE ///////////////////////////////////////////////////////////////

// UPDATE ////////////////////////////////////////////////////////////////////////////
function update () {

} // END UPDATE //////////////////////////////////////////////////////////////////////

// FUNCTIONS /////////////////////////////////////////////////////////////////////////
// Basic callback function of timed event
function onEvent () {
    if (startGame) {
        emitter.explode()
        //console.log("hi")
        
    }  
} 

// END FUNCTIONS /////////////////////////////////////////////////////////////////////
