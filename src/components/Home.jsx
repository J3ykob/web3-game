import {useEffect, useState} from 'react';
import styled from 'styled-components';

import ProgressBar from './ProgressBar';
import Feed from './Feed';
import Token from './Token'
import Console from './Console';

const MainContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #000009;
    flex-direction: column;
    
`;

function Home(){
    return(
        <MainContainer>
            <Console />
            {/* <Token token={{text: "0xasASKBlnsakl******************"}}/> */}
            {/* <Feed/> */}
        </MainContainer>
    );
}

export default Home;