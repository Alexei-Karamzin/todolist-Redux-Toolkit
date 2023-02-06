import {useDispatch} from "react-redux";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";
import {AppDispatchType} from "./types";

export const useAppDispatch = () => useDispatch<AppDispatchType>()
export function useActions<T extends ActionCreatorsMapObject>(action: T) {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(action, dispatch)
    }, [])

    return boundActions
}

