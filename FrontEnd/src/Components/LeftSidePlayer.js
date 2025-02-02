import React from 'react'
import ScoreBoards from './ScoreBoards'
import LeftGameBoard from './LeftGameBoard'

////////////////////////////Function for Left Side Player////////////////////////////////////

function LeftSidePlayer({ player, opponent, setPlayer, setOpponent, socket, started, room }) {
    return (
        <>
            <ScoreBoards 
                left={player.name}
                right={opponent.name}
                leftHeart={player.hearts}
                rightHeart={opponent.hearts}
                />
            <LeftGameBoard
                player={player} 
                opponent={opponent}
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
                room={room}
            />
        </>
    )
}

export default LeftSidePlayer
