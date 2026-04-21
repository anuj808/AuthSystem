import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Zap,
  Hammer,
  Droplets,
  Brush,
  Paintbrush,
  Snowflake,
} from "lucide-react";

const services = [
  { name: "Plumber", value: "plumber", icon: Droplets },
  { name: "Electrician", value: "electrician", icon: Zap },
  { name: "Mechanic", value: "mechanic", icon: Wrench },
  { name: "Carpenter", value: "carpenter", icon: Hammer },
  { name: "Cleaner", value: "cleaner", icon: Brush },
  { name: "Painter", value: "painter", icon: Paintbrush },
  { name: "AC Repair", value: "ac", icon: Snowflake },
];

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState("");
  const [work, setWork] = useState("");
  const [location, setLocation] = useState("");

  const locationRef = useRef(null);

  // Google Autocomplete (optional – works only if Google loaded)
  useEffect(() => {
    if (window.google && locationRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setLocation(place.formatted_address || "");
      });
    }
  }, []);

  // Live GPS
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                setLocation(results[0].formatted_address);
              }
            }
          );
        } else {
          setLocation(`Lat ${latitude}, Lng ${longitude}`);
        }
      },
      () => alert("Location permission denied")
    );
  };

  const handleSearch = () => {
    if (!selectedService || !location) {
      alert("Select helper and location");
      return;
    }

    navigate("/find-helpers", {
      state: {
        service: selectedService,
        location,
        work,
      },
    });
  };

  return (
    <header className="w-full min-h-screen flex justify-center px-5 pt-24 text-white">
      <div className="w-full max-w-4xl space-y-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Find Helpers Near You
          </h1>
          <p className="text-gray-400 mt-1">
            {userData ? `Hi ${userData.name}` : "Fast & reliable home services"}
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.value}
                onClick={() => setSelectedService(service.value)}
                className={`p-3 rounded-xl flex flex-col items-center border text-xs sm:text-sm transition
                  ${
                    selectedService === service.value
                      ? "border-teal-400 bg-teal-400/10"
                      : "border-gray-600 hover:border-teal-400"
                  }`}
              >
                <Icon className="w-6 h-6 text-teal-400" />
                <span className="mt-1">{service.name}</span>
              </button>
            );
          })}
        </div>

        {/* Inputs */}
        <div className="space-y-4 max-w-2xl mx-auto">

          {/* LOCATION (CONTROLLED INPUT – FIXED) */}
          <div className="relative">
            <input
              ref={locationRef}
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 pr-28 rounded-lg bg-[#142b2b]/60
              text-white placeholder-gray-400 focus:ring-2
              focus:ring-teal-400 outline-none"
            />
            <button
              onClick={getCurrentLocation}
              type="button"
              className="absolute right-2 top-2 px-3 py-1 text-sm
              bg-teal-400 text-black rounded-md hover:bg-teal-300"
            >
              Use GPS
            </button>
          </div>

          {/* Work */}
          <textarea
            rows="3"
            placeholder="Describe the work"
            value={work}
            onChange={(e) => setWork(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#142b2b]/60
            text-white placeholder-gray-400 resize-none
            focus:ring-2 focus:ring-teal-400 outline-none"
          />

          {/* Button */}
          <button
            onClick={handleSearch}
            disabled={!selectedService || !location}
            className={`w-full py-3 rounded-full font-semibold transition
              ${
                selectedService && location
                  ? "bg-teal-400 text-black hover:bg-teal-300"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
          >
            Search Helpers
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
