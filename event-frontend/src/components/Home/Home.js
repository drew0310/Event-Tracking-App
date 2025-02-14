import React, { useState, useEffect } from "react";
import EventCard from "../EventCard/EventCard";
import "./Home.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EventCreationForm from "../EventCreationForm/EventCreationForm";
import "../EventCreationForm/EventCreationForm.css";
import Navbar from "../Navbar/Navbar";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/app/events/fetchEventsByUser/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [username]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setEvents((prevEvents) => {
        const filteredEvents = prevEvents.filter((event) => {
          const eventEnd = new Date(`${event.endDate}T${event.endTime}`);
          if (now > eventEnd) {
            axios.delete(`http://localhost:8080/app/events/deleteEvent/${event.eventId}`, {
              headers: {
                "Content-Type": "application/json",
              },
            }).catch((error) => {
              console.error("Error deleting event:", error);
            });
            return false;
          }
          return true;
        });
        return filteredEvents;
   
    });
  }, 5000); 

  return () => clearInterval(interval); 
  }, [events]);


  const handleCreateEvent = (newEvent) => {
    setEvents((events) => [...events, newEvent]);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
  };

  return (
    <div className="home-page">
      <Navbar username={username} />
      {events.length === 0 ? (
        <div className="welcome-message">
          <h1 className="title-message">Hey {username}! What's on your agenda?</h1>
          <p>Get started by clicking the + icon below!</p>
        </div>
      ) : (
        <>
          <div className="title-container">
            <h1 className="page-title">Your Schedule</h1>
          </div>
          <div className="events-container">
            {events.map((event) => (
              <EventCard key={event.eventId} event={event} onDelete={handleDeleteEvent} onUpdate={handleUpdateEvent} />
            ))}
          </div>
        </>
      )}
      <button
        className="create-event-btn"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>
      {isModalOpen && (
        <div className="modal-overlay">
          <EventCreationForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateEvent}
            currentUser={username}
          />
        </div>
      )}
    </div>
  );
};

export default Home;



