import * as todoListSelectors from "./selectors";
import * as tasksActions from "./reducers/actions/tasks-actions";
import * as todoListsAsyncActions from "./reducers/actions/todoLists-actions";
import {slice} from "./reducers/todoLists-reducer";
import { TodoListsList } from "./TodoListsList";


const todoListsActions = {
    ...todoListsAsyncActions,
    ...slice.actions,
};


export {
    todoListSelectors,
    tasksActions,
    todoListsActions,
    TodoListsList,
};