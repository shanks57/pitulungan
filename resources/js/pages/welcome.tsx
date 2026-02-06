import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { PWAInstallButton } from '@/components/pwa-install-button';
import { PushSubscribeButton } from '@/components/PushSubscribeButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Home, FileText, BarChart3, User, Clock, Eye } from 'lucide-react';

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    status: string;
    priority: string;
    category: {
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    canRegister?: boolean;
    activeTickets?: Ticket[];
    stats?: {
        total_tickets: number;
        submitted: number;
        done: number;
        pending_response: number;
    };
}

export default function Welcome({
    canRegister = true,
    activeTickets = [],
    stats = { total_tickets: 0, submitted: 0, done: 0, pending_response: 0 },
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const [activeNav, setActiveNav] = useState<'home' | 'update' | 'help' | 'more'>('home');

    // For authenticated users, show mobile app-like interface
    if (auth.user) {
        return (
            <>
                <Head title="SIPERKASA - Aplikasi Tiket">
                    <meta name="description" content="Kelola tiket dan laporan Anda dengan mudah." />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                </Head>

                {/* Mobile App Layout Container */}
                <div className="min-h-screen bg-white flex justify-center">
                    <div className="w-full max-w-md flex flex-col bg-white">
                        {/* Header */}
                        <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 pt-3 pb-6">
                            {/* Status Bar */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold">
                                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <div className="flex gap-1 text-xs">
                                    <span>📶</span>
                                    <span>📡</span>
                                    <span>🔋</span>
                                </div>
                            </div>

                            {/* User Profile Section */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-base">{auth.user.name}</h2>
                                    <p className="text-sm text-blue-100">{auth.user.email}</p>
                                </div>
                            </div>

                            {/* Create New Complaint Button */}
                            <Link href="/tickets/create" className="block">
                                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg text-center">
                                    + New Complaint
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Section */}
                        <div className="px-4 py-4 space-y-4 bg-blue-50">
                            {/* Last 90 Days Stats */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-600 mb-3">Last 90 Days</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    <Card className="p-3 text-center bg-white border-0 shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{stats.total_tickets}</div>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Total</p>
                                    </Card>
                                    <Card className="p-3 text-center bg-white border-0 shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{stats.submitted}</div>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Open</p>
                                    </Card>
                                    <Card className="p-3 text-center bg-white border-0 shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{stats.done}</div>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Closed</p>
                                    </Card>
                                    <Card className="p-3 text-center bg-white border-0 shadow-sm">
                                        <div className="text-xl font-bold text-blue-600">{stats.pending_response}</div>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Reopen</p>
                                    </Card>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card className="p-4 text-center bg-white border-0 shadow-sm">
                                    <div className="text-2xl font-bold text-blue-600">{activeTickets?.length || 0}</div>
                                    <p className="text-xs text-gray-600 mt-1 font-medium">Active</p>
                                </Card>
                                <Card className="p-4 text-center bg-white border-0 shadow-sm">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.total_tickets > 0 ? Math.round((stats.done / stats.total_tickets) * 100) : 0}%
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 font-medium">Closed Rate</p>
                                </Card>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
                            <div className="px-4 py-4">
                                {/* Recent Complaints Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 text-base">Recent Complaints</h3>
                                    <Link href="/user/tickets" className="text-blue-600 text-xs font-semibold hover:underline">
                                        View All
                                    </Link>
                                </div>

                                {/* Complaints List */}
                                <div className="space-y-2">
                                    {activeTickets && activeTickets.length > 0 ? (
                                        activeTickets.map((ticket) => (
                                            <Link key={ticket.id} href={`/user/tickets/${ticket.id}`}>
                                                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-0 bg-white">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="text-xs text-gray-500">
                                                                        ID: #{ticket.ticket_number}
                                                                    </p>
                                                                </div>
                                                                <p className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
                                                                    {ticket.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {ticket.category.name} • {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                className={`text-xs whitespace-nowrap font-semibold flex-shrink-0 ${
                                                                    ticket.status === 'done'
                                                                        ? 'bg-green-500 text-white'
                                                                        : ticket.status === 'repairing'
                                                                            ? 'bg-orange-500 text-white'
                                                                            : ticket.status === 'processed'
                                                                                ? 'bg-blue-500 text-white'
                                                                                : 'bg-gray-500 text-white'
                                                                }`}
                                                            >
                                                                {ticket.status === 'submitted' && 'Open'}
                                                                {ticket.status === 'processed' && 'Open'}
                                                                {ticket.status === 'repairing' && 'Reopen'}
                                                                {ticket.status === 'done' && 'Resolved'}
                                                                {ticket.status === 'rejected' && 'Rejected'}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))
                                    ) : (
                                        <Card className="p-8 text-center border-0 bg-white">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm font-medium">No complaints yet</p>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-40">
                            <div className="flex justify-around items-center">
                                <Link href="/" className="block flex-1">
                                    <button
                                        onClick={() => setActiveNav('home')}
                                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors w-full ${
                                            activeNav === 'home' ? 'text-blue-600' : 'text-gray-600'
                                        }`}
                                    >
                                        <Home className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-semibold">Home</span>
                                    </button>
                                </Link>
                                <Link href="/user/tickets" className="block flex-1">
                                    <button
                                        onClick={() => setActiveNav('update')}
                                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors w-full ${
                                            activeNav === 'update' ? 'text-blue-600' : 'text-gray-600'
                                        }`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        <span className="text-xs font-semibold">Update</span>
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setActiveNav('help')}
                                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors flex-1 ${
                                        activeNav === 'help' ? 'text-blue-600' : 'text-gray-600'
                                    }`}
                                >
                                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-semibold">Help</span>
                                </button>
                                <Link href="/user/settings/profile" className="block flex-1">
                                    <button
                                        onClick={() => setActiveNav('more')}
                                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors w-full ${
                                            activeNav === 'more' ? 'text-blue-600' : 'text-gray-600'
                                        }`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        <span className="text-xs font-semibold">More</span>
                                    </button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </>
        );
    }

    // For unauthenticated users, show the landing page
    return (
        <>
            <Head title="SIPERKASA - Sistem Laporan Perbaikan Sarana Rumah Sakit">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
                <meta name="description" content="Sederhanakan operasi rumah sakit dengan sistem helpdesk komprehensif kami. Kelola tiket, lacak kemajuan, dan pastikan koordinasi perawatan pasien yang efisien." />
            </Head>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">SIPERKASA</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href={login()}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Masuk
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Mulai
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden pt-16">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Sistem Informasi Pelaporan
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                SIPERKASA
                                <span className="text-blue-600 block">Sistem Laporan Perbaikan Sarana</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Platform terintegrasi untuk manajemen laporan perbaikan sarana rumah sakit. Kelola tiket dengan efisien, koordinasikan tim, dan optimalkan operasional fasilitas kesehatan.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={login()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Masuk ke Sistem
                            </Link>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mt-16">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Manajemen Laporan</h3>
                                <p className="text-sm text-gray-600">Buat, lacak, dan kelola laporan perbaikan dengan mudah</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Monitoring Status</h3>
                                <p className="text-sm text-gray-600">Pantau progres perbaikan secara real-time</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Koordinasi Tim</h3>
                                <p className="text-sm text-gray-600">Delegasikan tugas dan kelola tim dengan efisien</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-4">Siap mulai melaporkan?</h2>
                    <p className="text-blue-100 mb-8">Gunakan SIPERKASA untuk melaporkan dan mengelola perbaikan sarana rumah sakit dengan efisien</p>
                    <Link
                        href={login()}
                        className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-block"
                    >
                        Masuk Sekarang
                    </Link>
                </div>
            </section>
        </>
    );
}
