import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };
  // Save todos to AsyncStorage whenever todos change
  useEffect(() => {
    AsyncStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  const handleCreateTodo = () => {
    if (title.trim() !== '') {
      const newTodo = { id: Date.now(), title };
      setTodos([...todos, newTodo]);
      setTitle('');
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditingTodoId(id);
      setEditedTitle(todoToEdit.title);
    }
  };

  const handleUpdateTodo = () => {
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodoId ? { ...todo, title: editedTitle } : todo
    );
    setTodos(updatedTodos);
    setEditingTodoId(null);
    setEditedTitle('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter a new task"
      />
      <Button title="Add Task" onPress={handleCreateTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Button
              title="Edit"
              onPress={() => handleEditTodo(item.id)}
              color="#2E86C1"
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteTodo(item.id)}
              color="#E74C3C"
            />
          </View>
        )}
      />

      {editingTodoId !== null && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Edit task"
          />
          <Button title="Update" onPress={handleUpdateTodo} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  todoTitle: {
    flex: 1,
  },
  editContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
  editInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
