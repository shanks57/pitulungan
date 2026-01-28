<?php

namespace App\Http\Controllers;

use App\Models\TicketCategory;
use App\Models\TicketSubcategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    // ==================== Categories ====================

    public function indexCategories()
    {
        $categories = TicketCategory::with('subcategories')->paginate(10);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function createCategory()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories',
            'description' => 'nullable|string',
        ]);

        TicketCategory::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function editCategory(TicketCategory $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category->load('subcategories'),
        ]);
    }

    public function updateCategory(Request $request, TicketCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(TicketCategory $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }

    // ==================== Subcategories ====================

    public function indexSubcategories()
    {
        $subcategories = TicketSubcategory::with('category')->paginate(10);

        return Inertia::render('Admin/Categories/SubcategoriesIndex', [
            'subcategories' => $subcategories,
            'categories' => TicketCategory::all(),
        ]);
    }

    public function createSubcategory()
    {
        $categories = TicketCategory::all();

        return Inertia::render('Admin/Categories/CreateSubcategory', [
            'categories' => $categories,
        ]);
    }

    public function storeSubcategory(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:ticket_categories,id',
            'name' => 'required|string|max:255|unique:ticket_subcategories',
            'description' => 'nullable|string',
        ]);

        TicketSubcategory::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory created successfully.');
    }

    public function editSubcategory(TicketSubcategory $subcategory)
    {
        $categories = TicketCategory::all();

        return Inertia::render('Admin/Categories/EditSubcategory', [
            'subcategory' => $subcategory->load('category'),
            'categories' => $categories,
        ]);
    }

    public function updateSubcategory(Request $request, TicketSubcategory $subcategory)
    {
        $request->validate([
            'category_id' => 'required|exists:ticket_categories,id',
            'name' => 'required|string|max:255|unique:ticket_subcategories,name,' . $subcategory->id,
            'description' => 'nullable|string',
        ]);

        $subcategory->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory updated successfully.');
    }

    public function destroySubcategory(TicketSubcategory $subcategory)
    {
        $subcategory->delete();

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory deleted successfully.');
    }

    // ==================== Technician-Category Assignment ====================

    public function manageTechnicianCategories(TicketCategory $category)
    {
        $technicians = User::where('role', 'technician')->get();
        $assignedTechnicians = $category->technicians()->pluck('user_id')->toArray();

        return Inertia::render('Admin/Categories/ManageTechnicians', [
            'category' => $category,
            'technicians' => $technicians,
            'assignedTechnicians' => $assignedTechnicians,
        ]);
    }

    public function assignTechniciansToCategory(Request $request, TicketCategory $category)
    {
        $request->validate([
            'technician_ids' => 'array',
            'technician_ids.*' => 'exists:users,id',
        ]);

        $technicianIds = $request->technician_ids ?? [];

        // Sync the technicians (remove old assignments and add new ones)
        $category->technicians()->sync($technicianIds);

        return redirect()->route('admin.categories.index')->with('success', 'Technicians assigned to category successfully.');
    }
}
