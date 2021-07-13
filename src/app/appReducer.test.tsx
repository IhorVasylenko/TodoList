import {actionsForApp, AppInitialStateType, appReducer} from "./appReducer";


let startState: AppInitialStateType;
beforeEach (() => {
    startState = {
        status: "idle",
        error: null,
        addingTodoList: false,
    };
});


test('correct error message should be set', () => {
    const endState = appReducer(startState, actionsForApp.setAppError("some error"));

    expect(endState.error).toBe("some error");
});

test('correct status should be set', () => {
    const endState = appReducer(startState, actionsForApp.setAppStatus("failed"));

    expect(endState.status).toBe("failed");
});