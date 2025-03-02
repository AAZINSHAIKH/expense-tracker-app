import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Card, Title, Paragraph } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);

  // Load expenses every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadExpenses = async () => {
        let storedExpenses = await AsyncStorage.getItem("expenses");
        console.log("Stored Expenses:", storedExpenses);
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
      };
      loadExpenses();
    }, [])
  );

  // Reset all expenses
  const resetExpenses = async () => {
    await AsyncStorage.removeItem("expenses");
    setExpenses([]);
    console.log("Expenses reset!");
  };

  return (
    <View style={styles.container}>
      <Title style={styles.total}>
        Total Spent: ${expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2)}
      </Title>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noExpenses}>No expenses found</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.title}</Title>
              <Paragraph>Amount: ${item.amount}</Paragraph>
              <Paragraph>Category: {item.category}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      <Button title="Add Expense" onPress={() => navigation.navigate("Add Expense")} />
      <Button title="Reset Expenses" onPress={resetExpenses} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  noExpenses: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
  card: { marginBottom: 10, padding: 10 },
});
