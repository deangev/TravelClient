export const updateUserData = (userData) => {
    return {
        type: "UPDATE_USER_DATA",
        payload: userData,
    };
};

export const initialUpdateVacations = (vacations) => {
    return {
        type: "INITIAL_UPDATE_VACATIONS",
        payload: vacations,
    };
};

export const createVacation = (vacation) => {
    return {
        type: "CREATE_VACATION",
        payload: vacation,
    };
};

export const removeVacation = (id) => {
    return {
        type: "REMOVE_VACATION",
        payload: id,
    };
};

export const editVacation = (vacation) => {
    return {
        type: "EDIT_VACATION",
        payload: vacation,
    };
};

export const initialSetFollows = (vacations) => {
    return {
        type: "INITIAL_SET_FOLLOWS",
        payload: vacations,
    };
};

export const followVacation = (vacationId) => {
    return {
        type: "FOLLOW_VACATION",
        payload: vacationId,
    };
};

export const filterVacations = (input) => {
    return {
        type: "FILTER_VACATIONS",
        payload: input,
    };
};

export const clearInput = () => {
    return {
        type: "CLEAR_INPUT",
        payload: '',
    };
};