import React from 'react'
import { MonthTaskPlanner } from './components/Calender/MonthTaskPlanner';
import { TaskProvider } from './context/TaskContext';
const App = () => {
  return (
    <TaskProvider>
      <MonthTaskPlanner/>
    </TaskProvider>
  )
}

export default App;
