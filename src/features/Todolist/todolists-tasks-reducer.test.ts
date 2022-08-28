import {TaskStateType} from "../../App/App";
import {tasksReducer} from "./Task/tasks-reducer";
import {addTodolistAC, removeTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {v1} from "uuid";
import {TaskPriority} from "../../api/tasks-api";

test('property with todolistId should be added', () => {
    const startTaskState: TaskStateType = {}
    const startTodolistState: Array<TodolistDomainType> =
        [
            {id: '1', order: 1, title: 'title', addedDate: '', filter: "all", entityStatus: "idle"}
        ]
    const newTodolist = {id: '2', order: 1, title: 'NEW', addedDate: '', filter: "all"}


    const action = addTodolistAC({todolist: newTodolist})
    const endTasksState = tasksReducer(startTaskState, action)
    const endTodolistsState = todolistsReducer(startTodolistState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})

test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        'todolistId1': [
            {
                id: v1(),
                title: "HTML&CSS",
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                status: 1,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ],
        'todolistId2': [
            {
                id: v1(),
                title: "M3",
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                status: 1,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ]
    }

    const action = removeTodolistAC({todolistId: 'todolistId1'})
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId1']).toBeUndefined()
})
