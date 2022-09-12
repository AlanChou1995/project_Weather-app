//import
import {
  Container,
  theme,
} from './styled';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useMemo } from 'react';
import sunriseAndSunsetData from './sunrise-sunset.json';
import WeatherCard from './WeatherCard';
import useWeatherApi from './useWeatherApi';
import WeatherSetting from './WeatherSetting';
import { findLocation } from './utils';
import dayjs from 'dayjs'


//拉取時間判定day or night
const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );
  if (!location) return null;
  const now = dayjs();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');
  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);
  const sunriseTimestamp = dayjs(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).unix();
  const sunsetTimestamp = dayjs(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).unix();
  const nowTimeStamp = now.unix();
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp ? 'day' : 'night';
};
//
//render
const WeatherApp = () => {
  //
  const storageCity = localStorage.getItem('cityName');
  const [currentTheme, setCurrentTheme] = useState('light')
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentCity, setCurrentCity] = useState(storageCity || '臺北市')
  const currentLocation = findLocation(currentCity) || {};
  // const { locationName } = weatherElement;
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName,
  ]);
  //Custom Hook
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  //
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])
  useEffect(() => {
    localStorage.setItem('cityName', currentCity);
  }, [currentCity])
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />)}
      </Container>
    </ThemeProvider>
  );
};
//
export default WeatherApp;