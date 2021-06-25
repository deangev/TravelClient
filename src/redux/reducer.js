const initialState = {
    userData: {
        token: undefined,
        firstName: undefined,
        lastName: undefined,
        id: undefined,
        role: undefined,
    },
    vacations: [],
    following: [],
    filteredVacations: [],
    searchString: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER_DATA':
            return { ...state, userData: action.payload }

        case 'INITIAL_UPDATE_VACATIONS':
            const initialVacations = action.payload
            const followedVacations = []
            const unFollowedVacations = []
            initialVacations.map(v => {
                let isFollowedPush = false
                state.following.map(id => {
                    if (v.id === id) {
                        followedVacations.push(v)
                        isFollowedPush = true
                    }
                    return false
                })
                if (!isFollowedPush) unFollowedVacations.push(v)
                return false
            })
            const orderedVacations = [...followedVacations, ...unFollowedVacations]
            return { ...state, vacations: orderedVacations, filteredVacations: orderedVacations }

        case 'INITIAL_SET_FOLLOWS':
            const vacationsId = action.payload.map(vacation => vacation.vacationId)
            return { ...state, following: vacationsId }

        case 'CREATE_VACATION':
            const isVacationExist = state.vacations.find(v => v.id === action.payload.id)
            if (isVacationExist) return { ...state }
            return {
                ...state,
                vacations: [...state.vacations, action.payload],
                filteredVacations: [...state.filteredVacations, action.payload]
            }

        case 'REMOVE_VACATION':
            const vacationIdToRemove = action.payload
            const remove_filteredVacations = state.vacations.filter(vacation => vacation.id !== vacationIdToRemove)
            return { ...state, vacations: remove_filteredVacations, filteredVacations: remove_filteredVacations }

        case 'EDIT_VACATION':
            const editedVacations = state.vacations.map(v => v.id === action.payload.id ? action.payload : v)
            return { ...state, vacations: editedVacations, filteredVacations: editedVacations }

        case 'FOLLOW_VACATION':
            const { vacationIdToFollow, isFollowed } = action.payload
            const followIndex = state.following.findIndex(item => item === vacationIdToFollow)
            let newFollowArray = state.following
            isFollowed
                ? newFollowArray.splice(followIndex, 1)
                : newFollowArray.push(vacationIdToFollow)

            const newVacationsArray = state.vacations.map(v => (
                v.id === vacationIdToFollow ? { ...v, followers: isFollowed ? v.followers - 1 : v.followers + 1 } : v
            ))
            const followedVacationArray = []
            const unFollowedVacationArray = []
            newVacationsArray.map(v => {
                let isFollowedPush = false
                state.following.map(id => {
                    if (v.id === id) {
                        followedVacationArray.push(v)
                        isFollowedPush = true
                    }
                    return false
                })
                if (!isFollowedPush) unFollowedVacationArray.push(v)
                return false
            })
            const orderedVacationArray = [...followedVacationArray, ...unFollowedVacationArray]

            return { ...state, following: newFollowArray, filteredVacations: orderedVacationArray, vacations: orderedVacationArray }

        case 'FILTER_VACATIONS':
            const inputText = action.payload
            if (!inputText.length) {
                return { ...state, filteredVacations: state.vacations, searchString: inputText }
            } else {
                const newFilteredVacation = state.vacations.filter(vacation => vacation.destination.toLowerCase().includes(inputText.trim().toLowerCase())).map(item => {
                    let destinationHighlight = item.destination.replace(
                        new RegExp(inputText, 'gi'),
                        match => `<mark style="background: #f50057; color: white">${match}</mark>`
                    )
                    return {
                        ...item,
                        destination: destinationHighlight
                    }
                })
                return { ...state, filteredVacations: newFilteredVacation, searchString: inputText }
            }

        case 'CLEAR_INPUT':
            return { ...state, searchString: '', filteredVacations: state.vacations }
        default: break
    }
    return state;
}

export default reducer;