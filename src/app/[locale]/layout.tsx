import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Banner from '@/components/Banner';
import NavBar from '@/components/NavBar';
import ContributorsSection from '@/components/Contributors/ContributorsSection';
import Footer from '@/components/Footer';

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;

    // Check if the locale is supported
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
        notFound();
    }
    const messages = await getMessages();

    // Set the request locale
    setRequestLocale(locale);

    return (
        <NextIntlClientProvider messages={messages}>
            <Banner />
            <NavBar locale={locale} />
            <main>{children}</main>
            <ContributorsSection />
            <Footer />
        </NextIntlClientProvider>
    );
}