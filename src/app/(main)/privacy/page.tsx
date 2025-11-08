import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

  return (
    <main className="flex-grow pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('lastUpdated', { date: new Date().toLocaleDateString() })}
          </p>
        </section>

        {(() => {
  type Section = {
    id: string | number;
    title: string;
    content?: string | Record<string, string>;
    items?: string[];
  };

  const sections = t.raw('sections') as Section[];

  return sections.map((section) => (
    <section key={section.id} className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {section.id}. {section.title}
      </h2>

      {/* Handle if content is a string */}
      {typeof section.content === "string" && (
        <p className="mb-4">{section.content}</p>
      )}

      {/* Handle if content is an object (like contact info) */}
      {typeof section.content === "object" && section.content !== null && (
        <div className="bg-gray-50 p-6 rounded-lg mb-4">
          <p className="mb-2">
            <strong>Email:</strong> {section.content.email}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {section.content.phone}
          </p>
          <p className="mb-2">
            <strong>Hours:</strong> {section.content.hours}
          </p>
          <p>
            <strong>Address:</strong> {section.content.address}
          </p>
        </div>
      )}

      {/* Handle list items */}
      {section.items && (
        <ul className="list-disc list-inside space-y-2 mb-4">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  ));
        })()}

      </div>
    </main>
  );
}
