import React, { ReactNode, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { toast, Toaster } from "react-hot-toast";
import Modal from "../components/Modal";

interface Animes {
  url: string;
  title: string;
  id: number;
  onClick: Function;
}

const CollectionDetailPage: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [shouldRerender, setShouldRerender] = useState(false);
  const GET_ANIMES = gql`
    query GetData($ids: [Int!]!) {
      Page {
        media(type: ANIME, id_in: $ids) {
          id
          title {
            romaji
            english
            native
          }
          averageScore
          coverImage {
            large
          }
          duration
        }
      }
    }
  `;

  function truncateText(text: string) {
    if (text.length > 25) {
      return text.slice(0, 25) + "...";
    }
    return text;
  }

  const DeleteableAnimeCard: React.FC<Animes> = ({
    url,
    title,
    id,
    onClick,
  }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleOpenDeleteModal = () => {
      setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
    };

    const handleRemoveCollection = () => {
      removeFromCollection(id);
      setShouldRerender(true);
      setIsDeleteModalOpen(false);
    };
    const removeFromCollection = (idToDelete: number) => {
      console.log(name);

      if (name) {
        let lists = localStorage.getItem(name);
        console.log(lists);

        if (lists === "null" || lists === null) {
          return <StyledText>No Animes Yet in This Collection</StyledText>;
        } else {
          let idList = JSON.parse(lists);

          if (idList.length > 1) {
            let updatedList = idList.filter(
              (element: string) => parseInt(element) !== idToDelete
            );

            localStorage.setItem(name, JSON.stringify(updatedList));
          } else {
            localStorage.setItem(name, "null");
          }
          toast("Successfully removed");
        }
      }

      return null;
    };

    return (
      <>
        <StyledContainer>
          <StyledImage src={url} alt={title} onClick={() => onClick()} />
          <StyledTitle onClick={() => onClick()}>
            {truncateText(title)}
          </StyledTitle>
          <StyledButton onClick={() => handleOpenDeleteModal()}>
            Remove
          </StyledButton>
        </StyledContainer>
        {isDeleteModalOpen && (
          <Modal
            title="Confirm Removal"
            content={`Are you sure you want to remove ${title}?`}
            onConfirm={() => handleRemoveCollection()}
            onCancel={() => handleCloseDeleteModal()}
          />
        )}
      </>
    );
  };
  //

  const titleFilter = (title: any) => {
    if (title.english) {
      return title.english;
    } else if (title.romaji) {
      return title.romaji;
    } else {
      return title.native;
    }
  };

  const navigateDetail = (id: any) => {
    navigate(`/detail/${id}`, { replace: true });
  };

  const CollectionMapping: React.FC = () => {
    const { name } = useParams();
    if (name) {
      let storage = localStorage.getItem(name);

      if (storage === "null" || storage === null) {
        return <StyledText>No Animes Yet in This Collection</StyledText>;
      } else {
        let idList = JSON.parse(storage);
        return <GetAnimeLists ids={idList} children={null} />;
      }
    } else {
      return null;
    }
  };

  const renderLoading = () => {
    const forLoading = [];
    for (let i = 0; i < 10; i++) {
      forLoading.push(<LoadingSkeleton />);
    }
    return forLoading;
  };

  useEffect(() => {
    <CollectionMapping />;
    setShouldRerender(false);
  }, [shouldRerender]);
  const GetAnimeLists: React.FC<{ ids: number[]; children: ReactNode }> = ({
    ids,
  }) => {
    const { loading, error, data } = useQuery(GET_ANIMES, {
      variables: {
        ids,
      },
    });

    if (loading)
      return <AnimeListContainer>{renderLoading()}</AnimeListContainer>;
    if (error) return <StyledText>Error : {error.message}</StyledText>;
    if (data) {
      if (data.Page.media.length == 0) {
        return <StyledText>No Animes Yet In This Collection</StyledText>;
      } else {
        return (
          <AnimeListContainer>
            {data.Page.media?.map((value: any) => (
              <DeleteableAnimeCard
                url={value.coverImage.large}
                title={titleFilter(value.title)}
                id={value.id}
                onClick={() => navigateDetail(value.id)}
              />
            ))}
          </AnimeListContainer>
        );
      }
    }
    return null;
  };
  return (
    <Section>
      <CollectionMapping />
    </Section>
  );
};

export default CollectionDetailPage;

const Section = styled.section`
  background-color: #222;
  color: #fff
  padding: 2rem 0;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  justify-content: center
  `;
const StyledText = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 0px;
  padding-top: 2rem;
  color: #fff;
`;

const AnimeListContainer = styled.div`
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

const LoadingSkeleton = styled.div`
  min-width: 60px;
  min-height: 280px;
  background-color: #ccc;
  margin: 0px 0px 16px 32px;
`;

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
  transition: transform 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;
const StyledTitle = styled.h3`
  font-size: 1rem;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
`;
const StyledButton = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 5px 8px;
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
