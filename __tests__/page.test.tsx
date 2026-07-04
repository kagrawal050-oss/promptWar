import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the hero section correctly', () => {
    render(<Home />)
    
    // Check main heading
    expect(screen.getByText('Discover Your Next Destination')).toBeInTheDocument()
    
    // Check subtitle
    expect(screen.getByText(/Let our intelligent engine craft the perfect itinerary/i)).toBeInTheDocument()
    
    // Check CTA button
    expect(screen.getByRole('link', { name: /Get Started/i })).toHaveAttribute('href', '/planner')
  })

  it('renders the features section', () => {
    render(<Home />)
    
    expect(screen.getByText('Smart Itineraries')).toBeInTheDocument()
    expect(screen.getByText('Hidden Gems')).toBeInTheDocument()
    expect(screen.getByText('Beautiful Memories')).toBeInTheDocument()
  })
})
