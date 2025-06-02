import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { checkBingo, check } from '../CheckBingo.mjs'

const Grid_4 = (props) => {
    const [count, setCount] = useState(1);
    const [grid, setGrid] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
    const [borderColor, setBorderColor] = useState('#023047')
    const { clickedNo, ready, no, myTurn, setBingo, bingo } = props;

    useEffect(()=>{
        if(myTurn){
            setBorderColor('#8ee694');
        }
        else{
            if(count > 16){
                setBorderColor('#219EBC');
            }
        }
    }, [myTurn])

    const handleClick = (row, col) => {
        // console.log(row, col, count);
        if (grid[row][col] === 0) {
            if (count === 16) {
                setBorderColor('#219EBC');
                props.setPlayer();

            }
            let newGrid = grid;
            newGrid[row][col] = count;
            setCount(count => count + 1);
            setGrid(newGrid);

        }
        else {
            if (ready) {
                if (myTurn || grid[row][col] === no) {
                    document.getElementById(`cross${row}${col}`).style.display = 'inline-flex';
                    check[row][col] = true;
                    let count = checkBingo(row, col, 4);
                    clickedNo(grid[row][col], bingo+count)
                    setBingo(bingo => bingo + count)
                }
            }
        }
    }

    const renderCross = (row, col) => {
        return (
            <span style={{ position: 'absolute', color: '#ff00009c', display: 'none', fontSize: '2.5rem', alignItems: 'center', justifyContent: 'center', transition: 'font-size 200ms ease, color 200ms ease' }} id={`cross${row}${col}`} >
                <FontAwesomeIcon icon={faXmark} />
            </span>
        )
    }


    let grid_style = {
        'border': `5px solid ${borderColor}`,
        'backgroundColor': 'beige',
        'display': 'grid',
        'gridTemplateRows': '1fr 1fr 1fr 1fr',
        'gridTemplateColumns': '1fr 1fr 1fr 1fr',
        'height': '100%'
    }

    let box_style = {
        'border': `1px solid ${borderColor}`,
        'fontSize': '2rem',
        'textAlign': 'center',
        'lineHeight': '2.4',
        'fontFamily': `"Orbitron", sans-serif`,
        'display': 'inline-flex',
        'justifyContent': 'center',
        'alignItems': 'center'
    }
    return (
        <div style={grid_style}>
            <div style={box_style} onClick={() => handleClick(0, 0)} >{grid[0][0] === 0 ? ' ' : grid[0][0]} {renderCross(0, 0)} </div>
            <div style={box_style} onClick={() => handleClick(0, 1)} >{grid[0][1] === 0 ? ' ' : grid[0][1]} {renderCross(0, 1)} </div>
            <div style={box_style} onClick={() => handleClick(0, 2)} >{grid[0][2] === 0 ? ' ' : grid[0][2]} {renderCross(0, 2)} </div>
            <div style={box_style} onClick={() => handleClick(0, 3)} >{grid[0][3] === 0 ? ' ' : grid[0][3]} {renderCross(0, 3)} </div>

            <div style={box_style} onClick={() => handleClick(1, 0)} >{grid[1][0] === 0 ? ' ' : grid[1][0]} {renderCross(1, 0)} </div>
            <div style={box_style} onClick={() => handleClick(1, 1)} >{grid[1][1] === 0 ? ' ' : grid[1][1]} {renderCross(1, 1)} </div>
            <div style={box_style} onClick={() => handleClick(1, 2)} >{grid[1][2] === 0 ? ' ' : grid[1][2]} {renderCross(1, 2)} </div>
            <div style={box_style} onClick={() => handleClick(1, 3)} >{grid[1][3] === 0 ? ' ' : grid[1][3]} {renderCross(1, 3)} </div>

            <div style={box_style} onClick={() => handleClick(2, 0)} >{grid[2][0] === 0 ? ' ' : grid[2][0]} {renderCross(2, 0)} </div>
            <div style={box_style} onClick={() => handleClick(2, 1)} >{grid[2][1] === 0 ? ' ' : grid[2][1]} {renderCross(2, 1)} </div>
            <div style={box_style} onClick={() => handleClick(2, 2)} >{grid[2][2] === 0 ? ' ' : grid[2][2]} {renderCross(2, 2)} </div>
            <div style={box_style} onClick={() => handleClick(2, 3)} >{grid[2][3] === 0 ? ' ' : grid[2][3]} {renderCross(2, 3)} </div>

            <div style={box_style} onClick={() => handleClick(3, 0)} >{grid[3][0] === 0 ? ' ' : grid[3][0]} {renderCross(3, 0)} </div>
            <div style={box_style} onClick={() => handleClick(3, 1)} >{grid[3][1] === 0 ? ' ' : grid[3][1]} {renderCross(3, 1)} </div>
            <div style={box_style} onClick={() => handleClick(3, 2)} >{grid[3][2] === 0 ? ' ' : grid[3][2]} {renderCross(3, 2)} </div>
            <div style={box_style} onClick={() => handleClick(3, 3)} >{grid[3][3] === 0 ? ' ' : grid[3][3]} {renderCross(3, 3)} </div>

        </div>
    )
}

export default Grid_4