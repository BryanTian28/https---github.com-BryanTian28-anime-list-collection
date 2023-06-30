import "../App.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import styled from "@emotion/styled";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [pageCount, setPageCount] = useState<number>(0);
  const navigate = useNavigate();

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
    navigate(`detail/${id}`);
  };
  const GET_DATA = gql`
  query GetData
    {
      Page(page: ${page}, perPage: ${perPage}) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          averageScore
          coverImage{
            large
          }
          duration
        }
      }
    }
  `;
  const GetAnimeLists: React.FC = () => {
    const { loading, error, data } = useQuery(GET_DATA);

    useEffect(() => {
      if (data) {
        setPageCount(data.Page.pageInfo.lastPage);
      }
    }, [data]);

    const renderLoading = () => {
      const forLoading = [];
      for (let i = 0; i < perPage; i++) {
        forLoading.push(<LoadingSkeleton />);
      }
      return forLoading;
    };
    if (loading)
      return <AnimeListContainer>{renderLoading()}</AnimeListContainer>;
    if (error) return <StyledText>Error : {error.message}</StyledText>;

    if (data) {
      return data.Page.media?.map((value: any) => (
        <AnimeCard
          key={value.id}
          id={value.id}
          title={titleFilter(value.title)}
          imageUrl={value.coverImage.large}
          duration={value.duration}
          onClick={() => navigateDetail(value.id)}
        />
      ));
    }
    return <p>No data available</p>;
  };

  const handlePageChange = async (selected_page: { selected: number }) => {
    try {
      let current_page = selected_page.selected + 1;
      setPage(current_page);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    <GetAnimeLists />;
  }, [page]);
  return (
    <Backdrop>
      <CenteredText>
        <StyledText>Trending Animes Right Now</StyledText>
      </CenteredText>
      <AnimeListContainer>
        <GetAnimeLists />
      </AnimeListContainer>
      <div className="flex justify-center pb-4">
        <ReactPaginate
          breakLabel="..."
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageRangeDisplayed={1}
          pageCount={pageCount}
          containerClassName="flex justify-end items-center mt-4 text-[#fff]"
          pageClassName="px-4 py-2 cursor-pointer border"
          previousClassName="border px-4 py-2"
          nextClassName="border px-4 py-2 text-[#fff]"
          activeClassName="bg-blue-500 text-[#fff]"
          marginPagesDisplayed={1}
          breakClassName="border px-4 py-2 text-[#fff]"
          onPageChange={handlePageChange}
          disabledClassName="text-[#fff]"
          forcePage={page - 1}
        />
      </div>
    </Backdrop>
  );
};

export default Homepage;

//Component styles
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

const CenteredText = styled.div`
  text-align: center;
`;

const StyledText = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 0px;
  padding-top: 2rem;
  color: #fff;
`;

const Backdrop = styled.div`
  background-color: #222;
  height: 100%;
  width: 100%;
`;
const LoadingSkeleton = styled.div`
  min-width: 60px;
  min-height: 280px;
  background-color: #ccc;
  margin: 0px 0px 16px 32px;
`;
