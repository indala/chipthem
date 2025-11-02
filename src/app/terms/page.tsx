import { useTranslations } from 'next-intl';

export default function TermsOfService() {
  const t = useTranslations('TermsOfService');

  const sections = t.raw('sections') as {
    id: number | string;
    title: string;
    content?: string | Record<string, string>;
    items?: string[];
    contact?: {
      email?: string;
      phone?: string;
      hours?: string;
      address?: string;
    };
  }[];

  return (
    <main className="flex-grow pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('lastUpdated', { date: new Date().toLocaleDateString() })}
          </p>
        </section>

        {/* Sections Loop */}
        {sections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.id}. {section.title}
            </h2>

            {/* Paragraph content */}
            {typeof section.content === 'string' && (
              <p className="mb-4">{section.content}</p>
            )}

            {/* List items */}
            {section.items && (
              <ul className="list-disc list-inside space-y-2 mb-4">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {/* Contact info */}
            {section.contact && (
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                {section.contact.email && (
                  <p className="mb-2">
                    <strong>Email:</strong> {section.contact.email}
                  </p>
                )}
                {section.contact.phone && (
                  <p className="mb-2">
                    <strong>Phone:</strong> {section.contact.phone}
                  </p>
                )}
                {section.contact.hours && (
                  <p className="mb-2">
                    <strong>Hours:</strong> {section.contact.hours}
                  </p>
                )}
                {section.contact.address && (
                  <p>
                    <strong>Address:</strong> {section.contact.address}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
