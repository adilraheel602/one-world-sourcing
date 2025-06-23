"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

interface OrderEvent {
  event: string;
  date: string;
  time: string;
  user?: string;
  location?: string;
  status: string;
}

interface OrderTimelineProps {
  orderId: string;
  token: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ orderId, token }) => {
  const [events, setEvents] = useState<OrderEvent[]>([]);

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`/api/order/${orderId}/timeline/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load timeline", err));
  }, [orderId, token]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "current":
        return "bg-primary text-white";
      case "completed":
        return "bg-success text-white";
      case "upcoming":
        return "bg-secondary text-white";
      case "delayed":
        return "bg-danger text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="timeline-container border-start border-2 ps-3">
      {events.map((event, index) => (
        <div key={index} className="position-relative mb-4">
          <div
            className={`position-absolute top-0 start-0 translate-middle rounded-circle border border-white timeline-dot ${getStatusClass(event.status)}`}
            style={{
              width: "20px",
              height: "20px",
              zIndex: 1,
            }}
          ></div>
          <div className="ms-4">
            <h6 className="mb-1 fw-bold">{event.event}</h6>
            <small className="text-muted">
              {moment(event.date).format("MMM DD, YYYY")} • {event.time}
            </small>
            {event.location && (
              <div className="text-muted fst-italic">{event.location}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
