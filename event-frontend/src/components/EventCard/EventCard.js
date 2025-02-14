import React, { useEffect, useState } from "react";
import "./EventCard.css";
import axios from "axios";
import EventUpdateForm from "../EventUpdateForm/EventUpdateForm";
import "../EventUpdateForm/EventUpdateForm.css";

const EventCard = ({ event, onDelete, onUpdate }) => {
  const [countdown, setCountdown] = useState({});
  const [isMounted, setIsMounted] = useState(false); 
  const [popupClass, setPopupClass] = useState(""); 
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
      const diff = startDateTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ expired: true });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [event.startDate, event.startTime]);

  const getCountdownStyle = () => {
    const currentTime = new Date();
    const eventStart = new Date(`${event.startDate}T${event.startTime}`);
    const remaining = eventStart - currentTime;

    
    const greenToYellowThreshold = 72 * 60 * 60 * 1000; 
    const yellowToRedThreshold = 24 * 60 * 60 * 1000; 

    let color;

    if (remaining > greenToYellowThreshold) {
        color = "rgb(0, 255, 0)";
    } else if (remaining > yellowToRedThreshold) {
        const greenToYellowProgress = remaining - yellowToRedThreshold; 
        const range = greenToYellowThreshold - yellowToRedThreshold;

        const red = (1 - greenToYellowProgress / range) * 255; 
        const green = 255; 
        color = `rgb(${red}, ${green}, 0)`;
    } else if (remaining > 0) {
        const yellowToRedProgress = remaining; 
        const range = yellowToRedThreshold; 

        const red = 255; 
        const green = (yellowToRedProgress / range) * 255;
        color = `rgb(${red}, ${green}, 0)`;
    } else {
        color = "rgb(255, 0, 0)";
    }

    return { color };
  };


  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    const formattedDate = dateTime.toLocaleDateString("en-GB");
    const formattedTime = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const handleOpenPopup = () => {
    setIsMounted(true); 
    setTimeout(() => {
      setPopupClass("popup-show"); 
    }, 0);
  };

  const handleClosePopup = () => {
    setPopupClass("popup-hide"); 
    setTimeout(() => setIsMounted(false), 300);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/app/events/deleteEvent/${event.eventId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.status === 200) {
        setPopupClass("popup-hide");
        setTimeout(() => onDelete(event.eventId), 2000);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };




  return (
    <>
      <div className="event-card" onClick={handleOpenPopup}>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
          {countdown.expired
            ? <div className="countdown" style={{color: "#00468d"}}>In Progress</div>
            : <div className="countdown" style={getCountdownStyle()}>in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</div> }
      </div>

      {isMounted && (
        <div className={`event-popup ${popupClass}`}>
          <div className="popup-content">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Start: {formatDateTime(event.startDate, event.startTime)}</p>
            <p>End: {formatDateTime(event.endDate, event.endTime)}</p>
            <button className="close-button" onClick={handleClosePopup}>
              ✖
            </button>
            <button className="delete-button" onClick={handleDelete}>
                <img width="35" height="35" src="https://img.icons8.com/ios-glyphs/40/ff0000/filled-trash.png" alt="filled-trash"/>
            </button>
            <button className="update-button" onClick={() => setIsUpdateModalOpen(true)}>
                <img width="30" height="30" src="https://img.icons8.com/metro/35/FAB005/edit.png" alt="edit" />
            </button>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="modal-overlay">
          <EventUpdateForm 
            event={event} 
            onClose={() => setIsUpdateModalOpen(false)} 
            onSubmit={onUpdate} 
          />
        </div>
      )}
    </>
  );
};

export default EventCard;
