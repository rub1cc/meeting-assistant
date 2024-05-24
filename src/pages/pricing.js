import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuestNav } from "@/components/guest-nav";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/user-nav";
import { useQuery } from "@tanstack/react-query";

const plans = [
  {
    title: "Free",
    description: "Get started with our free plan.",
    price: "Rp. 0",
    benefits: [
      "Try 30 minutes of transcription and summary",
      "Basic MoM template",
    ],
  },
];

export default function Page() {
  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <Breadcrumbs
          paths={[
            {
              label: "Pricing",
            },
          ]}
        />
        <div className="flex gap-4 items-center">
          <UserNav />
        </div>
      </div>
      <main className="w-full max-w-[70ch] mx-auto mt-8 px-4 lg:px-0">
        <div className="text-center">
          <h1 className="pb-4 text-4xl font-bold">Pricing</h1>
          <p className="text-neutral-500">Choose a plan that works for you.</p>
        </div>
        <div className="mt-16 space-y-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className="p-8 flex flex-col items-start gap-4 max-w-[40ch] w-full mx-auto"
            >
              <div>
                <h2 className="font-semibold text-2xl">{plan.title}</h2>
                <p className=" text-neutral-500">{plan.description}</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {plan.price}{" "}
                  <span className="font-normal text-sm">/month</span>
                </p>
                <ul className="space-y-2 mt-8">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <Icons.check className="w-6 h-6 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <Button size="xl" className="w-full mt-4" disabled>
                Current plan
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
