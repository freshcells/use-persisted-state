import React from 'react'
import createPersistedState from '../src'
import { render, fireEvent, cleanup } from '@testing-library/react'

const [usePersistedState, clear] = createPersistedState('test')

afterEach(() => {
  cleanup()
  clear()
})

describe('Integration Tests', () => {
  it('Component should rerender from change to local storage', () => {
    const initialValue = 0
    const testComponentId = 'test_count_component'
    const testButtonId = 'test_count_button'

    const Component = () => {
      const [count] = usePersistedState('count', initialValue)
      return <span data-testid={testComponentId}>{count}</span>
    }
    const TestButton = () => {
      const [, setCount] = usePersistedState('count', initialValue)

      return (
        <button onClick={() => setCount(prev => prev + 1)} data-testid={testButtonId}>
          Test Button
        </button>
      )
    }

    const testComponent = render(<Component />)
    const testButton = render(<TestButton />)

    expect(testComponent.getByTestId(testComponentId).textContent).toBe(String(initialValue))

    fireEvent.click(testButton.getByTestId(testButtonId));

    expect(testComponent
      .getByTestId(testComponentId)
      .textContent
    ).toBe(String(initialValue + 1));
  })
})