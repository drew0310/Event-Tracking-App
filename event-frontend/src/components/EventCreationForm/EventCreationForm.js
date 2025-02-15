import React, { useState } from "react";
import "./EventCreationForm.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const generateTimeOptions = (startDate, endDate, isEndTime) => {
  const times = [];
  const now = new Date();

  const baseTime = isEndTime ? new Date(endDate) : new Date(startDate);
  if (isEndTime && endDate > startDate) baseTime.setHours(0, 0, 0, 0);

  for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
    const optionTime = new Date(baseTime.getTime());
    optionTime.setMinutes(baseTime.getMinutes() + minutes);

    if (optionTime >= now) {
      const formattedTime = optionTime.toTimeString().slice(0, 5);
      if (isEndTime) {
        times.push({ value: formattedTime, label: `${formattedTime}` });
      } else {
        times.push({ value: formattedTime, label: formattedTime });
      }
    }
  }

  return times;
};

const EventCreationForm = ({ onClose, onSubmit, currentUser }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (description.split(" ").length > 100) newErrors.description = "Description cannot exceed 100 words.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (endDate < startDate || (endDate === startDate && endTime < startTime)) {
      newErrors.endDate = "End time must be later than start time.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); 
    }, 300); 
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newEvent = {
      eventId: uuidv4(),
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      createdBy: currentUser,
    };
    try {
        const response = await axios.post("https://event-tracking-app-production.up.railway.app/app/events/addEvent", newEvent);
        if(response.status === 201) {
            setMessage("Event created successfully!");
            setTimeout(() => {
                setMessage("");
                handleClose();
                onSubmit(newEvent);
            }, 2000);
        }
    } catch (error) {
        setMessage("Failed to create the event. Please try again!");
    }
  };

  const timeOptions = generateTimeOptions(startDate, endDate || startDate, endDate > startDate);

 

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      <div className="form-card">
  <h2>Create New Event</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-field">
      <label className="label-text">Title</label>
      <input
        type="text"
        placeholder="Enter event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <div className="error-message">{errors.title}</div>}
    </div>
    <div className="form-field">
      <label className="label-text">Description</label>
      <input
        type="text"
        placeholder="Enter event description (max 100 words)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <div className="error-message">{errors.description}</div>}
    </div>
    <div className="form-field">
      <label className="label-text">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      {errors.startDate && <div className="error-message">{errors.startDate}</div>}
    </div>
    <div className="form-field">
      <label className="label-text">Start Time</label>
      <select
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      >
        <option value="">Select start time</option>
        {timeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors.startTime && <div className="error-message">{errors.startTime}</div>}
    </div>
    <div className="form-field">
      <label className="label-text">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {errors.endDate && <div className="error-message">{errors.endDate}</div>}
    </div>
    <div className="form-field">
      <label className="label-text">End Time</label>
      <select
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      >
        <option value="">Select end time</option>
        {timeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors.endTime && <div className="error-message">{errors.endTime}</div>}
    </div>
    <div className="form-buttons">
      <button type="submit">Create</button>
      <button type="button" onClick={handleClose}>
        Cancel
      </button>
    </div>
  </form>
  {message && <div className="message">{message}</div>}
</div>

    </div>
  );
};

export default EventCreationForm;




