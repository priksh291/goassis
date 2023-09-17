import React, { useEffect, useState } from "react";
import "./Explore.css";
import { Link } from "react-router-dom";

const BookNow = () => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `https://www.gocomet.com/api/assignment/hotels?page=${currentPage}&size=8`
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

  // const handleBookNowClick = (hotelId) => {
  //   // Build the URL with the hotel ID and other parameters
  //   const url = `/hotelpage/${hotelId}}`;
  // };

  // Function to filter hotels based on the selected price range
  const filterHotelsByPriceRange = (hotel) => {
    if (selectedPriceRange === null) {
      return true; // If no price range is selected, show all hotels
    }
    const priceRanges = {
      1000: { min: 0, max: 1000 },
      2000: { min: 1001, max: 2000 },
      5000: { min: 2001, max: 5000 },
      above5000: { min: 5001, max: 8000 }, // Define the maximum value for "Above Rs.5000"
    };

    const selectedRange = priceRanges[selectedPriceRange];
    if (!selectedRange) {
      return true; // Invalid price range selected, show all hotels
    }

    const lowestRoomPrice = getLowestRoomPrice(hotel);

    // Check if the lowest room price is within the selected range
    return (
      lowestRoomPrice >= selectedRange.min &&
      lowestRoomPrice <= selectedRange.max
    );
  };

  // Handle checkbox click to set the selected price range
  const handlePriceRangeCheckboxClick = (range) => {
    if (selectedPriceRange === range) {
      setSelectedPriceRange(null); // Uncheck the checkbox if it's already selected
    } else {
      setSelectedPriceRange(range); // Set the selected price range
    }
  };

  // Filter hotels based on the selected price range
  const filteredHotels = hotels.filter(filterHotelsByPriceRange);

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
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "90px",
                  alignItems: "center",
                }}
              >
                <h2>Filters</h2>
                <h5>CLEAR ALL</h5>
              </div>
              <div className="Pricerange">
                <h3>Price range</h3>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => handlePriceRangeCheckboxClick("1000")}
                    checked={selectedPriceRange === "1000"}
                  />
                  Up to Rs 1000
                </div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => handlePriceRangeCheckboxClick("2000")}
                    checked={selectedPriceRange === "2000"}
                  />
                  Rs 1001 to Rs 2000
                </div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => handlePriceRangeCheckboxClick("5000")}
                    checked={selectedPriceRange === "5000"}
                  />
                  Rs 2001 to Rs 5000
                </div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => handlePriceRangeCheckboxClick("above5000")}
                    checked={selectedPriceRange === "above5000"}
                  />
                  Above Rs.5000
                </div>
              </div>
              <div>
                <h3>Rating</h3>
                <div>
                  <input type="checkbox" />
                  0-1 Star
                </div>
                <div>
                  <input type="checkbox" />
                  1-2 Star
                </div>
                <div>
                  <input type="checkbox" />
                  2-3 Star
                </div>
                <div>
                  <input type="checkbox" />
                  3-4 Star
                </div>
                <div>
                  <input type="checkbox" />
                  4-5 Star
                </div>
              </div>
              <div>
                <h3>City</h3>
                <div>
                  <input type="checkbox" />
                  Mumbai
                </div>
                <div>
                  <input type="checkbox" />
                  Kolkata
                </div>
                <div>
                  <input type="checkbox" />
                  Banglore
                </div>
                <div>
                  <input type="checkbox" />
                  jaipur
                </div>
              </div>
            </div>
            <div className="explore-hotels">
              {isLoading ? (
                <div>loading...</div>
              ) : Array.isArray(filteredHotels) &&
                filteredHotels.length === 0 ? (
                <div className="Nohotels">No hotels found</div>
              ) : (
                Array.isArray(filteredHotels) &&
                filteredHotels.map((hotel) => (
                  <div key={hotel.id}>
                    <div key={hotel.id} className="hotel-box">
                      <img
                        className="hotel-img"
                        src={hotel.image_url}
                        alt="/"
                      />
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
                  </div>
                ))
              )}
            </div>
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
