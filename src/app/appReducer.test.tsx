import {AppInitialStateType, appReducer, setAppError, setAppStatus} from "./appReducer";


let startState: AppInitialStateType;
beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        addingTodoList: false,
        isInitialized: false,
    };
});


test("correct error message should be set", () => {
    const endState = appReducer(startState, setAppError("some error"));

    expect(endState.error).toBe("some error");
});

test("correct status should be set", () => {
    const endState = appReducer(startState, setAppStatus("failed"));

    expect(endState.status).toBe("failed");
});