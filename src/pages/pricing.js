import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/user-nav";

const plans = [
  {
    title: "⚫️ Free",
    description: "Get started with our free plan.",
    price: "Rp. 0",
    benefits: [
      "30 minutes credits of transcription and summary every month",
      "Basic MoM template",
      "25 MB file upload limit",
    ],
    period: "Free forever",
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
      <main className="w-full max-w-[70ch] mx-auto mt-8 px-4 lg:px-0 pb-8">
        <div className="text-center">
          <h1 className="pb-4 text-4xl font-bold">Pricing</h1>
          <p className="text-neutral-500">Choose a plan that works for you.</p>
        </div>
        <div className="mt-16 flex gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="max-w-[40ch] w-full mx-auto h-full">
              <div className="p-6">
                <h2 className="font-semibold text-2xl">{plan.title}</h2>
                <p className=" text-neutral-500">{plan.description}</p>
                <p className="text-4xl font-bold mt-8">{plan.price} </p>
                <p className=" text-neutral-500">{plan.period}</p>
              </div>
              <div className="bg-neutral-100 w-full p-4 border-t border-neutral-200 border-b">
                <Button className="w-full rounded-full" size="lg" disabled>
                  Current plan
                </Button>
              </div>
              <ul className="space-y-4 p-6">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span>
                      <Icons.check className="w-6 h-6" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
