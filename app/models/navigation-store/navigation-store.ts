import { types } from "mobx-state-tree"
import { RootNavigator } from "../../navigation/root-navigator"
import { NavigationActions, NavigationAction } from "react-navigation"
import { NavigationEvents } from "./navigation-events"

const DEFAULT_STATE = RootNavigator.router.getStateForAction(NavigationActions.init(), null)

/**
 * Finds the current route.
 *
 * @param navState the current nav state
 */
function findCurrentRoute(navState) {
  const route = navState.routes[navState.index]
  if (route.routes) {
    return findCurrentRoute(route)
  }
  return route
}

/**
 * Tracks the navigation state for `react-navigation` as well as providers
 * the actions for changing that state.
 */
export const NavigationStoreModel = NavigationEvents.named("NavigationStore")
  .props({
    /**
     * the navigation state tree (Frozen here means it is immutable.)
     */
    state: types.optional(types.frozen(), DEFAULT_STATE),
  })
  .views(self => ({
    /**
     * Gets the current route.
     */
    get currentRoute() {
      return findCurrentRoute(self.state)
    },
  }))
  .actions(self => ({
    /**
     * Return all subscribers
     */
    actionSubscribers() {
      return self.subs
    },
    /**
     * Fires when navigation happens.
     *
     * Our job is to update the state for this new navigation action.
     *
     * @param action The new navigation action to perform
     * @param shouldPush Should we push or replace the whole stack?
     */
    dispatch(action: NavigationAction, shouldPush: boolean = true) {
      const previousNavState = shouldPush ? self.state : null
      self.state = RootNavigator.router.getStateForAction(action, previousNavState) || self.state
      self.fireSubscribers(action, previousNavState, self.state)
      return true
    },

    /**
     * Resets the navigation back to the start.
     */
    reset() {
      self.state = DEFAULT_STATE
    },

    /**
     * Finds the current route.
     */
    findCurrentRoute() {
      return findCurrentRoute(self.state)
    },
  }))
  .preProcessSnapshot(snapshot => {
    // only if we have a valid .state to check
    if (!snapshot || !Boolean(snapshot.state)) return snapshot

    try {
      // will react-navigation be ok?
      RootNavigator.router.getPathAndParamsForState(snapshot.state)
      // snapshot is valid, let's go.
      return snapshot
    } catch (e) {
      // fallback to initial state
      return { ...snapshot, state: DEFAULT_STATE }
    }
  })

export type NavigationStore = typeof NavigationStoreModel.Type
