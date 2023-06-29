import React from "react";
import styled from "@emotion/styled";

interface Collection {
  url: string;
  name: string;
  onClick: Function;
}

const CollectionCard: React.FC<Collection> = ({ url, name, onClick }) => {
  return (
    <>
      <StyledContainer onClick={() => onClick()}>
        <StyledImage src={url} />
        <StyledTitle>{name}</StyledTitle>
      </StyledContainer>
    </>
  );
};

export default CollectionCard;

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

const StyledImage = styled.img`
  overflow: hidden;
  height: 240px;
  margin-bottom: 1rem;
`;
const StyledTitle = styled.h3`
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 0.2rem;
`;
