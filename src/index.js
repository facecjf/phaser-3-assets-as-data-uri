import 'phaser'

// ASSETS /////////////////////////////////////////////////////////////////////////
import bgSrc from '../assets/bgSq.jpg'
import appIconSrc from '../assets/appIcon.png'
import shardsSrc from '../assets/shards.png'
import uiHandSrc from '../assets/ui_hand.png'
import tutMsgSrc from '../assets/tutMsg.png'
import tutMsg2Src from '../assets/tutMsg2.png'
import uiButtonSrc from '../assets/ui_button.png'
import ctaSrc from '../assets/CTA.png'

// the json file can be loaded by webpack. url-loader doesn't apply here
//import sfxJson from '../assets/sfx.json'

// Aspect Ratio 16:9 - landscape
/*
const MAX_SIZE_WIDTH_SCREEN = 1920
const MAX_SIZE_HEIGHT_SCREEN = 1080
const MIN_SIZE_WIDTH_SCREEN = 480
const MIN_SIZE_HEIGHT_SCREEN = 270
const SIZE_WIDTH_SCREEN = 960
const SIZE_HEIGHT_SCREEN = 540
*/
// Aspect Ratio 16:9 - portrait
const MAX_SIZE_WIDTH_SCREEN = 1080
const MAX_SIZE_HEIGHT_SCREEN = 1920
const MIN_SIZE_WIDTH_SCREEN = 270
const MIN_SIZE_HEIGHT_SCREEN = 480
const SIZE_WIDTH_SCREEN = 540
const SIZE_HEIGHT_SCREEN = 960
// CONFIG /////////////////////////////////////////////////////////////////////////
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#FFF',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        min: {
            width: MIN_SIZE_WIDTH_SCREEN,
            height: MIN_SIZE_HEIGHT_SCREEN
        },
        max: {
            width: MAX_SIZE_WIDTH_SCREEN,
            height: MAX_SIZE_HEIGHT_SCREEN
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: gameState
    }
}

var game = new Phaser.Game(config)

// VARIABLES /////////////////////////////////////////////////////////////////////////
// Assets
var bg
var appIcon
var shards
var uiHand
var CTA
var tutMsg
var uiButton1
var uiButton2
var overlay

// Emitters
//var emitter

// Booleans
var firstClick = false
var gameOver = false
var ctaClicked = false
var button1Clicked = false
var button2Clicked = false

// Numbers
var gameTime = 35000 // 1000K = 1 sec
var startX = 0
var startY = 0
var inactiveTime = 6000 // 1000K = 1 sec
var gamePhase = 0
var gameStep = 0

// Tweens
var uiHandTween
var appIconTween
var CTATween
var uiButton1Tween
var uiButton2Tween
var tutMsgTween

