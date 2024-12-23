import React, { useState } from "react";
import CalendarWrapper from "./components/EventCalendar";
import EventForm from "./components/EventForm"; // Renamed to EventForm
import EventList from "./components/EventDisplay";
import dayjs from "dayjs";

const App = () => {
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle selecting a day on the calendar
  const handleDaySelect = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    // Set the selected day and open the modal immediately
    setSelectedDay(formattedDate);
    setIsModalOpen(true); // Open the modal after setting the selected day
  };

  // Function to check if a new event overlaps with any existing event
  const checkForOverlap = (newEvent, existingEvents) => {
    const newStart = dayjs(`${selectedDay}T${newEvent.start}`);
    const newEnd = dayjs(`${selectedDay}T${newEvent.end}`);

    return existingEvents.some((event) => {
      const existingStart = dayjs(`${selectedDay}T${event.start}`);
      const existingEnd = dayjs(`${selectedDay}T${event.end}`);
      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    });
  };

  // Save a new event
  const handleSaveEvent = (newEvent) => {
    const formattedDate = selectedDay;

    // Validate no overlapping events
    if (events[formattedDate] && checkForOverlap(newEvent, events[formattedDate])) {
      alert("This event overlaps with an existing event. Please adjust the time.");
      return;
    }

    // Add the new event
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: [...(prevEvents[formattedDate] || []), newEvent],
    }));
    setIsModalOpen(false); // Close the modal
  };

  // Edit an existing event
  const handleEditEvent = (index, updatedEvent) => {
    const formattedDate = selectedDay;

    // Validate no overlapping events (excluding the event being edited)
    const filteredEvents = events[formattedDate].filter((_, i) => i !== index);
    if (checkForOverlap(updatedEvent, filteredEvents)) {
      alert("This event overlaps with an existing event. Please adjust the time.");
      return;
    }

    // Update the event
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: prevEvents[formattedDate].map((event, i) =>
        i === index ? updatedEvent : event
      ),
    }));
  };

  // Delete an event from the list
  const handleDeleteEvent = (index) => {
    const formattedDate = selectedDay;
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: prevEvents[formattedDate].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="App">
      {/* Calendar for selecting days */}
      <div className="calendar-container">
        <CalendarWrapper onDaySelect={handleDaySelect} />
      </div>

      {/* Event List for the selected day */}
      {selectedDay && (
        <EventList
          events={events[selectedDay] || []}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          selectedDay={selectedDay} // Pass selectedDay to EventList
        />
      )}

      {/* Event Modal for adding or editing events */}
      <EventForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDay={selectedDay}
      />
    </div>
  );
};

export default App;
