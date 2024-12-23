import React, { useState } from "react";
import { Button } from "./ui/button";
import dayjs from "dayjs"; // Import dayjs to format the date

const EventDisplay = ({ events, onEdit, onDelete, selectedDay }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [filter, setFilter] = useState("");

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedEvent({ ...events[index] });
  };

  const handleSave = () => {
    onEdit(editingIndex, editedEvent);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(filter.toLowerCase()) ||
      event.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Format the selected date to display at the top of the event list
  const formattedDate = dayjs(selectedDay).format("YYYY-MM-DD");

  return (
    <div className="event-list bg-gray-800 text-white p-6 max-w-2xl mx-auto rounded-md">
      <h3 className="text-xl font-semibold mb-4">Events for {formattedDate}</h3> {/* Date shown here */}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md w-full"
        />
      </div>

      {filteredEvents.length > 0 ? (
        <ul className="list-none pl-6"> {/* Changed from list-disc to list-none */}
          {filteredEvents.map((event, index) => (
            <li
              key={index}
              className="mb-4 p-4 rounded-md"
              style={{
                backgroundColor:
                  event.category === "work"
                    ? "#CC5500"
                    : event.category === "personal"
                    ? "#1B03A3"
                    : "#9333ea", // Adjust this for different categories
              }}
            >
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editedEvent.name}
                    onChange={handleChange}
                    className="mb-2 p-2 bg-gray-700 text-white"
                    placeholder="Event Name"
                  />
                  <input
                    type="time"
                    name="start"
                    value={editedEvent.start}
                    onChange={handleChange}
                    className="mb-2 p-2 bg-gray-700 text-white"
                  />
                  <input
                    type="time"
                    name="end"
                    value={editedEvent.end}
                    onChange={handleChange}
                    className="mb-2 p-2 bg-gray-700 text-white"
                  />
                  <textarea
                    name="description"
                    value={editedEvent.description}
                    onChange={handleChange}
                    className="mb-2 p-2 bg-gray-700 text-white w-full resize-none h-24"
                    placeholder="Event Description"
                  />
                  <div className="mt-2">
                    <Button onClick={handleSave} className="mr-2 bg-white text-black hover:bg-gray-200">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingIndex(null)}
                      className="bg-transparent text-white border-white hover:bg-white hover:text-black"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-medium">
                    {event.name} ({event.category}) {/* Display category in parentheses */}
                  </h4>
                  <p>
                    {event.start} - {event.end}
                  </p>
                  {/* Add text wrapping here */}
                  <p className="whitespace-normal break-words">{event.description}</p>
                  <div className="mt-2">
                    <Button onClick={() => handleEditClick(index)} className="mr-2 bg-white text-black hover:bg-gray-200">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onDelete(index)}
                      className="bg-transparent text-white border-white hover:bg-white hover:text-black mr-2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>No events match your search.</p>
        </div>
      )}
    </div>
  );
};

export default EventDisplay;
