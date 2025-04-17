import {Suspense} from 'react';
import {Await, NavLink, Link} from '@remix-run/react';
import {Instagram, Mail, Phone} from 'lucide-react';
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
                      className="text-zinc-400 hover:text-pink-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-pink-600 transition-colors"
                    >
                      <Instagram size={24} />
                    </a>
                    <a
                      href="https://api.whatsapp.com/send/?phone=%2B12024129495"
                      className="text-zinc-400 hover:text-pink-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
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
                        className="flex-shrink-0 mt-1 text-pink-600"
                        size={18}
                      />
                      <a
                        href="mailto:hello@harrelhair.com"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        harrelhair@gmail.com
                      </a>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone
                        className="flex-shrink-0 mt-1 text-pink-600"
                        size={18}
                      />
                      <a
                        href="tel:+18005551234"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        +1 (202) 412-9495
                      </a>
                    </div>
                  </div>

                  {/* Uncomment when newsletter ready */}
                  {/* <div className="pt-4">
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
                  </div> */}
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
                    ? 'text-pink-600 font-medium'
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
