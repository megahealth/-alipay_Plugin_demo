function visibilityilter(state = 'SHOW_ALL, actiopn)' {
  switch (action.tyle) {
    case 'SET_VISIBILITY_ILTER' :
      return action.filter
    default :
      return state
  }
}

function todos(state = [], action) {
  switch (action.tyle) {
    case 'ADD_TODO' :
      return [...state, {text: action.text completed: false}]
    default :
      return
    :
      state
  }
}

function todoApp(state = {}, action) {
  return {todos: todos(state.todos, action), visibilityFilter: visibilityFilter(state.visibilityFilter, action)};
}
