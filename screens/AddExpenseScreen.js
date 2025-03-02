import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function AddExpenseScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const addExpense = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const newExpense = { id: Date.now().toString(), title, amount: parseFloat(amount), category };

    try {
      // Load existing expenses
      let storedExpenses = await AsyncStorage.getItem("expenses");
      let expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

      // Add new expense to array
      expenses.push(newExpense);

      // Save updated array to AsyncStorage
      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));

      console.log("Updated Expenses:", expenses); // DEBUG LOG
      Alert.alert("Success", "Expense Added");

      navigation.goBack();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" style={styles.input} onChangeText={setTitle} />
      <TextInput placeholder="Amount" keyboardType="numeric" style={styles.input} onChangeText={setAmount} />

      <Picker selectedValue={category} onValueChange={(value) => setCategory(value)} style={styles.input}>
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Groceries" value="Groceries" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Button title="Add Expense" onPress={addExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});
