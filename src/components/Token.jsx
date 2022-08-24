import {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'


const TokenWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 70vw;
    flex-wrap: wrap;
`
const TokenTile = styled.div`
    width: 50px;
    height: 50px;
    border: 1px ${props => props.done ? "green" : "white"} solid;
    margin: 10px;
    background-color:black;
    font-size: 1.5em;

    & > input{
        pointer-events: ${props=> props.done ? "none" : "auto"};
    }

`
//input with no styling
const TokenTileInput = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    color: white;
    font-size: 1.4em;
    text-align: center;
    padding: 10px;
    &:focus{
        outline: none;
    }
`

function TokenTileElem(props){

    const moveCursor = (e) => {
        //see if key pressed was an arrow from event
        if(props.letter != ''){
            e.preventDefault();
            if(e.target.parentNode.nextSibling){
                e.target.parentNode.nextSibling.children[0].focus();
            }
            return;
        }

        let newNode;
        if(e.keyCode == '39' || e.keyCode == '37'){
            e.preventDefault();
            if(e.keyCode == '39' && e.target.parentNode.nextSibling){
                newNode = e.target.parentNode.nextSibling.children[0];
            }else if(e.keyCode == '37' && e.target.parentNode.previousSibling){
                newNode = e.target.parentNode.previousSibling.children[0];
            }
        
            newNode.focus();
            newNode.setSelectionRange(newNode.value.length, newNode.value.length + 1);
        }
        //detect backspace
        else if(e.keyCode == '8'){
            e.preventDefault();
            e.target.value = '';
            if(e.target.parentNode.previousSibling){
                e.target.parentNode.previousSibling.children[0].focus();
            }   
        }

        else if((parseInt(e.keyCode) > 47 && parseInt(e.keyCode) < 91) || (parseInt(e.keyCode) > 95 && parseInt(e.keyCode) < 112) || (parseInt(e.keyCode) > 185 && parseInt(e.keyCode) < 193) || (parseInt(e.keyCode) > 218 && parseInt(e.keyCode) < 223)){
            e.preventDefault();
            if(e.target.parentNode.nextSibling){
                e.target.parentNode.nextSibling.children[0].focus();
                if(e.target.value == ''){
                    e.target.value = e.key;
                }else{
                    if(e.target.parentNode.nextSibling.children[0].value == ''){
                        e.target.parentNode.nextSibling.children[0].value = e.key;
                    }
                }
            }else{
                e.target.value = e.key;
            }
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=>{

        }, 100);

        return () => clearInterval(interval);
    }, [])

    return(
        <TokenTile done={props.letter}><TokenTileInput onChange={moveCursor} onKeyDown={moveCursor} maxLength={1} value={props.letter}></TokenTileInput></TokenTile>
    );
}
function Token(props){
    const tokenWrapper = useRef(null);

    const [token, setToken] = useState(props.token);

    return(
        <TokenWrapper ref={tokenWrapper}>
            {token.text.split('').map((letter, i) => <TokenTileElem key={i} letter={letter != "*" ? letter : ''}></TokenTileElem>)}
        </TokenWrapper>
    );
}

export default Token;