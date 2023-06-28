import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import AnimeCard from "../components/AnimeCard";

interface Dates {
  year: number;
  month: number;
  day: number;
}

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const GET_DATA_ANIME = gql`
  query GetData {
    Media(type: ANIME, id: ${id}) {
      id
      title {
        romaji
        english
        native
      }
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      isAdult
      genres
      bannerImage
      episodes
      duration
      averageScore
      status
      studios {
        edges {
          node {
            name
          }
        }
      }
      relations {
        nodes {
          id
          title {
            userPreferred
          }
        }
      }
      }
    }
    `;

  const GET_RECOMMEND = gql`
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

  const navigateDetail = (id: any) => {
    navigate(`/detail/${id}`, { replace: true });
  };

  const titleFilter = (title: any) => {
    if (title.english) {
      return title.english;
    } else if (title.romaji) {
      return title.romaji;
    } else {
      return title.native;
    }
  };

  const formatDate = (date: Dates) => {
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };
  const GetAnimeDetail: React.FC = () => {
    const { loading, error, data } = useQuery(GET_DATA_ANIME);
    if (loading) return <StyledText>Loading...</StyledText>;
    if (error) return <StyledText>Error : {error.message}</StyledText>;

    if (data) {
      const recommendId: number[] = [];
      if (data.Media.relations.nodes.length > 10) {
        for (let i = 0; i < 10; i++) {
          recommendId.push(data.Media.relations.nodes[i].id);
        }
      } else {
        for (let i = 0; i < data.Media.relations.nodes.length; i++) {
          recommendId.push(data.Media.relations.nodes[i].id);
        }
      }
      return (
        <>
          <Section>
            <Container>
              <img
                src={data.Media.bannerImage}
                alt={data.Media.coverImage.medium}
              />
              <Title>
                {titleFilter(data.Media.title)}
                {data.Media.isAdult ? "(18+)" : null}
              </Title>
              <Subtitle>Genres: {data.Media.genres.join(", ")}</Subtitle>
              <Description>{data.Media.description}</Description>
              <Button>Add to collection</Button>
            </Container>
            <ContentWrapper>
              <RightSide>
                <DetailItem>
                  <Label>Japanese:</Label>
                  <Value>{data.Media.title.native}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Synonyms:</Label>
                  <Value>{data.Media.title.romaji}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Aired:</Label>
                  <Value>
                    {formatDate(data.Media.startDate)} to{" "}
                    {data.Media.endDate.year
                      ? formatDate(data.Media.endDate)
                      : null}
                  </Value>
                </DetailItem>
                <DetailItem>
                  <Label>Status:</Label>
                  <Value>{data.Media.status}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Duration:</Label>
                  <Value>{data.Media.duration}m</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Score:</Label>
                  <Value>{data.Media.averageScore}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Studio:</Label>
                  <Value>{data.Media.studios.edges[0].node.name}</Value>
                </DetailItem>
              </RightSide>
            </ContentWrapper>
          </Section>

          <GetAnimeRecommendations recommendId={recommendId} />
        </>
      );
    }

    return null;
  };
  const GetAnimeRecommendations: React.FC<{ recommendId: number[] }> = ({
    recommendId,
  }) => {
    const {
      loading,
      error,
      data: recommendationsData,
    } = useQuery(GET_RECOMMEND, {
      variables: {
        ids: recommendId,
      },
    });

    if (loading) return <StyledText>Loading...</StyledText>;
    if (error) return <StyledText>Error : {error.message}</StyledText>;
    if (recommendationsData) {
      if (recommendationsData.Page.media.length == 0) {
        return null;
      } else {
        return (
          <Recommend className="text-center pt-2">
            <Subtitle className="mt-4">You might also like</Subtitle>
            <AnimeListContainer>
              {recommendationsData.Page.media?.map((value: any) => (
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
          </Recommend>
        );
      }
    }
    return null;
  };
  return (
    <>
      <GetAnimeDetail />
    </>
  );
};

export default AnimeDetailPage;

const StyledText = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 0px;
  padding-top: 2rem;
  color: #fff;
`;

const Section = styled.section`
  background-color: #222;
  color: #fff
  padding: 2rem 0;
  display: flex;
  flex-direction: row;
  height: full;
  `;

const Container = styled.div`
  max-width: 75vw;
  margin: 0;
  margin-left: 2rem;
  text-align: center;
  color: #fff;
  padding-top: 2rem;
  left: 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
  color: #4287f5;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  margin-bottom: 1.5rem;
`;

const ContentWrapper = styled.div`
  max-width: 25vw;
  background-color: #555555;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 2rem;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10rem;
  margin-left: 1rem;
  padding-right: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  color: #ffffff;
  font-size: 0.8rem;
`;

const Value = styled.span`
  color: #cccccc;
  font-size: 0.7rem;
`;

const Recommend = styled.div`
  background-color: #333333;
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

// const Link = styled.a`
//   display: inline-block;
//   padding: 0.8rem 1.5rem;
//   background-color: #333;
//   color: #fff;
//   text-decoration: none;
//   border-radius: 4px;
//   font-weight: bold;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #555;
//   }
// `;
