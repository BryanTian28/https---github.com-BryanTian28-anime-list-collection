import React from "react";
import styled from "@emotion/styled";

interface Anime {
  id: number;
  title: string;
  imageUrl: string;
  duration: number;
  onClick: Function;
}
const AnimeCard: React.FC<Anime> = ({
  id,
  title,
  imageUrl,
  duration,
  onClick,
}) => {
  function truncateText(text: string) {
    if (text.length > 25) {
      return text.slice(0, 25) + "...";
    }
    return text;
  }
  return (
    <StyledContainer onClick={() => onClick()}>
      <StyledImage src={imageUrl} alt={title} />
      <StyledTitle>{truncateText(title)}</StyledTitle>
      <StyledParagraph>{duration || "-"} min</StyledParagraph>
    </StyledContainer>
  );
};

export default AnimeCard;

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  max-height: 360px;
  max-width: 180px;
  color: #fff;
  width: 180px;
  border: 1px solid #ccc;
  background-color: #222;
  margin-bottom: 1rem;
  margin-left: 2rem;
`;

const StyledParagraph = styled.p`
  position: absolute;
  font-size: 0.8rem;
  bottom: 0.5rem;
  right: 0.5rem;
  margin: 0;
`;
const StyledImage = styled.img`
  overflow: hidden;
  height: 240px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;

const StyledTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  transition: color 0.3s ease;
  &:hover {
    cursor: pointer;
    color: #90ee90;
    transition: color 0.3s;
  }
`;
