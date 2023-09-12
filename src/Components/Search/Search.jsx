import Explore from './Explore/Explore';
import { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";

import "./Search.css";
import { MdLocationPin } from "react-icons/md";
import { BiSolidNavigation } from "react-icons/bi";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const Search = () => {
  //search suggestions
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [check, setCheck] = useState([]);
  const [opens, setOpens] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("0");

  const fetchdata = (value) => {
    fetch("https://www.gocomet.com/api/assignment/hotels-name")
      .then((response) => response.json())
      .then((json) => {
        setCheck(json);
        const results = json.filter((item) => {
          return (
            value &&
            item &&
            item.name &&
            item.name.toLowerCase().includes(value) &&
            item.city.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };

  const handlechange = (value) => {
    setInput(value);
    fetchdata(value);
  };
  //date state
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  //open close
  const [open, setOpen] = useState(false);
  //get the target element to toggle

  const refOne = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", hideonClickOutside, true);
  }, []);

  //hide on outside click
  const hideonClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
    if (resultsRef.current && !resultsRef.current.contains(e.target)) {
      setResults([]); // Close the results list if click is outside
    }
  };

  const handleitemclick = (itemname, itemnameid) => {
    setInput(itemname);
    setSelectedItemId(itemnameid);
    setOpens(false);
  };
  const handleonclick = () => {
    setOpens(!opens);
  };

  const onSearchclick = () => {
    alert("fill all details");
  };
  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // explore hotels section

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
    setCurrentPage(pageNumber);
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
  

  return (
    <div>
      <div className="bg-box">
        <div className="img-container">
          <img
            src="https://raw.githubusercontent.com/gocomet-india/frontend-hotel-assignment/main/hero-bg.jpg"
            alt="/"
          />
          <div className="white-image"></div>
        </div>
        <div className="contents">
          <div className="about">
            <h1>Find the Perfect deal, always.</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Similique officia non corrupti pariatur aspernatur sint modi
              commodi cum possimus blanditiis facilis beatae repellendus, autem
              voluptates ratione delectus architecto quae dolore.
            </p>
            <div className="booking-section">
              <div className="search-box">
                <div className="input-button">
                  <MdLocationPin className="icon1" />
                  <input
                    placeholder="Type city, place, or hotel name"
                    value={input}
                    onChange={(e) => handlechange(e.target.value)}
                    onClick={handleonclick}
                  />
                  <BiSolidNavigation className="icon2" />
                </div>
                <div className="results-list">
                  {input &&
                    results.map((ele) => (
                      <div
                        ref={resultsRef}
                        key={ele.id}
                        onClick={() => handleitemclick(ele.name, ele.id)}
                      >
                        {ele.name}
                      </div>
                    ))}
                  {opens &&
                    !input &&
                    check.map((item) => (
                      <div
                        ref={refOne}
                        key={item.id}
                        onClick={() => handleitemclick(item.name, item.id)}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              </div>

              <div className="date-picker">
                <div
                  className="checkinout"
                  onClick={() => setOpen((open) => !open)}
                >
                  <div>
                    <div>
                      <AiTwotoneCalendar />
                      {range[0].startDate
                        ? range[0].startDate.toDateString()
                        : "check-in"}
                    </div>
                  </div>
                  <div className="line"></div>
                  <div>
                    {range[0].endDate
                      ? range[0].endDate.toDateString()
                      : "check-out"}
                  </div>
                </div>
                <div ref={refOne}>
                  {open && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={range}
                      className="datepick"
                      direction="horizontal"
                    />
                  )}
                </div>
              </div>

              <div className="nopeople">
                {/* <label><BsPeopleFill/></label> */}
                <select
                  id="dropdown"
                  name="dropdown"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="search">
                {input && range[0].startDate && range[0].endDate ? (
                  <Link
                    to={`/Hotelpage/${selectedItemId}?selectedOption=${selectedOption}&startDate=${range[0].startDate.toISOString()}&endDate=${range[0].endDate.toISOString()}`}
                  >
                    <button className="searchbtn">Search</button>
                  </Link>
                ) : (
                  <button className="searchbtn" onClick={onSearchclick}>
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="exploresection">
      <Explore/>
      </div>
    </div>
  );
};

export default Search;
