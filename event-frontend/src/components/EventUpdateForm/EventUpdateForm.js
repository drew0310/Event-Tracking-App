import React, { useState } from "react";
import axios from "axios";
import "./EventUpdateForm.css";

const generateTimeOptions = (startDate, endDate, isEndTime, existingTime) => {
  const times = [];
  const now = new Date();

  const baseTime = isEndTime ? new Date(endDate) : new Date(startDate);
  if (isEndTime && endDate > startDate) baseTime.setHours(0, 0, 0, 0);

  for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
    const optionTime = new Date(baseTime.getTime());
    optionTime.setMinutes(baseTime.getMinutes() + minutes);

    if (optionTime >= now) {
      const formattedTime = optionTime.toTimeString().slice(0, 5);
      times.push({ value: formattedTime, label: formattedTime });
    }
  }

  if (existingTime && !times.find((t) => t.value === existingTime)) {
    times.push({ value: existingTime, label: existingTime });
  }

  return times;
};

const EventUpdateForm = ({ event, onClose, onSubmit }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    eventId: event.eventId,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    startTime: event.startTime,
    endDate: event.endDate,
    endTime: event.endTime,
    createdBy: event.createdBy
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (formData.description.split(" ").length > 100) newErrors.description = "Description cannot exceed 100 words.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";
    if (formData.endDate < formData.startDate || (formData.endDate === formData.startDate && formData.endTime < formData.startTime)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/app/events/updateEvent`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setMessage("Event updated successfully!");
        setTimeout(() => {
          setMessage("");
          handleClose();
          onSubmit(formData);
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to update the event. Please try again!");
    }
  };

  const startTimeOptions = generateTimeOptions(
    formData.startDate,
    formData.endDate || formData.startDate,
    false,
    formData.startTime
  );
  
  const endTimeOptions = generateTimeOptions(
    formData.startDate,
    formData.endDate || formData.startDate,
    true,
    formData.endTime
  );

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      <div className="form-card">
        <h2>Update Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="label-text">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>
          <div className="form-field">
            <label className="label-text">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <div className="error">{errors.description}</div>}
          </div>
          <div className="form-field">
            <label className="label-text">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="label-text">Start Time</label>
            <select name="startTime" value={formData.startTime} onChange={handleChange}>
                <option value="">Select start time</option>
                {startTimeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label className="label-text">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="label-text">End Time</label>
            <select name="endTime" value={formData.endTime} onChange={handleChange}>
                <option value="">Select end time</option>
                {endTimeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">Update</button>
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

export default EventUpdateForm;
