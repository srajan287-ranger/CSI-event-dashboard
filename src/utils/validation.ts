import type { EventItem } from '@/types';

type EventFormData = Partial<EventItem> & {
  speakerName?: string;
  speakerDesignation?: string;
  speakerOrganization?: string;
};

export interface ValidationResult {
  errors: Record<string, string>;
  valid: boolean;
}

export function validateEvent(data: EventFormData): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Event name is required.';
  if (!data.date) errors.date = 'Date is required.';
  if (!data.venue || data.venue.trim().length < 2) errors.venue = 'Venue is required.';
  if (!data.category) errors.category = 'Category is required.';
  if (data.capacity === undefined || data.capacity <= 0)
    errors.capacity = 'Capacity must be greater than 0.';
  if (data.startTime && data.endTime && data.endTime <= data.startTime)
    errors.endTime = 'End time must be after start time.';
  if (
    data.registrations !== undefined &&
    data.capacity !== undefined &&
    data.registrations > data.capacity
  )
    errors.registrations = 'Registrations cannot exceed capacity.';
  if (!data.registrationDeadline) errors.registrationDeadline = 'Registration deadline is required.';
  return { errors, valid: Object.keys(errors).length === 0 };
}
