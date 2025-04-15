import { useContext } from 'react';
import { EventContext } from './EventContext';
import { Link } from 'react-router-dom';
import './Voting.css';
import './App.css';

function FinalResult() {
  const { votes } = useContext(EventContext);

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
      {/* Progress bar section */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '70%', backgroundColor: '#ffc107' }} />
        <div className="progress-percentage">70%</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
        <Link to="/voting" className="btn back-btn rounded-circle shadow-sm back-icon">
          <i className="bi bi-arrow-left-short"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x m-0 text-nowrap">Final Result</h1>
      </div>

      {/* Display final results (budget removed) */}
      {['theme', 'venue', 'dates'].map((category) => (
        <div key={category}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}:</h3>
          <p>{getHighestVoteOption(category)}</p>
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
