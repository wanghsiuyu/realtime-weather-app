import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import dayjs from "dayjs";

import { useState, useEffect } from "react";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;
const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;
const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
    animation: rotate 1.5s linear infinite;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const AUTHORIZATION_KEY = "CWB-FA1FBE6F-B278-40FD-8588-C518440E1F18";
const LOCATION_NAME = "臺北";
const LOCATION_NAME_FORECAST = "臺北市";
function App() {
  console.log("invoke function component");
  const [currentTheme, setCurrentTheme] = useState("light");
  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    weatherCode: 0,
    comfort: "",
    isLoading: true,
  });
  const {
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    comfort,
    isLoading,
  } = weatherElement;
  useEffect(() => {
    console.log("execute function in useEffect");
    fetchCurrentWeather();
    fetchWeatherForecast();
  }, []);
  const fetchCurrentWeather = () => {
    setWeatherElement((prevState) => ({ ...prevState, isLoading: true }));
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log("data", data);
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
              //console.log(neededElements,item);
              //{WDSD: '3.5'} {elementName: 'WDSD', elementValue: '3.5'}
              //{WDSD: '3.5', TEMP: '28.8'} {elementName: 'TEMP', elementValue: '28.8'}
            }
            return neededElements;
          },
          {}
        );
        setWeatherElement((prevState) => ({
          ...prevState,
          locationName: locationData.locationName,
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
          observationTime: locationData.time.obsTime,
          isLoading: false,
        }));
      });
  };
  const fetchWeatherForecast = () => {
    setWeatherElement((prevState) => ({ ...prevState, isLoading: true }));
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}
    `)
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
              // console.log(neededElements);
            }
            return neededElements;
          },
          {}
        );
        setWeatherElement((prevState) => ({
          ...prevState,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfort: weatherElements.CI.parameterName,
          isLoading: false,
        }));
      });
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log("render")}
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>
            {description}
            {comfort}
          </Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}
              <Celsius>℃</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {rainPossibility}%
          </Rain>
          <Refresh
            onClick={() => {
              fetchCurrentWeather();
              fetchWeatherForecast();
            }}
            isLoading={isLoading}
          >
            最後觀測時間：
            {new Intl.DateTimeFormat("zh-TW", {
              hour: "numeric",
              minute: "numeric",
            }).format(dayjs(observationTime))}
            {""}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
