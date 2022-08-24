import styled from 'styled-components'
import {useEffect, useState, useRef} from 'react';
import axios from 'axios';


const FeedWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 170px;
    width: 50%;
    margin-top: 200px;
`

const FeedPost = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: white;
    margin: 20px;
    text-align: start;
    position:relative;
`
const FeedPostTop = styled.h1`
    font-size: 1.5em;
    margin-bottom: 10px;
    width: 100%;
`
const FeedPostDate = styled.span`
    font-size: 1em;
    position:absolute;
    right: 20px;
    top: 5px;
`
const FeedPostBottom = styled.span`
    font-size: 1em;    
    width: 100%;
`

function FeedPostElem(props){
    let date = props.date;
    return(
        <FeedPost>
            <FeedPostDate>{date}</FeedPostDate>
            <FeedPostTop>
                {props.text}
            </FeedPostTop>
            <FeedPostBottom>{props.distance}</FeedPostBottom>
        </FeedPost>
    );
}

function Feed(){

    const [feed, setFeed] = useState([
        {text: "Marian just got closer", distance: "1km", date:123},
        {text: "Emma just got closer", distance: "2km", date: 123},
    ]);
    const feedScroll = useRef(null);

    useEffect(() => {
        const int = setInterval(() => {
            setTimeout(()=>{}, Math.random * 500);
            const date = new Date();
            const newFeed = {
                text: (Math.random() + 1).toString(36).substring(7) + " just got closer", 
                distance: "distance left: " + Math.floor(Math.random() * 100) + "km", 
                date: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            };
            setFeed(feed=>[...(feed.length >= 5 ? feed.slice(1) : feed), newFeed]);
        }, 3000)

        return () => clearInterval(int);
    });

    useEffect(()=>{
        //scroll to bottom
        feedScroll.current.scrollTop = feedScroll.current.scrollHeight;
    }, [feed]);

    return(
        <>
            <FeedWrapper ref={feedScroll}>
                {feed.map((post, i) => <FeedPostElem key={post.text} text={post.text} distance={post.distance} date={post.date}/>)}
            </FeedWrapper>
        </>
    );
}

export default Feed;