import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEventByID } from './firebaseHelpers';
import './Voting.css';
import './App.css';

function FinalResult() {
  const [votes, setVotes] = useState({});
  const [eventOptions, setEventOptions] = useState({ theme: [], venue: [], dates: [] });
  const [loading, setLoading] = useState(true);
  const eventID = localStorage.getItem("eventID");

  useEffect(() => {
    const loadVotes = async () => {
      const event = await fetchEventByID(eventID);
      if (event) {
        setVotes(aggregateVotes(event.votes || {}));
        setEventOptions({
          theme: event.theme || [],
          venue: event.venue || [],
          dates: event.dates || [],
        });
        setLoading(false);
      }
    };

    loadVotes();
    const interval = setInterval(loadVotes, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, [eventID]);

  const aggregateVotes = (userVotes) => {
    const categories = ['theme', 'venue', 'dates'];
    const result = {};

    for (const category of categories) {
      result[category] = {};
      for (const uid in userVotes) {
        const categoryVotes = userVotes[uid][category];
        for (const option in categoryVotes) {
          result[category][option] = (result[category][option] || 0) + categoryVotes[option];
        }
      }
    }

    return result;
  };

  const getHighestVoteOption = (category) => {
    const categoryVotes = votes[category];
    if (categoryVotes && Object.keys(categoryVotes).length > 0) {
      const maxVotes = Math.max(...Object.values(categoryVotes));
      const highestOption = Object.keys(categoryVotes).find(
        (option) => categoryVotes[option] === maxVotes
      );
      return highestOption;
    } else {
      return "No votes yet";
    }
  };

  return (
    <div className="container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '80%', backgroundColor: '#ffc107' }} />
        <div className="progress-percentage">80%</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
        <Link to="/voting" className="btn back-btn rounded-circle shadow-sm back-icon">
          <i className="bi bi-arrow-left-short"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x m-0 text-nowrap">Final Result</h1>
      </div>

      {['theme', 'venue', 'dates'].map((category) => (
        <div key={category}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}:</h3>
          <p>{loading ? 'Loading...' : getHighestVoteOption(category)}</p>
        </div>
      ))}

      <div className="next-button-row">
        <Link to="/tasks" className="next-button">
          Next
        </Link>
      </div>
    </div>
  );
}

export default FinalResult;
