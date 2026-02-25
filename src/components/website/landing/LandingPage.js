import Link from "next/link";
import { useEffect, useState } from "react";

import BrandLogo from "./BrandLogo";
import { benchmarkMedia, faqs, featureRows, pricingCards, testimonials } from "./data";

const btn = {
  primary:
    "inline-flex items-center justify-center rounded-full border border-sky-500 bg-sky-500 text-white font-semibold tracking-wide align-middle duration-500 hover:border-sky-600 hover:bg-sky-600",
  soft:
    "inline-flex items-center justify-center rounded-full border border-sky-500/10 bg-sky-500/5 text-sky-600 tracking-wide align-middle duration-500 hover:border-sky-500 hover:bg-sky-500 hover:text-white",
  outline:
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 tracking-wide align-middle duration-500 hover:border-slate-300 hover:bg-slate-50",
  textLink:
    "relative inline-block font-semibold tracking-wide align-middle text-sky-600 duration-500 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-sky-600 after:duration-500 hover:after:w-full",
};

function ContainImage({ src, alt, className = "", decorative = false, eager = false }) {
  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}

function SvgIcon({ path, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconButton({ children, href = "#", label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-gray-400 duration-500 hover:border-sky-500 hover:bg-sky-500 hover:text-white"
    >
      {children}
    </a>
  );
}

function Header({ mobileOpen, onToggleMobile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <BrandLogo href="/" compact className="gap-2.5" />
          <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:inline">3plug</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          <a href="#platform" className="duration-500 hover:text-slate-900">Platform</a>
          <a href="#plugs" className="duration-500 hover:text-slate-900">3 Plugs</a>
          <a href="#marketplace" className="duration-500 hover:text-slate-900">Marketplace</a>
          <a href="#pricing" className="duration-500 hover:text-slate-900">Plans</a>
          <a href="#faq" className="duration-500 hover:text-slate-900">FAQ</a>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login" className={`${btn.soft} h-9 px-3 text-sm`}>
            Log In
          </Link>
          <Link href="/login" className={`${btn.primary} h-9 px-3 text-sm`}>
            Try it Free
          </Link>
        </div>

        <button
          type="button"
          onClick={onToggleMobile}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-5 bg-current transition ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm font-medium text-slate-700 sm:px-6">
            <a href="#platform">Platform</a>
            <a href="#plugs">3 Plugs</a>
            <a href="#marketplace">Marketplace</a>
            <a href="#pricing">Plans</a>
            <a href="#faq">FAQ</a>
            <div className="mt-2 flex gap-2">
              <Link href="/login" className={`${btn.soft} h-9 px-3 text-sm`}>Log In</Link>
              <Link href="/login" className={`${btn.primary} h-9 px-3 text-sm`}>Try it Free</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative table w-full overflow-hidden bg-gradient-to-b from-sky-500/20 to-transparent py-24 lg:py-36">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-10 grid grid-cols-1 items-center gap-7.5 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="md:pr-8">
              <h1 className="relative mb-5 text-4xl font-bold leading-normal text-slate-900 lg:text-5xl">
                Easy way to{" "}
                <span className="relative inline-block">
                  <span className="absolute -inset-1 -skew-y-3 bg-sky-500" />
                  <span className="relative text-white">manage</span>
                </span>{" "}
                your operations work
              </h1>
              <p className="max-w-xl text-lg text-slate-400">
                Launch 3plug as a portal-first business platform with a separate platform bundle, selective app bundles,
                and a clear path to cloud-native or local deployment for different business needs.
              </p>

              <div className="subcribe-form mb-3 mt-6">
                <form className="relative max-w-xl">
                  <input
                    type="email"
                    name="email"
                    className="h-[52px] w-full rounded-full border border-slate-200 bg-white py-3 pl-6 pr-44 text-slate-900 shadow-sm outline-none"
                    placeholder="Your Email Address :"
                  />
                  <button
                    type="submit"
                    className={`${btn.primary} absolute right-1 top-1 h-[44px] px-5 text-sm leading-none`}
                  >
                    Try it for free
                  </button>
                </form>
              </div>

              <span className="font-medium text-slate-400">
                Looking for help? <a href="#contact" className="text-sky-600">Get in touch with us</a>
              </span>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-md shadow-slate-300/40">
                <div
                  className="w-full bg-slate-400 bg-cover bg-top bg-no-repeat py-72"
                  style={{ backgroundImage: `url(${benchmarkMedia.heroBackdrop})` }}
                />
              </div>

              <div className="absolute bottom-5 left-0 m-3 flex w-60 items-center justify-between rounded-lg bg-white p-4 shadow-md md:-left-16 md:bottom-10">
                <div className="flex items-center">
                  <div className="mr-3 flex h-16 w-16 min-w-16 items-center justify-center rounded-full bg-sky-500/5 text-sky-600">
                    <SvgIcon path="M4 6h16v10H4z M8 20h8 M10 16h4" className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h6 className="text-slate-400">Visitor</h6>
                    <p className="text-xl font-bold text-slate-900">4589</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-red-600">
                  <SvgIcon path="M5 15l4-4 3 3 7-7" className="h-4 w-4" />
                  0.5%
                </span>
              </div>

              <div className="absolute -right-1 top-40 m-3 w-60 rounded-lg bg-white p-4 shadow-md lg:-right-10 xl:-right-20 xl:top-20">
                <h5 className="mb-3 text-xl font-semibold text-slate-900">Manage Your Platform</h5>
                <div className="mb-2 mt-3 flex justify-between">
                  <span className="text-slate-400">Work in progress</span>
                  <span className="text-slate-400">84%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 w-[84%] rounded-full bg-sky-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroVideoSection() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 pb-8 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-50 shadow-sm">
            <ContainImage src={benchmarkMedia.logoIcon} alt="3plug icon" decorative eager className="h-10 w-10" />
          </div>
          <h2 className="mb-6 mt-8 text-3xl font-bold leading-normal text-slate-900 md:text-4xl">
            The best customer relationship <br /> management platform for just <br /> about{" "}
            <span className="relative text-sky-600 after:absolute after:bottom-1 after:left-0 after:right-0 after:h-2 after:rounded-md after:bg-sky-500/30 md:after:h-3">
              everything.
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Start with a clear public website, route authenticated users into `/home`, and expand by enabling only the
            bundles and marketplace apps each tenant actually needs.
          </p>
        </div>

        <div className="mt-8 grid">
          <div className="relative overflow-hidden rounded-lg shadow-md shadow-slate-300/40">
            <video className="w-full" controls autoPlay loop muted playsInline preload="metadata" poster={benchmarkMedia.heroVisual}>
              <source src={benchmarkMedia.heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-sky-600 shadow-lg transition lg:h-20 lg:w-20">
                <SvgIcon path="M9 7l8 5-8 5z" className="h-7 w-7" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlugsSection() {
  return (
    <section id="plugs" className="mx-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 pb-8 text-center">
        <h3 className="mb-6 text-2xl font-semibold leading-normal text-slate-900 md:text-3xl">Why Everyone Loves 3plug</h3>
        <p className="mx-auto max-w-xl text-slate-400">
          Start with Operations, Management, and Administration, then extend through selective bundles and marketplace apps on the same portal-first runtime.
        </p>
      </div>
    </section>
  );
}

function FeatureSections() {
  return (
    <>
      {featureRows.map((row) => (
        <section
          key={row.title}
          id={row.eyebrow === "Platform Runtime" ? "platform" : undefined}
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className={`grid grid-cols-1 items-center gap-7.5 ${row.reverse ? "md:grid-cols-2" : "md:grid-cols-2"} ${row.reverse ? "md:[&>*:first-child]:order-2" : ""} ${row.reverse ? "md:mt-16" : "md:mt-16"}`}>
            <div className={`relative ${row.reverse ? "order-1 md:order-2" : ""}`}>
              <img
                src={row.reverse ? benchmarkMedia.featureVisualB : benchmarkMedia.featureVisualA}
                alt={`${row.title} preview`}
                className="w-full rounded-lg shadow-md shadow-slate-300/40"
                loading="lazy"
              />
              <div className={`absolute bottom-0 ${row.reverse ? "right-0" : "left-0"} -z-10 h-80 w-80 rotate-45 rounded-3xl bg-sky-500/10`} />
            </div>

            <div className={`${row.reverse ? "order-2 md:order-1 lg:mr-8" : "lg:ml-8"}`}>
              <h4 className="mb-4 text-2xl font-medium leading-normal text-slate-900">{row.title}</h4>
              <p className="text-slate-400">{row.body}</p>
              <ul className="mt-4 list-none text-slate-400">
                {row.bullets.map((item) => (
                  <li key={item} className="mb-1 flex">
                    <span className="mr-2 text-sky-600">
                      <SvgIcon path="M5 12l4 4 10-10" className="h-5 w-5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/login" className={`${btn.textLink} text-base`}>
                  <span className="inline-flex items-center gap-1">
                    Find Out More
                    <SvgIcon path="M9 6l6 6-6 6" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

function TestimonialsSection() {
  return (
    <section id="marketplace" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 pb-8 text-center">
        <h6 className="mb-2 text-base text-sky-600">Testimonial</h6>
        <h3 className="mb-4 text-2xl font-semibold leading-normal text-slate-900 md:text-3xl">What Our Users Say</h3>
        <p className="mx-auto max-w-xl text-slate-400">
          Feedback focus for this rollout is practical: tenant onboarding, selective activation, publisher releases, and
          safe upgrades across cloud and local deployments.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.quote} className="text-center">
            <div className="relative m-2 rounded bg-white p-6 shadow-sm shadow-slate-300/40 before:absolute before:left-1/2 before:top-full before:h-4 before:w-4 before:-translate-x-1/2 before:-translate-y-2 before:rotate-45 before:bg-white before:shadow-sm">
              <div className="text-4xl text-sky-600">“</div>
              <p className="text-slate-400">" {item.quote} "</p>
              <ul className="mt-3 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="inline">★</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 text-center">
              <img src={item.avatar} alt="" aria-hidden="true" className="mx-auto h-14 w-14 rounded-full object-cover shadow-md" />
              <h6 className="mt-2 font-semibold text-slate-900">{item.name}</h6>
              <span className="text-sm text-slate-400">{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rollout paths for real 3plug adoption</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Start with the platform bundle and core plugs, then expand into industry packs, marketplace apps, and advanced
          platform controls as your operations mature.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {pricingCards.map((card) => (
          <div
            key={card.name}
            className={`rounded-2xl border p-6 shadow-sm ${card.featured ? "border-sky-200 bg-gradient-to-b from-sky-50 to-white shadow-lg shadow-sky-500/10" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{card.tag}</div>
              {card.featured ? <span className="rounded-full bg-sky-500 px-2 py-1 text-[10px] font-semibold text-white">Popular</span> : null}
            </div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">{card.name}</h3>
            <div className="mt-3 text-2xl font-bold text-slate-900">{card.price}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-sky-600"><SvgIcon path="M5 12l4 4 10-10" className="h-4 w-4" /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className={`mt-6 w-full px-4 py-3 text-sm ${card.featured ? btn.primary : `${btn.outline} text-slate-800`}`}>
              {card.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="bg-slate-50 py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
        <div>
          <p className="mb-2 text-base text-sky-600">FAQs</p>
          <h2 className="mb-4 text-2xl font-semibold leading-normal text-slate-900 md:text-3xl">Frequently Asked Questions</h2>
          <p className="max-w-2xl text-slate-400">Keep the public website simple, keep the portal structured, and keep the platform/bundle boundaries clear from the start.</p>
          <div className="mt-6 space-y-4">
            {faqs.map((item, idx) => (
              <details key={item.q} open={idx === 0} className="group overflow-hidden rounded-md bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-start text-base font-semibold">
                  <span>{item.q}</span>
                  <span className="text-slate-500 transition duration-300 group-open:rotate-180">
                    <SvgIcon path="M6 9l6 6 6-6" className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-slate-400">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div id="contact" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Have question?</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Get in touch</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start with a simple public site, route users into `/home`, and grow the platform shell and bundles in phases.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">Business account onboarding</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">Publisher ecosystem onboarding</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">Cloud and local deployment guidance</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className={`${btn.primary} h-10 px-4 text-sm`}>Contact via Portal</Link>
            <a href="#" className={`${btn.outline} h-10 px-4 text-sm font-semibold`}>Contact us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-slate-900 text-gray-200">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="lg:col-span-4 md:col-span-12">
              <BrandLogo href="/" subtitle="Operations / Management / Administration" />
              <p className="mt-6 text-gray-300">
                3plug is being structured as a portal-first runtime with selective bundles, tenant lifecycle controls,
                and a publisher marketplace ecosystem for real business rollout.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                <li><IconButton label="Marketplace"><span>🛒</span></IconButton></li>
                <li><IconButton label="LinkedIn"><span>in</span></IconButton></li>
                <li><IconButton label="Email"><span>@</span></IconButton></li>
                <li><IconButton label="Docs"><span>?</span></IconButton></li>
              </ul>
            </div>

            <div className="lg:col-span-2 md:col-span-4">
              <h5 className="font-semibold tracking-[1px] text-gray-100">Company</h5>
              <ul className="mt-6 space-y-2.5">
                <li><a href="#platform" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Platform</a></li>
                <li><a href="#plugs" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />3 Plugs</a></li>
                <li><a href="#pricing" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Plans</a></li>
                <li><Link href="/login" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Login</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3 md:col-span-4">
              <h5 className="font-semibold tracking-[1px] text-gray-100">Useful Links</h5>
              <ul className="mt-6 space-y-2.5">
                <li><a href="#faq" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />FAQs</a></li>
                <li><Link href="/home" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Portal Home</Link></li>
                <li><a href="#marketplace" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Marketplace</a></li>
                <li><a href="#contact" className="inline-flex items-center gap-1 text-gray-300 duration-500 hover:text-white"><SvgIcon path="M9 6l6 6-6 6" className="h-3.5 w-3.5" />Contact</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3 md:col-span-4">
              <h5 className="font-semibold tracking-[1px] text-gray-100">Newsletter</h5>
              <p className="mt-6 text-gray-300">Sign up and receive the latest tips via email.</p>
              <form className="mt-4">
                <label className="text-sm text-gray-300">Write your email <span className="text-red-500">*</span></label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5 text-gray-300">@</span>
                  <input
                    type="email"
                    className="h-10 w-full rounded bg-slate-800 px-10 pr-3 text-gray-100 outline-none placeholder:text-gray-400"
                    placeholder="Email"
                  />
                </div>
                <button type="submit" className={`${btn.primary} mt-3 h-10 w-full rounded-md px-5 text-sm`}>Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-4 px-4 text-center sm:px-6 md:grid-cols-2 md:text-left lg:px-8">
          <p className="mb-0 text-gray-100">© {new Date().getFullYear()} 3plug. Built by Triotek Systems Ltd.</p>
          <div className="flex justify-center gap-2 md:justify-end">
            {["AMEX", "DISC", "MC", "PAY", "VISA"].map((p) => (
              <span key={p} className="inline-flex h-6 items-center rounded border border-slate-700 px-2 text-[10px] text-gray-300">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function CookiePopup({ onClose }) {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-lg rounded-md bg-white px-6 py-5 shadow-sm">
      <p className="text-slate-400">
        This website uses cookies to provide you with a great user experience. By using it, you accept our{" "}
        <a href="#" className="font-semibold text-emerald-600">use of cookies</a>
      </p>
      <button type="button" onClick={onClose} className="absolute right-2 top-2 p-0 text-2xl text-slate-900">×</button>
    </div>
  );
}

function BackToTop({ visible }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg"
      aria-label="Back to top"
    >
      <SvgIcon path="M12 19V5 M5 12l7-7 7 7" className="h-4 w-4" />
    </button>
  );
}

function DirToggle({ dirMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-2 top-[40%] z-30 -rotate-90 rounded-t-md bg-white px-3 py-1 font-bold shadow-md"
    >
      {dirMode === "ltr" ? "RTL" : "LTR"}
    </button>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showCookie, setShowCookie] = useState(true);
  const [dirMode, setDirMode] = useState("ltr");

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div dir={dirMode} className="min-h-screen bg-white text-slate-800">
      <Header mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen((v) => !v)} />
      <main>
        <HeroSection />
        <IntroVideoSection />
        <PlugsSection />
        <FeatureSections />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
      {showCookie ? <CookiePopup onClose={() => setShowCookie(false)} /> : null}
      <BackToTop visible={showTop} />
      <DirToggle dirMode={dirMode} onToggle={() => setDirMode((v) => (v === "ltr" ? "rtl" : "ltr"))} />
    </div>
  );
}
