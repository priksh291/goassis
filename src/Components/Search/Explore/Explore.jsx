import React, { useEffect, useState } from "react";
import "./Explore.css";
import { Link } from "react-router-dom";

const BookNow = () => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `https://www.gocomet.com/api/assignment/hotels?page=${currentPage}&size=10`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setHotels(data.hotels);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Fetch error:", error);
        setIsLoading(false); // Set loading to false in case of an error
      }
    };

    fetchHotels();
  }, [currentPage]);

  const handlePagination = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= 4) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to get the lowest room price for a hotel
  const getLowestRoomPrice = (hotel) => {
    const roomPrices = hotel.rooms.map((room) => room.price);
    return Math.min(...roomPrices);
  };
  // Function to get the highest room price for a hotel
  const getHighestRoomPrice = (hotel) => {
    const roomPrices = hotel.rooms.map((room) => room.price);
    return Math.max(...roomPrices);
  };

  const [sortingOption, setSortingOption] = useState("lowToHigh");

  // Function to sort hotels by room price
  const sortHotelsByPrice = (option) => {
    // Clone the hotels array to avoid mutating the original data
    const sortedHotels = [...hotels];
    if (option === "lowToHigh") {
      sortedHotels.sort(
        (a, b) => getLowestRoomPrice(a) - getLowestRoomPrice(b)
      );
    } else if (option === "highToLow") {
      sortedHotels.sort(
        (a, b) => getHighestRoomPrice(b) - getHighestRoomPrice(a)
      );
    }
    setHotels(sortedHotels);
  };

  // Handle sorting option change
  const handleSortingOptionChange = (e) => {
    const option = e.target.value;
    setSortingOption(option);
    sortHotelsByPrice(option);
  };

  const handleBookNowClick = (hotelId) => {
    // Build the URL with the hotel ID and other parameters
    const url = `/hotelpage/${hotelId}}`;
  };
  return (
    <div>
      <div className="exploreHotels">
        <div>
          <div
            style={{
              // display: "flex",
              // justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <div></div>
            <div className="Heading">Explore Hotel</div>
            <div onChange={handleSortingOptionChange}>
              <select
                value={sortingOption}
                onChange={handleSortingOptionChange}
                className="dropdown"
              >
                <option value="Relevance">Relevance</option>
                <option value="lowToHigh">Sort Low to High</option>
                <option value="highToLow">Sort High to Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="hotels-filters">
          <div className="hotel-details">
            {isLoading ? (
              <div>loading...</div>
            ) : (
              Array.isArray(hotels) &&
              hotels.map((hotel) => (
                <div key={hotel.id} className="hotel-box">
                  <img className="hotel-img" src={hotel.image_url} alt="/" />
                  <div style={{ marginTop: "25px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: "400", fontSize: "16px" }}>
                        {hotel.name}
                      </div>
                      <div>{hotel.rating}</div>
                    </div>
                    <div style={{ fontSize: "12px" }}>{hotel.city}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <div style={{ fontWeight: "700" }}>
                        ₹{getLowestRoomPrice(hotel)}-
                        {getHighestRoomPrice(hotel)}
                      </div>
                      <div className="book-btn1">
                        <Link to={`/hotelpage/${hotel.id}`}>
                          <button
                            className="book-btn1"
                            onClick={() => handleBookNowClick(hotel.id)}
                          >
                            View 
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePagination(currentPage - 1)}
          >
            Pre
          </button>
          <span>Page {currentPage}</span>
          <button onClick={() => handlePagination(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
