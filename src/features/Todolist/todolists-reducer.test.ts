import {v1} from "uuid";
import {
    changeTodolistEntityStatus,
    changeTodolistFilter, TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";
import {addTodolist, changeTodolistTitle, fetchTodolists, removeTodolist} from "./todolists-actions";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'test_1', addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: todolistId2, title: 'test_2', addedDate: '', order: 0, filter: "all", entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolist.fulfilled({todolistId: todolistId1}, "requestId", todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {

    const newTodolist = {id: 'todolistId3', title: 'NEW', addedDate: '', order: 0, filter: "all"}

    const endState = todolistsReducer(startState, addTodolist.fulfilled({todolist: newTodolist}, "requestId", newTodolist.title))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe('NEW')
})

test('correct todolist should be changed title', () => {

    const endState = todolistsReducer(startState, changeTodolistTitle.fulfilled({todolistId: todolistId2, title: 'new title'}, "requestId", {id: todolistId2, title: 'new title'}))

    expect(endState.length).toBe(2)
    expect(endState[1].title).toBe('new title')
})

test('correct todolist changed filter', () => {

    const endState = todolistsReducer(startState, changeTodolistFilter({value: "completed", todolistId: todolistId2}))

    expect(endState.length).toBe(2)
    expect(endState[1].filter).toBe('completed')
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should be set to the state', () => {

    let payload = {
        todolists: [
            {id: '1', title: 'test_1', order: 0, addedDate: '',},
            {id: '2', title: 'test_2', order: 0, addedDate: '',}
        ]
    }

    const endState = todolistsReducer([], fetchTodolists.fulfilled(payload, "requestId"))

    expect(endState.length).toBe(2)
})

test('correct entity status should be changed', () => {

    const endState = todolistsReducer(startState, changeTodolistEntityStatus({id: todolistId2, status: "loading"}))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe('loading')
})