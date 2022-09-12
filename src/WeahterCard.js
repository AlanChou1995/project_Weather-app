import {
    Location,
    Description,
    CurrentWeather,
    Temperature,
    Celsius,
    AirFlow,
    Rain,
    Refresh,
    WeatherCardWrapper,
    Cog,
} from './styled'
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RedoIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import WeatherIcon from './weatherIcon';

const WeatherCard = ({ weatherElement, moment, fetchData, setCurrentPage, cityName }) => {
    const {
        observationTime,
        // locationName,
        temperature,
        windSpeed,
        description,
        weatherCode,
        rainPossibility,
        comfortability,
        isLoading,
    } = weatherElement;
    return (
        <WeatherCardWrapper>
            <Cog onClick={() => setCurrentPage('WeatherSetting')} />
            <Location>{cityName}</Location>
            <Description>
                {description} {comfortability}
            </Description>
            <CurrentWeather>
                <Temperature>
                    {Math.round(temperature)} <Celsius>°C</Celsius>
                </Temperature>
                <WeatherIcon
                    currentWeatherCode={weatherCode}
                    moment={moment || 'day'}
                />
            </CurrentWeather>
            <AirFlow>
                <AirFlowIcon />
                {windSpeed} m/h
            </AirFlow>
            <Rain>
                <RainIcon />
                {Math.round(rainPossibility)} %
            </Rain>
            <Refresh onClick={fetchData} isLoading={isLoading}>
                最後觀測時間：
                {new Intl.DateTimeFormat('zh-TW', {
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(observationTime))}{' '}
                {isLoading ? <LoadingIcon /> : <RedoIcon />}
            </Refresh>
        </WeatherCardWrapper>
    )
};

export default WeatherCard;