import {Link} from '@remix-run/react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {useState} from 'react';

export const meta = () => {
  return [
    {title: 'About | Harrel Hair'},
    {
      name: 'og:title',
      content: 'About | Harrel Hair',
    },
    {
      name: 'twitter:title',
      content: 'About | Harrel Hair',
    },
  ];
};

const galleryImages = [
  'https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-5-top.jpg?v=1739558899',
  'https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-2-middle.jpg?v=1739558898',
  'https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-4-middle.jpg?v=1739558897',
];

const faqs = [
  {
    question: 'What type of wigs do you offer?',
    answer:
      'We offer a wide range of wigs, including natural-looking wigs, synthetic wigs, and even human hair wigs',
  },
  {
    question: 'How do I choose the right wig for me?',
    answer:
      'Choosing the right wig depends on your hair type, desired style, and personal preferences. Consider factors like texture, length, and color when selecting a wig.',
  },
  {
    question: 'Do you offer wigs for medical hair loss?',
    answer:
      'Yes, we offer wigs for medical hair loss. Our wigs are designed to provide comfort and support during treatment.',
  },
  {
    question: 'How do I care for my wig?',
    answer:
      'To care for your wig, follow these steps: Wash it with a wig shampoo, brush it gently, and store it in a cool, dry place when not in use.',
  },
  {
    question: 'How do I apply my wig?',
    answer:
      'To apply your wig, follow these steps: Wash your hair with a wig shampoo, wrap it in a towel, and gently pull the wig over your head.',
  },
  {
    question: 'Can I style my wig with heat tools?',
    answer:
      'Yes, you can style your wig with heat tools like curling irons or flat irons. However, avoid using hot tools directly on the wig to prevent damage.',
  },
];

const AboutUs = () => {
  const [selectedFaq, setSelectedFaq] = useState(null);

  return (
    <div className="bg-zinc-900 text-zinc-50 min-h-screen">
      {/* Full-width Hero Header */}
      <div className="w-full">
        <header className="relative aspect-[16/9] md:aspect-[21/9] w-full">
          <img
            src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/tim-mossholder-ArQIWcmOlA8-unsplash.jpg?v=1740118267"
            alt="Harrel Hair premium wigs"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/90" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-white leading-none">
              Your Destination for Premium Wigs and Unmatched Style
            </h1>
          </div>
        </header>
      </div>

      {/* Main content container */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* About Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <p className="text-center text-lg md:text-xl lg:text-2xl text-zinc-300 leading-relaxed max-w-4xl mx-auto">
            At Harrel Hair, we believe that everyone deserves to feel confident
            and beautiful. Our journey began with a passion for helping people
            express their unique style and regain their confidence through
            high-quality wigs. Whether you're looking for a natural everyday
            look or a bold, statement-making style, we're here to help you find
            the perfect fit.
          </p>
        </section>

        {/* Our Values */}
        <section className="py-8 md:py-12 lg:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-center mb-10 md:mb-14">
            Our Core Values
          </h2>

          <div className="space-y-12 md:space-y-16">
            {/* Value 1 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
              <div className="md:flex-1 aspect-video md:aspect-square rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Quality_1.jpg?v=1744742869"
                  alt="Premium quality wigs"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="md:flex-1 flex flex-col justify-center">
                <p className="text-xs md:text-sm uppercase tracking-wider text-pink-600 font-medium">
                  Premium Craftsmanship
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-medium mt-2 mb-4">
                  Quality You Can Trust
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  We handpick every wig in our collection to ensure the highest
                  quality. From 100% human hair to lightweight synthetic
                  options, our wigs are designed to look and feel natural. Each
                  piece is crafted with care to provide you with a seamless and
                  comfortable experience.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8 lg:gap-10">
              <div className="md:flex-1 aspect-video md:aspect-square rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Servise.jpg?v=1744739721"
                  alt="Personalized wig consultation"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="md:flex-1 flex flex-col justify-center">
                <p className="text-xs md:text-sm uppercase tracking-wider text-pink-600 font-medium">
                  Exceptional Service
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-medium mt-2 mb-4">
                  Personalized Support
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Choosing the perfect wig can be overwhelming, but we're here
                  to help. Our team of wig experts is dedicated to guiding you
                  every step of the way. From selecting the right style to
                  providing tips on wig care, we're committed to making your
                  experience enjoyable and stress-free.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
              <div className="md:flex-1 aspect-video md:aspect-square rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Confidence_35.jpg?v=1744742132"
                  alt="Confident woman wearing wig"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="md:flex-1 flex flex-col justify-center">
                <p className="text-xs md:text-sm uppercase tracking-wider text-pink-600 font-medium">
                  Handpicked Excellence
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-medium mt-2 mb-4">
                  Empowering Confidence
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our mission is to empower individuals to express their unique
                  style and regain their confidence. We offer a diverse range of
                  wigs that cater to all hair types, textures, and lifestyles.
                  Whether you're transitioning, experimenting with a new look,
                  or dealing with hair loss, we're here to support you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-8 md:py-12 lg:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-center mb-8 md:mb-12">
            Our Work in Style
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((image) => (
              <div
                key={image}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 hover:ring-2 hover:ring-pink-600"
              >
                <img
                  src={image}
                  alt="Harrel Hair wig styles"
                  className="aspect-square object-cover w-full hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-2xl p-8 md:p-12 lg:p-16 text-center border border-zinc-700">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium mb-4 md:mb-6">
              Find Your Perfect Wig Today
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto mb-6 md:mb-8">
              Ready to transform your look? Explore our collection of premium
              wigs and discover the perfect style for you. With fast shipping,
              hassle-free returns, and exceptional customer service, your
              journey to confidence starts here.
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-lg transition-colors duration-200"
            >
              Start Shopping Now
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-center mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-zinc-700 py-4 md:py-6"
              >
                <button
                  className="w-full flex justify-between items-center text-left text-lg md:text-xl font-medium text-zinc-50 hover:text-pink-600 transition-colors duration-200"
                  onClick={() =>
                    setSelectedFaq(
                      selectedFaq === faq.question ? null : faq.question,
                    )
                  }
                >
                  <span>{faq.question}</span>
                  {selectedFaq === faq.question ? (
                    <ChevronUp className="h-5 w-5 text-pink-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-400" />
                  )}
                </button>
                {selectedFaq === faq.question && (
                  <p className="mt-3 text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
