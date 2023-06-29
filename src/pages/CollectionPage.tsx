import React, { ReactNode, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import CollectionCard from "../components/CollectionCard";
import { log } from "console";
import EmptyCollection from "../components/EmptyCollection";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface Item {
  id: number;
  coverImage: {
    large: string;
  };
}

const CollectionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const GET_IMAGE = gql`
    query GetAnime($ids: [Int!]!) {
      Page {
        media(type: ANIME, id_in: $ids) {
          id
          coverImage {
            large
          }
        }
      }
    }
  `;

  const toList = (name: string) => {
    navigate(`/collections/${name}`);
  };
  const GetCollections: React.FC = () => {
    const all = localStorage.getItem("collectionList");
    if (all) {
      const arrayAll = JSON.parse(all);
      const idArr: number[] = [];
      const noList: string[] = [];
      arrayAll.forEach((element: string) => {
        let tempColl = localStorage.getItem(element);

        if (tempColl == "null") {
          noList.push(element);
        } else if (tempColl) {
          let tempArr = JSON.parse(tempColl);
          idArr.push(tempArr[0]);
        }
      });

      return (
        <CollectionListContainer>
          <GetImage ids={idArr} coll={arrayAll}>
            {noList?.map((value) => (
              <EmptyCollection name={value} onClick={() => toList(value)} />
            ))}
          </GetImage>
          ;
        </CollectionListContainer>
      );
    }
    return null;
  };

  const GetImage: React.FC<{
    ids: number[];
    coll: string[];
    children: ReactNode;
  }> = ({ ids, coll, children }) => {
    const urlChoose = (array: Item[], chosenId: number) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == chosenId) {
          return array[i].coverImage.large;
        }
      }
      return "";
    };
    const { loading, error, data } = useQuery(GET_IMAGE, {
      variables: { ids: ids },
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    if (data) {
      let urlArr: string[] = [];

      for (let i = 0; i < ids.length; i++) {
        urlArr.push(urlChoose(data.Page.media, ids[i]));
      }

      return (
        <>
          {data.Page.media?.map((value: any[], index: number) => (
            <CollectionCard
              key={index}
              url={urlArr[index]}
              name={coll[index]}
              onClick={() => toList(coll[index])}
            />
          ))}
          {children}
        </>
      );
    }
    return null;
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addCollection = (name: string) => {
    let temp = localStorage.getItem("collectionList");

    if (temp === null) {
      let tempJSON = JSON.stringify([name]);
      localStorage.setItem("collectionList", tempJSON);
      localStorage.setItem(name, JSON.stringify([]));
    } else {
      let tempJSON = JSON.parse(temp);

      if (tempJSON.includes(name)) {
        alert("Collection name already exists");
        return;
      }
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

  return (
    <div className="bg-[#222] min-h-screen flex flex-col items-center">
      <div>
        <StyledButton onClick={() => openModal()}>
          Add New Collection
        </StyledButton>
        <StyledButton onClick={() => removeCollection("")}>
          Remove Collection
        </StyledButton>
      </div>
      <GetCollections />
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

const CollectionListContainer = styled.div`
  padding-top: 2rem;
  padding-bottom: 1rem;
  display: grid;
  min-height: 100vh;
  min-width: 90vw;
  justify-content: space-around;
  text-align: center;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export default CollectionPage;
