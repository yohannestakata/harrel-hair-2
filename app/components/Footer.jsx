import {Suspense} from 'react';
import {Await, NavLink, Link} from '@remix-run/react';
import {Instagram, Facebook, Twitter, Mail, Phone} from 'lucide-react';
import logo from '../assets/Logo-43.svg';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-zinc-900 text-zinc-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-7xl mx-auto 2xl:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="space-y-6">
                  <Link to="/" className="inline-block">
                    <img
                      src={logo}
                      alt="Harrel Hair"
                      className="w-32 h-auto filter brightness-0 invert"
                    />
                  </Link>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Premium wigs and hair extensions for every style and
                    occasion. Elevate your look with our high-quality,
                    natural-looking hair solutions.
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-pink-400 transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-pink-400 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-pink-400 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>

                {/* Navigation Links */}
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <FooterMenu
                    menu={footer.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                )}

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-medium text-white">
                    Contact Us
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Mail
                        className="flex-shrink-0 mt-1 text-pink-400"
                        size={18}
                      />
                      <a
                        href="mailto:hello@harrelhair.com"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        hello@harrelhair.com
                      </a>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone
                        className="flex-shrink-0 mt-1 text-pink-400"
                        size={18}
                      />
                      <a
                        href="tel:+18005551234"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        (800) 555-1234
                      </a>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-white mb-2">
                      Newsletter
                    </h4>
                    <form className="flex">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="bg-zinc-800 text-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 w-full"
                      />
                      <button
                        type="submit"
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                      >
                        Join
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-medium text-white">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/faqs"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        FAQs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/size-guide"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Size Guide
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/care-guide"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Care Guide
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-zinc-500 text-sm">
                  © {new Date().getFullYear()} Harrel Hair. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link
                    to="/policies/privacy-policy"
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/policies/terms-of-service"
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/policies/shipping-policy"
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    Shipping Policy
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-medium text-white">Information</h3>
      <nav className="grid grid-cols-1 gap-2">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');

          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {item.title}
            </a>
          ) : (
            <NavLink
              end
              key={item.id}
              prefetch="intent"
              to={url}
              className={({isActive}) =>
                `transition-colors ${
                  isActive
                    ? 'text-pink-400 font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
