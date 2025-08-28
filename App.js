import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  
  const pastelColors = [
    "#FFE5E5",
    "#E5F3FF", 
    "#E5FFE5", 
    "#FFF5E5", 
    "#F0E5FF", 
    "#E5FFFF", 
    "#FFFFE5", 
    "#FFE5F5", 
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("todolist_tasks");
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      Alert.alert("Erro", "Não foi possível carregar as tarefas");
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem("todolist_tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Erro ao salvar tarefas:", error);
      Alert.alert("Erro", "Não foi possível salvar as tarefas");
    }
  };

  const getCardColor = (index) => {
    return pastelColors[index % pastelColors.length];
  };

  const addTask = async () => {
    if (taskText.trim() === "") {
      Alert.alert("Atenção! ", "Por favor, digite uma tarefa");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: taskText.trim(),
      createdAt: new Date().toLocaleString(),
      completed: false,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    setTaskText("");
  };

  const toggleTask = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const removeTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const renderTask = ({ item, index }) => (
    <View style={[styles.taskCard, { backgroundColor: getCardColor(index) }]}>
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskText,
          item.completed && styles.completedTaskText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.taskDate}>📅 {item.createdAt}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => toggleTask(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.completed ? "✓" : "○"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => removeTask(item.id)}
        >
          <Text style={styles.actionButtonText}>✗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Lista de Tarefas</Text>
        <Text style={styles.subtitle}>
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          placeholderTextColor="#999"
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚨</Text>
            <Text style={styles.emptyTitle}>Nenhuma tarefa ainda!</Text>
            <Text style={styles.emptySubtext}>
              Que tal começar adicionando uma nova tarefa? Você pode fazer isso
              no campo acima. Vamos lá!
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#6c5ce7",
    padding: 25,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  taskListContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  taskCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  taskContent: {
    flex: 1,
    marginRight: 15,
  },
  taskText: {
    fontSize: 18,
    color: "#2d3436",
    marginBottom: 8,
    fontWeight: "500",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#636e72",
    opacity: 0.6,
  },
  taskDate: {
    fontSize: 13,
    color: "#636e72",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    width: 35,
    height: 35,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButton: {
    backgroundColor: "#00b894",
  },
  removeButton: {
    backgroundColor: "#e17055",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default App;