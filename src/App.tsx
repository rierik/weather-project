import { SetStateAction, useEffect, useState } from 'react';
import { getFineDust, getShortForecast } from './api';

import './App.css';

interface Item {
  category: string;
  fcstValue: string;
  fcstTime: string;
  // 다른 속성들도 있을 수 있음
}

function App() {
  const [dustGrade, setDustGrade] = useState('');

  const [forecastTime, setForecastTime] = useState<SetStateAction<Array<string> | any>>([]);
  const [weatherDegArr, setWeatherDegArr] = useState<SetStateAction<Array<string> | any>>([]);
  const [skyCondition, setSkyCondition] = useState<SetStateAction<Array<string> | any>>([]);
  const [precipitationType, setPrecipitationType] = useState<SetStateAction<Array<string> | any>>([]);
  const [precipitationProbability, setPrecipitationProbability] = useState<SetStateAction<Array<string> | any>>([]);
  const [onehourPrecipitation, setOnehourPrecipitation] = useState<SetStateAction<Array<string> | any>>([]);
  const [humidity, setHumidity] = useState<SetStateAction<Array<string> | any>>([]);
  const [snowCover, setSnowCover] = useState<SetStateAction<Array<string> | any>>([]);

  useEffect(() => {
    async function getDustGrade() {
      const res = await getFineDust();
      setDustGrade(res.data.response.body.items[0].pm10Grade);
      console.log('re', res.data.response.body.items[0]);
    }
    getDustGrade();

    async function getShortWeatherData() {
      const res = await getShortForecast();
      console.log('resssss', res.data.response.body.items);

      const ddd = {
        예보시각: setForecastTime([...new Set(res.data.response.body.items.item.map((v: Item) => v.fcstTime))]),
        한시간기온: setWeatherDegArr(res.data.response.body.items.item.filter((v: Item) => v.category == 'TMP').map((d: Item) => d.fcstValue)),
        하늘상태: setSkyCondition(res.data.response.body.items.item.filter((v: Item) => v.category == 'SKY').map((d: Item) => d.fcstValue)),
        강수형태: setPrecipitationType(res.data.response.body.items.item.filter((v: Item) => v.category == 'PTY').map((d: Item) => d.fcstValue)),
        강수확률: setPrecipitationProbability(res.data.response.body.items.item.filter((v: Item) => v.category == 'POP').map((d: Item) => d.fcstValue)),
        한시간강수량: setOnehourPrecipitation(res.data.response.body.items.item.filter((v: Item) => v.category == 'PCP').map((d: Item) => d.fcstValue)),
        습도: setHumidity(res.data.response.body.items.item.filter((v: Item) => v.category == 'REH').map((d: Item) => d.fcstValue)),
        눈쌓임: setSnowCover(res.data.response.body.items.item.filter((v: Item) => v.category == 'SNO').map((d: Item) => d.fcstValue)),
      };
    }
    getShortWeatherData();
  }, []);

  // useEffect(() => {
  //   if (shortForecastData) {
  //     setWeatherDegArr(shortForecastData['한시간기온'].map((d: Item) => d.fcstValue));
  //   }
  // }, [shortForecastData]);

  return (
    <>
      {dustGrade && (
        <div>
          {dustGrade == '1'
            ? '미세먼지가 좋음 입니다 :)'
            : dustGrade == '2'
            ? '미세먼지가 보통 입니다 :@'
            : dustGrade == '3'
            ? '미세먼지가 나쁨입니다 :('
            : dustGrade == '4'
            ? '미세먼지가 매우 나쁨입니다. 마스크를 착용하세요 :<'
            : null}
        </div>
      )}
      {forecastTime.map((t: string, i: number) => (
        <div key={i}>{t}</div>
      ))}
      {skyCondition.map((t: string, i: number) => (
        <div key={i}>{t == '1' ? '맑음' : t == '2' ? '구름조금' : t == '3' ? '구름많음' : '흐림'}</div>
      ))}
      <div>
        {weatherDegArr.map((d: string, i: number) => (
          <p key={i}>현재 기온 : {d}</p>
        ))}
      </div>
      {precipitationType.map((t: string, i: number) => (
        <div key={i}>{t == '1' ? '비' : t == '2' ? '비/눈' : t == '3' ? '눈' : t == '4' ? '소나기' : '비 소식 없음'}</div>
      ))}
      {precipitationProbability.map((t: string, i: number) => (
        <div key={i}>강수확률 : {t}%</div>
      ))}
      {onehourPrecipitation.map((t: string, i: number) => (
        <div key={i}>한시간 강수량 : {t}</div>
      ))}
      {humidity.map((t: string, i: number) => (
        <div key={i}>습도 : {t}%</div>
      ))}
      {snowCover.map((t: string, i: number) => (
        <div key={i}>적설 : {t}</div>
      ))}
    </>
  );
}

export default App;
