import React from "react";
import "./Wrapper.css";
import styled, { keyframes } from 'styled-components';

const Wrapper = props => ( 
<React.Fragment>
<div className='wrapper'>
{props.children}
</div>
<WrapperDiv>Here's the other wrapperdiv </WrapperDiv>
</React.Fragment>
);


// =====================================STYLED-COMPONENTS CSS=======================================
const WrapperDiv = styled.div`
height: 100%;
display: flex;
padding-bottom: 0%;
padding-top: 5%;
color: white;
font-size: 16px;
justify-content: space-around;
align-content: flex-start;


`;

export default Wrapper;
// background-image: url("../images/static.gif");
// background-repeat: repeat;