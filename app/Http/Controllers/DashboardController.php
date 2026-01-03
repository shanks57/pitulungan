<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard');
        } elseif ($user->role === 'technician') {
            return Inertia::render('Technician/Dashboard');
        } else {
            return Inertia::render('User/Dashboard');
        }
    }
}
