import { FileText, Shield, Lock, AlertTriangle } from "lucide-react";

export default function TermsAndConditions() {
  const termsSections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FileText className="w-5 h-5" />,
      content: "Welcome to our car rental service. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms."
    },
    {
      id: "eligibility",
      title: "Eligibility Requirements",
      icon: <Shield className="w-5 h-5" />,
      content: "To rent a vehicle, you must be at least 21 years old and possess a valid driver's license for at least one year. Additional age restrictions may apply for certain vehicle categories. You must provide valid identification and a credit card in your name at the time of rental."
    },
    {
      id: "reservations",
      title: "Reservations & Payments",
      icon: <Lock className="w-5 h-5" />,
      content: "All reservations are subject to vehicle availability. We require a valid credit card to secure your booking. Payment is due upon vehicle pickup. Prices are subject to change without notice, but confirmed reservations will be honored at the quoted rate. Additional fees may apply for extra services or equipment."
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Cancellations made more than 48 hours before the scheduled pickup time will receive a full refund. Cancellations within 48 hours of pickup will incur a 50% cancellation fee. No-shows will be charged the full rental amount. Early returns do not qualify for partial refunds."
    },
    {
      id: "vehicle-use",
      title: "Vehicle Use & Restrictions",
      icon: <FileText className="w-5 h-5" />,
      content: "Rented vehicles may only be driven by authorized drivers listed on the rental agreement. The vehicle must not be used for illegal purposes, racing, off-road driving, or towing without prior authorization. Smoking and transporting pets are prohibited in all rental vehicles unless specifically approved."
    },
    {
      id: "insurance",
      title: "Insurance & Liability",
      icon: <Shield className="w-5 h-5" />,
      content: "Basic liability insurance is included with all rentals. Additional coverage options are available for purchase. Renters are responsible for all damage to the rental vehicle regardless of fault, subject to the terms of the protection package selected. A security deposit may be required and will be refunded upon vehicle return in satisfactory condition."
    },
    {
      id: "fuel-policy",
      title: "Fuel Policy",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Vehicles are provided with a full tank of fuel and must be returned with a full tank. If returned with less fuel, a refueling fee will be charged at a rate higher than local fuel prices. Pre-paid fuel options are available at the time of rental."
    },
    {
      id: "violations",
      title: "Traffic Violations & Tolls",
      icon: <Lock className="w-5 h-5" />,
      content: "Renters are responsible for all traffic and parking violations incurred during the rental period. Administrative fees will be added to any violations processed by our company. Electronic toll payments can be arranged through our toll service program for a daily fee."
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <FileText className="w-5 h-5" />,
      content: "We reserve the right to modify these Terms and Conditions at any time. Continued use of our services after changes constitutes acceptance of the modified terms. Significant changes will be communicated to registered users."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our car rental services. 
            By making a reservation, you agree to be bound by these terms.
          </p>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-6 rounded"></div>
        </div>

        {/* Last Updated */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Last Updated</h2>
              <p className="text-gray-600 mt-1">{new Date().getFullYear()}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">For questions about these terms</p>
              <a href="mailto:legal@carrental.com" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact our legal team
              </a>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-orange-500 mt-0.5 flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Important Notice</h3>
              <p className="text-orange-700 text-sm">
                By proceeding with your reservation, you acknowledge that you have read, understood, 
                and agree to be bound by all the terms and conditions outlined above. Failure to comply 
                with these terms may result in additional charges or cancellation of your rental agreement.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} kwickcar  Rental Service. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}