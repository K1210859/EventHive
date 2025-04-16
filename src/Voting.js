import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventContext } from './EventContext';
import { auth } from './firebase';
import { fetchEventByID, saveRankingVoteToFirestore } from './firebaseHelpers';
import './Voting.css';
import './App.css';

function Voting() {
  const { eventOptions, setEventOptions, votes, setVotes } = useContext(EventContext);
  const [selected, setSelected] = useState({ theme: '', venue: '', dates: '' });
  const [userVotes, setUserVotes] = useState({});
  const eventID = localStorage.getItem("eventID");
  const userID = auth.currentUser?.uid;

  useEffect(() => {
    const loadVotesAndOptions = async () => {
      const event = await fetchEventByID(eventID);
      if (!event) return;

      const options = {
        theme: event.theme || [],
        venue: event.venue || [],
        dates: event.dates || []
      };
      setEventOptions(options);

      const storedVotes = event.votes?.[userID] || {};
      setUserVotes(storedVotes);

      const selections = {};
      for (const category of Object.keys(options)) {
        const categoryVotes = storedVotes[category] || {};
        const sorted = Object.entries(categoryVotes).sort((a, b) => b[1] - a[1]);
        if (sorted.length > 0) {
          selections[category] = sorted[0][0];
        }
      }
      setSelected(selections);
      setVotes(event.votes || {});
    };

    loadVotesAndOptions();
    const interval = setInterval(loadVotesAndOptions, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, [eventID, userID, setEventOptions, setVotes]);

  const handleVote = async (category, option) => {
    if (userVotes[category] === option) return;

    const currentVotes = { ...(votes[category] || {}) };
    if (userVotes[category]) {
      currentVotes[userVotes[category]] = Math.max((currentVotes[userVotes[category]] || 0) - 1, 0);
    }
    currentVotes[option] = (currentVotes[option] || 0) + 1;

    const updatedVotes = {
      ...votes,
      [category]: currentVotes
    };

    setVotes(updatedVotes);
    setUserVotes((prev) => ({ ...prev, [category]: option }));
    setSelected((prev) => ({ ...prev, [category]: option }));

    const scores = {};
    const options = eventOptions[category];
    for (const opt of options) {
      scores[opt] = opt === option ? options.length : 0;
    }

    await saveRankingVoteToFirestore(eventID, userID, category, scores);
  };

  const calculatePercentage = (category, option) => {
    if (selected[category]) {
      return selected[category] === option ? '100' : '0';
    }
    return '0';
  };

  const allCategoriesVoted = Object.keys(eventOptions).every(
    (category) => userVotes[category]
  );

  return (
    <div className="container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '70%', backgroundColor: '#ffc107' }} />
        <div className="progress-percentage">70%</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
        <Link to="/venue" className="btn back-btn rounded-circle shadow-sm back-icon">
          <i className="bi bi-arrow-left-short"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x m-0 text-nowrap">Voting</h1>
      </div>

      {Object.keys(eventOptions).map((category) => (
        <div key={category} className="category-section">
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div className="options-list">
            {eventOptions[category].map((option) => (
              <div
                key={option}
                className={`option-item ${selected[category] === option ? 'selected' : ''}`}
                onClick={() => handleVote(category, option)}
              >
                <span className="option-text">{option}</span>
                {selected[category] && (
                  <span className="option-percentage"> - {calculatePercentage(category, option)}%</span>
                )}
                {selected[category] === option && (
                  <span className="checkmark">&#10003;</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="next-button-row">
        {allCategoriesVoted ? (
          <Link to="/final-result" className="next-button active" style={{ backgroundColor: '#ffcf34', color: '#000' }}>
            Next
          </Link>
        ) : (
          <button className="next-button disabled" disabled style={{ backgroundColor: '#ccc', color: '#666' }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Voting;
