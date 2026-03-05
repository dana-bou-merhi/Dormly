import { Zap, CheckCircle, DollarSign } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "24/7 Power Assurance",
    description: "Every listing shows clear details about solar panels, generator capacity, and backup systems. Study without interruption.",
    bgColor: "bg-teal-50",
    iconColor: "bg-teal-600",
  },
  {
    icon: CheckCircle,
    title: "Verified Landlords Only",
    description: "We verify every landlord identity and property ownership. Say goodbye to scams and fake listings.",
    bgColor: "bg-teal-50",
    iconColor: "bg-teal-600",
  },
  {
    icon: DollarSign,
    title: "Full Cost Transparency",
    description: "No hidden fees. See the full breakdown of rent, utility estimates, and deposit requirements upfront.",
    bgColor: "bg-teal-50",
    iconColor: "bg-yellow-400",
  },
];

export default function DormlyFeatures() {
  return (
    <section className="py-5 md:py-15 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Why Students trust Dormly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We prioritize safety, comfort, and peace of mind with verified accommodations and transparent information.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index}
                className={`${feature.bgColor} rounded-2xl p-8 transition hover:-translate-y-1 hover:shadow-lg duration-300`} >

                <div className={`w-12 h-12 ${feature.iconColor} rounded-full flex items-center justify-center text-white mb-6 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
