// USMap.tsx
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import InfoContainer from './infoContainer';
import VisitedForm from './formContainer';
// Import a JSON file that includes the geographical data of US states
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface USMapProps {
  onStateClick?: (stateId: string) => void;
}

const USMap: React.FC<USMapProps> = () => {
  // Handle hover state for UI feedback
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [visitedRegions, setVisitedRegions] = useState<string[]>([]);

  // randomize color
  const rgbRandom = (): string => {
    function rgbRand() {
      return Math.floor(Math.random() * 255)
    }
    return (
      'rgb(' +
      rgbRand() +
      ',' +
      rgbRand() +
      ',' +
      rgbRand() +
      ')'
    );
  };

  const onRegionClick = async (regionId: string, regionName: string) => {
    console.log(`Clicked state with id: ${regionId}`);
    setSelectedRegion(regionName);
    await setVisitedRegions([...visitedRegions, regionId]);
    // Perform additional actions, like fetching data for the clicked state
    
  };

  // useEffect(() => {
  //   console.log(visitedRegions);
  // }, [visitedRegions]);

  return (
    <div>
      <h1>Clickable US Map</h1>
      <ComposableMap projection='geoAlbersUsa'>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionId = geo.id;
              const regionName = geo.properties.name;

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
      {hoveredRegion && <div>Hovering over: {hoveredRegion}</div>}
      <InfoContainer selectedRegion={selectedRegion} />
      <VisitedForm region={selectedRegion}/>
    </div>
  );
};

export default USMap;