// Timed events
var inactivityEvent
var gameTimeEvent

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
    var nAssets = 8
    var nLoaded = 0 // keep track

    // ASSETS TO LOAD /////////////////// 
    this.textures.addBase64('bg', bgSrc)
    nLoaded++
    this.textures.addBase64('appIcon', appIconSrc)
    nLoaded++
    this.textures.addBase64('uiHand', uiHandSrc)
    nLoaded++
    this.textures.addBase64('tutMsg', tutMsgSrc)
    nLoaded++
    this.textures.addBase64('tutMsg2', tutMsg2Src)
    nLoaded++
    this.textures.addBase64('uiButton', uiButtonSrc)
    nLoaded++
    this.textures.addBase64('CTA', ctaSrc)
    nLoaded++
    
    // SPRITESHEET //////////////////////
    var shardsImg = new Image()
    shardsImg.onload = () => {
        this.textures.addSpriteSheet('shards', shardsImg, { frameWidth: 16, frameHeight: 16 })
        // check if assets are ready then call actual phaser create function
        nLoaded++
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
    this.cameras.main.fadeIn(500)
    // on camera fade complete
    /*
    this.cameras.main.once('camerafadeincomplete', function () {
        // do shit
    })
    */
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    //this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
    //this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
  
    // BACKGROUND
    bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
    let bgScaleX = this.cameras.main.width / bg.width
    let bgScaleY = this.cameras.main.height / bg.height
    let bgScale = Math.max(bgScaleX, bgScaleY)
    bg.setScale(bgScale).setScrollFactor(0)

    // APP ICON
    appIcon = this.add.image(65, 75, 'appIcon').setScale(0.9).setDepth(15).setInteractive()
    //tween appIcon
    appIconTween = this.tweens.createTimeline()
    appIconTween.add({targets: appIcon, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 300, delay: 0, repeat: -1, paused: true, yoyo: true})
    appIconTween.play()
    // APP ICON interaction
    appIcon.on('pointerdown', function () {
        console.log('click / appIcon')
        gameOver = true
        gameTimeEvent.delay = 0 
    }, this)
    
    // CTA
    CTA = this.add.image(this.cameras.main.width / 2, 880, 'CTA').setInteractive()
    CTA.setDepth(20)
    // CTA tween
    CTATween = this.tweens.createTimeline()
    CTATween.add({targets: CTA, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 600, delay: 0, repeat: -1, paused: false, yoyo: true})
    // CTA interaction
    CTA.on('pointerdown', function () {
        console.log('click / CTA')
        if (gameOver && !ctaClicked) {
            ctaClicked = true
        } else if (!gameOver) {
            //firstClick = true
            gameOver = true
            gameTimeEvent.delay = 0
        } 
    }, this) 

    // UI HAND (create assets)
    uiHand = this.add.image(startX, startY, 'uiHand').setDepth(20)
    
    // UI HAND / TUTORIAL (on start)
    if (gamePhase == 1) {
        // uiHand POS
        uiHandTween = this.tweens.createTimeline()
        UIhandHelper(150, 600, '+=80', '+=80')
        // tutorial message
        tutMsg = this.add.image(this.cameras.main.width / 2, 250, 'tutMsg').setDepth(15).setScale(0.9)
        // tween tutorial message
        tutMsgTween = this.tweens.createTimeline()
        tutMsgTween.add({targets: tutMsg, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 600, delay: 0, repeat: -1, paused: true, yoyo: true})
        tutMsgTween.play()
    } 

    // UI BUTTON 1
    uiButton1 = this.add.image(140, this.cameras.main.height/2, 'uiButton').setInteractive()
    uiButton1.setDepth(15)
    uiButton1.on('pointerdown', function () {
        //console.log('click / uiButton1 works')
        button1Clicked = true
        if(!firstClick) {
            firstClick = true
        }
        // TWEEN
        uiButton1Tween = this.tweens.createTimeline()
        uiButton1Tween.add({targets: uiButton1, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 100, delay: 0, yoyo: true, loop: 0, 
        onStart: function () {
            uiButton1.setScale(1)
        }, onComplete: function () { 
            uiButton1.visible = false
            if (button2Clicked) {
                gameOver = true
                /* enable for timer control */
                gameTimeEvent.delay = 0
                /* disable for timer control */
                //gameOverMan() 
            } 
        }})
        uiButton1Tween.play()
        gameStep++
    }, this)

    // UI BUTTON 2
    uiButton2 = this.add.image(400, this.cameras.main.height/2, 'uiButton').setInteractive()
    uiButton2.setDepth(15)
    uiButton2.on('pointerdown', function () {
        //console.log('click / uiButton2 works')
        button2Clicked = true
        if(!firstClick) {
            firstClick = true
        } 
        // TWEEN
        uiButton2Tween = this.tweens.createTimeline()
        uiButton2Tween.add({targets: uiButton2, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 100, delay: 0, yoyo: true, loop: 0, 
        onStart: function () {
            uiButton2.setScale(1)
        }, onComplete: function () {
            uiButton2.visible = false
            if (button1Clicked) {
                gameOver = true
                /* enable for timer control */
                gameTimeEvent.delay = 0
                /* disable for timer control */
                //gameOverMan() 
            } 
        }}) 
        uiButton2Tween.play()
        gameStep++
    }, this) 

    // ON CLICK (ANY) INTERACTION
    this.input.on('pointerdown', function () {
        // Check first click
        if (gameOver && gamePhase > 2) {
            if(!ctaClicked) {
                ctaClicked = true
            } 
        } else if (!firstClick && !gameOver) {
            firstClick = true
            console.log('first click!')
            // reset ui hand
            removeTweens()
            this.time.removeEvent(inactivityEvent)
            inactivityEvent = this.time.addEvent({ delay: inactiveTime, callback: inactivityTimer, callbackScope: this })
        } else {
            // reset ui hand
            //console.log('click / ui hand reset works!')
            removeTweens()
            this.time.removeEvent(inactivityEvent)
            inactivityEvent = this.time.addEvent({ delay: inactiveTime, callback: inactivityTimer, callbackScope: this })
        }
    }, this)

    // OVERLAY
    overlay = this.add.graphics()
    // GAME TIME
    gameTimeEvent = this.time.addEvent({ delay: gameTime, callback: gameTimer, callbackScope: this, loop: false})
} // END ACTUAL CREATE ///////////////////////////////////////////////////////////////

