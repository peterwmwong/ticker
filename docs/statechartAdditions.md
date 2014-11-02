## Parameterized States and `reenter`

Parameterized States are different than usual states in that they can be
(1) exited and (2) reentered with (3) a different context.

Currently, states are parameterized not by any configuration option, but how the
state is visited.  Using the `force` flag with `goto`
(ex. `goto('.', {force: true})`) allows the state to be reentered with an optional
context.

### Problems with current solution

(See `/spec/helpers/statechart_issues_specs.js` for specs exposing these issues)

1. All ancestors are reentered (see testcase)
  - Maybe unintuitive and lead to unintended side-effects
    - ex. An ancestor state that creates a new model.  This ancestor state may
          not even be seen by the author of the `goto('.',{force:true})` as it
          maybe in a different file or far away at the top of the file. Reentry
          would cause the unseen ancestor state to create another model.
1. `exit`'s are not called, (1) not satisfied (see testcase)
  - This could be a problem if a state's `enter` allocates and the `exit` does
    cleanup...

### Proposed solution: `reenter`

`reenter` solves the 2 problems above by only affecting the state being reentered
and calling `exit`. Specifically, a reentry is...

1. `exit()`
2. `attrs` initialized
3. `enter()`

Example:

    ```coffee
    sc = new StateChart
      attrs:
        'parentVal':({val})->val
      states:
        'child':
          attrs:
            'childVal':({val})->val
          events:
            'reenterEvent':(val)->reenter {val}

    sc.goto 'child', val:5
    expect(sc.attrs).toEqual parentVal: 5, childVal: 5

    sc.fire 'reenterEvent', 777
    expect(sc.attrs).toEqual parentVal: 5, childVal: 777
    ```
