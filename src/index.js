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

// this is a small helper to convert the audio (see package.json)
//import toArrayBuffer from 'to-array-buffer'


// Aspect Ratio 16:9 //
const MAX_WIDTH_SCREEN = 1080
const MAX_HEIGHT_SCREEN = 1920
const MIN_WIDTH_SCREEN = 430
const MIN_HEIGHT_SCREEN = 932

const SIZE_WIDTH_SCREEN = 1136
const SIZE_HEIGHT_SCREEN = 1136
const ZOOM_level = 1
const tileSize = 128
const aspectRatio = [9, 16]

const optimalGameWidth = aspectRatio[0] * tileSize
const optimalGameHeight = aspectRatio[1] * tileSize
let canvasWidth, canvasHeight
// CONFIG /////////////////////////////////////////////////////////////////////////
if(isPortrait()){
    var config = {
        type: Phaser.AUTO,
        backgroundColor: '#000000',
        scale: {
            parent: 'phaser-game',
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: optimalGameWidth,
            height: optimalGameHeight,
            /*
            min: {
                width: MIN_WIDTH_SCREEN,
                height: MIN_HEIGHT_SCREEN
            },
            max: {
                width: MAX_WIDTH_SCREEN,
                height: MAX_HEIGHT_SCREEN
            },
            */
            //zoom: ZOOM_level
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
}else{
    var config = {
        type: Phaser.AUTO,
        backgroundColor: '#000000',
        scale: {
            parent: 'phaser-game',
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: optimalGameHeight,
            height: optimalGameWidth,
            /*
            min: {
                width: MIN_HEIGHT_SCREEN,
                height: MIN_WIDTH_SCREEN
            },
            max: {
                width: MAX_HEIGHT_SCREEN,
                height: MAX_WIDTH_SCREEN
            },
            */
            //zoom: ZOOM_level  
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
var width
var height
var orient = 0 // 1 = port 2 = land



// Emitters
//var emitter

// Booleans
var firstClick = false
var gameOver = false
var ctaClicked = false
var button1Clicked = false
var button2Clicked = false

// Numbers
//var gameTime = 35000 // 1000K = 1 sec
var startX
var startY
var inactiveTime = 6000 // 1000K = 1 sec
var gamePhase = 0
var gameStep = 0


// Tweens
var uiHandTween
//var appIconTween
var CTATween
//var uiButton1Tween
//var uiButton2Tween
var tutMsgTween

// Timed events
var inactivityEvent
//var gameTimeEvent

// PRELOAD (unused for DATA URI METHOD) // VARIABLES /////////////////////////////////
function preload ()
{ 
    // original loading methods for web (with xhr requests)
    // this.load.image('bg', 'assets/blue.png');
    //this.load.spritesheet([{ file: 'assets/shards.png', key: 'shards', config: { frameWidth: 16, frameHeight: 16 } }]);
    //this.load.audioSprite('sfx', ['assets/sfx.ogg', 'assets/sfx.mp3'], 'assets/sfx.json');
    //this.load.image('napie-eight-font', 'assets/napie-eight-font.png');
}

// CREATE ///////////////////////////////////////////////////////////////////////////
function create ()
{
    
    // new methods for loading the assets as data-uri's
    // adding them directly to the textures and/or cache
    // We don't place this in the preloader, because
    // the preloader will immediatly return and
    // we have our own async stuff and the assets won't
    // be ready in the create function where we normally
    // add our gameObjects
    // _________________________________________________

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
    /*
    // method for an audiosprite json file
    this.cache.json.add('sfx', sfxJson);
    nLoaded++;

    // method for an audiosprite Audio Buffer
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.decodeAudioData(toArrayBuffer(sfxSrc), (buffer) => {
        this.cache.audio.add('sfx', buffer);
        // check if assets are ready then call actual phaser create function
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = createGameObjects.bind(this);
            actualCreate();
        }
    }, (e) => { console.log("Error with decoding audio data" + e.err); });

    // method for bitmap font
    this.textures.addBase64('napie-eight-font', napieEightFontSrc);
    nLoaded++;
    var fontConfig = {
        image: 'napie-eight-font',
        width: 8,
        height: 8,
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?#abcdefghijklmnopqrstuvwxyz@:;^%&1234567890*\'"`[]/\\~+-=<>(){}_|$',
        charsPerRow: 16,
        spacing: { x: 0, y: 0 }
    };
    this.cache.bitmapFont.add('napie-eight-font', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
    */
} // END CREATE //////////////////////////////////////////////////////////////////////

function createGameObjects ()
{
    const cameraWidth = window.innerWidth
    const cameraHeight = window.innerHeight
    const width = optimalGameWidth
    const height = optimalGameHeight

    //this.checkOriention(this.game.scale.orientation)
    //this.game.scale.on('orientationchange', ()=>{ alert("test"); })
    
    window.addEventListener("resize", () => {
            this.game.scale.resize(width, height)
        },false
    )
    
    this.game.scale.on('orientationchange', (Orientation)=> {
        if (Orientation === Phaser.Scale.PORTRAIT) 
        {   
            console.log('resize port')
            this.game.scale.resize(width, height) 
        } 
        else if (Orientation === Phaser.Scale.LANDSCAPE) 
        {
            console.log('resize land')
            this.game.scale.resize(width, height)     
        }
    }, this )
    
    //  Set the camera
    //this.cameras.main.setZoom(1)
    //this.cameras.main.centerOn(width/2, height/2)
    this.cameras.main.setBounds(0, 0, width, height)
    // camera fade in
    this.cameras.main.fadeIn(500)
    // on camera fade complete
    this.cameras.main.once('camerafadeincomplete', function () {
        // do shit
    })
    
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    //this.cameras.main.setViewport(0, 0, width, height)
    //this.physics.world.setBounds(0, 0, 1136 * 2, 640 * 2)
    // BACKGROUND
    bg = this.add.image(cameraWidth / 2, cameraHeight / 2, 'bg')
    let bgScaleX = cameraWidth / bg.width
    let bgScaleY = cameraHeight / bg.height
    let bgScale = Math.max(bgScaleX, bgScaleY)
    bg.setScale(bgScale).setScrollFactor(0)
    
    // APP ICON
    appIcon = this.add.image(75, 75, 'appIcon').setScale(0.9).setDepth(15).setInteractive()
    //tween appIcon
    //appIconTween = this.tweens.createTimeline()
    const appIconTween = this.tweens.add({targets: appIcon, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 300, delay: 0, repeat: -1, paused: true, yoyo: true})
    appIconTween.play()
    // APP ICON interaction
    appIcon.on('pointerdown', function () {
        console.log('click / appIcon')
        gameOver = true
        /* enable for timer control */
        //gameTimeEvent.delay = 0
        /* disable for timer control */
        gameOverMan() 
    }, this)
    
    // CTA
    CTA = this.add.image(cameraWidth/2, cameraHeight-150, 'CTA').setInteractive()
    CTA.setDepth(20)
    // CTA tween
    
    CTATween = this.tweens.add({targets: CTA, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 450, delay: 0, repeat: -1, paused: false, yoyo: true})
    CTATween.pause()
    // CTA interaction
    CTA.on('pointerdown', function () {
        console.log('click / CTA')
        if (gameOver && !ctaClicked) {
            ctaClicked = true
            //FACEBOOK
            //FbPlayableAd.onCTAClick()
            //AppLovin
            //mraid.open()
        } else if (!gameOver) {
            gameOver = true
            /* enable for timer control */
            //gameTimeEvent.delay = 0
            /* disable for timer control */
            gameOverMan()
            //FACEBOOK
            //FbPlayableAd.onCTAClick()
            //AppLovin
            //mraid.open()
        } 
    }, this) 
    
    // UI BUTTON 1
    uiButton1 = this.add.image((cameraWidth/2)-150, cameraHeight/2, 'uiButton').setInteractive()
    uiButton1.setDepth(15)
    uiButton1.on('pointerdown', function () {
        console.log('click / uiButton1 works')
        removeTweens()
        button1Clicked = true
        if(!firstClick) {
            firstClick = true
        }
        // TWEEN
        const uiButton1Tween = this.tweens.add({targets: uiButton1, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 100, delay: 0, completeDelay: 0, yoyo: true, loop: 0,  
        onStart: function () {
            uiButton1.setScale(1)
        }, onComplete: function () { 
            uiButton1.visible = false
            if (button2Clicked) {
                gameOver = true
                ///enable for timer control 
                //gameTimeEvent.delay = 0
                ///disable for timer control 
                gameOverMan() 
            } 
        }})
        uiButton1Tween.play()
        gameStep++
    }, this)
    
    // UI BUTTON 2
    uiButton2 = this.add.image((cameraWidth/2) + 150, cameraHeight/2,  'uiButton').setInteractive()
    uiButton2.setDepth(15)
    uiButton2.on('pointerdown', function () {
        console.log('click / uiButton2 works')
        removeTweens()
        button2Clicked = true
        if(!firstClick) {
            firstClick = true
        } 
        // TWEEN
        const uiButton2Tween = this.tweens.add({targets: uiButton2, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 100, delay: 0, completeDelay: 0, yoyo: true, loop: 0, 
        onStart: function () {
            uiButton2.setScale(1)
        }, onComplete: function () {
            uiButton2.visible = false
            if (button1Clicked) {
                gameOver = true
                ///enable for timer control
                //gameTimeEvent.delay = 0
                ///disable for timer control
                gameOverMan() 
            } 
        }}) 
        uiButton2Tween.play()
        gameStep++
    }, this)
    
    // UI HAND (create assets)
    uiHand = this.add.image(startX, startY, 'uiHand').setDepth(20)
    // UI HAND / TUTORIAL (on start)
    if (gamePhase == 1) {
        // uiHand POS
        uiHandTween = this.tweens.add({targets: uiHand, x: uiButton1.x, y: uiButton1.y, ease: 'Sine.easeInOut', duration: 500, delay: 0, repeat: -1, paused: true, yoyo: true})
        uiHandTween.play()
        UIhandHelper(uiButton1.x + 120, uiButton1.y + 100, -395)
       
        // tutorial message
        tutMsg = this.add.image(cameraWidth/2, 250, 'tutMsg').setDepth(15).setScale(0.9)
        // tween tutorial message
        tutMsgTween = this.tweens.add({targets: tutMsg, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 600, delay: 0, repeat: -1, paused: true, yoyo: true})
        tutMsgTween.play()
    } 
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
            removeTweens()
            // reset ui hand
            this.time.removeEvent(inactivityEvent)
            inactivityEvent = this.time.addEvent({ delay: inactiveTime, callback: inactivityTimer, callbackScope: this })
        } else {
            // reset ui hand
            //console.log('click / ui hand reset works!')
            this.time.removeEvent(inactivityEvent)
            inactivityEvent = this.time.addEvent({ delay: inactiveTime, callback: inactivityTimer, callbackScope: this })
        }
    }, this)

    // OVERLAY
    overlay = this.add.graphics()
    
    // GAME TIME
    //gameTimeEvent = this.time.addEvent({ delay: gameTime, callback: gameTimer, callbackScope: this, loop: false})
    //this.scale.on("resize", this.resize, this)
	
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
/*
function gameTimer () {
    gameOver = true
    this.time.removeEvent(gameTimeEvent)
    gameOverMan()
}
*/
// orientation function
function isPortrait () {
    if(window.innerWidth < window.innerHeight)
    {
        console.log('port')
        orient = 1
        return true
        
    } else {
        console.log('land')
        orient = 2
        return false
    }
}
// resize function
/*
function resize () {
    canvasWidth = SIZE_WIDTH_SCREEN
    canvasHeight = SIZE_HEIGHT_SCREEN
    
    if (window.innerHeight > window.innerWidth) {
        console.log('port') 
    } else {
        console.log('land')    
    } 
}
*/
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
    uiHand.alpha = 0
    tutMsgTween.remove()
    uiHandTween.remove()
}
// ui hand helper : (set start POS & tween direction with parameters)
function UIhandHelper (startX, startY, handRot) {
    //uiHandTween = this.tweens.add({targets: uiHand, x: xMove, y: yMove, ease: 'Sine.easeInOut', duration: 500, delay: 0, repeat: -1, paused: true, yoyo: true})
    //uiHandTween.play()
    uiHand.x = startX
    uiHand.y = startY
    uiHand.setAngle(handRot)
    uiHand.alpha = 1
}
// inactivity function (ui hand / tutorial msgs)
function inactivityTimer () {
    let cameraWidth = optimalGameWidth
    if (gameOver) {
        this.time.removeEvent(inactivityEvent)
    } else {
        console.log("inactive: Trigger!")
        // tutorial message
        if(gameStep == 0) {
            tutMsg = this.add.image(cameraWidth/2, 250, 'tutMsg').setDepth(15).setScale(0.9)
        } else {
            tutMsg = this.add.image(cameraWidth/2, 250, 'tutMsg2').setDepth(15).setScale(0.9)
        }
        // tutMsg = this.add.image(width / 2, 250, 'tutMsg').setDepth(15)
        tutMsg.alpha = 1
        // tween tutorial message
        tutMsgTween = this.tweens.add({targets: tutMsg, scaleX: '-=.1', scaleY: '-=.1', ease: 'Sine.easeInOut', duration: 600, delay: 0, repeat: -1, paused: true, yoyo: true})
        tutMsgTween.play()
        // ui hand
        
        //uiHandTween = this.tweens.createTimeline()
        // position hand based on button choice interaction 
        if(button1Clicked) {
            uiHandTween = this.tweens.add({targets: uiHand, x: uiButton2.x, y: uiButton2.y, ease: 'Sine.easeInOut', duration: 500, delay: 0, repeat: -1, paused: true, yoyo: true})
            uiHandTween.play()
            UIhandHelper(uiButton2.x - 120, uiButton2.y + 100, 395)
        } else {
            uiHandTween = this.tweens.add({targets: uiHand, x: uiButton1.x, y: uiButton1.y, ease: 'Sine.easeInOut', duration: 500, delay: 0, repeat: -1, paused: true, yoyo: true})
            uiHandTween.play()
            UIhandHelper(uiButton1.x + 120, uiButton1.y + 100, -395)
        }
    }
}
// end modual function
function endModual () {
    
    // overlay
    overlay.fillStyle(0x000000, 0.5).setDepth(15).fillRect(0, 0, 1136*2, 1136*2)
    // EM CTA placement
    CTA.y = (window.innerHeight - 200)
    CTATween.resume()
    CTATween.timeScale += 1
}
// return modual function
function returnModual () {
    // RM CTA placement
    CTA.y = (window.innerHeight - 300)
    CTATween.timeScale -= 1.5
}
