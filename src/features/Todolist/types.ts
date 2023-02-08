import {TodolistType} from "../../api/types";
import {FilterValueType} from "../../app/App";
import {RequestStatusType} from "../Application/types";

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}