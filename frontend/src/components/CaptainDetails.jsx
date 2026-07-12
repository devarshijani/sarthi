import React from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = React.useContext(CaptainDataContext);

  const firstName = captain?.fullName?.firstName || captain?.fullname?.firstname;
  const lastName = captain?.fullName?.lastName || captain?.fullname?.lastname;
  
  const hasName = firstName || lastName;
  const captainName = hasName 
    ? `${firstName || ""} ${lastName || ""}`.trim() 
    : "Captain";

  const vehicleType = captain?.vehicleType || captain?.vehicle?.type || "";
  const plate = captain?.vehicle?.plate || "";
  const vehicleName = (vehicleType && plate)
    ? `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} - ${plate}`
    : "—";

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "C";

  return (
    <div className="h-1/2 p-4 bg-gray-50 flex flex-col justify-between">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between flex-1">
        {/* Captain Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Initials Avatar */}
            <div className="h-14 w-14 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xl uppercase">
              {initial}
            </div>
            <div>
              <h4 className="text-lg font-semibold capitalize">{captainName}</h4>
              <p className="text-sm text-gray-500">{vehicleName}</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xl font-bold">—</h4>
            <p className="text-sm text-gray-500">Earned</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 my-6"></div>

        {/* Status */}
        <div className="text-center py-4 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-sm font-medium">
            You are online and ready to accept rides
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
