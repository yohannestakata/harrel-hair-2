import {Link} from '@remix-run/react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {useState} from 'react';

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
  const [selectedFaq, setSelectedFaq] = useState(faqs[0].question);

  return (
    <div className="px-6 text-foreground">
      {/* Header */}
      <div className="pb-10">
        <header className="aspect-[21/9] bg-foreground relative">
          <img
            src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/tim-mossholder-ArQIWcmOlA8-unsplash.jpg?v=1740118267"
            alt="harrel hair"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b to-black from-transparent" />
          <h1 className="absolute bottom-10 left-10 text-zinc-50 text-5xl w-2/3">
            Your Destination for Premium Wigs and Unmatched Style
          </h1>
        </header>
      </div>

      {/* About */}
      <section className="py-10">
        <p className="text-center text-zinc-700 text-2xl leading-tight text-balance">
          At Harrel Hair, we believe that everyone deserves to feel confident
          and beautiful. Our journey began with a passion for helping people
          express their unique style and regain their confidence through
          high-quality wigs. Whether you’re looking for a natural everyday look
          or a bold, statement-making style, we’re here to help you find the
          perfect fit.
        </p>
      </section>

      {/* Our Values */}
      <section className="py-10">
        <h2 className="text-3xl font-semibold tracking-tight">Our Values </h2>
        <div className="mt-10 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 aspect-video">
              <img
                src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-5-top.jpg?v=1739558899"
                alt="Quality wigs"
                className="h-full w-full object-cover "
              />
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Premium Craftsmanship
              </p>
              <h3 className="text-2xl mt-1">Quality You Can Trust</h3>
              <p className="text-zinc-700 mt-4">
                We handpick every wig in our collection to ensure the highest
                quality. From 100% human hair to lightweight synthetic options,
                our wigs are designed to look and feel natural. Each piece is
                crafted with care to provide you with a seamless and comfortable
                experience.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 aspect-video">
              <img
                src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-2-middle.jpg?v=1739558898"
                alt="Quality wigs"
                className="h-full w-full object-cover "
              />
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Premium Craftsmanship
              </p>
              <h3 className="text-2xl mt-1">Personalized Support</h3>
              <p className="text-zinc-700 mt-4">
                Choosing the perfect wig can be overwhelming, but we’re here to
                help. Our team of wig experts is dedicated to guiding you every
                step of the way. From selecting the right style to providing
                tips on wig care, we’re committed to making your experience
                enjoyable and stress-free.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 aspect-video">
              <img
                src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/beauty-natural-4-middle.jpg?v=1739558897"
                alt="Quality wigs"
                className="h-full w-full object-cover "
              />
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Handpicked Excellence{' '}
              </p>
              <h3 className="text-2xl mt-1">Empowering Confidence</h3>
              <p className="text-zinc-700 mt-4">
                Our mission is to empower individuals to express their unique
                style and regain their confidence. We offer a diverse range of
                wigs that cater to all hair types, textures, and lifestyles.
                Whether you’re transitioning, experimenting with a new look, or
                dealing with hair loss, we’re here to support you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 grid grid-cols-3 gap-4">
        {galleryImages.map((image) => (
          <img
            src={image}
            key={image}
            className="aspect-square object-cover"
            alt="Quality Wig"
          />
        ))}
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="bg-card  flex flex-col items-center gap-6 p-10">
          <h2 className="text-3xl font-bold">Find Your Perfect Wig Today</h2>
          <p className="text-center text-zinc-700 text-balance ">
            Ready to transform your look? Explore our collection of premium wigs
            and discover the perfect style for you. With fast shipping,
            hassle-free returns, and exceptional customer service, your journey
            to confidence starts here.
          </p>
          <Link
            to="/"
            className="bg-primary px-4 py-2 inline-block text-primary-foreground cursor-pointer "
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10">
        <h2 className="text-3xl font-semibold tracking-tight">FAQs</h2>
        <div className="mt-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-zinc-200 py-6">
              <button
                className="text-xl cursor-pointer w-full text-left flex items-center"
                onClick={() =>
                  setSelectedFaq((prev) =>
                    prev === faq.question ? null : faq.question,
                  )
                }
              >
                <span className="flex-1">{faq.question}</span>
                {selectedFaq === faq.question ? <ChevronUp /> : <ChevronDown />}
              </button>
              {selectedFaq === faq.question && (
                <p className="text-zinc-700 mt-4 w-2/3">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
