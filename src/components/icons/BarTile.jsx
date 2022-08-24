import styled, {keyframes} from 'styled-components';

const pulseAnimation = (scale) => keyframes`
    0% {transform: scale(1);}
    50% {transform: scale(${scale});}
    100% {transform: scale(1);}
`
const TileWrapper = styled.div`
    animation-name: ${props => pulseAnimation(props.scale)};
    animation-duration: ${(props => props.speed)}s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`

const BarTile = (props) => {
    return(
        <TileWrapper speed={props.speed} scale={props.scale}>
            <svg id="Layer_1" style={{...props.style}} fill={props.fill} dataname="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.05 151.43">
                <path d="M37.8,62.41c-1.46.83,0,2.47-1.35,3.14-.13-.24-.35-.46-.34-.66.24-7.9-.73-15.82.9-23.69,1-4.82,3.15-5.9,7.53-3.37.86.49,2.54,2,2.7-1,.08-1.41,2.13-1,2.94-.69,5.83,2.3,11.79-.57,17.95.77,3.9.84,9.45.14,14.15-.11,4.53-.24,9.63-1.95,14.18.48,1.17.62,2,1,3-.12a5.42,5.42,0,0,1,6.46-.88c4.64,2.77,9,.46,13.28-.08,6-.76,10.15,2.2,8.62,8.15-1.87,7.33,0,14.39.2,21.54.41,13.91,1.26,27.8,1,41.72a4.47,4.47,0,0,1-1.13,3.11c-1.3,1.52-1.24,1.63.61,3.63.84.9.43,1.53-.42,1.56-2.8.11-2.75,1.86-1.41,3.15,3.72,3.58.77,7.7,1.16,11.49,1.55,15.21,1,30.52,1.25,45.79a29.85,29.85,0,0,1-1.43,8.18,3.26,3.26,0,0,1-3.33,2.41c-8.35-.74-16.79.93-25.11-.94-2.49-.56-4.67,1.06-7.21,1-16.3-.17-32.6-.13-48.9-.05-3.94,0-5.14-.64-4.56-5.37.72-5.84,3-12.42-2-17.9-.61-.68-.55-2.28-.34-3.36,2-10.17.7-20.34.37-30.54-.44-13.58-.51-27.18-.28-40.77.1-6-.71-12.16.8-18.15C37.69,68.19,38.6,65.5,37.8,62.41Z" transform="translate(-35.97 -35.6)"/>
                
            </svg>
        </TileWrapper>
    )
}

function generateRandomLines(){

    function randomLine(){
        return `M${20 + Math.floor(Math.random() * 100)} ${Math.floor(10 + Math.random() * 50)} L${10 + Math.floor(Math.random() * 30)} ${Math.floor(20 + Math.random() * 100)}`
    }

    const lines = [];

    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        lines.push(<path key={i} d={randomLine()} fill="none" stroke="black" strokeWidth="2px"/>)
    }
    return lines

}

export default BarTile;