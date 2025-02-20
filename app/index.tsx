import React, { useEffect, useState } from "react";
import { View, FlatList, Modal, StyleSheet } from "react-native";
import { Text, Snackbar, IconButton, Button } from "react-native-paper";
import AppButton from "@/componets/Button";
import Input from "@/componets/Input";
import { createTask, deleteTask, getTasks, updateTask } from "@/constant/task.api";
import { getToken, removeToken } from "@/utils/storage";
import { router } from "expo-router";
import Loader from "@/componets/Loader";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("authToken");
      if (!token) {
        router.replace("/login");
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!title || !description) {
      setSnackbarMessage("Title and Description are required!");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      if (selectedTaskId) {
        await updateTask(selectedTaskId, { title, description });
      } else {
        await createTask({ title, description });
      }
      setTitle("");
      setDescription("");
      setSelectedTaskId(null);
      fetchTasks();
      setSnackbarMessage("Task saved successfully!");
    } catch (error) {
      setSnackbarMessage("Error saving task!");
    } finally {
      setLoading(false);
      setSnackbarVisible(true);
    }
  };

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteModalVisible(true);
  };

  const handleDeleteTask = async () => {
    setLoading(true);
    try {
      if (taskToDelete) {
        await deleteTask(taskToDelete);
        fetchTasks();
        setSnackbarMessage("Task deleted!");
      }
    } catch (error) {
      setSnackbarMessage("Error deleting task!");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setTaskToDelete(null);
      setSnackbarVisible(true);
    }
  };

  const renderTaskForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>
        {selectedTaskId ? "Edit Task" : "New Task"}
      </Text>
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input 
        label="Description" 
        value={description} 
        onChangeText={setDescription}
      />
      <AppButton 
        disabled={loading} 
        title={selectedTaskId ? "Update Task" : "Add Task"} 
        onPress={handleSaveTask} 
      />
    </View>
  );

  const renderTaskList = () => (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }: any) => (
          <View style={styles.taskCard}>
            <View style={styles.taskDetails}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
            <View style={styles.iconContainer}>
              <IconButton 
                icon="pencil" 
                size={20}
                onPress={() => { 
                  setTitle(item.title); 
                  setDescription(item.description); 
                  setSelectedTaskId(item._id); 
                }} 
              />
              <IconButton 
                icon="delete" 
                size={20}
                onPress={() => confirmDeleteTask(item._id)} 
              />
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
        <Button mode="contained" onPress={removeToken} style={styles.logoutButton}>
          Logout
        </Button>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.centeredForm}>
          {renderTaskForm()}
        </View>
      ) : (
        <View style={styles.splitContainer}>
          {renderTaskForm()}
          {renderTaskList()}
        </View>
      )}

      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <Button mode="contained-tonal" onPress={() => setDeleteModalVisible(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleDeleteTask}>
                Delete
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar 
        visible={snackbarVisible} 
        onDismiss={() => setSnackbarVisible(false)} 
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
  },
  centeredForm: {
    flex: 1,
    justifyContent: "center",
  },
  splitContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Index;