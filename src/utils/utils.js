import { useEffect, useRef } from 'react';
import { playerImageData } from '../constants/player-image-data';
import { Dimensions, Platform } from 'react-native';

export const { height, width } = Dimensions.get('window');
export const responsiveHeight = (h) => height * (h / 100);
export const responsiveWidth = (w) => width * (w / 100);

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const parseDate = (input) => {
  return new Date(input);
};

export const dayToShow = (date, timezone) => {
  const selectedLocales =
    timezone.includes('Asia') && timezone.includes('America');
  const day = parseDate(date).getDate();
  const month = parseDate(date).getMonth() + 1;
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return day === today && month === currentMonth && selectedLocales
    ? `Today`
    : ((day === today + 1 && month === currentMonth) ||
        month === currentMonth + 1) &&
      selectedLocales
    ? `Tomorrow`
    : ((day === today - 1 && month === currentMonth) ||
        month === currentMonth - 1) &&
      selectedLocales
    ? `Yesterday`
    : days[parseDate(date).getDay()];
};

export const teamLogo = (id, team) => {
  if (id === 13) {
    return `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`;
  } else {
    return `https://cdn.statmuse.com/img/nba/teams/nba_${team
      .replace(/ /g, '_')
      .toLowerCase()}_secondary.png`;
  }
};

export const genericPlayerImage = (string) => {
  if (string === 'LA Clippers') {
    return 'https://cdn.statmuse.com/img/nba/teams/Los-Angeles-Clippers-Silhouette.png';
  } else if (string === 'Portland Trail Blazers') {
    return 'https://cdn.statmuse.com/img/nba/teams/Portland-Trailblazers-Silhouette.png';
  } else if (string === 'Chicago Bulls') {
    return 'https://cdn.statmuse.com/img/nba/teams/chicago-bulls-silhouette.png';
  } else {
    string = string.replace(/\s+/g, '-');
    return `https://cdn.statmuse.com/img/nba/teams/${string}-Silhouette.png`;
  }
};

export const findPlayerImage = (id) => {
  const player = playerImageData.find((p) => p.id === id);
  return player ? player.image : null;
};

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const groupBy = (arr, prop) => {
  const map = new Map(Array.from(arr, (obj) => [obj[prop], []]));
  arr.forEach((obj) => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
};
