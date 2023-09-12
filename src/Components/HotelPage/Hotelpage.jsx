import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Hotelpage.css";
import { AiTwotoneStar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import SimpleImageSlider from "react-simple-image-slider";
import { AiOutlineClose } from "react-icons/ai";
import { AiTwotoneCalendar } from "react-icons/ai";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const Hotelpage = () => {
  const params = useParams(); // Step 1: Extract the ID from URL parameters
  const location = useLocation();

  const [hotelData, setHotelData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAmenities, setShowAmenities] = useState(true);
  const [BookNow, SetBookNow] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [selectedCheckindate, setselectedCheckindate] = useState(null);
  const [selectedCheckoutdate, setselectedCheckoutdate] = useState(null);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [selectedRoomAmmenities, setSelectedRoomAmmenities] = useState(null);
  const [personDetails, setPersonDetails] = useState([]);

  const [activeButtons, setActiveButtons] = useState(
    Array(selectedOption).fill("male")
  );

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  useEffect(() => {
    if (params && params.id) {
      // Step 2: Make an API request with the extracted ID
      fetch(`https://www.gocomet.com/api/assignment/hotels/${params.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the API response here
          if (data && data.hotel) {
            setHotelData(data.hotel);
          } else {
            setHotelData(null); // Set to null if data is missing or not as expected
          }
        })
        .catch((error) => {
          console.error("Error fetching hotel data:", error);
        });
    }
    const searchParams = new URLSearchParams(location.search);
    const selectedOptionParam = searchParams.get("selectedOption");
    const startDateParam = new Date(searchParams.get("startDate"));
    const endDateParam = new Date(searchParams.get("endDate"));
    setSelectedOption(selectedOptionParam);
    setStartDate(startDateParam);
    setEndDate(endDateParam);
  }, [params, location.search]);

  const handleshowamenities = (roomindex) => {
    setShowAmenities((prevroomindex) =>
      prevroomindex === roomindex ? null : roomindex
    );
  };

  const handleButtonClick = (personIndex, button) => {
    const updatedButtons = [...activeButtons];
    updatedButtons[personIndex] = button;
    setActiveButtons(updatedButtons);
  };

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  //get the target element to toggle

  const refOne = useRef(null);
  // const resultsRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", hideonClickOutside, true);
  }, []);

  //hide on outside click
  const hideonClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div>
      {/* Render hotel data here */}
      {hotelData ? (
        <div>
          <div className="hoteldata">
            <div className="hoteldiv">
              <div className="hotelnamecity">
                <h1>{hotelData.name}</h1>
                <div>
                  <p>
                    <FaLocationDot />
                    {hotelData.city}
                  </p>
                  <p>
                    <AiTwotoneStar />
                    {hotelData.rating}
                  </p>
                </div>
              </div>
              <div className="blackimg"></div>
              <img className="hotelimg" src={hotelData.image_url} alt="/" />
            </div>
            <div className="rooms">
              {hotelData.rooms.map((room, index) => (
                <div className="roomsdiv" key={index}>
                  <SimpleImageSlider
                  className="imageslider"
                    width={500}
                    height={256}
                    images={room.image_urls.map((imageUrl) => ({
                      url: imageUrl,
                    }))}
                    showNavs={true}
                  />
                  <div className="room-guest">
                    <h3 className="roomname">{room.name}</h3>
                    <div>
                      <BsPeopleFill />
                      {selectedOption}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <p className="roomprice">₹{room.price}</p>/night
                  </div>
                  {/* <p>Amenities: {room.amenities.join(", ")}</p> */}
                  <div className="room-buttons">
                    <div className="img-amenities">
                      <button
                        className="amenities"
                        onClick={() => handleshowamenities(index)}
                      >
                        {showAmenities === index
                          ? "Close Facilities"
                          : "View Facilites"}
                      </button>
                      {showAmenities === index && (
                        <div className="amenities-list">
                          <div className="blackimg1"></div>

                          <ul className="amenities-items">
                            {room.amenities.map((amenity, amenityIndex) => (
                              <li key={amenityIndex}>{amenity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button
                      className="book-btn"
                      onClick={() => {
                        SetBookNow(true);
                        setSelectedRoomName(room.name);
                        setselectedCheckindate(
                          startDate ? startDate.toDateString() : "Not selected"
                        );
                        setselectedCheckoutdate(
                          endDate ? endDate.toDateString() : "Not selected"
                        );
                        setSelectedRoomImages(room.image_urls);
                        setSelectedRoomAmmenities(room.amenities);
                        const details = [];
                        for (let i = 1; i <= selectedOption; i++) {
                          details.push({ person: `Person ${i}`, value: "" });
                        }
                        setPersonDetails(details);
                      }}
                    >
                      <div>Book Now</div> <AiOutlineArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hoteldesc">
              <h1>About The {hotelData.name}</h1>
              <div>{hotelData.description}</div>
            </div>
            {/* <div>{startDate ? startDate.toDateString() : "Not selected"}</div> */}
            {/* <div><BookNow/></div> */}

            {BookNow && (
              <div className="booking-modal">
                <div className="book-modal">
                  <div
                    style={{
                      display: "flex",
                      justifyContent:'space-between',
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <div className="hotelroomname">
                      <p className="modal-roomname">{hotelData.name}</p>
                      <p>
                        <IoIosArrowForward />
                      </p>
                      <div>{selectedRoomName}</div>
                    </div>
                    <div className="imageslider">
                      <SimpleImageSlider
                        width={380}
                        height={221}
                        images={selectedRoomImages.map((imageUrl) => ({
                          url: imageUrl,
                        }))}
                        showNavs={true}
                      />
                    </div>
                    <div>
                      <ul className="modalammenities">
                        {selectedRoomAmmenities.map((amenity, amenityIndex) => (
                          <li
                            className="modalammenities_items"
                            key={amenityIndex}
                          >
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* <div className="modalcheckinout">
                      <div>
                        <BsPeopleFill />
                        Person:
                        {selectedOption}
                      </div>
                      <div>
                        Check-In:{" "}
                        {startDate ? startDate.toDateString() : "Not selected"}
                      </div>
                      <div>
                        Check-Out:{" "}
                        {endDate ? endDate.toDateString() : "Not selected"}
                      </div>
                    </div> */}
                    <div>
                      {startDate &&
                      endDate &&
                      startDate.getTime() === endDate.getTime() ? (
                        // Dates are the same, show the date picker

                        <div className="modalcheckinout">
                          <div>
                            <BsPeopleFill />
                            Person: {selectedOption}
                          </div>
                          <div>
                            Check-In:{" "}
                            {selectedStartDate
                              ? selectedStartDate.toDateString()
                              : "Not selected"}
                          </div>
                          <div>
                            Check-Out:{" "}
                            {selectedEndDate
                              ? selectedEndDate.toDateString()
                              : "Not selected"}
                          </div>
                        </div>
                      ) : (
                        // Dates are not the same, display the formatted dates
                        <div>
                          <div className="modalcheckinout">
                            <div>
                              <BsPeopleFill />
                              Person: {selectedOption}
                            </div>
                            <div>
                              Check-In:{" "}
                              {startDate
                                ? startDate.toDateString()
                                : "Not selected"}
                            </div>
                            <div>
                              Check-Out:{" "}
                              {endDate
                                ? endDate.toDateString()
                                : "Not selected"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="close-button">
                      <div onClick={() => SetBookNow(false)}>
                        <AiOutlineClose />
                      </div>
                    </div>
                    <div className="person-details">
                      <div
                        className={
                          startDate &&
                          endDate &&
                          startDate.getTime() === endDate.getTime()
                            ? "checkinout2"
                            : "checkinout1"
                        }
                      >
                        {startDate &&
                        endDate &&
                        startDate.getTime() === endDate.getTime() ? (
                          // Dates are the same, show the date picker
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
                                  onChange={(item) => {
                                    setSelectedStartDate(
                                      item.selection.startDate
                                    );
                                    setSelectedEndDate(item.selection.endDate);
                                    setRange([item.selection]); // Update the range state as well, if needed
                                  }}
                                  moveRangeOnFirstSelection={false}
                                  months={1}
                                  ranges={range}
                                  className="datepick"
                                  direction="horizontal"
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          // Dates are not the same, display the formatted dates
                          <>
                            <div>
                              Check-In:{" "}
                              {startDate
                                ? startDate.toDateString()
                                : "Not selected"}
                            </div>
                            <div>
                              Check-Out:{" "}
                              {endDate
                                ? endDate.toDateString()
                                : "Not selected"}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="person-details">
                      {personDetails.map((detail, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <h3>{detail.person}</h3>
                          <input
                            key={index}
                            type="text"
                            style={{ padding: "4px" }}
                            placeholder={`Enter ${detail.person}'s details`}
                            value={detail.value}
                            onChange={(e) => {
                              const updatedDetails = [...personDetails];
                              updatedDetails[index].value = e.target.value;
                              setPersonDetails(updatedDetails);
                            }}
                          />
                          <div style={{ display: "flex" }}>
                            <input type="number" placeholder="Age" />
                            <div style={{ display: "flex", marginLeft: "5px" }}>
                              <div
                                className={`gender-button ${
                                  activeButtons[index] === "male"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => handleButtonClick(index, "male")}
                              >
                                Male
                              </div>
                              <div
                                className={`gender-button ${
                                  activeButtons[index] === "female"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleButtonClick(index, "female")
                                }
                              >
                                Female
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                    <button className="room-book">Book Now</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Hotelpage;
