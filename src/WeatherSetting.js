import {
    WeatherSettingWrapper,
    Title,
    StyledLabel,
    StyledInputList,
    ButtonGroup,
    Back,
    Save,
} from './styled'
import { useState, useRef } from 'react';
import { availableLocations } from './utils';

const location = availableLocations.map((location) => location.cityName);
const WeatherSetting = ({ setCurrentPage, cityName, setCurrentCity }) => {
    const [locationName, setLocationName] = useState(cityName);
    // const inputLocationRef = useRef(null);
    const handleChange = (even) => {
        setLocationName(even.target.value)
    }
    const handleSave = () => {
        // const locationName = inputLocationRef.current.value;
        // console.log(locationName);
        if (location.includes(locationName)) {
            console.log(`儲存的地區資訊為：${locationName}`);
            setCurrentCity(locationName);
            setCurrentPage('WeatherCard');
        } else {
            alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`)
            return
        }
    }
    return (
        <WeatherSettingWrapper>
            <Title>設定</Title>
            <StyledLabel htmlFor='location'>地區</StyledLabel>
            <StyledInputList
                list='location-list'
                id='location'
                name='location'
                placeholder={locationName}
                onChange={handleChange}
            // ref={inputLocationRef}
            // defaultValue='高雄市'
            />
            <datalist id='location-list'>
                {location.map(location => (
                    <option value={location} key={location} />
                ))}
            </datalist>
            <ButtonGroup>
                <Back onClick={() => setCurrentPage('WeatherCard')}>返回</Back>
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        </WeatherSettingWrapper>
    )
};

export default WeatherSetting;