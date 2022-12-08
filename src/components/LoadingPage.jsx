import React from 'react';
import image from './401.png';

function LoadingPage({ error, handleRetryClick }) {
	if (error) {
		return (
			<div className="tc">
				<img src={image} alt="Error 401" />
				<br />
				<button onClick={handleRetryClick}>Retry</button>
			</div>
		);
	} else {
		return <p className="tc">Page is loading please wait</p>;
	}
}

export default LoadingPage;
