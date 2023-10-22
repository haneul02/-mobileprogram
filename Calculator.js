import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import calorieData from '../Dataroom/calorieData';

const Calculator = ({ navigation, route }) => {
  const [foodItem, setFoodItem] = useState(''); // 입력된 음식 항목
  const [mealTime, setMealTime] = useState(''); // 선택된 식사 시간
  const [breakfastCalories, setBreakfastCalories] = useState(0); // 아침 칼로리
  const [lunchCalories, setLunchCalories] = useState(0); // 점심 칼로리
  const [dinnerCalories, setDinnerCalories] = useState(0); // 저녁 칼로리
  const [totalCalories, setTotalCalories] = useState(0); // 총 칼로리
  const [foodLog, setFoodLog] = useState([]); // 음식 로그
  const [selectedMeal, setSelectedMeal] = useState(''); // 현재 선택된 식사
  const selectedDate = route.params.selectedDate; // 선택된 날짜

  const calculateCalories = () => {
    const selectedFood = calorieData.find((item) => item.food === foodItem);
    if (selectedFood) {
      const foodCalories = selectedFood.calories;

      if (foodCalories > 0 && selectedMeal) {
        let mealCalories = 0;
        if (selectedMeal === '아침') {
          mealCalories = breakfastCalories;
          setBreakfastCalories(breakfastCalories + foodCalories);
        } else if (selectedMeal === '점심') {
          mealCalories = lunchCalories;
          setLunchCalories(lunchCalories + foodCalories);
        } else if (selectedMeal === '저녁') {
          mealCalories = dinnerCalories;
          setDinnerCalories(dinnerCalories + foodCalories);
        }

        const entry = {
          food: foodItem,
          calories: foodCalories,
          meal: selectedMeal,
          mealCalories: mealCalories,
        };

        setFoodLog([...foodLog, entry]);

        setTotalCalories(totalCalories + foodCalories);
      }

      setFoodItem('');
      setMealTime('');
    }
  };

  const deleteEntry = (index) => {
    const deletedEntry = foodLog[index];
    const updatedLog = foodLog.filter((entry, i) => i !== index);
    setFoodLog(updatedLog);

    if (deletedEntry.meal === '아침') {
      setBreakfastCalories(breakfastCalories - deletedEntry.calories);
    } else if (deletedEntry.meal === '점심') {
      setLunchCalories(lunchCalories - deletedEntry.calories);
    } else if (deletedEntry.meal === '저녁') {
      setDinnerCalories(dinnerCalories - deletedEntry.calories);
    }
    setTotalCalories(totalCalories - deletedEntry.calories);
  };

  const saveData = async () => {
    try {
      const existingDataString = await AsyncStorage.getItem(selectedDate);
      const existingData = JSON.parse(existingDataString) || {};

      existingData.breakfastCalories = breakfastCalories;
      existingData.lunchCalories = lunchCalories;
      existingData.dinnerCalories = dinnerCalories;
      existingData.totalCalories = totalCalories;
      existingData.foodLog = foodLog;

      await AsyncStorage.setItem(selectedDate, JSON.stringify(existingData));

      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(selectedDate);

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setBreakfastCalories(parsedData.breakfastCalories);
          setLunchCalories(parsedData.lunchCalories);
          setDinnerCalories(parsedData.dinnerCalories);
          setTotalCalories(parsedData.totalCalories);
          setFoodLog(parsedData.foodLog);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [selectedDate]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="음식 항목"
        value={foodItem}
        onChangeText={(text) => setFoodItem(text)}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="아침"
          onPress={() => {
            setMealTime('아침');
            setSelectedMeal('아침');
          }}
          color={selectedMeal === '아침' ? 'blue' : 'gray'}
        />
        <Button
          title="점심"
          onPress={() => {
            setMealTime('점심');
            setSelectedMeal('점심');
          }}
          color={selectedMeal === '점심' ? 'blue' : 'gray'}
        />
        <Button
          title="저녁"
          onPress={() => {
            setMealTime('저녁');
            setSelectedMeal('저녁');
          }}
          color={selectedMeal === '저녁' ? 'blue' : 'gray'}
        />
      </View>
      <Button title="칼로리 계산" onPress={calculateCalories} />
      <Text style={styles.caloriesText}>
        아침 칼로리: {breakfastCalories} 칼로리
      </Text>
      <Text style={styles.caloriesText}>
        점심 칼로리: {lunchCalories} 칼로리
      </Text>
      <Text style={styles.caloriesText}>
        저녁 칼로리: {dinnerCalories} 칼로리
      </Text>

      <Text style={styles.logTitle}></Text>
      {foodLog.map((entry, index) => (
        <View key={index} style={styles.logEntry}>
          <Text>
            {entry.food} - {entry.calories} 칼로리 ({entry.meal})
          </Text>
          <TouchableOpacity onPress={() => deleteEntry(index)} style={styles.deleteButton}>
            <Text style={{ color: '#FF3399' }}>삭제</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="저장" onPress={saveData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 10,
  },
  caloriesText: {
    fontSize: 18,
    marginTop: 20,
  },
  logTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  logEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF3399',
    padding: 5,
    borderRadius: 5,
  },
});

export default Calculator; 