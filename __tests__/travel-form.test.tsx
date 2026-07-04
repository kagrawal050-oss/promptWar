import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TravelForm } from '@/components/planner/travel-form'
import { useRouter } from 'next/navigation'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('TravelForm', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('renders correctly', () => {
    render(<TravelForm />)
    
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Travel Style/i)).toBeInTheDocument()
    
    // Check if interest buttons are rendered
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Culture')).toBeInTheDocument()
  })

  it('shows validation errors for empty destination', async () => {
    render(<TravelForm />)
    
    // Just submit without filling required destination
    fireEvent.click(screen.getByRole('button', { name: /Generate Itinerary/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Destination must be at least 2 characters/i)).toBeInTheDocument()
    })
    
    // Also requires at least one interest by default
    await waitFor(() => {
      expect(screen.getByText(/Select at least one interest/i)).toBeInTheDocument()
    })
    
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('submits correctly when valid', async () => {
    render(<TravelForm />)
    
    fireEvent.change(screen.getByLabelText(/Destination/i), { target: { value: 'Paris' } })
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '5' } })
    
    // Select an interest
    fireEvent.click(screen.getByText('Food'))
    
    fireEvent.click(screen.getByRole('button', { name: /Generate Itinerary/i }))
    
    // Wait for validation and mock delay (1500ms)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    }, { timeout: 2000 })
    
    // Check URL parameters
    const calledUrl = mockPush.mock.calls[0][0]
    expect(calledUrl).toContain('destination=Paris')
    expect(calledUrl).toContain('duration=5')
    expect(calledUrl).toContain('interests=Food')
  })
})
