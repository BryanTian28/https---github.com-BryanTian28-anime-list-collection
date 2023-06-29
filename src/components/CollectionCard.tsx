import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "./Modal";

interface Collection {
  url: string;
  name: string;
  onClick: Function;
}

const CollectionCard: React.FC<Collection> = ({ url, name, onClick }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleRemoveCollection = () => {
    removeCollection(name);
    setIsDeleteModalOpen(false);
  };
  const removeCollection = (name: string): void => {
    let temp = localStorage.getItem("collectionList");
    if (temp === null) {
    } else {
      let arr = JSON.parse(temp);
      let updateArr = arr.filter((item: string) => item !== name);
      localStorage.setItem("collectionList", JSON.stringify(updateArr));
      localStorage.removeItem(name);
    }
  };
  return (
    <>
      <StyledContainer>
        <StyledImage src={url} onClick={() => onClick()} />
        <StyledTitle onClick={() => onClick()}>{name}</StyledTitle>
        <StyledModalButton onClick={() => handleOpenDeleteModal()}>
          Remove
        </StyledModalButton>
      </StyledContainer>
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Removal"
          content={`Are you sure you want to remove ${name}?`}
          onConfirm={() => handleRemoveCollection()}
          onCancel={() => handleCloseDeleteModal()}
        />
      )}
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

const StyledModalButton = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 2px 6px;
  border: solid #fff 1px;
  max-width: 12rem;
  border-radius: 4px;
  font-size: 0.6rem;
  cursor: pointer;

  transition: color 0.3s, background-color 0.3s;
  &:hover {
    color: #222;
    background-color: #fff;
  }
`;

const StyledImage = styled.img`
  overflow: hidden;
  height: 240px;
  margin-bottom: 1rem;
`;
const StyledTitle = styled.h3`
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.2rem;
`;