// UPDATE : GAME STATE ///////////////////////////////////////////////////////////////
function gameState () {
    let startGame = false
    if (gamePhase == 0 && !gameOver) {
        console.log('Phase 1 Tutorial')
        gamePhase++
    } else if (gamePhase == 1 && !gameOver) { // Tutorial Phase ie:1
        if (firstClick) {
            console.log('Phase 2 Start')
            startGame = true
            gamePhase++
        } 
    } else if (gamePhase == 2 && gameOver) { // Game Phase ie:2
            console.log('Phase 3 Game Over EM')
            gamePhase++
    } else if (gamePhase == 3 && gameOver) { // End Modal Phase ie:3
        if (ctaClicked) {
            console.log('Phase 4 Return Modual')
            returnModual() // call RM
            gamePhase++
        }
    } else { // Return Modal Phase ie:4
        //console.log('Return Modual')
    }
} // END UPDATE //////////////////////////////////////////////////////////////////////

// FUNCTIONS /////////////////////////////////////////////////////////////////////////
// game timer function
// can be bypassed via gamePhase & gameState function. Remove 'gameTimeEvent' to control flow with gameState only) 
// useful for ad networks that do not allow timers

function gameTimer () {
    gameOver = true
    this.time.removeEvent(gameTimeEvent)
    gameOverMan()
}

// game over function
function gameOverMan () {
    endModual() // EM
    removeTweens()
    appIcon.visible = false
    tutMsg.visible = false
    uiHand.visible = false
    uiButton1.visible = false
    uiButton2.visible = false
    if (!firstClick) {
        gamePhase = gamePhase + 1
    } else {
        gamePhase = gamePhase
    }
}
// tutorial / inactivity helper : removes ui hand / tutmsg tweens
function removeTweens () {
    tutMsg.alpha = 0
    tutMsgTween.stop()
    tutMsgTween.destroy()
    uiHand.alpha = 0
    uiHandTween.stop()
    uiHandTween.destroy()
}
// ui hand helper : (set start POS & tween direction with parameters)
function UIhandHelper (startX, startY, xMove, yMove) {
    uiHandTween.add({targets: uiHand, x: xMove, y: yMove, ease: 'Sine.easeInOut', duration: 500, delay: 0, repeat: -1, paused: true, yoyo: true})
    uiHandTween.play()
    uiHand.x = startX
    uiHand.y = startY
    uiHand.alpha = 1
}
// inactivity function (ui hand / tutorial msgs)
function inactivityTimer () {
    if (gameOver) {
        this.time.removeEvent(inactivityEvent)
    } else {
        console.log("inactive: Trigger!")
        // tutorial message
        if(gameStep == 0) {
            tutMsg = this.add.image(this.cameras.main.width / 2, 250, 'tutMsg').setDepth(15).setScale(0.9)
        } else {
            tutMsg = this.add.image(this.cameras.main.width / 2, 250, 'tutMsg2').setDepth(15).setScale(0.9)
        }
        // tutMsg = this.add.image(this.cameras.main.width / 2, 250, 'tutMsg').setDepth(15)
        tutMsg.alpha = 1
        // tween tutorial message
        tutMsgTween = this.tweens.createTimeline()
        tutMsgTween.add({targets: tutMsg, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 600, delay: 0, repeat: -1, paused: true, yoyo: true})
        tutMsgTween.play()
        // ui hand
        uiHandTween = this.tweens.createTimeline()
        // position hand based on button choice interaction 
        if(button1Clicked) {
            UIhandHelper(350, 600, '-=80', '+=80')
        } else {
            UIhandHelper(150, 600, '+=80', '+=80')
        }
    }
}
// end modual function
function endModual () {
    // overlay
    overlay.fillStyle(0x000000, 0.5).setDepth(15).fillRect(0, 0, 1136, 1136)
    // EM CTA placement
    CTA.y = 750
    CTATween.play()
}
// return modual function
function returnModual () {
    // RM CTA placement
    CTA.y = 650
}
