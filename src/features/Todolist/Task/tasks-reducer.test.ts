import {v1} from "uuid";
import {TaskStateType} from "../../../app/App";
import {TaskPriority, TaskStatuses, TodolistType} from "../../../api/types";
/*
import {addTask, fetchTasks, removeTask, updateTask} from "./tasks-actions";
import {fetchTodolists} from "../todolists-actions";

let todolistId1: string
let todolistId2: string
let startState: TaskStateType

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = {
        [todolistId1]: [
        {
            id: '1', title: 'HTML&CSS1', description: '',
            todoListId: todolistId1, order: 0, status: 1,
            priority: TaskPriority.Low,startDate: '',
            deadline: '', addedDate: ''
        },
        {
            id: '2', title: 'HTML&CSS2', description: '',
            todoListId: todolistId1, order: 0, status: 1,
            priority: TaskPriority.Low,startDate: '',
            deadline: '', addedDate: ''}
        ],
        [todolistId2]: [
        {
            id: '3', title: 'test 1', description: '',
            todoListId: todolistId2, order: 0, status: 1,
            priority: TaskPriority.Low,startDate: '',
            deadline: '', addedDate: ''
        },
        {
            id: '4', title: 'test 2', description: '',
            todoListId: todolistId2, order: 0, status: 1,
            priority: TaskPriority.Low,startDate: '',
            deadline: '', addedDate: ''
        }
        ]
    }
})

test('correct task should be added', ()=>{

    const newTask = {
        id: v1(), title: 'NEW', description: '', todoListId: todolistId1,
        order: 0, status: 1, priority: TaskPriority.Low,
        startDate: '', deadline: '', addedDate: ''
    }
    const action = addTask.fulfilled(newTask, 'requestId', {title: newTask.title, todolistId: newTask.todoListId})

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(3)
    expect(endState[todolistId2].length).toBe(2)
    expect(endState[todolistId1][0].title).toBe('NEW')
    expect(endState[todolistId1][0].id).toBeDefined()
})

test('correct task should be removed', ()=>{

    const param = {todolistId: todolistId1, taskId: '1'};
    const action = removeTask.fulfilled(param, '', param)

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(1)
    expect(endState[todolistId2].length).toBe(2)
    expect(endState[todolistId1].every(t=>t.id!='1')).toBeTruthy()
})

test('correct task should be change status', ()=>{

    const updateModel = {taskId: '2', todolistId: todolistId1, domainModel: {status: TaskStatuses.Completed}};
    const endState = tasksReducer(startState, updateTask.fulfilled(updateModel, 'requestId', updateModel))

    expect(endState[todolistId1].length).toBe(2)
    expect(endState[todolistId1][0].status).toBe(TaskStatuses.InProgress)
    expect(endState[todolistId1][1].status).toBe(TaskStatuses.Completed)
})

test('correct task should be change title', ()=>{

    const updateModel = {taskId: '1', todolistId: todolistId1, domainModel: {title: 'new title'}};
    const endState = tasksReducer(startState, updateTask.fulfilled(updateModel, "requestId", updateModel))

    expect(endState[todolistId1].length).toBe(2)
    expect(endState[todolistId2][0].title).toBe('test 1')
    expect(endState[todolistId1][0].title).toBe('new title')
})

test('empty arrays should be added when we set todolists', ()=>{

    const todolists: Array<TodolistType> = [
        {id: '1', title: 'HTML&CSS', addedDate: '', order: 0},
        {id: '2', title: 'HTML&CSS', addedDate: '', order: 0}
    ]

    const endState = tasksReducer({}, fetchTodolists.fulfilled({todolists: todolists}, "requestId"))

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolists', ()=>{

    const emptyTodolists = {
        'todolistId1': [],
        'todolistId2': []
    }
    const tasks = startState[todolistId1]

    const action = fetchTasks.fulfilled({tasks: tasks, todolistId: todolistId1}, '', todolistId1)

    const endState = tasksReducer(emptyTodolists, action)

    expect(endState[todolistId1].length).toBe(2)
})*/
