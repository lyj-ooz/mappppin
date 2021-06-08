import React from "react";

import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin, faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Map = () => {
  const currentUser = "angel123";

  const [pins, setPins] = useState([]);
  const [currPlaceId, setCurrPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4,
  });

  useEffect(() => {
    getPins();
  }, []);

  const getPins = async () => {
    try {
      const res = await axios.get("/pins");
      setPins(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrPlaceId(id);
    setViewport({ ...viewport, latitude, longitude });
  };

  const handleAddClick = (e) => {
    console.log(e);
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      latitude,
      longitude,
    });
  };
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/yjlee1026/ckpnmyf3n0ax217li1uh8s91l"
      onDblClick={handleAddClick}
      transitionDuration="200"
    >
      {pins.map((pin) => {
        return (
          <>
            <Marker
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <FontAwesomeIcon
                icon={faMapPin}
                style={{
                  fontSize: viewport.zoom * 5,
                  color: pin.username === currentUser ? "red" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleMarkerClick(pin._id, pin.latitude, pin.longitude)
                }
              />
            </Marker>
            {pin._id === currPlaceId && (
              <Popup
                latitude={pin.latitude}
                longitude={pin.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label htmlFor="">Place</label>
                  <h4 className="place">{pin.title}</h4>

                  <label htmlFor="">Review</label>
                  <p className="desc">{pin.desc}</p>

                  <label htmlFor="">Rating</label>
                  <div className="stars">
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                    <FontAwesomeIcon icon={faStar} className="star" />
                  </div>

                  <label htmlFor="">Information</label>
                  <span className="username">
                    Created by: <b>{pin.username}</b>
                  </span>
                  <span className="date">{pin.createdAt}</span>
                </div>
              </Popup>
            )}
          </>
        );
      })}

      {newPlace && (
        <Popup
          latitude={newPlace.latitude}
          longitude={newPlace.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
        >
          <div>
            <form>
              <label htmlFor="">Title</label>
              <input type="text" placeholder="Enter a title" />
              <label htmlFor="">Review</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="write review..."
              ></textarea>
              <label htmlFor="">Rating</label>
              <select name="" id="">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitBtn" type="submit">
                Add pin
              </button>
            </form>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;
