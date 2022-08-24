import {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import commander from './commands';

const ConsoleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 70vw;
    height: 500px;
    overflow: scroll;
    position: relative;
    justify-content: space-between;
    box-sizing: border-box;
`
const ConsoleDisplay = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10vw;
    padding-right: 10vw;
    width: 100%;

`
const ConsoleInputContainer = styled.div`
    display: flex;
    justify-self: flex-end;
    align-self: center;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding-left: 9vw;
    padding-right: 10vw;
`
const ConsoleInput = styled.input`
    width: 100%;
    font-size: 1em;
    outline: none;
    border: none;
    background-color: transparent;
    color: #00de00;
    text-shadow: 0px 0px 20px rgb(220, 255, 220);
`
const ConsoleIcon = styled.span`
    color: #00de00;
`
let setter;
const commands = () => {
    const {help, clear, status, checkCharacter, printTestData, login, getPrice, getMarket, setForSale, buyToken} = commander(setter);
    return {
        'help()': help,
        'clear()': clear,
        'status()': status,
        'checkCharacter()': checkCharacter,
        'printTestData()': printTestData,
        'login()': login,
        'getPrice()': getPrice,
        'getMarket()': getMarket,
        'setForSale()': setForSale,
        'buyToken()': buyToken,
    }
}

const completeCommand = (input) => {
    const result = Object.keys(commands())
    const args = input.split('(')[1]?.split(')')[0]?.split(/[\,\ ]/);
   
    const cmd = result.find(c=>c.startsWith(input.split('(')[0]));
    let command;
    if(!args) command = cmd;
    else command = input;

    console.log(command, cmd, args)
    
    return {command, args, cmd};
}

const executeCommand = (c) => {
    const { args, cmd } = completeCommand(c)
    console.log(cmd, args)
    commands()[cmd](...args);
}

let consoleWrapperVar;

function Console(){
    
    const consoleWrapper = useRef(null)
    consoleWrapperVar = consoleWrapper

    const [command, setCommand] = useState([
        {text: "Terminal initialized", done: true}
    ]);
    setter = setCommand;

    const handleConsoleInput = (event) => {
        if(event.code != 'Enter' && event.code != 'Tab')return;

        event.preventDefault();

        if(event.code == 'Enter'){
            executeCommand(event.target.value);
            event.target.value = '';
        }else if(event.code == 'Tab'){
            const {command} = completeCommand(event.target.value);
            event.target.value = command;
            consoleWrapper.current.scrollTop = consoleWrapper.current.scrollHeight;
        }
    }

    useEffect(()=>{
        consoleWrapper.current.scrollTop = consoleWrapper.current.scrollHeight;
    }, [command]);
 
    return(
        <ConsoleWrapper ref={consoleWrapper}>
            <ConsoleDisplay>
                {command.map((cmd, i)=><ConsoleCommand text={cmd.text} key={i}/>)}
            </ConsoleDisplay>
            <ConsoleInputContainer>
                <ConsoleIcon>{">"}</ConsoleIcon>
                <ConsoleInput onKeyDown={handleConsoleInput} />
            </ConsoleInputContainer>
        </ConsoleWrapper>
    );
}

export default Console;

const ConsoleCommandElem = styled.span`
    font-size: 1em;
    color: #00de00;
    margin-bottom: 30px;
    text-shadow: 0px 0px 10px rgb(220, 255, 220);
`

function ConsoleCommand(props){
    const command = useRef(null);
    const [init, setInit] = useState(false);

    //create typewriter effect
    useEffect(()=>{
        if(!init){
            setInit(true);
            const int = setInterval(() => {
                if(command.current.innerHTML.length < props.text.length){
                    if(props.text[command.current.innerHTML.length] == '\n'){
                        command.current.innerHTML += '<br>';
                    }else{
                        command.current.innerHTML += props.text[command.current.innerHTML.length];
                    }
                }else{
                    clearInterval(int);
                }
                consoleWrapperVar.current.scrollTop = consoleWrapperVar.current.scrollHeight;
            }, 10);
        }
    }, [props.text]);

    return (
        <ConsoleCommandElem ref={command}></ConsoleCommandElem>
    );
}