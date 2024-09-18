import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// USMap.tsx
import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import InfoContainer from './infoContainer';
import VisitedForm from './formContainer';
import Logout from './userlogs/logout';
// Import a JSON file that includes the geographical data of US states
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const USMap = () => {
    // Handle hover state for UI feedback
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [visitedRegions, setVisitedRegions] = useState([]);
    const [regionInfo, setRegionInfo] = useState(_jsx("div", {}));
    const [currCaption, setCurrCaption] = useState('');
    const [image, setImage] = useState(''); //image url from s3 bucket
    // randomize color
    const rgbRandom = () => {
        function rgbRand() {
            return Math.floor(Math.random() * 255);
        }
        return 'rgb(' + rgbRand() + ',' + rgbRand() + ',' + rgbRand() + ')';
    };
    const onRegionClick = async (regionId, regionName) => {
        console.log(`Clicked state with id: ${regionId}`);
        setSelectedRegion(regionName);
        await setVisitedRegions([...visitedRegions, regionId]);
        // Perform additional actions, like fetching data for the clicked state
        if (regionId % 2 == 0) {
            fetch(`/db?${regionName}`)
                .then((response) => response.json())
                .then((data) => {
                return setRegionInfo(_jsx(InfoContainer, { selectedRegion: regionName, caption: data.caption, image: data.image }));
            });
            return setRegionInfo(_jsx(InfoContainer, { selectedRegion: regionName }));
        }
        else {
            return setRegionInfo(_jsx(VisitedForm, { selectedRegion: regionName }));
        }
    };
    // useEffect(() => {
    //   console.log(visitedRegions);
    // }, [visitedRegions]);
    return (_jsxs("div", { style: {
            position: 'absolute',
            justifyContent: 'center',
            left: '220px',
            top: '30px',
        }, children: [_jsxs("div", { style: { position: 'relative', top: 10, right: 10 }, children: [' ', _jsx(Logout, {}), ' '] }), _jsxs("div", { className: "map", children: [_jsx("h1", { children: "Clickable US Map" }), _jsx(ComposableMap, { projection: "geoAlbersUsa", children: _jsx(Geographies, { geography: geoUrl, children: ({ geographies }) => geographies.map((geo) => {
                                const regionId = geo.id;
                                const regionName = geo.properties.name;
                                return (_jsx(Geography, { geography: geo, onMouseEnter: () => setHoveredRegion(regionName), onMouseLeave: () => setHoveredRegion(null), onClick: () => onRegionClick(regionId, regionName), style: {
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
                                    } }, regionId));
                            }) }) }), hoveredRegion && (_jsxs("div", { style: {
                            position: 'absolute',
                            padding: '10px',
                            marginBottom: '10px',
                            paddingBottom: '50px',
                            left: '300px',
                        }, children: ["Hovering over: ", hoveredRegion] }))] }), regionInfo] }));
};
export default USMap;
