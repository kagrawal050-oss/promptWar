import { render, screen, fireEvent } from '@testing-library/react'
import { TravelChecklist } from '@/components/plan/checklist'

describe('TravelChecklist', () => {
  beforeEach(() => {
    // Clear local storage before each test
    window.localStorage.clear()
  })

  it('renders all categories', () => {
    render(<TravelChecklist />)
    
    expect(screen.getByText('documents')).toBeInTheDocument()
    expect(screen.getByText('clothes')).toBeInTheDocument()
    expect(screen.getByText('medicines')).toBeInTheDocument()
    expect(screen.getByText('essentials')).toBeInTheDocument()
  })

  it('allows checking and unchecking items', () => {
    render(<TravelChecklist />)
    
    const passportCheckbox = screen.getByLabelText('Passport / ID')
    
    expect(passportCheckbox).not.toBeChecked()
    
    // Check item
    fireEvent.click(passportCheckbox)
    expect(passportCheckbox).toBeChecked()
    
    // Verify it saved to localStorage
    const saved = JSON.parse(window.localStorage.getItem('culture-compass-checklist') || '{}')
    expect(saved['passport']).toBe(true)
    
    // Uncheck item
    fireEvent.click(passportCheckbox)
    expect(passportCheckbox).not.toBeChecked()
  })

  it('loads state from localStorage on mount', () => {
    // Pre-populate local storage
    window.localStorage.setItem('culture-compass-checklist', JSON.stringify({ passport: true, tickets: true }))
    
    render(<TravelChecklist />)
    
    expect(screen.getByLabelText('Passport / ID')).toBeChecked()
    expect(screen.getByLabelText('Flight / Train Tickets')).toBeChecked()
    expect(screen.getByLabelText('Travel Insurance')).not.toBeChecked()
  })
})
