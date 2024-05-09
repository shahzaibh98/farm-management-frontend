import { Flex, Tooltip, useMantineTheme } from '@mantine/core';
import {
  GoogleMap,
  Marker,
  Polygon,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import { IconRestore } from '@tabler/icons-react';
import {
  ChangeEvent,
  Key,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SlActionUndo } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { Button, SearchForm, Text } from '../../concave.agri/components';
import {
  darkenColors,
  getLandColors,
} from '../../utils/common/constant.objects';
import {
  calculateCenterPointAndZoom,
  getCenterPoint,
  isEmpty,
} from '../../utils/common/function';

interface Location {
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  isMultiple?: boolean;
  onLocationSelect: (location: any) => void;
  onClose: () => void;
  isReadOnly?: boolean;
  data?: any;
}

const LocationSearch = ({
  isMultiple = false,
  onClose,
  onLocationSelect,
  isReadOnly,
  data,
}: LocationSearchProps) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
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
  const [polygonCoords, setPolygonCoords] = useState<Location[]>(
    data?.coordinates ?? []
  );
  const [zoomLevel, setZoomLevel] = useState<number>(0);

  const [totalArea, setTotalArea] = useState<number | null>(null);
  const searchBox = useRef<any>(null); // Ref type should be any
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleZoomChanged = () => {
    if (mapRef.current) {
      setZoomLevel(mapRef.current.getZoom() ?? 0);
    }
  };

  const [centerPoint, setCenterPoint] = useState({
    lat: 33.6573,
    lng: 73.0572,
  });

  const [multiCenterPoint] = useState(
    isMultiple
      ? calculateCenterPointAndZoom(data, 600, 450)
      : {
          lat: 33.6573,
          lng: 73.0572,
          zoom: 12,
        }
  );

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
    for (let i = 0; i < polygon?.length; i++) {
      totalLat += polygon[i].lat; // Summing up latitude values
      totalLng += polygon[i].lng; // Summing up longitude values
    }

    // Divide the total sums by the number of vertices to get the average
    const centerLat = totalLat / polygon?.length;
    const centerLng = totalLng / polygon?.length;
    setLat(centerLat ?? null);
    setLng(centerLng ?? null);
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      // Request current position
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenterPoint({ lat, lng });
        },
        error => {
          console.error('Error getting current position:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCenterPoint({ lat: 33.6573, lng: 73.0572 });
    }
  }, []);

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
      }
    }
  };

  const handleMapClick = (e: any) => {
    if (!isReadOnly) {
      const clickedLatLng = e.latLng.toJSON();
      setPolygonCoords([...polygonCoords, clickedLatLng]);
    }
  };

  const handleUndoPoint = () => {
    if (!isReadOnly) {
      setPolygonCoords(polygonCoords.slice(0, -1));
    }
  };

  const handleResetPolygon = () => {
    if (!isReadOnly) {
      setLat(null);
      setLng(null);
      setPolygonCoords([]);
    }
  };

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (!isReadOnly) {
      if (polygonRef.current) {
        const nextPath = polygonRef.current
          .getPath()
          .getArray()
          .map((latLng: { lat: () => any; lng: () => any }) => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
        setPolygonCoords(nextPath);
      }
    }
  }, [setPolygonCoords]);

  // Call setPath with new edited path
  const onLoad = useCallback(
    (polygon: google.maps.Polygon) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
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
          height: '450px',
          width: '100%',
          marginTop: '10px',
          borderRadius: '10px',
          border: '2px solid #ccc', // Border style, width, and color
        }}
        center={
          isMultiple
            ? multiCenterPoint.center
            : data?.markLocation ?? selectedLocation ?? centerPoint
        }
        zoom={isMultiple ? multiCenterPoint?.zoom : 12}
        onClick={e => !isReadOnly && handleMapClick(e)}
        onLoad={map => {
          mapRef.current = map;
          mapRef.current.addListener('zoom_changed', handleZoomChanged);
        }}
      >
        <>
          {selectedLocation && isEmpty(polygonCoords) && (
            <Marker
              position={selectedLocation ?? { lat: 33.6573, lng: 73.0572 }}
            />
          )}

          {isMultiple && (
            <>
              {/* Existing markers */}
              {data?.map((landData: any, index: Key | null | undefined) => (
                <>
                  <Marker
                    onClick={() => navigate(`/lands/edit/${landData?.landId}`)}
                    position={getCenterPoint(landData?.coordinates)}
                    label={{
                      text: zoomLevel > 12 ? `${landData?.name}` : '', // Only show label if zoomed in beyond a certain threshold
                      color:
                        zoomLevel > 12
                          ? darkenColors(
                              getLandColors(landData?.type ?? ''),
                              0.2
                            )
                          : 'transparent', // Adjust color only if label is shown
                      fontSize: '18px',
                    }}
                    icon={{
                      url: require(
                        `../../assets/images/${landData?.type ?? 'map-pin'}.png`
                      ),
                      scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
                      fillColor: darkenColors(
                        getLandColors(landData?.type ?? ''),
                        0.2
                      ), // Darken fill color
                      fillOpacity: 1, // Full opacity for fill
                      strokeWeight: 1, // Stroke weight
                      strokeColor: darkenColors(
                        getLandColors(landData?.type ?? ''),
                        0.2
                      ), // Darken stroke color
                    }}
                  ></Marker>
                  <Polygon
                    key={index}
                    paths={landData?.coordinates}
                    // Make the Polygon editable / draggable
                    editable={!isReadOnly}
                    draggable={!isReadOnly}
                    // Event used when manipulating and adding points
                    onMouseUp={onEdit}
                    // Event used when dragging the whole Polygon
                    onDragEnd={onEdit}
                    onLoad={polygon => onLoad(polygon)}
                    onUnmount={onUnmount}
                    options={{
                      geodesic: true,
                      fillColor: getLandColors(landData?.type) ?? '#000000',
                      fillOpacity: 0.15,
                      strokeColor: getLandColors(landData?.type) ?? '#000000',
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }}
                  />
                </>
              ))}
            </>
          )}

          {!isMultiple && !isEmpty(polygonCoords) && (
            <>
              <Marker
                onClick={() => navigate(`/lands/edit/${data?.landId}`)}
                position={getCenterPoint(polygonCoords)}
                label={{
                  text: zoomLevel > 12 ? `${data?.name}` : '',
                  color:
                    zoomLevel > 12
                      ? darkenColors(getLandColors(data?.type ?? ''), 0.2)
                      : 'transparent', // Adjust color only if label is shown,
                  fontSize: '18px',
                }}
                icon={{
                  url: require(
                    `../../assets/images/${data?.type ?? 'map-pin'}.png`
                  ), // Specify the relative path to the icon image file
                  scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
                  fillColor: darkenColors(getLandColors(data?.type ?? ''), 0.2), // Darken fill color
                  fillOpacity: 1, // Full opacity for fill
                  strokeWeight: 1, // Stroke weight
                  strokeColor: darkenColors(
                    getLandColors(data?.type ?? ''),
                    0.2
                  ), // Darken stroke color
                }}
              />
              <Polygon
                paths={polygonCoords}
                // Make the Polygon editable / draggable
                editable={!isReadOnly}
                draggable={!isReadOnly}
                onClick={() => navigate(`/lands/edit/${data?.landId}`)}
                // Event used when manipulating and adding points
                onMouseUp={onEdit}
                // Event used when dragging the whole Polygon
                onDragEnd={onEdit}
                onLoad={polygon => onLoad(polygon)}
                onUnmount={onUnmount}
                options={{
                  geodesic: true,
                  fillColor: getLandColors(data?.type) ?? '#000000',
                  fillOpacity: 0.15,
                  strokeColor: getLandColors(data?.type) ?? '#000000',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              ></Polygon>
            </>
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
          className="mb-2"
        >
          <Button
            variant="outline"
            autoContrast
            color={theme.colors.secondaryColors[3]}
            size="md"
            onClick={onClose}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic" p={2}>
              {'Cancel'}
            </Text>
          </Button>
          <Button
            variant="outline"
            autoContrast
            color={theme.colors.primaryColors[0]}
            size="md"
            onClick={() =>
              onLocationSelect({
                coordinates: polygonCoords ?? [],
                markLocation: { lat, lng },
                totalArea,
              })
            }
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic" p={2}>
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
