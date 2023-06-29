import React from "react";
import styled from "@emotion/styled";

interface ModalProps {
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <ModalText>{content}</ModalText>
        <div className="flex flex-row justify-around">
          <ModalButton onClick={onCancel}>Cancel</ModalButton>
          <ModalButton onClick={onConfirm}>Yes</ModalButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 4px;
`;

const ModalTitle = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 0px;
  padding-top: 2rem;
  color: #222;
`;

const ModalText = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
  color: #4287f5;
`;

const ModalButton = styled.button`
  background-color: #222;
  color: #fff;
  padding: 2px 6px;
  border: solid #fff 1px;
  max-width: 12rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  transition: color 0.3s, background-color 0.3s;
  &:hover {
    color: #222;
    background-color: #fff;
  }
`;

export default Modal;
