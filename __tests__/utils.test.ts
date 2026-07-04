import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes properly', () => {
      const result = cn('bg-red-500', 'text-white', { 'bg-blue-500': true })
      expect(result).toBe('text-white bg-blue-500')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', false && 'hidden', true && 'visible')
      expect(result).toBe('base-class visible')
    })
  })
})
