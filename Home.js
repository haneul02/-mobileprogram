import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'; // Updated import
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const navigation = useNavigation();

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    loadCalorieData(day.dateString);  // 선택한 날짜의 칼로리 데이터 로드
  };

  const loadCalorieData = async (date) => {
    if (!date || date === '') {
      console.warn("Invalid date provided.");
      return;
    }
    
    try {
      const existingDataString = await AsyncStorage.getItem(date);
      if (existingDataString) {
        const existingData = JSON.parse(existingDataString);
        if (existingData.totalCalories) {
          setTotalCalories(existingData.totalCalories);
        } else {
          setTotalCalories(0);  // 데이터가 없으면 0으로 설정
        }
      } else {
        setTotalCalories(0);  // 데이터가 없으면 0으로 설정
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#bbdddd' },
        }}
        current={today}
        monthFormat={'yyyy년 MM월'}
      />
      <View style={styles.buttonContainer} />
      <View style={styles.buttonContainer} />
      <View style={styles.buttonContainer} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonWrapper} // Apply border styles to create a border
          onPress={() => navigation.navigate('Calculator', { selectedDate })}
        >
          <Text style={styles.buttonText}>칼로리 계산</Text>
        </TouchableOpacity>
      </View>

      {selectedDate && (
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesText}>총 칼로리: {totalCalories} 칼로리</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', //배경색을 하얀색으로 설정
    marginTop: 0, //0으로 설정하여 상단에 여백이 없도록
  },
  buttonContainer: {
    alignItems: 'center', // 가로 방향으로 중앙에 정렬
    marginTop: 20, // 스타일이 적용된 요소 위에 20의 여백
  },
  buttonWrapper: {
    borderWidth: 1, //테두리 두께
    borderColor: '#336699', //테두리 색상
    borderRadius: 5, //테두리 모서리 둥글게
    overflow: 'hidden', //모서리가 둥글 때 안쪽 내용이 넘치지 않도록
    padding: 10, 
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#336699', 
  },
  caloriesContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1,
  },
  caloriesText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Home;
