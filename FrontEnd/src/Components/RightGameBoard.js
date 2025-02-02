import React, { useEffect, useState } from 'react'
import styles from './CSS/GameRight.module.css'


//////////////////////// Function For Right Game Board //////////////////////////////////////////
function RightGameBoard({player, opponent, setPlayer, setOpponent,socket, started, room}) {
    const VEL = 1;
    const BULLETS_VEL = 1.25;
    const MAX_BULLETS = 3;
    var mySpace;
    var hisSpace;
    var BOARD;
    var myBullets = []
    var hisBullets = []

    const [keysPressed, setKeysPressed] = useState({ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false})
    var dummyKeysPressed = {...keysPressed}
    var otherKeys

    const [shoot, setShoot] = useState(false)
    const [myHearts, setmyHearts] = useState(player.hearts)
    const [hisHearts, setHisHearts] = useState(opponent.hearts)
    var dummyShot = false;
    const [anyShoots, setAnyShoots] = useState(false)
    const allowedKeyPress = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

    let lastTimestamp = 0,
    maxFPS = 60,
    timestep = 1000 / maxFPS;

    const getWidthPersentage = (val)=>{
        return val / document.documentElement.clientWidth * 100
    }

    const getHeightPersentage = (val)=>{
        return val / document.documentElement.clientHeight * 100
    }

    const handelMySpaceShipMovement = () =>{
        // LEFT
        if (dummyKeysPressed["ArrowLeft"] && getWidthPersentage(mySpace.offsetLeft) - VEL > 51) {
            // console.log("l");
            mySpace.style.left = (getWidthPersentage(mySpace.offsetLeft) - VEL) + "%"
        }

        //RIGHT        
        if (dummyKeysPressed["ArrowRight"] && getWidthPersentage(mySpace.offsetLeft) + VEL + getWidthPersentage(mySpace.offsetWidth) < 100) {
            // console.log("r");
            mySpace.style.left = (getWidthPersentage(mySpace.offsetLeft) + VEL) + "%"
        }
        
        // UP
        if (dummyKeysPressed["ArrowUp"] && getHeightPersentage(mySpace.offsetTop) - VEL > 0) {
            // console.log("u");
            mySpace.style.top = (getHeightPersentage(mySpace.offsetTop) - VEL) + "%"
        }
        
        // DOWN
        if(dummyKeysPressed["ArrowDown"] && getHeightPersentage(mySpace.offsetTop) + VEL + getHeightPersentage(mySpace.offsetHeight) < 100) {
            // console.log("d");
            mySpace.style.top = (getHeightPersentage(mySpace.offsetTop) + VEL) + "%"
        }
    }

    const handelOtherSpaceShipMovement = () =>{
        // LEFT
        if (otherKeys["ArrowLeft"] && getWidthPersentage(hisSpace.offsetLeft) - VEL > 0) {
            // console.log("l");
            hisSpace.style.left = (getWidthPersentage(hisSpace.offsetLeft) - VEL) + "%"
        }
        
        // RIGHT
        if (otherKeys["ArrowRight"] && getWidthPersentage(hisSpace.offsetLeft) + VEL + getWidthPersentage(hisSpace.offsetWidth) < 51) {
            // console.log("r");
            hisSpace.style.left = (getWidthPersentage(hisSpace.offsetLeft) + VEL) + "%"
        }
        
        // UP
        if (otherKeys["ArrowUp"] && getHeightPersentage(hisSpace.offsetTop) - VEL > 0) {
            // console.log("u");
            hisSpace.style.top = (getHeightPersentage(hisSpace.offsetTop) - VEL) + "%"
        }
        
        // DOWN
        if(otherKeys["ArrowDown"] && getHeightPersentage(hisSpace.offsetTop) + VEL + getHeightPersentage(hisSpace.offsetHeight) < 100) {
            // console.log("d");
            hisSpace.style.top = (getHeightPersentage(hisSpace.offsetTop) + VEL) + "%"
        }
    }

    const createMyBullet = () =>{
        const bullet = document.createElement("div")
        bullet.setAttribute("class", styles.myBullets)
        bullet.style.left = getWidthPersentage(mySpace.offsetLeft) - 2 + "%"
        bullet.style.top = getHeightPersentage(mySpace.offsetTop) + getHeightPersentage(mySpace.offsetHeight) / 2 - 2 + "%"
        return bullet;
    }

    const createHisBullet = () => {
        const bullet = document.createElement("div")
        bullet.setAttribute("class", styles.enemyBullets)
        bullet.style.left = getWidthPersentage(hisSpace.offsetLeft) + getWidthPersentage(hisSpace.offsetWidth) - 2 + "%"
        bullet.style.top = getHeightPersentage(hisSpace.offsetTop) + getHeightPersentage(hisSpace.offsetHeight) / 2 - 2 + "%"
        return bullet;
    }

    const didBulletHitMe = (bullet)=>{
        if( getWidthPersentage(bullet.offsetLeft) + getWidthPersentage(bullet.offsetWidth) > getWidthPersentage(mySpace.offsetLeft) 
                && getWidthPersentage(bullet.offsetLeft) + getWidthPersentage(bullet.offsetWidth) < getWidthPersentage(mySpace.offsetLeft) + getWidthPersentage(mySpace.offsetWidth)
            && getHeightPersentage(bullet.offsetTop) > getHeightPersentage(mySpace.offsetTop) 
                && getHeightPersentage(bullet.offsetTop) + getHeightPersentage(bullet.offsetHeight) < getHeightPersentage(mySpace.offsetTop) + getHeightPersentage(mySpace.offsetHeight)){
                return true;
        }else{
            return false;
        }
    }

    const didBulletHitHim = (bullet) =>{
        if(getWidthPersentage(bullet.offsetLeft)  < getWidthPersentage(hisSpace.offsetLeft) + getWidthPersentage(hisSpace.offsetWidth) 
                && getWidthPersentage(bullet.offsetLeft) > getWidthPersentage(hisSpace.offsetLeft) 
            && getHeightPersentage(bullet.offsetTop) > getHeightPersentage(hisSpace.offsetTop) 
                && getHeightPersentage(bullet.offsetTop) + getHeightPersentage(bullet.offsetHeight) < getHeightPersentage(hisSpace.offsetTop) + getHeightPersentage(hisSpace.offsetHeight) ){
                return true;
        }else{
            return false;
        }
    }

    const keyDown = (e) =>{
        if(allowedKeyPress.includes(e.key)){
            if(dummyKeysPressed[e.key] === false){
                    dummyKeysPressed = {...keysPressed, [e.key]: true}
                    setKeysPressed(dummyKeysPressed)
            }
        }else if(e.code === "Space" && dummyShot === false && myBullets.length < MAX_BULLETS){
            dummyShot = true;
            setAnyShoots(true)
            setShoot(prevState => !prevState)
            var bullet = createMyBullet()
            myBullets.push(bullet)
            BOARD.appendChild(bullet)
        }
    }

    const keyUp = (e) =>{
        if(allowedKeyPress.includes(e.key)){
            dummyKeysPressed = {...keysPressed, [e.key]: false}
        setKeysPressed(dummyKeysPressed)
        }else if(e.code === "Space"){
            dummyShot = false
        }
    }

    const update = (timestamp)=>{
        window.requestAnimationFrame(update);

        // skip if timestep ms hasn't passed since last frame
        if (timestamp - lastTimestamp < timestep) return;

        lastTimestamp = timestamp;

        if(started){
            handelMySpaceShipMovement()
            handelOtherSpaceShipMovement()

            myBullets.forEach((bullet, index, object) => {
                if(getWidthPersentage(bullet.offsetLeft) < 0){
                    BOARD.removeChild(bullet);
                    object.splice(index, 1);
                }else{
                    if (didBulletHitHim(bullet)) {
                        setHisHearts(prevState => prevState - 1)
                        BOARD.removeChild(bullet);
                        object.splice(index, 1);
                    }else{
                        bullet.style.left = getWidthPersentage(bullet.offsetLeft) - BULLETS_VEL + "%";
                    }
                }
            });

            hisBullets.forEach((bullet, index, object) => {
                if(getWidthPersentage(bullet.offsetLeft) + BULLETS_VEL > 98){
                    BOARD.removeChild(bullet);
                    object.splice(index, 1);
                }else{
                    if(didBulletHitMe(bullet)){
                        setmyHearts(prevState => prevState - 1)
                        BOARD.removeChild(bullet);
                        object.splice(index, 1);
                    }else{
                        bullet.style.left = getWidthPersentage(bullet.offsetLeft) + BULLETS_VEL + "%";
                    }
                }
            });
        }
    }

    useEffect(() => {
        otherKeys = {ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false}

        mySpace = document.getElementById(styles.mySpaceShip)
        hisSpace = document.getElementById(styles.enemySpaceShip)
        BOARD = document.getElementById("board")

        document.addEventListener("keydown", keyDown)
        document.addEventListener("keyup", keyUp)

        socket.on("heMoved", (movedKeys) => {
            otherKeys = movedKeys
        })

        socket.on("heShot",()=>{
            // console.log("SSSS");
            var bullet = createHisBullet()
            hisBullets.push(bullet)
            BOARD.appendChild(bullet)
        })

        requestAnimationFrame(update)
    }, [])

    useEffect(() => {
        socket.emit("iMoved", keysPressed, room);
    }, [keysPressed])

    useEffect(() => {
        if(anyShoots)
            socket.emit("iShot", room)
    }, [shoot])

    useEffect(() => {
        setOpponent({...opponent, hearts: hisHearts})
        setPlayer({...player, hearts: myHearts})
    }, [myHearts, hisHearts])

    return (
        <div className={styles.gameBoard} id="board">
            <div id={styles.enemySpaceShip} />
            <div id={styles.mySpaceShip} />
        </div>
    )
}

export default RightGameBoard;
