import { Link } from '@inertiajs/react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${link.active
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
