import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from '../pages/index'

// Mock WebSocket
global.WebSocket = class WebSocket {
  constructor() {
    this.readyState = 1
  }
  send() {}
  close() {}
}

describe('Industrial Dashboard', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />)
    const title = screen.getByText(/Industrial Monitoring Dashboard/i)
    expect(title).toBeInTheDocument()
  })

  test('shows connection status', () => {
    render(<Dashboard />)
    const status = screen.getByText(/Connected|Disconnected/i)
    expect(status).toBeInTheDocument()
  })
})
