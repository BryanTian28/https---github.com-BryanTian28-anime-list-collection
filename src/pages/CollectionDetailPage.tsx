import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import AnimeCard from "../components/AnimeCard";

const CollectionDetailPage: React.FC = () => {
  const navigate = useNavigate();

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
      console.log(JSON.parse(JSON.stringify(storage)));

      if (storage === "null" || storage === null) {
        return <StyledText>No Animes Yet in This Collection</StyledText>;
      } else {
        let idList = JSON.parse(storage);
        return <GetAnimeLists ids={idList} />;
      }
    } else {
      return null;
    }
  };
  const GetAnimeLists: React.FC<{ ids: number[] }> = ({ ids }) => {
    const { loading, error, data } = useQuery(GET_ANIMES, {
      variables: {
        ids,
      },
    });

    if (loading) return <StyledText>Loading...</StyledText>;
    if (error) return <StyledText>Error : {error.message}</StyledText>;
    if (data) {
      if (data.Page.media.length == 0) {
        return null;
      } else {
        return (
          <AnimeListContainer>
            {data.Page.media?.map((value: any) => (
              <AnimeCard
                key={value.id}
                id={value.id}
                title={titleFilter(value.title)}
                imageUrl={value.coverImage.large}
                duration={value.duration}
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
