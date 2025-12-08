import { NextResponse } from 'next/server';
import { initialOrganizations } from '@/data/organizations';
import { Organization } from '@/domain/types';

// In-memory store for demonstration purposes
// Note: This will reset when the server restarts
let organizations: Organization[] = [...initialOrganizations];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(organizations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const newOrganization: Organization = {
      id: (organizations.length + 1).toString(),
      name: body.name,
      category: body.category,
      description: body.description || '',
      tags: [body.category, 'Verified'], // Default tags
      website: body.website || '',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80', // Default image
      verified: false,
    };

    organizations.unshift(newOrganization); // Add to beginning of list

    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
