// USMap.tsx
import React, { useState, useEffect, ReactElement } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import InfoContainer from './infoContainer';
import VisitedForm from './formContainer';
import Logout from './userlogs/logout';
// Import a JSON file that includes the geographical data of US states
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface USMapProps {
  onStateClick?: (stateId: string) => void;
}

const USMap: React.FC<USMapProps> = () => {
  // Handle hover state for UI feedback
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [visitedRegions, setVisitedRegions] = useState<
    string[] | number | null
  >([]);
  const [regionInfo, setRegionInfo] = useState<ReactElement>(<div></div>);
  const [currCaption, setCurrCaption] = useState('');
  const [image, setImage] = useState(''); //image url from s3 bucket

  // randomize color
  const rgbRandom = (): string => {
    function rgbRand() {
      return Math.floor(Math.random() * 255);
    }
    return 'rgb(' + rgbRand() + ',' + rgbRand() + ',' + rgbRand() + ')';
  };

  const onRegionClick = async (regionId: number, regionName: string) => {
    console.log(`Clicked state with id: ${regionId}`);
    setSelectedRegion(regionName);
    await setVisitedRegions([...visitedRegions, regionId]);
    // Perform additional actions, like fetching data for the clicked state
    if (regionId % 2 == 0) {
      fetch(`/db?${regionName}`)
        .then((response) => response.json())
        .then((data) => {
          return setRegionInfo(
            <InfoContainer
              selectedRegion={regionName}
              caption={data.caption}
              image={data.image}
            />
          );
        });
      return setRegionInfo(<InfoContainer selectedRegion={regionName} />);
    } else {
      return setRegionInfo(<VisitedForm selectedRegion={regionName} />);
    }
  };

  // useEffect(() => {
  //   console.log(visitedRegions);
  // }, [visitedRegions]);

  return (
    <div
      style={{
        position: 'absolute',
        justifyContent: 'center',
        left: '220px',
        top: '30px',
      }}
    >
      <div style={{ position: 'relative', top: 10, right: 10 }}>
        {' '}
        <Logout />{' '}
      </div>
      <div className="map">
        <h1>Clickable US Map</h1>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const regionId = geo.id;
                const regionName: string = geo.properties.name;

                return (
                  <Geography
                    key={regionId}
                    geography={geo}
                    onMouseEnter={() => setHoveredRegion(regionName)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onRegionClick(regionId, regionName)}
                    style={{
                      default: {
                        //   fill: hoveredRegion === regionName ? '#f0e68c' : '#D6D6DA',
                        fill: visitedRegions.includes(regionId)
                          ? rgbRandom()
                          : '#D6D6DA',
                        outline: 'none',
                      },
                      hover: {
                        fill: '#FFD700',
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#FF6347',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {hoveredRegion && (
          <div
            style={{
              position: 'absolute',
              padding: '10px',
              marginBottom: '10px',
              paddingBottom: '50px',
              left: '300px',
            }}
          >
            Hovering over: {hoveredRegion}
          </div>
        )}
      </div>
      {regionInfo}
    </div>
  );
};

export default USMap;
