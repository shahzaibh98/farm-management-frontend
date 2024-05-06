import { Flex, Tooltip, useMantineTheme } from '@mantine/core';
import {
  GoogleMap,
  Marker,
  Polygon,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import { IconRestore } from '@tabler/icons-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SlActionUndo } from 'react-icons/sl';
import { SearchForm, Button, Text } from '../../concave.agri/components';
import { isEmpty } from '../../utils/common/function';

interface Location {
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  isReadOnly?: boolean;
  centerPoint?: Location;
  polygonCoords?: Location[];
  color?: string;
}

const LocationSearch = ({
  onLocationSelect,
  isReadOnly,
  color,
}: LocationSearchProps) => {
  const theme = useMantineTheme();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY ?? '',
    libraries: ['places'],
    language: 'en',
    region: 'us',
  });
  const [query, setQuery] = useState<string>('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [polygonCoords, setPolygonCoords] = useState<Location[]>([]);
  const [totalArea, setTotalArea] = useState<number | null>(null);
  const searchBox = useRef<any>(null); // Ref type should be any
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    if (isLoaded) {
      if (!window?.google) {
        console.error('Google Maps JavaScript API is not loaded!');
        return;
      }

      const polygon = new window.google.maps.Polygon({
        paths: polygonCoords,
      });

      if (!isEmpty(polygonCoords)) calculateCenterPointLatLng(polygonCoords);
      // Compute the area of the polygon
      const area =
        polygon.getPath() &&
        window.google.maps.geometry?.spherical?.computeArea(polygon.getPath());
      // Convert area from square meters to acres
      const areaInAcres = area / 4046.86;

      setTotalArea(areaInAcres);
    }
  }, [polygonCoords, isLoaded]);

  function calculateCenterPointLatLng(polygon: any) {
    let totalLat = 0;
    let totalLng = 0;

    // Iterate through each vertex of the polygon
    for (let i = 0; i < polygon.length; i++) {
      totalLat += polygon[i].lat; // Summing up latitude values
      totalLng += polygon[i].lng; // Summing up longitude values
    }

    // Divide the total sums by the number of vertices to get the average
    const centerLat = totalLat / polygon.length;
    const centerLng = totalLng / polygon.length;
    console.log(centerLat, centerLng);
    setLat(centerLat ?? null);
    setLng(centerLng ?? null);
  }

  const handlePlaceSelect = () => {
    if (searchBox?.current) {
      const places = searchBox?.current?.getPlaces();
      if (places?.length > 0) {
        const place = places[0];
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        setQuery(place.formatted_address);
        setLat(latitude);
        setLng(longitude);
        setSelectedLocation({ lat: latitude, lng: longitude });

        // Call a function to handle the obtained latitude and longitude
        onLocationSelect({ lat: latitude, lng: longitude });
      }
    }
  };

  const handleMapClick = (e: any) => {
    const clickedLatLng = e.latLng.toJSON();
    setPolygonCoords([...polygonCoords, clickedLatLng]);
  };

  const handleUndoPoint = () => {
    setPolygonCoords(polygonCoords.slice(0, -1));
  };

  const handleResetPolygon = () => {
    setLat(null);
    setLng(null);
    setPolygonCoords([]);
  };

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: { lat: () => any; lng: () => any }) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPolygonCoords(nextPath);
    }
  }, [setPolygonCoords]);

  // Bind refs to current Polygon and listeners
  const onLoad = useCallback(
    (polygon: google.maps.Polygon | null) => {
      polygonRef.current = polygon;
      const path = polygon && polygon.getPath();
      path &&
        listenersRef.current.push(
          path.addListener('set_at', onEdit),
          path.addListener('insert_at', onEdit),
          path.addListener('remove_at', onEdit)
        );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis: { remove: () => any }) => lis.remove());
    polygonRef.current = null;
  }, []);

  return isLoaded ? (
    <>
      {!isReadOnly && (
        <div className="flex flex-row justify-between">
          <div className="w-3/4">
            <StandaloneSearchBox
              onLoad={(ref: any) => (searchBox.current = ref)}
              onPlacesChanged={handlePlaceSelect}
            >
              <SearchForm
                id="simple-search"
                placeholder="Enter a location"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
              />
            </StandaloneSearchBox>
          </div>
          <div className="w-1/4 flex justify-around ml-4 items-center">
            {/* 30% width */}
            <Tooltip
              label={'Remove last point'}
              withArrow
              position="left"
              transitionProps={{ transition: 'skew-up', duration: 300 }}
              // color={theme.colors.lightColors[3]}
            >
              <div>
                <SlActionUndo
                  onClick={handleUndoPoint}
                  size={24}
                  opacity={0.8}
                  // color={theme.colors.secondaryColors[0]}
                  className="cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            </Tooltip>
            <Tooltip
              label={'Reset Polygon'}
              withArrow
              position="left"
              transitionProps={{ transition: 'skew-up', duration: 300 }}
              // color={theme.colors.lightColors[3]}
            >
              <div>
                <IconRestore
                  onClick={handleResetPolygon}
                  size={24}
                  opacity={0.8}
                  stroke={1.5}
                  // color={theme.colors.secondaryColors[0]}
                  className="cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={{
          height: '500px',
          width: '100%',
          marginTop: '10px',
          borderRadius: '10px',
          border: '2px solid #ccc', // Border style, width, and color
        }}
        center={{
          lat: lat ?? 37.7749,
          lng: lng ?? -122.4194,
        }}
        zoom={12}
        onDblClick={handleMapClick}
      >
        <>
          {selectedLocation && isEmpty(polygonCoords) && (
            <Marker
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
            />
          )}
          {!isEmpty(polygonCoords) && lat && lng && (
            <Marker
              label={'Name'}
              position={{
                lat,
                lng,
              }}
              icon={{
                url: '',
                scaledSize: new window.google.maps.Size(20, 32),
              }}
            />
          )}
          {polygonCoords?.length > 0 && (
            <Polygon
              paths={polygonCoords}
              // Make the Polygon editable / draggable
              editable={true}
              draggable={true}
              // Event used when manipulating and adding points
              onMouseUp={onEdit}
              // Event used when dragging the whole Polygon
              onDragEnd={onEdit}
              onLoad={polygon => onLoad(polygon)}
              onUnmount={onUnmount}
              options={{
                geodesic: true,
                fillColor: color ?? '#FF0000',
                fillOpacity: 0.35,
                strokeColor: color ?? '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            ></Polygon>
          )}
        </>
      </GoogleMap>
      {!isReadOnly && (
        <Flex
          mih={50}
          mt={8}
          gap="xs"
          justify="flex-end"
          align="flex-start"
          direction="row"
          wrap="wrap"
          className="mb-5"
        >
          <Button
            variant="outline"
            autoContrast
            color={theme.colors.secondaryColors[3]}
            size="md"
            onClick={() => {}}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic">
              {'Cancel'}
            </Text>
          </Button>
          <Button
            variant="outline"
            autoContrast
            color={theme.colors.primaryColors[0]}
            size="md"
            onClick={() => {
              console.log('Confirm', {
                coordinates: polygonCoords,
                markLocation: { lat, lng },
                totalArea,
              });
            }}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic">
              {'Save'}
            </Text>
          </Button>
        </Flex>
      )}
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default LocationSearch;
