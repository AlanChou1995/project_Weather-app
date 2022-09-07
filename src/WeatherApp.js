import {
  Container,
  WeatherCard,
  Location,
  Description,
  CurrentWeather,
  Temperature,
  Celsius,
  AirFlow,
  Rain,
  Redo,
} from './styled';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RedoIcon } from './images/refresh.svg';
import WeatherIcon from './weatherIcon';
import sunriseAndSunsetData from './sunrise-sunset.json';

const fetchCurrentWeather = async () => {
  const response = await fetch(
    'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-E0314E01-F327-43E7-ACBA-02841E5CFFEB&locationName=高雄');
  const data = await response.json();
  const locationData = data.records.location[0];
  const weatherElements = locationData.weatherElement.reduce(
    (neededElements, item) => {
      if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
        neededElements[item.elementName] = item.elementValue;
      }
      return neededElements;
    },
    {});
  return {
    observationTime: locationData.time.obsTime,
    locationName: locationData.locationName,
    temperature: weatherElements.TEMP,
    windSpeed: weatherElements.WDSD,
    humid: weatherElements.HUMD,
  };
};

const fetchWeatherForecast = async () => {
  const response = await fetch(
    'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-E0314E01-F327-43E7-ACBA-02841E5CFFEB&locationName=高雄市');
  const data = await response.json();
  const locationData = data.records.location[0];
  const weatherElements = locationData.weatherElement.reduce(
    (neededElements, item) => {
      if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
        neededElements[item.elementName] = item.time[0].parameter;
      }
      return neededElements;
    },
    {});
  return {
    description: weatherElements.Wx.parameterName,
    weatherCode: weatherElements.Wx.parameterValue,
    rainPossibility: weatherElements.PoP.parameterName,
    comfortability: weatherElements.CI.parameterName,
  };
};

const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const WeatherApp = () => {
  console.log('--- invoke function component ---');
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast(),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
      });
    };

    fetchingData();
  }, []);

  const moment = useMemo(() => getMoment(weatherElement.locationName), [
    weatherElement.locationName,
  ]);

  useEffect(() => {
    console.log('execute function in useEffect');

    fetchData();
  }, [fetchData]);

  return (
    <Container>
      {console.log('render')}
      <WeatherCard>
        <Location>{weatherElement.locationName}</Location>
        <Description>
          {weatherElement.description} {weatherElement.comfortability}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(weatherElement.temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon
            currentWeatherCode={weatherElement.weatherCode}
            moment={moment || 'day'}
          />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {Math.round(weatherElement.rainPossibility)} %
        </Rain>
        <Redo onClick={fetchData}>
          最後觀測時間：
          {new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(weatherElement.observationTime))}{' '}
          <RedoIcon />
        </Redo>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
