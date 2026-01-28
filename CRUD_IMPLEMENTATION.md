# Ticket Categories & Subcategories CRUD Implementation

## Overview

A complete CRUD (Create, Read, Update, Delete) system has been implemented for managing Ticket Categories and Subcategories, with admin-only access control.

## Files Created

### Backend

1. **Migration**: [database/migrations/2026_01_27_000001_create_ticket_subcategories_table.php](database/migrations/2026_01_27_000001_create_ticket_subcategories_table.php)
    - Creates `ticket_subcategories` table with foreign key to `ticket_categories`

2. **Model**: [app/Models/TicketSubcategory.php](app/Models/TicketSubcategory.php)
    - Relationships: belongs to TicketCategory, has many Tickets

3. **Controller**: [app/Http/Controllers/CategoryController.php](app/Http/Controllers/CategoryController.php)
    - Methods for managing categories (index, create, store, edit, update, destroy)
    - Methods for managing subcategories (index, create, store, edit, update, destroy)

4. **Updated Model**: [app/Models/TicketCategory.php](app/Models/TicketCategory.php)
    - Added relationship: `subcategories()`

### Frontend (React/Inertia.js Components)

1. **Categories Pages**:
    - [resources/js/pages/Admin/Categories/Index.tsx](resources/js/pages/Admin/Categories/Index.tsx) - List all categories with subcategory count
    - [resources/js/pages/Admin/Categories/Create.tsx](resources/js/pages/Admin/Categories/Create.tsx) - Create new category
    - [resources/js/pages/Admin/Categories/Edit.tsx](resources/js/pages/Admin/Categories/Edit.tsx) - Edit category and manage its subcategories

2. **Subcategories Pages**:
    - [resources/js/pages/Admin/Categories/SubcategoriesIndex.tsx](resources/js/pages/Admin/Categories/SubcategoriesIndex.tsx) - List all subcategories
    - [resources/js/pages/Admin/Categories/CreateSubcategory.tsx](resources/js/pages/Admin/Categories/CreateSubcategory.tsx) - Create new subcategory
    - [resources/js/pages/Admin/Categories/EditSubcategory.tsx](resources/js/pages/Admin/Categories/EditSubcategory.tsx) - Edit subcategory

### Routes

Updated [routes/web.php](routes/web.php):

- Added CategoryController import
- Added admin-only route group with category and subcategory routes
- All routes protected by `role:admin` middleware

## Route Structure

### Categories

- `GET /admin/categories` - List all categories
- `GET /admin/categories/create` - Show create form
- `POST /admin/categories` - Store new category
- `GET /admin/categories/{category}/edit` - Show edit form
- `PUT /admin/categories/{category}` - Update category
- `DELETE /admin/categories/{category}` - Delete category

### Subcategories

- `GET /admin/subcategories` - List all subcategories
- `GET /admin/subcategories/create` - Show create form
- `POST /admin/subcategories` - Store new subcategory
- `GET /admin/subcategories/{subcategory}/edit` - Show edit form
- `PUT /admin/subcategories/{subcategory}` - Update subcategory
- `DELETE /admin/subcategories/{subcategory}` - Delete subcategory

## Features

### Categories Management

- ✅ List all categories with subcategory counts
- ✅ Create new categories with description
- ✅ Edit category information
- ✅ View and manage subcategories from category edit page
- ✅ Delete categories (with cascade delete of subcategories)
- ✅ Pagination support

### Subcategories Management

- ✅ List all subcategories with associated category
- ✅ Create subcategories under specific categories
- ✅ Edit subcategory information
- ✅ Delete subcategories
- ✅ Dropdown selection of parent category
- ✅ Pagination support

### Security

- ✅ Admin-only access (role:admin middleware)
- ✅ Form validation on backend
- ✅ Error handling and display
- ✅ CSRF protection (Inertia.js built-in)

## Next Steps

### 1. Run Migration

```bash
php artisan migrate
```

### 2. Update Ticket Model (Optional)

If you want tickets to have a subcategory field, update the Ticket model and create a migration:

```bash
php artisan make:migration add_subcategory_to_tickets_table
```

Add this to the migration:

```php
$table->foreignId('subcategory_id')->nullable()->constrained('ticket_subcategories')->onDelete('set null');
```

Then update the Ticket model with the relationship.

### 3. Update UI Navigation

Add links to the admin navigation menu for quick access to:

- `/admin/categories` - Manage Categories
- `/admin/subcategories` - Manage Subcategories

## Usage

1. **Login as Admin** - Only users with `role = 'admin'` can access these pages
2. **Navigate to Categories** - Go to `/admin/categories`
3. **Manage Categories** - Create, read, update, or delete categories
4. **Manage Subcategories** - Create, read, update, or delete subcategories
    - You can access subcategory management from the edit category page
    - Or navigate directly to `/admin/subcategories`

## Database Schema

### ticket_categories

```
id (primary key)
name (string, unique)
description (text, nullable)
timestamps
```

### ticket_subcategories

```
id (primary key)
category_id (foreign key → ticket_categories.id)
name (string, unique)
description (text, nullable)
timestamps
```

## Notes

- Deleting a category will automatically delete all associated subcategories (cascade delete)
- All forms include proper validation feedback
- UI is responsive with Tailwind CSS and shadcn/ui components
- Form submission is handled asynchronously via Inertia.js
