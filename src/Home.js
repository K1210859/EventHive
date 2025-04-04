import React from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";

function Home() {
  return (
    <div>
      <h1>EventHive</h1>

      <div className="event-card">
        <div className="date-box">
          <div>18</div>
          <div>Tue</div>
        </div>
        <div className="event-info">
          <div className="title">Naomi’s Pool Party</div>
          <div className="time">7:00 PM - 12:00 AM</div>
        </div>
      </div>

      <div className="event-card">
        <div className="date-box">
          <div>13</div>
          <div>Wed</div>
        </div>
        <div className="event-info">
          <div className="title">Alana’s Cat Party</div>
          <div className="time">8:00 PM - 12:00 AM</div>
        </div>
      </div>

      <div className="grid-buttons">
        <Link to="/plan" className="button-tile button-plan">Plan</Link>
        <Link to="/invites" className="button-tile">Invites</Link>
        <Link to="/events" className="button-tile">Events</Link>
        <Link to="/money" className="button-tile">Money</Link>
      </div>
    </div>
  );
}

export default Home;
