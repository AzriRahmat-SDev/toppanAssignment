import React from 'react';

function LoadingPage({ error, handleRetryClick }) {
	if (error) {
		return (
			<div className="tc">
				<p>There was an error</p>
				<button onClick={handleRetryClick}>Retry</button>
			</div>
		);
	} else {
		return <p className="tc">Page is loading please wait</p>;
	}
}

export default LoadingPage;
