import images from '../../assets/images/Images.js';
import { calculateDate } from '../../utils/calculateDate';
import { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import { styled } from 'styled-components';

const StoreReviewTab = ({ reviewData, scrollTo, reviewRef }) => {
  const itemsPerPage = 5; // 페이지당 항목 수 (원하는대로 수정)

  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(reviewData.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    scrollTo(reviewRef);
  };

  const displayedReviews = reviewData.slice(offset, offset + itemsPerPage);

  return (
    <div className="flex flex-col w-[1050px] mb-3">
      {displayedReviews.map((review) => (
        <ReviewItem key={review.id} data={review} />
      ))}

      {/* 페이지네이션 추가 */}
      <CustomPaginate>
        <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </CustomPaginate>
    </div>
  );
};

export default StoreReviewTab;

export const Stars = ({ rating, readOnly }) => {
  return (
    <div className="flex mr-3">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <div
          key={star}
          className={`star ${star <= rating ? 'active' : ''}`}
          role={readOnly ? null : 'button'}
        >
          <img
            src={star <= rating ? images.bookmarkOn : images.bookmarkOff}
            alt={`별점 ${star}`}
            width="20px"
            height="20px"
          />
        </div>
      ))}
    </div>
  );
};

export const ReviewItem = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트되거나 내용이 변경될 때마다 텍스트 높이를 계산
    if (contentRef.current) {
      const contentHeight = contentRef.current.clientHeight;
      setShowButton(contentHeight > 3 * 16); // 3줄 * 16px 폰트 크기
    }
  }, [data.content]);

  const reviewContentHandle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex w-[1070px] p-[10px] border-b">
      <div className="w-[750px]">
        <div className="flex mb-1">
          <span className="mr-3">{data.nickname}</span>
          <div>{calculateDate(data.created_at)}일 전</div>
        </div>
        <div className="flex mb-3">
          <div>
            <Stars rating={data.rating} readOnly={true} />
          </div>
        </div>
        <div
          className={`break-word ${isExpanded ? 'line-clamp-3' : ''}`}
          ref={contentRef}
        >
          {data.content}
        </div>
        {showButton && (
          <button className="mt-2" onClick={reviewContentHandle}>
            {isExpanded ? '내용 더보기' : '내용 숨기기'}
          </button>
        )}
      </div>
      <img
        className="w-[300px] h-[200px] object-cover rounded-lg ml-3"
        src={data.img}
        alt="후기 이미지"
      />
    </div>
  );
};

const CustomPaginate = styled.div`
  display: flex;
  justify-content: center;

  ul {
    display: flex;
    color: #fff;
  }

  li {
    padding: 6px 12px 6px 12px;
    margin: 3px;
    border-radius: 8px;

    &:first-child {
      background-color: #ffe3a9;
    }
    &:last-child {
      background-color: #ffe3a9;
    }
  }
  li:hover {
    background-color: #ff8c8c;
  }

  li:active,
  li.active {
    background-color: #ffc3c3; /* 선택된(li.active) 상태의 배경색 변경 */
  }
`;
