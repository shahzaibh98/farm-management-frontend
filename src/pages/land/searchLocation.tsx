// import React, { useState, useRef } from 'react';
// import {
//   GoogleMap,
//   LoadScript,
//   StandaloneSearchBox,
//   Marker,
//   Polygon,
// } from '@react-google-maps/api';

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface LocationSearchProps {
//   onLocationSelect: (location: Location) => void;
// }

// const LocationSearch: React.FC<LocationSearchProps> = ({
//   onLocationSelect,
// }) => {
//   const [query, setQuery] = useState<string>('');
//   const [lat, setLat] = useState<number | null>(null);
//   const [lng, setLng] = useState<number | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
//     null
//   );
//   const [polygonCoords, setPolygonCoords] = useState<Location[]>([]);
//   const searchBox = useRef<any>(null); // Ref type should be any

//   const handlePlaceSelect = () => {
//     if (searchBox.current) {
//       const places = searchBox.current.getPlaces();
//       if (places.length > 0) {
//         const place = places[0];
//         const latitude = place.geometry.location.lat();
//         const longitude = place.geometry.location.lng();

//         setQuery(place.formatted_address);
//         setLat(latitude);
//         setLng(longitude);
//         setSelectedLocation({ lat: latitude, lng: longitude });

//         // Call a function to handle the obtained latitude and longitude
//         onLocationSelect({ lat: latitude, lng: longitude });
//       }
//     }
//   };

//   const handleMapClick = (e: any) => {
//     const clickedLatLng = e.latLng.toJSON();
//     setPolygonCoords([...polygonCoords, clickedLatLng]);
//   };

//   const handleUndoPoint = () => {
//     setPolygonCoords(polygonCoords.slice(0, -1));
//   };

//   const handleResetPolygon = () => {
//     setPolygonCoords([]);
//   };

//   return (
//     <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
//       <StandaloneSearchBox
//         onLoad={(ref: any) => (searchBox.current = ref)}
//         onPlacesChanged={handlePlaceSelect}
//       >
//         <input
//           type="text"
//           placeholder="Enter a location"
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//         />
//       </StandaloneSearchBox>
//       <GoogleMap
//         mapContainerStyle={{ height: '400px', width: '100%' }}
//         center={{ lat: lat || 37.7749, lng: lng || -122.4194 }}
//         zoom={12}
//         onClick={handleMapClick}
//       >
//         {selectedLocation && (
//           <Marker
//             position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
//           />
//         )}
//         {polygonCoords.length > 0 && (
//           <Polygon
//             paths={polygonCoords}
//             options={{
//               fillColor: '#FF0000',
//               fillOpacity: 0.35,
//               strokeColor: '#FF0000',
//               strokeOpacity: 0.8,
//               strokeWeight: 2,
//             }}
//           />
//         )}
//       </GoogleMap>
//       <div>
//         <button onClick={handleUndoPoint}>Undo Point</button>
//         <button onClick={handleResetPolygon}>Reset Polygon</button>
//       </div>
//     </LoadScript>
//   );
// };

// export default LocationSearch;

export const LocationSearch = () => {};
