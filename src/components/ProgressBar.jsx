import {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios'

import ProgressFrame from '../assets/BarFrame.svg';
import ProgressTile from './icons/BarTile';

const BarWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
`
const BarFrame = styled.img`
    height: 111px;
    position: absolute;
`
const BarTile = styled.img`
    height: 50px;
    margin: 5px;
`

const tileStyle = {
    general: {
        height: "50px",
        margin: "5px", 
        fill: "#dddddd",
        filter: 'drop-shadow(0px 0px 4px #555555) opacity(0.9)'
    },
    0: {marginLeft: "27px", speed: 3, scale: 1.1},
    1: {speed: 3, scale: 1.1},
    2: {speed: 3, scale: 1.1},
    3: {speed: 3, scale: 1.1},
    4: {speed: 3, scale: 1.15},
    5: {fill: "rgb(210, 130,130)", speed: 2.5, scale: 1.15},
    6: {fill: "rgb(210, 70,70)", speed: 0.5, scale: 1.15},
    7: {fill: "rgb(210, 40,40)", speed: 0.35, scale: 1.3},
    8: {fill: "rgb(210, 1,1)", speed: 0.2, scale: 1.4},
}

function ProgressBar(){

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setTimeout(()=>{
            setProgress(7);
            
        }, 400)
    }, []);

    return(
        <BarWrapper>
            
            {
                Array(progress).fill(0).map((_, i) => {
                    if(i + 1 === progress){
                        return <ProgressTile style={{...tileStyle.general, ...tileStyle[i]}} speed={tileStyle[i].speed} scale={tileStyle[i].scale} key={i}></ProgressTile>
                    }else{
                        return <ProgressTile style={{...tileStyle.general, ...tileStyle[i]}} key={i}></ProgressTile>
                    }
                })
            }
        </BarWrapper>
    );
}

export default ProgressBar;