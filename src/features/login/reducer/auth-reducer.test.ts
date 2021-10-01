import {authReducer, setIsLoggedIn} from "./auth-reducer";

let startState: { isLoggedIn: boolean };

beforeEach(() => {
    startState = {
        isLoggedIn: false,
    };
});

test("status task should be changed", () => {
    const action = setIsLoggedIn(true);

    const endState = authReducer(startState, action);

    expect(endState.isLoggedIn).toBe(true);
});