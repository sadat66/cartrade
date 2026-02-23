import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PromoCards() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Instant Cash Offer</CardTitle>
              <CardDescription className="mt-1.5">
                Receive an immediate, no-obligation offer for your car in
                minutes. Get a fair price and sell when you&apos;re ready.
              </CardDescription>
            </div>
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=224&q=80)",
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Rego"
                className="max-w-[140px]"
                aria-label="Registration number"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Offer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                Browse Local Dealerships
              </CardTitle>
              <CardDescription className="mt-1.5">
                Find dealerships near you and browse their inventory. Compare
                prices and book a test drive.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/dealerships">Find Dealerships</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
