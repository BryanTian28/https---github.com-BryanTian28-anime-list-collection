import React from "react";
import styled from "@emotion/styled";

interface Collection {
  name: string;
  onClick: Function;
}

const EmptyCollection: React.FC<Collection> = ({ name, onClick }) => {
  return (
    <>
      <StyledContainer onClick={() => onClick()}>
        <StyledTitle className="mt-20">No Animes Yet</StyledTitle>
        <StyledTitle className="mt-28">{name}</StyledTitle>
      </StyledContainer>
    </>
  );
};

export default EmptyCollection;

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: left;
  max-width: 180px;
  max-height: 360px;
  color: #fff;
  width: 180px;
  border: 1px solid #ccc;
  background-color: #222;
  margin-bottom: 1rem;
  margin-left: 2rem;
  transition: color 0.3s ease;
  &:hover {
    cursor: pointer;
    color: #90ee90;
    transition: color 0.3s;
  }
`;

const StyledTitle = styled.h3`
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 0.2rem;
`;
