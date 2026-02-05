import React, { createContext, useEffect, useState } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
	const [captain, setCaptain] = useState(() => {
		const stored = localStorage.getItem("captain");
		return stored ? JSON.parse(stored) : null;
	});

	const [activeRide, setActiveRide] = useState(() => {
		return localStorage.getItem("activeRide") === "true";
	});

	/* ---------- PERSIST CAPTAIN ---------- */
	useEffect(() => {
		if (captain) {
			localStorage.setItem("captain", JSON.stringify(captain));
		} else {
			localStorage.removeItem("captain");
		}
	}, [captain]);

	/* ---------- PERSIST RIDE STATE ---------- */
	useEffect(() => {
		localStorage.setItem("activeRide", activeRide ? "true" : "false");
	}, [activeRide]);

	return (
		<CaptainDataContext.Provider
			value={{
				captain,
				setCaptain,
				activeRide,
				setActiveRide,
			}}
		>
			{children}
		</CaptainDataContext.Provider>
	);
};

export default CaptainContext;
