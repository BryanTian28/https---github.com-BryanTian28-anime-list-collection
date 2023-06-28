import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import CollectionCard from "../components/CollectionCard";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CollectionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const GET_IMAGE = gql`
    query GetAnime($id: Int) {
      Page {
        media(type: ANIME, id: $id) {
          id
          coverImage {
            large
          }
        }
      }
    }
  `;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addCollection = (name: string) => {
    let temp = localStorage.getItem("collectionList");
    console.log(temp);

    if (temp === null) {
      let tempJSON = JSON.stringify([name]);
      localStorage.setItem("collectionList", tempJSON);
      localStorage.setItem(name, "null");
    } else {
      let tempJSON = JSON.parse(temp);
      tempJSON.push(name);
      localStorage.setItem("collectionList", JSON.stringify(tempJSON));
      localStorage.setItem(name, "null");
    }
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

  const AddModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const handleSubmit = () => {
      addCollection(inputValue);
      setIsModalOpen(false);
    };

    if (!isOpen) return null;

    return (
      <ModalOverlay>
        <ModalContent>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="border-[0.2rem]"
            placeholder="New Collection Name"
          />
          <div>
            <ModalButton onClick={onClose}>Close</ModalButton>
            <ModalButton onClick={() => handleSubmit()}>Add</ModalButton>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // const useAnimeData = (id: number) => {
  //   const { loading, error, data } = useQuery(GET_IMAGE, {
  //     variables: { id },
  //   });

  //   return { loading, error, data };
  // };

  // const MappedCollection: React.FC = () => {
  //   const list = localStorage.getItem("collectionList");

  //   if (list) {
  //     let lists = JSON.parse(list);

  //     lists.map((value: string) => {
  //       let inside = localStorage.getItem(value);

  //       if (inside) {
  //         const firstId = JSON.parse(inside)[0];
  //         const { loading, error, data } = useAnimeData(firstId);

  //         if (loading) {
  //           return <div>Loading...</div>;
  //         }

  //         if (error) {
  //           return <div>Error: {error.message}</div>;
  //         }

  //         if (data) {
  //           return (
  //             <CollectionCard
  //               url={data.Page.media.coverImage.large}
  //               name={value}
  //             />
  //           );
  //         }
  //       }
  //       return null;
  //     });
  //   }

  //   return null;
  // };
  return (
    <div className="bg-[#222] min-h-screen flex flex-col items-center">
      <div>
        <StyledButton onClick={() => openModal()}>
          Add New Collection
        </StyledButton>
        <StyledButton onClick={() => removeCollection("acc")}>
          Remove Collection
        </StyledButton>
      </div>
      <AddModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
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
`;

const ModalContent = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 4px;
`;

const ModalButton = styled.button`
  background-color: transparent;
  color: #222;
  padding: 10px 20px;
  border: solid #222 1px;
  max-width: 12rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 2rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  transition: color 0.3s, background-color 0.3s;
  &:hover {
    color: #fff;
    background-color: #222;
  }
`;

const StyledButton = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 10px 20px;
  border: solid #fff 1px;
  max-width: 12rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 2rem;
  margin-left: 1rem;
  transition: color 0.3s, background-color 0.3s;
  &:hover {
    color: #222;
    background-color: #fff;
  }
`;
export default CollectionPage;
