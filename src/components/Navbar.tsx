import React, { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <StyledNav className="flex flex-row justify-between">
      <Link to="/">
        <StyledTitle>MyAni</StyledTitle>
      </Link>
      <StyledHamburger onClick={() => toggleMenu()} isMenuOpen={isMenuOpen}>
        <span />
        <span />
        <span />
      </StyledHamburger>
      <StyledMenuItems isMenuOpen={isMenuOpen}>
        <Link to="/" onClick={toggleMenu}>
          <StyledNavItem>Home</StyledNavItem>
        </Link>
        <StyledNavItem>About</StyledNavItem>
        <Link to="/">
          <StyledNavItem>Anime</StyledNavItem>
        </Link>
        <Link to="/collections">
          <StyledNavItem>My Collections</StyledNavItem>
        </Link>
      </StyledMenuItems>
    </StyledNav>
  );
};

export default Navbar;

// Emotion styles
const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #222;
  color: #fff;
  border-bottom: 2px solid #ccc;
`;

const StyledTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const StyledHamburger = styled.div<{ isMenuOpen: boolean }>`
  display: none;
  flex-direction: column;
  cursor: pointer;
  margin-right: 2rem;
  span {
    width: 25px;
    height: 3px;
    background-color: #fff;
    margin-bottom: 4px;
    border-radius: 2px;
    transition: transform 0.3s ease-in-out;
  }

  ${({ isMenuOpen }) =>
    isMenuOpen &&
    `
    span:nth-of-type(1) {
      transform: translateY(8px) rotate(45deg);
    }
    span:nth-of-type(2) {
      opacity: 0;
    }
    span:nth-of-type(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

const StyledMenuItems = styled.ul<{ isMenuOpen: boolean }>`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    display: ${({ isMenuOpen }) => (isMenuOpen ? "flex" : "none")};
    background-color: #222;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    padding: 1rem;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

const StyledNavItem = styled.li`
  cursor: pointer;
  margin-left: 1rem;
  margin-right: 1rem;
  color: #fff;
  transition: color 0.3s ease;
  &:hover {
    color: #90ee90;
    transition: color 0.3s;
  }

  @media (max-width: 768px) {
    margin: 0.5rem;
  }
`;
