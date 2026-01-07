import React, { createContext, useContext, useState } from "react";

export const CaptainDataContext = createContext();

// export const useCaptain = () => useContext(CaptainContext);

export const CaptainContext = ({ children }) => {
	const [captain, setCaptain] = useState(null); // Captain data (object or null)
	const [isCaptainAuthenticated, setIsCaptainAuthenticated] = useState(false); // Auth state

	const loginCaptain = (captainData) => {
		setCaptain(captainData);
		setIsCaptainAuthenticated(true);
	};

	const logoutCaptain = () => {
		setCaptain(null);
		setIsCaptainAuthenticated(false);
	};

	const value = {
		captain,
		isCaptainAuthenticated,
		loginCaptain,
		logoutCaptain,
		setCaptain,
		setIsCaptainAuthenticated,
	};

	return (
		<CaptainDataContext.Provider value={value}>
			{children}
		</CaptainDataContext.Provider>
	);
};

export default CaptainContext;