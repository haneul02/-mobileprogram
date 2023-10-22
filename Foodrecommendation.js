import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import calorieData from '../Dataroom/calorieData'; // 주신 데이터 파일의 경로를 정확하게 지정해주세요.

const Foodrecommendation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = calorieData.filter(foodItem => foodItem.food.includes(searchQuery));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        placeholder="음식 이름 검색"
        onChangeText={(value) => setSearchQuery(value)}
      />
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.food}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.food}</Text>
            <Text>{item.calories}칼로리</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white', // Add this line
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Foodrecommendation;
