import { NextResponse } from "next/server";

interface PetInfo {
  petName: string;
  petType: string;
  petAge: string;
  petColor: string;
  ownerName: string;
  phone: string;
  email: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chipNumber = searchParams.get("chipNumber");

  // Demo data
  const demoPets: Record<string, PetInfo> = {
    "123456789012345": {
      petName: "Max",
      petType: "Golden Retriever",
      petAge: "4 years",
      petColor: "Golden",
      ownerName: "Jennifer Thompson",
      phone: "(555) 123-4567",
      email: "jennifer.thompson@email.com",
    },
    "987654321098765": {
      petName: "Luna",
      petType: "Siamese Cat",
      petAge: "2 years",
      petColor: "Cream & Brown",
      ownerName: "Carlos Rodriguez",
      phone: "(555) 987-6543",
      email: "carlos.rodriguez@email.com",
    },
  };

  if (chipNumber && demoPets[chipNumber]) {
    return NextResponse.json({ found: true, result: demoPets[chipNumber] });
  }

  return NextResponse.json({ found: false });
}
